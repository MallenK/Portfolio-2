import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, Html, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { PortfolioContent } from '../../types';
import { buildGraph3D, GNode3D } from './graph3d';
import { atmos } from '../bg/atmos';

interface Props {
  content: PortfolioContent;
  theme: 'dark' | 'light';
  reducedMotion: boolean;
  onOpen: (target: string) => void;
}

const isSmall = () => typeof window !== 'undefined' && window.innerWidth < 720;
const MIN_D = 5;
const MAX_D = isSmall() ? 26 : 18;
const HOME_Z = isSmall() ? 20 : 11.5;

/* ------------------------------------------------------------------ node */
const Node: React.FC<{
  n: GNode3D;
  theme: 'dark' | 'light';
  onOpen: (t: string) => void;
  onHover: (id: string | null) => void;
  active: boolean;
}> = ({ n, theme, onOpen, onHover, active }) => {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const accent = '#fde100';
  const base = theme === 'light' ? '#0a0a0a' : '#f2f2f2';
  const size = n.kind === 'core' ? 0.42 : n.kind === 'primary' ? 0.24 : 0.12;
  const lit = hovered || active;

  useFrame((_, dt) => {
    if (!ref.current) return;
    if (n.kind === 'core') ref.current.rotation.y += dt * 0.15;
    const s = THREE.MathUtils.damp(ref.current.scale.x, lit ? 1.35 : 1, 8, dt);
    ref.current.scale.setScalar(s);
  });

  const showLabel = n.kind === 'primary' || hovered || active;

  return (
    <group position={n.pos}>
      <mesh
        ref={ref}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(n.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onOpen(n.target);
        }}
      >
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial
          color={lit ? accent : base}
          emissive={lit ? accent : n.kind === 'core' ? accent : base}
          emissiveIntensity={n.kind === 'core' ? 0.6 : lit ? 1.1 : theme === 'light' ? 0.05 : 0.35}
          roughness={0.4}
          metalness={0}
        />
      </mesh>

      {n.kind === 'core' && (
        <mesh rotation={[Math.PI / 2.6, 0, 0]}>
          <torusGeometry args={[0.72, 0.012, 12, 64]} />
          <meshBasicMaterial color={accent} toneMapped={false} transparent opacity={0.85} />
        </mesh>
      )}
      {n.live && (
        <mesh position={[size + 0.12, size + 0.05, 0]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshBasicMaterial color={accent} toneMapped={false} />
        </mesh>
      )}

      {showLabel && n.kind !== 'core' && (
        <Html
          center
          distanceFactor={11}
          position={[0, size + 0.42, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <span
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              fontSize: '11px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              color: lit ? accent : theme === 'light' ? '#565650' : '#9a9a9a',
              textShadow: theme === 'light' ? '0 0 8px #f4f3ee' : '0 0 10px #000'
            }}
          >
            {n.label}
            {n.kind === 'primary' && n.count ? `  ·  ${n.count}` : ''}
          </span>
        </Html>
      )}
    </group>
  );
};

/* ------------------------------------------------------------------ rig */
const Rig: React.FC = () => {
  const { camera } = useThree();
  useFrame(() => {
    const d = camera.position.length();
    atmos.zoom = THREE.MathUtils.clamp(1 - (d - MIN_D) / (MAX_D - MIN_D), 0, 1);
  });
  return null;
};

/** whole graph scales + settles in on mount — the "leap" without fighting OrbitControls */
const GraphGroup: React.FC<{ children: React.ReactNode; reducedMotion: boolean }> = ({
  children,
  reducedMotion
}) => {
  const ref = useRef<THREE.Group>(null);
  // lift + shrink the graph on phones so every cluster stays in frame
  const small = isSmall();
  const rest = small ? 0.8 : 1;
  const t = useRef(reducedMotion ? 1 : 0);
  useFrame((_, dt) => {
    if (!ref.current || t.current >= 1) return;
    t.current = Math.min(1, t.current + dt / 1.2);
    const e = 1 - Math.pow(1 - t.current, 3);
    ref.current.scale.setScalar(rest * (0.45 + 0.55 * e));
    ref.current.rotation.y = (1 - e) * -0.55;
  });
  return (
    <group ref={ref} position={[0, small ? 2.4 : 0, 0]} scale={reducedMotion ? rest : rest * 0.45}>
      {children}
    </group>
  );
};

/* ------------------------------------------------------------------ graph */
const Graph: React.FC<Omit<Props, 'content'> & { data: ReturnType<typeof buildGraph3D> }> = ({
  data,
  theme,
  reducedMotion,
  onOpen
}) => {
  const [hover, setHover] = useState<string | null>(null);
  const activeChain = hover ? data.nodes.find((n) => n.id === hover)?.parent ?? hover : null;
  const byId = useMemo(() => new Map(data.nodes.map((n) => [n.id, n])), [data.nodes]);
  const accent = '#fde100';
  const edgeCol = theme === 'light' ? '#c9c6bb' : '#333333';

  return (
    <>
      <ambientLight intensity={theme === 'light' ? 0.9 : 0.4} />
      <pointLight position={[6, 8, 10]} intensity={theme === 'light' ? 30 : 55} color="#fff6d0" />
      <pointLight position={[-8, -4, 6]} intensity={20} color="#fde100" />

      <GraphGroup reducedMotion={reducedMotion}>
        {data.edges.map((e, i) => {
          const a = byId.get(e.a)!;
          const b = byId.get(e.b)!;
          const lit =
            activeChain && (e.a === activeChain || e.b === activeChain || e.a === hover || e.b === hover);
          return (
            <Line
              key={i}
              points={[a.pos, b.pos]}
              color={lit ? accent : edgeCol}
              lineWidth={lit ? 1.4 : 1}
              transparent
              opacity={lit ? 0.8 : 0.5}
            />
          );
        })}

        {data.nodes.map((n) => (
          <Node
            key={n.id}
            n={n}
            theme={theme}
            onOpen={onOpen}
            onHover={setHover}
            active={activeChain === n.id || activeChain === n.parent}
          />
        ))}
      </GraphGroup>

      <Rig />
      <OrbitControls
        makeDefault
        target={isSmall() ? [0, 2.4, 0] : [0, 0, 0]}
        enablePan={false}
        enableZoom
        zoomSpeed={0.7}
        minDistance={MIN_D}
        maxDistance={MAX_D}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={reducedMotion ? 0 : 0.55}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.26}
        minPolarAngle={Math.PI * 0.24}
        maxPolarAngle={Math.PI * 0.76}
      />
    </>
  );
};

/* ------------------------------------------------------------------ scene */
const Scene3D: React.FC<Props> = ({ content, theme, reducedMotion, onOpen }) => {
  const data = useMemo(() => buildGraph3D(content), [content]);

  return (
    <div className="fixed inset-0">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: isSmall() ? 46 : 42, near: 0.1, far: 120, position: [0, isSmall() ? 2.4 : 0, HOME_Z] }}
      >
        <Suspense fallback={null}>
          <Graph data={data} theme={theme} reducedMotion={reducedMotion} onOpen={onOpen} />
          {!reducedMotion && (
            <EffectComposer multisampling={0}>
              <Bloom intensity={0.5} luminanceThreshold={0.62} luminanceSmoothing={0.28} mipmapBlur />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
