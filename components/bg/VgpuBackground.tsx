import React, { useEffect, useRef, useState } from 'react';
import { atmos } from './atmos';

/**
 * Full-viewport WebGPU nebula (vgpu / vercel-labs). Black ground, BVB-yellow
 * clouds, drifting star grain. Reacts to the pointer and to the 3D camera zoom.
 * Renders nothing (and reports failure) when WebGPU is unavailable — the parent
 * then swaps in the WebGL Galaxy.
 */

const WGSL = /* wgsl */ `
struct Params {
  time: f32,
  aspect: f32,
  mx: f32,
  my: f32,
  zoom: f32,
  hue: f32,
  light: f32,
  reduce: f32,
}
@group(0) @binding(0) var<uniform> p: Params;

fn hash2(n: vec2f) -> f32 {
  return fract(sin(dot(n, vec2f(127.1, 311.7))) * 43758.5453123);
}
fn noise(x: vec2f) -> f32 {
  let i = floor(x);
  let f = fract(x);
  let u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash2(i), hash2(i + vec2f(1.0, 0.0)), u.x),
             mix(hash2(i + vec2f(0.0, 1.0)), hash2(i + vec2f(1.0, 1.0)), u.x), u.y);
}
fn fbm(pt: vec2f) -> f32 {
  var v = 0.0;
  var a = 0.5;
  var q = pt;
  for (var i = 0; i < 5; i = i + 1) {
    v = v + a * noise(q);
    q = q * 2.02 + vec2f(1.7, 9.2);
    a = a * 0.5;
  }
  return v;
}
fn hsv2rgb(c: vec3f) -> vec3f {
  let k = vec4f(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  let pp = abs(fract(c.xxx + k.xyz) * 6.0 - k.www);
  return c.z * mix(k.xxx, clamp(pp - k.xxx, vec3f(0.0), vec3f(1.0)), c.y);
}

@fragment fn main(@location(0) uv0: vec2f) -> @location(0) vec4f {
  var uv = (uv0 - 0.5) * vec2f(p.aspect, 1.0);
  let t = select(p.time, 0.0, p.reduce > 0.5) * 0.02;

  // parallax toward pointer + push-in with zoom
  let m = (vec2f(p.mx, 1.0 - p.my) - 0.5);
  uv = uv - m * 0.08;
  let scale = mix(1.25, 0.72, clamp(p.zoom, 0.0, 1.0));
  uv = uv * scale;

  // layered nebula
  let warp = vec2f(fbm(uv * 1.3 + t), fbm(uv * 1.3 - t + 5.0));
  let n = fbm(uv * 1.8 + warp * 1.6 + vec2f(t * 1.5, -t));
  let n2 = fbm(uv * 3.4 - warp + vec2f(-t, t * 0.7));
  var cloud = pow(clamp(n * 1.12 - 0.3, 0.0, 1.0), 1.75);
  cloud = cloud * (0.55 + 0.45 * n2);

  // a faint vignette so the centre stays readable
  let vig = 1.0 - smoothstep(0.3, 1.3, length(uv));
  cloud = cloud * mix(0.45, 1.0, vig);

  let hue = p.hue / 360.0;
  let warm = hsv2rgb(vec3f(hue, 0.82, 1.0)) * cloud;
  let deep = hsv2rgb(vec3f(hue + 0.02, 0.9, 0.35)) * cloud * cloud * 1.4;

  // star grain
  let g = uv * mix(70.0, 120.0, p.zoom);
  let sid = floor(g);
  let sf = fract(g) - 0.5;
  let sr = hash2(sid);
  var star = 0.0;
  if (sr > 0.982) {
    let tw = 0.6 + 0.4 * sin(p.time * 2.0 + sr * 40.0);
    star = smoothstep(0.16, 0.0, length(sf)) * tw * select(1.0, 0.6, p.reduce > 0.5);
  }
  let starCol = mix(vec3f(1.0), hsv2rgb(vec3f(hue, 0.5, 1.0)), 0.4) * star;

  var col = warm * 0.5 + deep * 0.95 + starCol;

  if (p.light > 0.5) {
    // invert to ink-on-paper
    let e = max(max(col.r, col.g), col.b);
    let cov = clamp(smoothstep(0.0, 0.5, e) * 0.9, 0.0, 0.9);
    col = mix(vec3f(0.955, 0.949, 0.933), clamp(col * 0.55, vec3f(0.0), vec3f(0.75)), cov);
    return vec4f(col, 1.0);
  }
  return vec4f(col, 1.0);
}
`;

type Props = { onUnsupported: () => void };

const VgpuBackground: React.FC<Props> = ({ onUnsupported }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    let gpu: { dispose?: () => void } | null = null;
    let loop: { stop?: () => void } | null = null;

    (async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (typeof navigator === 'undefined' || !(navigator as any).gpu) {
        onUnsupported();
        setFailed(true);
        return;
      }
      try {
        const vgpu = await import('vgpu');
        if (disposed) return;
        const g = await vgpu.init();
        if (disposed) {
          g.dispose?.();
          return;
        }
        gpu = g;
        const surf = vgpu.surface(g, canvas);
        const fx = vgpu.effect(g, WGSL, {
          set: { time: 0, aspect: 1, mx: 0.5, my: 0.5, zoom: 0.35, hue: atmos.hue, light: atmos.light, reduce: 0 }
        });
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0;
        const start = performance.now();
        loop = vgpu.frameLoop(g, (f: any) => {
          const w = canvas.clientWidth || 1;
          const h = canvas.clientHeight || 1;
          fx.set({
            time: (performance.now() - start) / 1000,
            aspect: w / h,
            mx: atmos.mx,
            my: atmos.my,
            zoom: atmos.zoom,
            hue: atmos.hue,
            light: atmos.light,
            reduce
          });
          f.pass({ target: surf }, (pass: any) => pass.draw(fx));
        });
      } catch (err) {
        console.warn('[vgpu] falling back to WebGL Galaxy:', err);
        onUnsupported();
        setFailed(true);
      }
    })();

    return () => {
      disposed = true;
      try {
        loop?.stop?.();
      } catch {
        /* noop */
      }
      try {
        gpu?.dispose?.();
      } catch {
        /* noop */
      }
    };
  }, [onUnsupported]);

  if (failed) return null;
  return <canvas ref={canvasRef} aria-hidden className="fixed inset-0 -z-10 h-full w-full" />;
};

export default VgpuBackground;
