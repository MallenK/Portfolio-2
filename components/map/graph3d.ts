import { PortfolioContent } from '../../types';

export type NodeKind = 'core' | 'primary' | 'satellite';
export type PrimaryShape = 'icosa' | 'box' | 'strata' | 'burst' | 'portal';
export type SatVariant = 'project' | 'company' | 'skill' | 'service';

export interface GNode3D {
  id: string;
  kind: NodeKind;
  label: string;
  /** popup section this element opens */
  section: string;
  /** item within the section to scroll to / highlight (satellites) */
  anchor?: string;
  parent?: string;
  count?: number;
  pos: [number, number, number];
  shape?: PrimaryShape;
  variant?: SatVariant;
  data?: {
    year?: string;
    live?: boolean;
    current?: boolean;
    skillCount?: number;
    url?: string;
    action?: string;
    stackCount?: number;
  };
}

export interface GEdge3D {
  a: string;
  b: string;
}

/** direction in the x/z plan (matches the minimap) + a distinct height per section */
/** even pentagon in the x/z plan + a distinct height per section */
const PRIMARY: Record<string, { dir: [number, number]; y: number; shape: PrimaryShape }> = {
  perfil: { dir: [-0.95, -0.31], y: 1.1, shape: 'icosa' },
  contacto: { dir: [0.0, -1.0], y: 2.4, shape: 'portal' },
  proyectos: { dir: [0.95, -0.31], y: -0.7, shape: 'box' },
  experiencia: { dir: [0.59, 0.81], y: 1.7, shape: 'strata' },
  servicios: { dir: [-0.59, 0.81], y: -1.5, shape: 'burst' }
};
const S = 6.4;

function rng(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0;
  return (h % 100000) / 100000;
}

export function buildGraph3D(c: PortfolioContent) {
  const nodes: GNode3D[] = [];
  const edges: GEdge3D[] = [];

  nodes.push({
    id: 'core',
    kind: 'core',
    label: c.meta.alias,
    section: 'core',
    pos: [0, 0, 0]
  });

  const sats = (
    pid: string,
    variant: SatVariant,
    items: { label: string; anchor: string; data: GNode3D['data'] }[]
  ) => {
    const p = nodes.find((n) => n.id === pid)!;
    const [px, py, pz] = p.pos;
    // fan around the parent, biased outward from the core, with real 3D volume
    const outward = Math.atan2(pz, px);
    const spread = Math.min(1.5, 0.65 + items.length * 0.15);
    items.forEach((it, i) => {
      const t = items.length === 1 ? 0 : i / (items.length - 1) - 0.5;
      const a = outward + t * spread;
      const dist = 1.45 + (i % 2) * 0.5 + rng(pid + i) * 0.45;
      const id = `${pid}:${i}`;
      nodes.push({
        id,
        kind: 'satellite',
        label: it.label,
        section: pid,
        anchor: it.anchor,
        parent: pid,
        variant,
        data: it.data,
        pos: [
          px + Math.cos(a) * dist,
          py + (rng(id + 'y') - 0.5) * 2.6,
          pz + Math.sin(a) * dist + (rng(id + 'z') - 0.5) * 1.4
        ]
      });
      edges.push({ a: pid, b: id });
    });
  };

  (
    [
      ['perfil', c.nav.perfil, c.about.skills.length],
      ['proyectos', c.nav.proyectos, c.projects.items.length],
      ['experiencia', c.nav.experiencia, c.experience.items.length],
      ['servicios', c.nav.servicios, c.services.items.length],
      ['contacto', c.nav.contacto, 0]
    ] as [string, string, number][]
  ).forEach(([id, label, count]) => {
    const conf = PRIMARY[id];
    nodes.push({
      id,
      kind: 'primary',
      label,
      section: id,
      count: count || undefined,
      shape: conf.shape,
      pos: [conf.dir[0] * S, conf.y, conf.dir[1] * S]
    });
    edges.push({ a: 'core', b: id });
  });

  // ---- children (contacto is a leaf: no satellites) ----
  sats(
    'perfil',
    'skill',
    c.about.skills.map((g) => ({
      label: g.category,
      anchor: g.category,
      data: { skillCount: g.skills.length }
    }))
  );
  sats(
    'proyectos',
    'project',
    c.projects.items.map((p) => ({
      label: p.title,
      anchor: p.id,
      data: { year: p.year, live: p.live, url: p.url, stackCount: p.stack.length }
    }))
  );
  sats(
    'experiencia',
    'company',
    c.experience.items.map((e, i) => ({
      label: e.company,
      anchor: e.id,
      data: { year: e.period, current: i === 0 }
    }))
  );
  sats(
    'servicios',
    'service',
    c.services.items.map((sv, i) => ({
      label: sv.title,
      anchor: String(i),
      data: { url: sv.url, action: sv.action, stackCount: i + 1 }
    }))
  );

  return { nodes, edges };
}
