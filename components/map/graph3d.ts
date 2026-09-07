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
  const SPREAD = 7.2;

  const seed = (s: string) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
    return (h % 10000) / 10000;
  };

  const nodes3d: GNode3D[] = nodes.map((n) => {
    let z = 0;
    if (n.kind === 'core') z = 0;
    else if (n.kind === 'primary') z = (seed(n.id) - 0.5) * 6.5;
    else z = (seed(n.id + '·z') - 0.5) * 9;

    // widen the satellite fan a little in 3D so clusters have real volume
    const jx = n.kind === 'satellite' ? (seed(n.id + 'x') - 0.5) * 1.1 : 0;
    const jy = n.kind === 'satellite' ? (seed(n.id + 'y') - 0.5) * 1.1 : 0;

    const x = n.hx * SPREAD + jx;
    const y = n.hy * SPREAD * 0.78 + jy;
    return { ...n, pos: [x, y, z] as [number, number, number] };
  });

  return { nodes: nodes3d, edges };
}
