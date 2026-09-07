import * as THREE from 'three';
import { siReact, siNodedotjs, siGit, siGoogleanalytics } from 'simple-icons';

/**
 * Flagship technology per Perfil skill category (see COMMON_SKILLS in constants).
 * Category strings are not localised, so we key straight off them.
 */
export const CATEGORY_ICON: Record<string, { path: string; title: string }> = {
  Frontend: { path: siReact.path, title: siReact.title },
  Backend: { path: siNodedotjs.path, title: siNodedotjs.title },
  Tooling: { path: siGit.path, title: siGit.title },
  'Marketing & Data': { path: siGoogleanalytics.path, title: siGoogleanalytics.title }
};

export const PERFIL_CATEGORIES = Object.keys(CATEGORY_ICON);

export function iconForCategory(category: string, index = 0) {
  return CATEGORY_ICON[category] ?? Object.values(CATEGORY_ICON)[index % PERFIL_CATEGORIES.length];
}

const texCache = new Map<string, THREE.Texture>();

/**
 * Render a simple-icons 24×24 path to a canvas (the browser parses the path data
 * natively, fill-rule and all) → a white-on-transparent texture, tinted by the
 * material. Cached per key. Browser-only (needs Path2D + canvas).
 */
export function iconTexture(path: string, key: string): THREE.Texture {
  const hit = texCache.get(key);
  if (hit) return hit;

  const S = 256;
  const pad = 30;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d')!;
  ctx.translate(pad, pad);
  ctx.scale((S - pad * 2) / 24, (S - pad * 2) / 24);
  ctx.fillStyle = '#ffffff';
  ctx.fill(new Path2D(path));

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  texCache.set(key, tex);
  return tex;
}
