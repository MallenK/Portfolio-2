/**
 * Shared atmosphere state — the WebGPU background shader and the WebGL 3D scene
 * both read/write this, outside React so it updates per frame.
 */
export const atmos = {
  /** pointer in 0..1 screen space */
  mx: 0.5,
  my: 0.5,
  /** camera zoom, 0 (far) .. 1 (close), written by Scene3D */
  zoom: 0.35,
  /** accent hue in degrees for the shader (BVB yellow ≈ 48) */
  hue: 48,
  /** 1 = light theme, 0 = dark */
  light: 0
};

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      atmos.mx = e.clientX / window.innerWidth;
      atmos.my = e.clientY / window.innerHeight;
    },
    { passive: true }
  );
}
