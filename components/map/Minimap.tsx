import React, { useEffect, useRef } from 'react';
import { PortfolioContent } from '../../types';
import { buildGraph3D } from './graph3d';
import { atmos } from '../bg/atmos';

interface Props {
  content: PortfolioContent;
  active: string | null;
  onJump: (id: string) => void;
  label: string;
}

const R = 8; // world half-extent shown (plan uses x/z)

/**
 * Orientation aid — a top-down (x/z) plan of the map with a marker for where
 * you're looking. Click a node to fly there.
 */
const Minimap: React.FC<Props> = ({ content, active, onJump, label }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const viewRef = useRef<SVGGElement>(null);
  const graph = React.useMemo(() => buildGraph3D(content), [content]);
  const nodes = React.useMemo(
    () => graph.nodes.filter((n) => n.kind !== 'satellite'),
    [graph]
  );
  const edges = React.useMemo(
    () => graph.edges.filter((e) => nodes.some((n) => n.id === e.a) && nodes.some((n) => n.id === e.b)),
    [graph, nodes]
  );

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const g = viewRef.current;
      if (!g) return;
      const x = (atmos.tgtX / R) * 50 + 50;
      const y = (atmos.tgtZ / R) * 50 + 50;
      const ang = Math.atan2(atmos.camX - atmos.tgtX, atmos.camZ - atmos.tgtZ) * (180 / Math.PI);
      g.setAttribute('transform', `translate(${x} ${y}) rotate(${ang})`);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="pointer-events-auto absolute left-4 top-16 hidden w-[124px] select-none sm:block md:left-6 md:top-[4.5rem]">
      <p className="mb-1.5 whitespace-nowrap font-[var(--font-display)] text-[8px] font-semibold uppercase tracking-[0.2em] text-fgfaint">
        {label}
      </p>
      <svg
        ref={svgRef}
        viewBox="-6 -6 112 112"
        className="h-[124px] w-[124px] border border-hair bg-bg/55 backdrop-blur-sm"
      >
        {edges.map((e, i) => {
            const a = nodes.find((n) => n.id === e.a)!;
            const b = nodes.find((n) => n.id === e.b)!;
            return (
              <line
                key={i}
                x1={(a.pos[0] / R) * 50 + 50}
                y1={(a.pos[2] / R) * 50 + 50}
                x2={(b.pos[0] / R) * 50 + 50}
                y2={(b.pos[2] / R) * 50 + 50}
                stroke="var(--hair)"
                strokeWidth="0.8"
              />
            );
          })}

        {nodes.map((n) => {
          const cx = (n.pos[0] / R) * 50 + 50;
          const cy = (n.pos[2] / R) * 50 + 50;
          const on = active === n.section;
          return (
            <circle
              key={n.id}
              cx={cx}
              cy={cy}
              r={n.kind === 'core' ? 4.5 : 3.4}
              fill={on || n.kind === 'core' ? 'var(--accent)' : 'var(--fg)'}
              opacity={on || n.kind === 'core' ? 1 : 0.78}
              style={{ cursor: 'pointer' }}
              onClick={() => onJump(n.id)}
            >
              <title>{n.label}</title>
            </circle>
          );
        })}

        {/* view marker */}
        <g ref={viewRef}>
          <path d="M0 -8 L5.5 6 L0 3 L-5.5 6 Z" fill="var(--accent)" opacity="0.95" />
        </g>
      </svg>
    </div>
  );
};

export default Minimap;
