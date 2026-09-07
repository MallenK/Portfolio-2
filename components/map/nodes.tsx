import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Billboard, Edges, Html } from '@react-three/drei';
import type { GNode3D } from './graph3d';

const ACCENT = '#fde100';

/* compact 3D value-noise for the flow shaders */
const NOISE = /* glsl */ `
  vec3 h3(vec3 p){ p=vec3(dot(p,vec3(127.1,311.7,74.7)),dot(p,vec3(269.5,183.3,246.1)),dot(p,vec3(113.5,271.9,124.6)));
    return fract(sin(p)*43758.5453123); }
  float vn(vec3 x){ vec3 i=floor(x); vec3 f=fract(x); f=f*f*(3.-2.*f);
    return mix(mix(mix(h3(i).x,h3(i+vec3(1,0,0)).x,f.x),mix(h3(i+vec3(0,1,0)).x,h3(i+vec3(1,1,0)).x,f.x),f.y),
               mix(mix(h3(i+vec3(0,0,1)).x,h3(i+vec3(1,0,1)).x,f.x),mix(h3(i+vec3(0,1,1)).x,h3(i+vec3(1,1,1)).x,f.x),f.y),f.z); }
  float fbm3(vec3 p){ float a=.5,s=0.; for(int i=0;i<4;i++){ s+=a*vn(p); p*=2.03; a*=.5; } return s; }
`;

/* additive radial-gradient glow billboard */
const GlowSprite: React.FC<{ size: number; opacity: number; color?: string; additive?: boolean }> = ({
  size,
  opacity,
  color = ACCENT,
  additive = true
}) => {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    const col = new THREE.Color(color);
    const rgb = `${(col.r * 255) | 0},${(col.g * 255) | 0},${(col.b * 255) | 0}`;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, `rgba(${rgb},0.9)`);
    g.addColorStop(0.4, `rgba(${rgb},0.24)`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, [color]);
  return (
    <sprite scale={size}>
      <spriteMaterial
        map={tex}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending}
        toneMapped={false}
      />
    </sprite>
  );
};

/* ---------- Singularidad — the Contacto node ----------
   an event horizon: a bright core, an orbiting accretion disc that shears with time,
   and a faint gravitational lens. Non-additive + darker gold on the light theme. */
const Singularity: React.FC<{ lit: boolean; theme: 'dark' | 'light' }> = ({ lit, theme }) => {
  const g = useRef<THREE.Group>(null);
  const disc = useRef<THREE.Mesh>(null);
  const light = theme === 'light';
  const gold = light ? '#8a6d00' : ACCENT;

  const discMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        blending: light ? THREE.NormalBlending : THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: { uT: { value: 0 }, uGold: { value: new THREE.Color(gold) }, uA: { value: light ? 0.9 : 0.55 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
        fragmentShader: `varying vec2 vUv; uniform float uT; uniform vec3 uGold; uniform float uA;
          void main(){
            float a = sin(vUv.x*44.0 - uT*4.0)*0.5 + 0.5;
            a *= smoothstep(0.0,0.28,vUv.y) * smoothstep(1.0,0.72,vUv.y);
            gl_FragColor = vec4(uGold, a*uA);
          }`
      }),
    [light, gold]
  );
  const lensMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        blending: light ? THREE.NormalBlending : THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: { uGold: { value: new THREE.Color(gold) }, uA: { value: light ? 0.4 : 0.28 } },
        vertexShader: `varying vec3 vN; varying vec3 vP;
          void main(){ vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); vP=mv.xyz; gl_Position=projectionMatrix*mv; }`,
        fragmentShader: `varying vec3 vN; varying vec3 vP; uniform vec3 uGold; uniform float uA;
          void main(){ vec3 V=normalize(-vP); float f=pow(1.-abs(dot(vN,V)),4.0); gl_FragColor=vec4(uGold, f*uA); }`
      }),
    [light, gold]
  );
  useFrame((state, dt) => {
    discMat.uniforms.uT.value = state.clock.elapsedTime;
    if (disc.current) disc.current.rotation.z += dt * 0.4;
    if (g.current) {
      g.current.rotation.y += dt * 0.06;
      const s = THREE.MathUtils.damp(g.current.scale.x, lit ? 0.58 : 0.48, 9, dt);
      g.current.scale.setScalar(s);
    }
  });
  return (
    <group ref={g} scale={0.48}>
      <mesh>
        <sphereGeometry args={[light ? 0.11 : 0.09, 20, 20]} />
        <meshBasicMaterial color={gold} toneMapped={false} />
      </mesh>
      <GlowSprite size={light ? 0.5 : 0.62} opacity={light ? 0.32 : 0.5} color={gold} additive={!light} />
      <mesh ref={disc} rotation={[Math.PI / 2 - 0.36, 0, 0]} material={discMat}>
        <ringGeometry args={[0.3, 0.64, 80]} />
      </mesh>
      <mesh material={lensMat}>
        <sphereGeometry args={[0.9, 40, 40]} />
      </mesh>
    </group>
  );
};

/* ============================================================ CLUSTER DUST
   a drifting particle haze around each primary so clusters read as nebulae */
export const ClusterDust: React.FC<{
  center: [number, number, number];
  count?: number;
  radius?: number;
  theme: 'dark' | 'light';
}> = ({ center, count = 220, radius = 2.6, theme }) => {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const bone = new THREE.Color(theme === 'light' ? '#3a3a34' : '#c9c9c0');
    const gold = new THREE.Color(ACCENT);
    for (let i = 0; i < count; i++) {
      // gaussian-ish blob
      const r = radius * Math.cbrt(Math.random()) * (0.5 + Math.random() * 0.8);
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
      pos[i * 3 + 2] = r * Math.cos(ph);
      const c = Math.random() < 0.16 ? gold : bone;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
  }, [count, radius, theme]);

  useFrame((state, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.04;
      const m = ref.current.material as THREE.PointsMaterial;
      m.opacity = 0.5 + 0.12 * Math.sin(state.clock.elapsedTime * 0.8);
    }
  });

  return (
    <points ref={ref} geometry={geo} position={center}>
      <pointsMaterial
        vertexColors
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
};

type Common = {
  n: GNode3D;
  theme: 'dark' | 'light';
  active: boolean;
  dim: boolean;
  onNode: (id: string, section: string, anchor?: string) => void;
  onHover: (id: string | null) => void;
};

const useHover = (onHover: (id: string | null) => void, id: string) => {
  const [h, setH] = useState(false);
  return {
    hovered: h,
    bind: {
      onPointerOver: (e: any) => {
        e.stopPropagation();
        setH(true);
        onHover(id);
        document.body.style.cursor = 'pointer';
      },
      onPointerOut: () => {
        setH(false);
        onHover(null);
        document.body.style.cursor = '';
      }
    }
  };
};

/* ---------- floating name card on hover ---------- */
const NameCard: React.FC<{
  text: string;
  sub?: string;
  y: number;
  theme: 'dark' | 'light';
  cta?: boolean;
}> = ({ text, sub, y, theme, cta }) => (
  <Html center position={[0, y, 0]} distanceFactor={12} style={{ pointerEvents: 'none' }} zIndexRange={[20, 0]}>
    <div
      style={{
        transform: 'translateY(-50%)',
        whiteSpace: 'nowrap',
        fontFamily: 'Montserrat, sans-serif',
        textAlign: 'center',
        textShadow: theme === 'light' ? '0 0 10px #f4f3ee, 0 0 4px #f4f3ee' : '0 0 12px #000, 0 0 4px #000'
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: '12px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: theme === 'light' ? '#0a0a0a' : '#f2f2f2'
        }}
      >
        {text}
      </div>
      {sub && (
        <div
          style={{
            marginTop: 3,
            fontSize: '9px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: theme === 'light' ? '#565650' : '#9a9a9a'
          }}
        >
          {sub}
        </div>
      )}
      {cta && (
        <div
          style={{
            marginTop: 5,
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: ACCENT
          }}
        >
          abrir →
        </div>
      )}
    </div>
  </Html>
);

/* ============================================================ CORE — "Nudo de energía"
   a torus knot carrying a flowing fbm energy band + a fresnel rim, slow tumble + breathing */
export const CoreNode: React.FC<Common> = ({ n, theme, onNode, onHover }) => {
  const g = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const { hovered, bind } = useHover(onHover, n.id);

  const knotMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uT: { value: 0 },
          uGold: { value: new THREE.Color(ACCENT) },
          uDark: { value: new THREE.Color(theme === 'light' ? '#20201a' : '#0d0d0a') }
        },
        vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vP;
          void main(){ vUv=uv; vN=normalize(normalMatrix*normal);
            vec4 mv=modelViewMatrix*vec4(position,1.); vP=mv.xyz;
            gl_Position=projectionMatrix*mv; }`,
        fragmentShader:
          NOISE +
          `varying vec2 vUv; varying vec3 vN; varying vec3 vP;
           uniform float uT; uniform vec3 uGold; uniform vec3 uDark;
           void main(){
             float flow = fbm3(vec3(vUv*vec2(9.0,2.2) - vec2(uT*0.7,0.0), uT*0.12));
             float band = smoothstep(0.40,0.72,flow);
             float spark = smoothstep(0.86,0.98,flow);
             vec3 V = normalize(-vP);
             float fres = pow(1.0 - max(dot(vN,V),0.0), 2.4);
             vec3 col = mix(uDark, uGold, band) + uGold*fres*0.5 + uGold*spark*0.9;
             gl_FragColor = vec4(col,1.0);
           }`
      }),
    [theme]
  );

  const haloMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uGold: { value: new THREE.Color(ACCENT) } },
        vertexShader: `varying vec3 vN; varying vec3 vP;
          void main(){ vN=normalize(normalMatrix*normal);
            vec4 mv=modelViewMatrix*vec4(position,1.); vP=mv.xyz;
            gl_Position=projectionMatrix*mv; }`,
        fragmentShader: `varying vec3 vN; varying vec3 vP; uniform vec3 uGold;
          void main(){ vec3 V=normalize(-vP);
            float f=pow(1.0-abs(dot(vN,V)),3.0);
            gl_FragColor=vec4(uGold, f*0.3); }`
      }),
    []
  );

  useFrame((state, dt) => {
    knotMat.uniforms.uT.value = state.clock.elapsedTime;
    if (knot.current) {
      knot.current.rotation.y += dt * 0.22;
      knot.current.rotation.x += dt * 0.11;
    }
    if (halo.current) halo.current.rotation.y -= dt * 0.15;
    if (g.current) {
      const b = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.04;
      g.current.scale.setScalar(THREE.MathUtils.damp(g.current.scale.x, (hovered ? 1.14 : 1) * b, 8, dt));
    }
  });

  return (
    <group ref={g} position={n.pos} {...bind} onClick={(e) => { e.stopPropagation(); onNode(n.id, 'core'); }}>
      <mesh ref={knot} material={knotMat}>
        <torusKnotGeometry args={[0.42, 0.135, 220, 28, 2, 3]} />
      </mesh>
      <mesh scale={0.32}>
        <sphereGeometry args={[0.5, 20, 20]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </mesh>
      <mesh ref={halo} material={haloMat} scale={1.15}>
        <sphereGeometry args={[0.8, 40, 40]} />
      </mesh>
      <GlowSprite size={1.6} opacity={theme === 'light' ? 0.1 : 0.16} additive={theme !== 'light'} />
      {hovered && <NameCard text={n.label} sub="manifiesto" y={1.5} theme={theme} />}
    </group>
  );
};

/* ============================================================ PRIMARY */
export const PrimaryNode: React.FC<Common> = ({ n, theme, active, dim, onNode, onHover }) => {
  const g = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Mesh>(null);
  const { hovered, bind } = useHover(onHover, n.id);
  const lit = hovered || active;
  const base = theme === 'light' ? '#0a0a0a' : '#eeeee6';

  useFrame((_, dt) => {
    if (g.current) {
      const s = THREE.MathUtils.damp(g.current.scale.x, lit ? 1.4 : dim ? 0.86 : 1, 9, dt);
      g.current.scale.setScalar(s);
    }
    if (spin.current) {
      spin.current.rotation.y += dt * (n.shape === 'box' ? 0.4 : 0.25);
      if (n.shape === 'box') spin.current.rotation.x += dt * 0.2;
    }
  });

  const mat = (
    <meshStandardMaterial
      color={lit ? ACCENT : base}
      emissive={lit ? ACCENT : base}
      emissiveIntensity={lit ? 1.1 : theme === 'light' ? 0.04 : 0.28}
      roughness={0.4}
      metalness={0.1}
    />
  );

  return (
    <group
      ref={g}
      position={n.pos}
      {...bind}
      onClick={(e) => { e.stopPropagation(); onNode(n.id, n.section); }}
    >
      {n.shape === 'icosa' && (
        <mesh ref={spin}>
          <icosahedronGeometry args={[0.32, 0]} />
          {mat}
          <Edges color={lit ? ACCENT : theme === 'light' ? '#8a8a82' : '#5a5a54'} />
        </mesh>
      )}
      {n.shape === 'box' && (
        <mesh ref={spin}>
          <boxGeometry args={[0.42, 0.42, 0.42]} />
          {mat}
          <Edges color={lit ? ACCENT : theme === 'light' ? '#8a8a82' : '#5a5a54'} />
        </mesh>
      )}
      {n.shape === 'strata' && (
        <group ref={spin as any}>
          {[0.42, 0.32, 0.22].map((rr, i) => (
            <mesh key={i} position={[0, (i - 1) * 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[rr, 0.035, 8, 40]} />
              {mat}
            </mesh>
          ))}
        </group>
      )}
      {n.shape === 'burst' && (
        <group ref={spin as any}>
          <mesh>
            <sphereGeometry args={[0.16, 16, 16]} />
            {mat}
          </mesh>
          {Array.from({ length: 9 }).map((_, i) => {
            const a = (i / 9) * Math.PI * 2;
            const b = Math.sin(i * 1.7) * 0.5;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.28, b * 0.3, Math.sin(a) * 0.28]} rotation={[0, -a, Math.PI / 2 + b]}>
                <coneGeometry args={[0.035, 0.34, 6]} />
                {mat}
              </mesh>
            );
          })}
        </group>
      )}
      {n.shape === 'portal' && <Singularity lit={lit} theme={theme} />}

      {/* persistent small label + count */}
      <Html center position={[0, n.shape === 'strata' ? 0.72 : 0.62, 0]} distanceFactor={13} style={{ pointerEvents: 'none' }} zIndexRange={[15, 0]}>
        <span
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            fontSize: '11px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            color: lit ? ACCENT : theme === 'light' ? '#565650' : '#9a9a9a',
            opacity: dim ? 0.4 : 1,
            textShadow: theme === 'light' ? '0 0 8px #f4f3ee' : '0 0 10px #000'
          }}
        >
          {n.label}
          {n.count ? `  ·  ${n.count}` : n.section === 'contacto' ? '  ·  →' : ''}
        </span>
      </Html>
      {hovered && n.section !== 'contacto' && <NameCard text={n.label} sub={`${n.count ?? ''} ${n.count ? 'elementos' : ''}`.trim()} y={-0.7} theme={theme} cta />}
    </group>
  );
};

/* ============================================================ SATELLITE */
export const SatelliteNode: React.FC<Common> = ({ n, theme, active, dim, onNode, onHover }) => {
  const g = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);
  const { hovered, bind } = useHover(onHover, n.id);
  const lit = hovered || active;
  const d = n.data ?? {};
  const base = theme === 'light' ? '#0a0a0a' : '#e2e2da';
  const current = d.current;

  useFrame((state, dt) => {
    if (g.current) {
      // hover lifts the satellite toward the viewer
      const target = lit ? 1.55 : dim ? 0.7 : 1;
      g.current.scale.setScalar(THREE.MathUtils.damp(g.current.scale.x, target, 10, dt));
    }
    if (orbit.current) orbit.current.rotation.z = state.clock.elapsedTime * 1.4;
  });

  const chip = (
    <meshStandardMaterial
      color={lit ? ACCENT : base}
      emissive={lit ? ACCENT : current ? ACCENT : base}
      emissiveIntensity={lit ? 1.1 : current ? 0.5 : theme === 'light' ? 0.03 : 0.2}
      roughness={0.45}
      metalness={0}
    />
  );

  return (
    <group
      ref={g}
      position={n.pos}
      {...bind}
      onClick={(e) => { e.stopPropagation(); onNode(n.id, n.section, n.anchor); }}
    >
      {/* --- PROJECT: a billboarded chip showing the year, live ring --- */}
      {n.variant === 'project' && (
        <Billboard>
          <mesh>
            <planeGeometry args={[0.4, 0.24]} />
            {chip}
            <Edges color={lit ? ACCENT : theme === 'light' ? '#8a8a82' : '#565650'} />
          </mesh>
          <Html center distanceFactor={11} style={{ pointerEvents: 'none' }} zIndexRange={[12, 0]}>
            <span
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: '10px',
                letterSpacing: '0.08em',
                color: '#0a0a0a'
              }}
            >
              {d.year}
            </span>
          </Html>
          {d.live && (
            <group ref={orbit}>
              <mesh position={[0.28, 0, 0.02]}>
                <sphereGeometry args={[0.028, 8, 8]} />
                <meshBasicMaterial color={ACCENT} toneMapped={false} />
              </mesh>
              <mesh>
                <torusGeometry args={[0.28, 0.005, 6, 40]} />
                <meshBasicMaterial color={ACCENT} toneMapped={false} transparent opacity={0.4} />
              </mesh>
            </group>
          )}
        </Billboard>
      )}

      {/* --- COMPANY: a plate; the current job gets a gold rim + is larger --- */}
      {n.variant === 'company' && (
        <group scale={current ? 1.25 : 1}>
          <mesh>
            <boxGeometry args={[0.34, 0.12, 0.34]} />
            {chip}
          </mesh>
          {current && (
            <mesh position={[0, 0.11, 0]}>
              <boxGeometry args={[0.4, 0.02, 0.4]} />
              <meshBasicMaterial color={ACCENT} toneMapped={false} />
            </mesh>
          )}
        </group>
      )}

      {/* --- SKILL: a little stack of cubes = the size of that part of the stack --- */}
      {n.variant === 'skill' && (
        <group rotation={[0.3, 0.5, 0]}>
          {Array.from({ length: Math.min(d.skillCount ?? 4, 6) }).map((_, i) => (
            <mesh
              key={i}
              position={[((i % 2) - 0.5) * 0.13, Math.floor(i / 2) * 0.13 - 0.13, 0]}
            >
              <boxGeometry args={[0.11, 0.11, 0.11]} />
              {chip}
            </mesh>
          ))}
        </group>
      )}

      {/* --- SERVICE: a flat hexagon badge --- */}
      {n.variant === 'service' && (
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.16, 0.16, 0.05, 6]} />
          {chip}
          <Edges color={lit ? ACCENT : theme === 'light' ? '#8a8a82' : '#565650'} />
        </mesh>
      )}

      {(hovered || active) && (
        <NameCard
          text={n.label}
          sub={
            n.variant === 'company'
              ? d.year
              : n.variant === 'skill'
                ? `${d.skillCount} tecnologías`
                : n.variant === 'project'
                  ? `${d.year}${d.live ? ' · en producción' : ''}`
                  : undefined
          }
          y={0.5}
          theme={theme}
          cta={n.variant === 'project' || n.variant === 'service'}
        />
      )}
    </group>
  );
};
