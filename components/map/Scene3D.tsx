import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, Html, CameraControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import CameraControlsImpl from 'camera-controls';
import { PortfolioContent } from '../../types';
import { buildGraph3D, GNode3D } from './graph3d';
import { atmos } from '../bg/atmos';

interface Props {
  content: PortfolioContent;
  theme: 'dark' | 'light';
  reducedMotion: boolean;
  focusId: string | null;
  onOpen: (target: string) => void;
}

const small = () => typeof window !== 'undefined' && window.innerWidth < 720;
const MIN_D = 3;
const MAX_D = 46;
const homeDist = () => (small() ? 30 : 15);

/* ------------------------------------------------------------------ node */
const Node: React.FC<{
  n: GNode3D;
  theme: 'dark' | 'light';
  onOpen: (t: string) => void;
  onHover: (id: string | null) => void;
  active: boolean;
}> = ({ n, theme, onOpen, onHover, active }) => {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const accent = '#fde100';
  const baseCol = theme === 'light' ? '#0a0a0a' : '#f2f2f2';
  const size = n.kind === 'core' ? 0.5 : n.kind === 'primary' ? 0.28 : 0.13;
  const lit = hovered || active;

  useFrame((_, dt) => {
    if (!ref.current) return;
    if (n.kind === 'core') ref.current.rotation.y += dt * 0.15;
    const s = THREE.MathUtils.damp(ref.current.scale.x, lit ? 1.4 : 1, 9, dt);
    ref.current.scale.setScalar(s);
  });

  const showLabel = n.kind === 'primary' || hovered || active;

  return (
    <group ref={ref} position={n.pos}>
      <mesh
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
          color={lit ? accent : baseCol}
          emissive={lit ? accent : n.kind === 'core' ? accent : baseCol}
          emissiveIntensity={n.kind === 'core' ? 0.65 : lit ? 1.2 : theme === 'light' ? 0.05 : 0.35}
          roughness={0.4}
          metalness={0}
        />
      </mesh>

      {n.kind === 'core' && (
        <mesh rotation={[Math.PI / 2.5, 0.2, 0]}>
          <torusGeometry args={[0.86, 0.014, 12, 72]} />
          <meshBasicMaterial color={accent} toneMapped={false} transparent opacity={0.9} />
        </mesh>
      )}
      {n.live && (
        <mesh position={[size + 0.14, size + 0.06, 0]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshBasicMaterial color={accent} toneMapped={false} />
        </mesh>
      )}

      {showLabel && n.kind !== 'core' && (
        <Html center distanceFactor={13} position={[0, size + 0.5, 0]} style={{ pointerEvents: 'none' }}>
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

/* ------------------------------------------------------------------ controls + rig */
const Controls: React.FC<{
  data: ReturnType<typeof buildGraph3D>;
  reducedMotion: boolean;
  focusId: string | null;
}> = ({ data, reducedMotion, focusId }) => {
  const ref = useRef<CameraControlsImpl>(null);
  const { camera } = useThree();

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const A = CameraControlsImpl.ACTION;
    // free movement: drag pans the map in every direction, wheel zooms,
    // right-drag (or a modifier) tumbles to reveal depth
    c.mouseButtons.left = A.TRUCK;
    c.mouseButtons.right = A.ROTATE;
    c.mouseButtons.middle = A.DOLLY;
    c.mouseButtons.wheel = A.DOLLY;
    c.touches.one = A.TOUCH_TRUCK;
    c.touches.two = A.TOUCH_DOLLY_ROTATE;
    c.touches.three = A.TOUCH_DOLLY_TRUCK;
    c.dollyToCursor = true;
    c.smoothTime = 0.42;
    c.draggingSmoothTime = 0.14;
    c.minDistance = MIN_D;
    c.maxDistance = MAX_D;
    c.minPolarAngle = 0.12;
    c.maxPolarAngle = Math.PI - 0.12;
    c.infinityDolly = false;
    // soft fence so you can roam wide but never fly off into the void
    c.setBoundary(new THREE.Box3(new THREE.Vector3(-44, -34, -44), new THREE.Vector3(44, 34, 44)));
    c.boundaryFriction = 0.35;
    c.boundaryEnclosesCamera = true;

    const bump = () => {
      atmos.lastInput = performance.now();
    };
    c.addEventListener('controlstart', bump);
    c.addEventListener('control', bump);
    return () => {
      c.removeEventListener('controlstart', bump);
      c.removeEventListener('control', bump);
    };
  }, []);

  // fly to a node when a pop-up opens; return home when it closes
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    if (focusId && focusId !== 'core') {
      const n = data.nodes.find((x) => x.id === focusId);
      if (n) {
        const [x, y, z] = n.pos;
        const d = 4.2;
        c.setLookAt(x + d * 0.5, y + d * 0.35, z + d, x, y, z, true);
        return;
      }
    }
    if (focusId === 'core' || focusId === null) {
      c.setLookAt(0, small() ? 2 : 0.5, homeDist(), 0, small() ? 1.4 : 0, 0, true);
    }
  }, [focusId, data.nodes]);

  useFrame((_, dt) => {
    const c = ref.current;
    if (!c) return;
    // idle drift — a slow orbit after the user pauses
    if (!reducedMotion && performance.now() - atmos.lastInput > 2600) {
      c.rotate(0.055 * dt, 0, false);
    }
    // publish state for the background shader + the minimap
    atmos.zoom = THREE.MathUtils.clamp(1 - (c.distance - MIN_D) / (MAX_D - MIN_D), 0, 1);
    atmos.camX = camera.position.x;
    atmos.camY = camera.position.y;
    atmos.camZ = camera.position.z;
    const t = new THREE.Vector3();
    c.getTarget(t);
    atmos.tgtX = t.x;
    atmos.tgtY = t.y;
    atmos.tgtZ = t.z;
  });

  return (
    <CameraControls ref={ref as any} makeDefault />
  );
};

/** whole graph scales + un-twists in on mount — the "leap" */
const GraphGroup: React.FC<{ children: React.ReactNode; reducedMotion: boolean }> = ({
  children,
  reducedMotion
}) => {
  const ref = useRef<THREE.Group>(null);
  const rest = small() ? 0.82 : 1;
  const t = useRef(reducedMotion ? 1 : 0);
  useFrame((_, dt) => {
    if (!ref.current || t.current >= 1) return;
    t.current = Math.min(1, t.current + dt / 1.3);
    const e = 1 - Math.pow(1 - t.current, 3);
    ref.current.scale.setScalar(rest * (0.5 + 0.5 * e));
    ref.current.rotation.y = (1 - e) * -0.6;
  });
  return (
    <group ref={ref} scale={reducedMotion ? rest : rest * 0.5}>
      {children}
    </group>
  );
};

/* ------------------------------------------------------------------ graph */
const Graph: React.FC<Omit<Props, 'content'> & { data: ReturnType<typeof buildGraph3D> }> = ({
  data,
  theme,
  reducedMotion,
  focusId,
  onOpen
}) => {
  const [hover, setHover] = useState<string | null>(null);
  const activeChain = hover ? data.nodes.find((n) => n.id === hover)?.parent ?? hover : null;
  const byId = useMemo(() => new Map(data.nodes.map((n) => [n.id, n])), [data.nodes]);
  const accent = '#fde100';
  const edgeCol = theme === 'light' ? '#bdbaae' : '#333333';

  return (
    <>
      <ambientLight intensity={theme === 'light' ? 0.95 : 0.42} />
      <pointLight position={[8, 10, 12]} intensity={theme === 'light' ? 34 : 60} color="#fff6d0" />
      <pointLight position={[-10, -6, 8]} intensity={24} color="#fde100" />

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
              lineWidth={lit ? 1.5 : 1}
              transparent
              opacity={lit ? 0.85 : 0.42}
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
            active={activeChain === n.id || activeChain === n.parent || focusId === n.id}
          />
        ))}
      </GraphGroup>

      <Controls data={data} reducedMotion={reducedMotion} focusId={focusId} />
    </>
  );
};

/* ------------------------------------------------------------------ scene */
const Scene3D: React.FC<Props> = ({ content, theme, reducedMotion, focusId, onOpen }) => {
  const data = useMemo(() => buildGraph3D(content), [content]);
  const s = small();

  return (
    <div className="fixed inset-0">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: s ? 50 : 42, near: 0.1, far: 200, position: [0, s ? 2 : 0.5, s ? 30 : 15] }}
      >
        <Suspense fallback={null}>
          <Graph
            data={data}
            theme={theme}
            reducedMotion={reducedMotion}
            focusId={focusId}
            onOpen={onOpen}
          />
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
