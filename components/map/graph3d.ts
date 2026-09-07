import { PortfolioContent } from '../../types';
import { buildGraph, GNode } from './graph';

export interface GNode3D extends GNode {
  pos: [number, number, number];
}

/**
 * Lift the 2D constellation graph into 3D: the hand-placed x/y become the
 * screen-plane spread, and z is layered by node kind plus a deterministic
 * jitter so the map has real depth to orbit and zoom through.
 */
export function buildGraph3D(content: PortfolioContent) {
  const { nodes, edges } = buildGraph(content, false);
  const SPREAD = 4.4;

  const seed = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return (h % 1000) / 1000;
  };

  const nodes3d: GNode3D[] = nodes.map((n) => {
    let z = 0;
    if (n.kind === 'core') z = 0;
    else if (n.kind === 'primary') z = (seed(n.id) - 0.5) * 3.2;
    else z = (seed(n.id) - 0.5) * 4.6;

    const x = n.hx * SPREAD;
    const y = n.hy * SPREAD * 0.82;
    return { ...n, pos: [x, y, z] as [number, number, number] };
  });

  return { nodes: nodes3d, edges };
}
