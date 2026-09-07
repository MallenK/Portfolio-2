import { PortfolioContent } from '../../types';

export type NodeKind = 'core' | 'primary' | 'satellite';

export interface GNode {
  id: string;
  label: string;
  kind: NodeKind;
  target: string;
  parent?: string;
  /** small count shown next to a primary label, e.g. "5" */
  count?: number;
  /** satellite marked live in production — gets the yellow marker */
  live?: boolean;
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  _a?: number;
}

export interface GEdge {
  a: string;
  b: string;
}

/** hand-placed primary positions — clear of the central wordmark band */
const PRIMARY_POS: Record<string, [number, number]> = {
  perfil: [-0.6, -0.36],
  proyectos: [0.62, -0.32],
  experiencia: [0.68, 0.32],
  servicios: [-0.6, 0.42],
  contacto: [0.06, 0.66]
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
    r: kind === 'core' ? 8 : kind === 'primary' ? 5 : 3
  });

  const core = mk('core', c.meta.alias, 'core', 'core');
  core.hx = 0;
  core.hy = -0.06;
  nodes.push(core);

  const primaries: { id: string; label: string; count?: number }[] = [
    { id: 'perfil', label: c.nav.perfil },
    { id: 'proyectos', label: c.nav.proyectos, count: c.projects.items.length },
    { id: 'experiencia', label: c.nav.experiencia, count: c.experience.items.length },
    { id: 'servicios', label: c.nav.servicios, count: c.services.items.length },
    { id: 'contacto', label: c.nav.contacto }
  ];
  primaries.forEach((p) => {
    const n = mk(p.id, p.label, 'primary', p.id);
    n.count = p.count;
    const [px, py] = PRIMARY_POS[p.id];
    n.hx = px * (small ? 0.66 : 1);
    n.hy = py * (small ? 0.82 : 1);
    nodes.push(n);
    edges.push({ a: 'core', b: p.id });
  });

  const addSats = (
    pid: string,
    items: { label: string; live?: boolean }[],
    scale = 1
  ) => {
    const p = nodes.find((n) => n.id === pid)!;
    const base = Math.atan2(p.hy - core.hy, p.hx - core.hx);
    const spread = Math.min(1.15, 0.5 + items.length * 0.13);
    items.forEach((it, i) => {
      const id = `${pid}:${i}`;
      const n = mk(id, it.label, 'satellite', pid, pid);
      n.live = it.live;
      const t = items.length === 1 ? 0 : i / (items.length - 1) - 0.5;
      const a = base + t * spread;
      const dist = (0.19 + (i % 2) * 0.055) * scale;
      n.hx = p.hx + Math.cos(a) * dist;
      n.hy = p.hy + Math.sin(a) * dist;
      nodes.push(n);
      edges.push({ a: pid, b: id });
    });
  };

  const s = small ? 0.62 : 1;
  const cap = <T,>(a: T[], n: number) => (small ? a.slice(0, n) : a);
  addSats('perfil', cap(c.about.skills, 3).map((x) => ({ label: x.category })), s);
  addSats('proyectos', cap(c.projects.items, 4).map((p) => ({ label: p.title, live: p.live })), s);
  addSats('experiencia', cap(c.experience.items, 4).map((e) => ({ label: e.company })), s);
  addSats('servicios', c.services.items.slice(0, small ? 3 : 4).map((x) => ({ label: x.title })), s);

  return { nodes, edges };
}
