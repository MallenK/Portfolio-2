import React, { useEffect, useRef, useState } from 'react';
import { PortfolioContent } from '../../types';
import { buildGraph, GNode } from './graph';

interface Props {
  content: PortfolioContent;
  theme: 'dark' | 'light';
  reducedMotion: boolean;
  onNavigate: (target: string) => void;
}

type Palette = {
  star: string;
  starAccent: string;
  node: string;
  edge: string;
  fg: string;
  fgDim: string;
  accent: string;
};

function readPalette(): Palette {
  const s = getComputedStyle(document.documentElement);
  const g = (v: string, fb: string) => s.getPropertyValue(v).trim() || fb;
  return {
    star: g('--star', 'rgba(242,242,242,0.95)'),
    starAccent: g('--star-accent', 'rgba(253,225,0,0.9)'),
    node: g('--node', '#f2f2f2'),
    edge: g('--edge', 'rgba(242,242,242,0.16)'),
    fg: g('--fg', '#f2f2f2'),
    fgDim: g('--fg-dim', '#9a9a9a'),
    accent: g('--accent', '#fde100')
  };
}

const Constellation: React.FC<Props> = ({ content, theme, reducedMotion, onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navRef = useRef(onNavigate);
  navRef.current = onNavigate;
  const [small, setSmall] = useState(
    typeof window !== 'undefined' && window.innerWidth < 640
  );

  useEffect(() => {
    const onR = () => setSmall(window.innerWidth < 640);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let W = 0;
    let H = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let pal = readPalette();
    let t0 = performance.now();

    const { nodes, edges } = buildGraph(content, small);
    const byId = new Map(nodes.map((n) => [n.id, n]));

    type Star = { x: number; y: number; z: number; r: number; tw: number; accent: boolean };
    let stars: Star[] = [];

    const pointer = { x: -9999, y: -9999, active: false };
    const pan = { x: 0, y: 0, tx: 0, ty: 0 };
    const drag = { on: false, moved: false, sx: 0, sy: 0, ox: 0, oy: 0 };
    let hover: GNode | null = null;

    const project = () => {
      const scale = Math.min(W, H) * (small ? 0.44 : 0.38);
      const cx = W / 2;
      const cy = small ? H * 0.3 : H * 0.4;
      return { scale, cx, cy };
    };

    const resize = () => {
      pal = readPalette();
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // denser, brighter starfield
      stars = [];
      const count = Math.round((W * H) / 620);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          z: 0.2 + Math.random() * 0.8,
          r: Math.random() < 0.72 ? 0.7 : Math.random() < 0.95 ? 1.3 : 2,
          tw: Math.random() * Math.PI * 2,
          accent: Math.random() < 0.06
        });
      }

      const { scale, cx, cy } = project();
      nodes.forEach((n) => {
        n.x = cx + n.hx * scale;
        n.y = cy + n.hy * scale;
        n.vx = 0;
        n.vy = 0;
      });
    };

    const step = (dt: number) => {
      const { scale, cx, cy } = project();
      if (!reducedMotion) {
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          n.vx += (cx + n.hx * scale - n.x) * 0.02;
          n.vy += (cy + n.hy * scale - n.y) * 0.02;
          for (let j = i + 1; j < nodes.length; j++) {
            const m = nodes[j];
            const dx = n.x - m.x;
            const dy = n.y - m.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 3600 && d2 > 0.01) {
              const f = ((3600 - d2) / 3600 / d2) * 6;
              n.vx += dx * f;
              n.vy += dy * f;
              m.vx -= dx * f;
              m.vy -= dy * f;
            }
          }
          if (pointer.active) {
            const dx = n.x - pointer.x;
            const dy = n.y - pointer.y;
            const d = Math.hypot(dx, dy);
            if (d < 110 && d > 0.01) {
              const f = (110 - d) / 110;
              n.vx += (dx / d) * f * 0.85;
              n.vy += (dy / d) * f * 0.85;
            }
          }
          n.vx *= 0.86;
          n.vy *= 0.86;
          n.x += n.vx;
          n.y += n.vy;
        }
      } else {
        nodes.forEach((n) => {
          n.x = cx + n.hx * scale;
          n.y = cy + n.hy * scale;
        });
      }
      pan.tx *= 0.92;
      pan.ty *= 0.92;
      pan.x += (pan.tx - pan.x) * 0.12;
      pan.y += (pan.ty - pan.y) * 0.12;
      void dt;
    };

    const off = () => {
      const parX = pointer.active ? (pointer.x / W - 0.5) * 16 : 0;
      const parY = pointer.active ? (pointer.y / H - 0.5) * 10 : 0;
      return { ox: pan.x + parX, oy: pan.y + parY };
    };

    const draw = (now: number) => {
      const time = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      const { ox, oy } = off();

      // starfield — brighter, gentle twinkle
      for (const s of stars) {
        const base = s.z * 0.8;
        const tw = reducedMotion ? base : base * (0.72 + 0.28 * Math.sin(s.tw + time * 1.1));
        ctx.globalAlpha = Math.max(0, Math.min(1, tw));
        ctx.fillStyle = s.accent ? pal.starAccent : pal.star;
        ctx.beginPath();
        ctx.arc(s.x + ox * s.z * 0.5, s.y + oy * s.z * 0.5, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const activeId = hover ? hover.parent ?? hover.id : null;

      // edges
      ctx.lineWidth = 1;
      for (const e of edges) {
        const a = byId.get(e.a)!;
        const b = byId.get(e.b)!;
        const lit =
          activeId &&
          (e.a === activeId || e.b === activeId || e.a === hover?.id || e.b === hover?.id);
        ctx.strokeStyle = lit ? pal.accent : pal.edge;
        ctx.globalAlpha = lit ? 0.6 : 1;
        ctx.beginPath();
        ctx.moveTo(a.x + ox, a.y + oy);
        ctx.lineTo(b.x + ox, b.y + oy);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      ctx.font = `600 10px "Montserrat", sans-serif`;
      ctx.textBaseline = 'middle';

      for (const n of nodes) {
        const x = n.x + ox;
        const y = n.y + oy;
        const isHover = hover?.id === n.id;
        const inChain = activeId && (n.id === activeId || n.parent === activeId);
        const hot = isHover || (inChain && n.kind !== 'satellite');

        // node dot
        ctx.beginPath();
        ctx.arc(x, y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = hot ? pal.accent : pal.node;
        ctx.globalAlpha = n.kind === 'satellite' && !inChain && !isHover ? 0.55 : 1;
        ctx.fill();
        ctx.globalAlpha = 1;

        // core ring (always) + pulse on hover
        if (n.kind === 'core') {
          ctx.strokeStyle = pal.accent;
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          ctx.arc(x, y, n.r + 8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        if (isHover) {
          ctx.strokeStyle = pal.accent;
          ctx.beginPath();
          ctx.arc(x, y, n.r + 6, 0, Math.PI * 2);
          ctx.stroke();
        }
        // live marker (satellite in production)
        if (n.live && !isHover) {
          ctx.fillStyle = pal.accent;
          ctx.beginPath();
          ctx.arc(x + n.r + 3, y - n.r - 1, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }

        // label
        const showLabel =
          n.kind === 'primary' || isHover || (inChain && n.kind === 'satellite');
        if (showLabel && n.kind !== 'core') {
          ctx.letterSpacing = '1.5px';
          ctx.fillStyle = isHover || hot ? pal.accent : pal.fgDim;
          ctx.globalAlpha = n.kind === 'satellite' && !isHover ? 0.8 : 1;
          let label = n.label.toUpperCase();
          if (n.kind === 'primary' && n.count) label += `  ·  ${n.count}`;
          if (small && n.kind === 'primary') {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(label, x, y + n.r + 7);
            ctx.textBaseline = 'middle';
          } else {
            const right = n.x >= project().cx;
            ctx.textAlign = right ? 'left' : 'right';
            ctx.fillText(label, x + (right ? n.r + 9 : -(n.r + 9)), y);
          }
          ctx.globalAlpha = 1;
          ctx.letterSpacing = '0px';
        }
      }
    };

    const loop = (now: number) => {
      step(16);
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const nodeAt = (mx: number, my: number): GNode | null => {
      const { ox, oy } = off();
      let best: GNode | null = null;
      let bd = Infinity;
      for (const n of nodes) {
        const d = Math.hypot(mx - (n.x + ox), my - (n.y + oy));
        if (d < n.r + 16 && d < bd) {
          bd = d;
          best = n;
        }
      }
      return best;
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      pointer.x = mx;
      pointer.y = my;
      pointer.active = true;
      if (drag.on) {
        pan.tx = drag.ox + (mx - drag.sx);
        pan.ty = drag.oy + (my - drag.sy);
        if (Math.hypot(mx - drag.sx, my - drag.sy) > 4) drag.moved = true;
        return;
      }
      hover = nodeAt(mx, my);
      canvas.style.cursor = hover ? 'pointer' : 'grab';
    };
    const onDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      if (nodeAt(mx, my)) return;
      drag.on = true;
      drag.moved = false;
      drag.sx = mx;
      drag.sy = my;
      drag.ox = pan.tx;
      drag.oy = pan.ty;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
    };
    const onUp = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      if (drag.on) {
        drag.on = false;
        canvas.style.cursor = 'grab';
        if (!drag.moved) {
          const hit = nodeAt(mx, my);
          if (hit) navRef.current(hit.target);
        }
        return;
      }
      const hit = nodeAt(mx, my);
      if (hit) navRef.current(hit.target);
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
      hover = null;
    };

    resize();
    raf = requestAnimationFrame(loop);
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, [content, reducedMotion, small]);

  useEffect(() => {
    const t = setTimeout(() => window.dispatchEvent(new Event('resize')), 60);
    return () => clearTimeout(t);
  }, [theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" aria-hidden />;
};

export default Constellation;
