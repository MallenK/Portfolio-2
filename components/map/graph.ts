import { PortfolioContent } from '../../types';

export type NodeKind = 'core' | 'primary' | 'satellite';

export interface GNode {
  id: string;
  label: string;
  kind: NodeKind;
  target: string;
  parent?: string;
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export interface GEdge {
  a: string;
  b: string;
}

/** hand-placed primary positions — all clear of the central wordmark band (|hy| >= 0.24) */
const PRIMARY_POS: Record<string, [number, number]> = {
  perfil: [-0.58, -0.34],
  proyectos: [0.6, -0.3],
  experiencia: [0.66, 0.3],
  servicios: [-0.58, 0.4],
  contacto: [0.08, 0.62]
};

export function buildGraph(c: PortfolioContent, small: boolean): { nodes: GNode[]; edges: GEdge[] } {
  const nodes: GNode[] = [];
  const edges: GEdge[] = [];

  const mk = (
    id: string,
    label: string,
    kind: NodeKind,
    target: string,
    parent?: string
  ): GNode => ({
    id,
    label,
    kind,
    target,
    parent,
    hx: 0,
    hy: 0,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    r: kind === 'core' ? 6.5 : kind === 'primary' ? 4.5 : 2.6
  });

  const core = mk('core', c.meta.alias, 'core', 'top');
  core.hx = 0;
  core.hy = -0.06;
  nodes.push(core);

  const primaries: [string, string][] = [
    ['perfil', c.nav.perfil],
    ['proyectos', c.nav.proyectos],
    ['experiencia', c.nav.experiencia],
    ['servicios', c.nav.servicios],
    ['contacto', c.nav.contacto]
  ];
  primaries.forEach(([id, label]) => {
    const n = mk(id, label, 'primary', id);
    const [px, py] = PRIMARY_POS[id];
    n.hx = px * (small ? 0.62 : 1);
    n.hy = py * (small ? 0.8 : 1);
    nodes.push(n);
    edges.push({ a: 'core', b: id });
  });

  // satellites — desktop only, fanned outward from the parent (away from centre)
  if (!small) {
    const addSats = (pid: string, items: string[]) => {
      const p = nodes.find((n) => n.id === pid)!;
      const base = Math.atan2(p.hy - core.hy, p.hx - core.hx);
      const spread = Math.min(1.1, 0.4 + items.length * 0.13);
      items.forEach((label, i) => {
        const id = `${pid}:${i}`;
        const n = mk(id, label, 'satellite', pid, pid);
        const t = items.length === 1 ? 0 : i / (items.length - 1) - 0.5;
        const a = base + t * spread;
        const dist = 0.23 + (i % 2) * 0.05;
        n.hx = p.hx + Math.cos(a) * dist;
        n.hy = p.hy + Math.sin(a) * dist;
        nodes.push(n);
        edges.push({ a: pid, b: id });
      });
    };
    addSats('perfil', c.about.skills.map((s) => s.category));
    addSats('proyectos', c.projects.items.map((p) => p.title));
    addSats('experiencia', c.experience.items.map((e) => e.company));
    addSats('servicios', c.services.items.slice(0, 3).map((s) => s.title));
  }

  return { nodes, edges };
}
