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
    star: g('--star', 'rgba(237,234,227,0.85)'),
    node: g('--node', 'rgba(237,234,227,0.9)'),
    edge: g('--edge', 'rgba(237,234,227,0.14)'),
    fg: g('--fg', '#edeae3'),
    fgDim: g('--fg-dim', '#9a978f'),
    accent: g('--accent', '#e0619e')
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

    const { nodes, edges } = buildGraph(content, small);
    const byId = new Map(nodes.map((n) => [n.id, n]));

    // starfield
    const stars: { x: number; y: number; z: number; r: number }[] = [];

    const pointer = { x: -9999, y: -9999, active: false };
    const pan = { x: 0, y: 0, tx: 0, ty: 0 };
    const drag = { on: false, moved: false, sx: 0, sy: 0, ox: 0, oy: 0 };
    let hover: GNode | null = null;

    const project = () => {
      const scale = Math.min(W, H) * (small ? 0.44 : 0.42);
      const cx = W / 2;
      const cy = small ? H * 0.33 : H * 0.46;
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

      stars.length = 0;
      const count = Math.round((W * H) / 9000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          z: 0.3 + Math.random() * 0.7,
          r: Math.random() < 0.85 ? 0.6 : 1.2
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

    const step = () => {
      const { scale, cx, cy } = project();

      if (!reducedMotion) {
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const homeX = cx + n.hx * scale;
          const homeY = cy + n.hy * scale;
          n.vx += (homeX - n.x) * 0.02;
          n.vy += (homeY - n.y) * 0.02;

          // gentle mutual repulsion (local)
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

          // pointer push
          if (pointer.active) {
            const dx = n.x - pointer.x;
            const dy = n.y - pointer.y;
            const d = Math.hypot(dx, dy);
            if (d < 120 && d > 0.01) {
              const f = (120 - d) / 120;
              n.vx += (dx / d) * f * 0.9;
              n.vy += (dy / d) * f * 0.9;
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

      // pan easing (spring back toward drag target, which itself decays)
      pan.tx *= 0.92;
      pan.ty *= 0.92;
      pan.x += (pan.tx - pan.x) * 0.12;
      pan.y += (pan.ty - pan.y) * 0.12;
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const parX = pointer.active ? (pointer.x / W - 0.5) * 18 : 0;
      const parY = pointer.active ? (pointer.y / H - 0.5) * 12 : 0;
      const ox = pan.x + parX;
      const oy = pan.y + parY;

      // stars
      for (const st of stars) {
        ctx.globalAlpha = st.z * 0.5;
        ctx.fillStyle = pal.star;
        ctx.beginPath();
        ctx.arc(st.x + ox * st.z * 0.4, st.y + oy * st.z * 0.4, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const activeId = hover ? (hover.parent ?? hover.id) : null;

      // edges
      ctx.lineWidth = 1;
      for (const e of edges) {
        const a = byId.get(e.a)!;
        const b = byId.get(e.b)!;
        const lit =
          activeId &&
          (e.a === activeId || e.b === activeId || e.a === hover?.id || e.b === hover?.id);
        ctx.strokeStyle = lit ? pal.accent : pal.edge;
        ctx.globalAlpha = lit ? 0.55 : 1;
        ctx.beginPath();
        ctx.moveTo(a.x + ox, a.y + oy);
        ctx.lineTo(b.x + ox, b.y + oy);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // nodes + labels
      ctx.font = '10px "Spline Sans Mono", monospace';
      ctx.textBaseline = 'middle';
      for (const n of nodes) {
        const x = n.x + ox;
        const y = n.y + oy;
        const isHover = hover?.id === n.id;
        const inChain = activeId && (n.id === activeId || n.parent === activeId);

        // node
        ctx.beginPath();
        ctx.arc(x, y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = isHover || (inChain && n.kind !== 'satellite') ? pal.accent : pal.node;
        ctx.globalAlpha = n.kind === 'satellite' && !inChain && !isHover ? 0.5 : 1;
        ctx.fill();
        ctx.globalAlpha = 1;

        if (n.kind === 'core') {
          ctx.strokeStyle = pal.fgDim;
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(x, y, n.r + 7, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        if (isHover) {
          ctx.strokeStyle = pal.accent;
          ctx.beginPath();
          ctx.arc(x, y, n.r + 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // label
        const showLabel =
          n.kind === 'primary' || isHover || (inChain && n.kind === 'satellite');
        if (showLabel && n.kind !== 'core') {
          const label = n.label.toUpperCase();
          ctx.letterSpacing = '2px';
          ctx.fillStyle = isHover ? pal.accent : pal.fgDim;
          ctx.globalAlpha = n.kind === 'satellite' && !isHover ? 0.75 : 1;
          if (small && n.kind === 'primary') {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(label, x, y + n.r + 7);
            ctx.textBaseline = 'middle';
          } else {
            const right = n.x >= project().cx;
            ctx.textAlign = right ? 'left' : 'right';
            ctx.fillText(label, x + (right ? n.r + 8 : -(n.r + 8)), y);
          }
          ctx.globalAlpha = 1;
          ctx.letterSpacing = '0px';
        }
      }
    };

    const loop = () => {
      step();
      draw();
      raf = requestAnimationFrame(loop);
    };

    // ---- interaction ----
    const nodeAt = (mx: number, my: number): GNode | null => {
      const parX = pointer.active ? (pointer.x / W - 0.5) * 18 : 0;
      const parY = pointer.active ? (pointer.y / H - 0.5) * 12 : 0;
      const ox = pan.x + parX;
      const oy = pan.y + parY;
      let best: GNode | null = null;
      let bestD = Infinity;
      for (const n of nodes) {
        const d = Math.hypot(mx - (n.x + ox), my - (n.y + oy));
        if (d < n.r + 15 && d < bestD) {
          bestD = d;
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
      const hit = nodeAt(mx, my);
      if (hit) {
        hover = hit;
        return;
      }
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
    loop();
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

  // repaint palette on theme flip without a full rebuild
  useEffect(() => {
    // the loop reads pal once; simplest is a tiny delayed re-read via CSS transition end.
    // Instead we force a remount-free refresh by dispatching resize.
    const t = setTimeout(() => window.dispatchEvent(new Event('resize')), 60);
    return () => clearTimeout(t);
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full touch-none"
      aria-hidden
    />
  );
};

export default Constellation;
