import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Billboard, Edges, Html } from '@react-three/drei';
import type { GNode3D } from './graph3d';

const ACCENT = '#fde100';

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

/* ============================================================ CORE */
export const CoreNode: React.FC<Common> = ({ n, theme, onNode, onHover }) => {
  const g = useRef<THREE.Group>(null);
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const { hovered, bind } = useHover(onHover, n.id);

  useFrame((state, dt) => {
    if (g.current) {
      g.current.rotation.y += dt * 0.18;
      const b = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.04;
      g.current.scale.setScalar(THREE.MathUtils.damp(g.current.scale.x, (hovered ? 1.15 : 1) * b, 8, dt));
    }
    if (r1.current) r1.current.rotation.z += dt * 0.5;
    if (r2.current) {
      r2.current.rotation.x += dt * 0.35;
      r2.current.rotation.y -= dt * 0.2;
    }
  });

  return (
    <group ref={g} position={n.pos} {...bind} onClick={(e) => { e.stopPropagation(); onNode(n.id, 'core'); }}>
      <mesh>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color="#1a1a12" emissive={ACCENT} emissiveIntensity={0.5} roughness={0.35} metalness={0.2} />
        <Edges color={ACCENT} threshold={12} />
      </mesh>
      <mesh scale={0.42}>
        <sphereGeometry args={[0.5, 20, 20]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </mesh>
      <mesh ref={r1} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.92, 0.012, 10, 80]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} transparent opacity={0.9} />
      </mesh>
      <mesh ref={r2} rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[1.12, 0.007, 8, 80]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} transparent opacity={0.45} />
      </mesh>
      {hovered && <NameCard text={n.label} sub="manifiesto" y={1.7} theme={theme} />}
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
      {n.shape === 'portal' && (
        <Billboard>
          <mesh ref={spin}>
            <torusGeometry args={[0.36, 0.03, 14, 60]} />
            <meshStandardMaterial color={lit ? ACCENT : base} emissive={ACCENT} emissiveIntensity={lit ? 1.4 : 0.6} roughness={0.3} />
          </mesh>
          <mesh scale={lit ? 0.9 : 0.7}>
            <circleGeometry args={[0.33, 32]} />
            <meshBasicMaterial color={ACCENT} toneMapped={false} transparent opacity={lit ? 0.22 : 0.1} />
          </mesh>
        </Billboard>
      )}

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
