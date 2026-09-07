import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, CameraControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import CameraControlsImpl from 'camera-controls';
import { PortfolioContent } from '../../types';
import { buildGraph3D, GNode3D } from './graph3d';
import { CoreNode, PrimaryNode, SatelliteNode, ClusterDust } from './nodes';
import { atmos } from '../bg/atmos';

interface Props {
  content: PortfolioContent;
  theme: 'dark' | 'light';
  reducedMotion: boolean;
  focusId: string | null;
  activeSection: string | null;
  onNode: (id: string, section: string, anchor?: string) => void;
}

const small = () => typeof window !== 'undefined' && window.innerWidth < 720;
const MIN_D = 3;
const MAX_D = 44;
const homeDist = () => (small() ? 30 : 17.5);

/* ------------------------------------------------------------------ controls */
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
    // immersive orbit-first navigation:
    //  · one finger / left drag  → orbit around the look point (full 3D)
    //  · two fingers / right drag → pan (truck) the look point anywhere
    //  · pinch / wheel            → zoom (dolly)
    c.mouseButtons.left = A.ROTATE;
    c.mouseButtons.right = A.TRUCK;
    c.mouseButtons.middle = A.DOLLY;
    c.mouseButtons.wheel = A.DOLLY;
    c.touches.one = A.TOUCH_ROTATE;
    c.touches.two = A.TOUCH_DOLLY_TRUCK;
    c.touches.three = A.TOUCH_TRUCK;
    c.dollyToCursor = false;
    c.smoothTime = 0.34;
    c.draggingSmoothTime = 0.1;
    c.azimuthRotateSpeed = 0.9;
    c.polarRotateSpeed = 0.9;
    c.truckSpeed = 2.2;
    c.dollySpeed = 0.9;
    c.minDistance = MIN_D;
    c.maxDistance = 34;
    c.minPolarAngle = 0.02;
    c.maxPolarAngle = Math.PI - 0.02;
    c.infinityDolly = false;
    c.setBoundary(new THREE.Box3(new THREE.Vector3(-24, -20, -24), new THREE.Vector3(24, 20, 24)));
    c.boundaryFriction = 0.4;
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

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const n = focusId ? data.nodes.find((x) => x.id === focusId) : null;
    if (n && focusId !== 'core') {
      const [x, y, z] = n.pos;
      const d = n.kind === 'satellite' ? 3.2 : 5;
      c.setLookAt(x + d * 0.45, y + d * 0.32, z + d, x, y, z, true);
    } else {
      c.setLookAt(0, small() ? 2 : 0.5, homeDist(), 0, small() ? 1.4 : 0, 0, true);
    }
  }, [focusId, data.nodes]);

  const idleT = useRef(0);
  useFrame((_, dt) => {
    const c = ref.current;
    if (!c) return;
    // ambient drift: a slow horizontal turn with a gentle vertical bob, so the
    // scene tumbles in 3D at rest instead of only panning left↔right
    if (!reducedMotion && !focusId && performance.now() - atmos.lastInput > 2600) {
      idleT.current += dt;
      c.rotate(0.05 * dt, Math.sin(idleT.current * 0.12) * 0.02 * dt, false);
    }
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

  return <CameraControls ref={ref as any} makeDefault />;
};

/** whole graph scales + un-twists in on mount — the "leap" */
const GraphGroup: React.FC<{ children: React.ReactNode; reducedMotion: boolean }> = ({
  children,
  reducedMotion
}) => {
  const ref = useRef<THREE.Group>(null);
  const t = useRef(reducedMotion ? 1 : 0);
  useFrame((_, dt) => {
    if (!ref.current || t.current >= 1) return;
    t.current = Math.min(1, t.current + dt / 1.3);
    const e = 1 - Math.pow(1 - t.current, 3);
    ref.current.scale.setScalar(0.55 + 0.45 * e);
    ref.current.rotation.y = (1 - e) * -0.55;
  });
  return (
    <group ref={ref} scale={reducedMotion ? 1 : 0.55}>
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
  activeSection,
  onNode
}) => {
  const [hover, setHover] = useState<string | null>(null);
  const byId = useMemo(() => new Map(data.nodes.map((n) => [n.id, n])), [data.nodes]);
  const accent = '#fde100';
  const edgeCol = theme === 'light' ? '#bdbaae' : '#333333';

  const hoverNode = hover ? byId.get(hover) : null;
  const focusSection = activeSection ?? (hoverNode ? hoverNode.section : null);
  const primaries = data.nodes.filter((n) => n.kind === 'primary');

  const isDim = (n: GNode3D) => {
    if (!focusSection) return false;
    if (n.kind === 'core') return true;
    return n.section !== focusSection;
  };
  const litEdge = (a: string, b: string) => {
    const na = byId.get(a);
    const nb = byId.get(b);
    if (hover && (a === hover || b === hover)) return true;
    if (focusSection && (na?.section === focusSection || nb?.section === focusSection)) return true;
    return false;
  };

  return (
    <>
      <ambientLight intensity={theme === 'light' ? 0.95 : 0.5} />
      <pointLight position={[8, 10, 12]} intensity={theme === 'light' ? 34 : 58} color="#fff6d0" />
      <pointLight position={[9, 7, 6]} intensity={theme === 'light' ? 8 : 14} color="#fde100" />

      <GraphGroup reducedMotion={reducedMotion}>
        {!reducedMotion &&
          primaries.map((p) => (
            <ClusterDust
              key={`dust-${p.id}`}
              center={p.pos}
              theme={theme}
              count={p.section === 'contacto' ? 90 : 220}
              radius={p.section === 'contacto' ? 1.6 : 2.7}
            />
          ))}

        {data.edges.map((e, i) => {
          const a = byId.get(e.a)!;
          const b = byId.get(e.b)!;
          const lit = litEdge(e.a, e.b);
          return (
            <Line
              key={i}
              points={[a.pos, b.pos]}
              color={lit ? accent : edgeCol}
              lineWidth={lit ? 1.5 : 1}
              transparent
              opacity={lit ? 0.85 : focusSection ? 0.18 : 0.42}
            />
          );
        })}

        {data.nodes.map((n) => {
          const shared = {
            n,
            theme,
            active: focusId === n.id || activeSection === n.section && n.kind === 'primary',
            dim: isDim(n),
            onNode,
            onHover: setHover
          };
          if (n.kind === 'core') return <CoreNode key={n.id} {...shared} />;
          if (n.kind === 'primary') return <PrimaryNode key={n.id} {...shared} />;
          return <SatelliteNode key={n.id} {...shared} />;
        })}
      </GraphGroup>

      <Controls data={data} reducedMotion={reducedMotion} focusId={focusId} />
    </>
  );
};

/* ------------------------------------------------------------------ scene */
const Scene3D: React.FC<Props> = ({ content, theme, reducedMotion, focusId, activeSection, onNode }) => {
  const data = useMemo(() => buildGraph3D(content), [content]);
  const s = small();

  return (
    <div className="fixed inset-0" style={{ touchAction: 'none' }}>
      <Canvas
        dpr={[1, 1.75]}
        style={{ touchAction: 'none' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: s ? 54 : 44, near: 0.1, far: 200, position: [0, s ? 1.5 : 0.4, s ? 30 : 17.5] }}
      >
        <Suspense fallback={null}>
          <Graph
            data={data}
            theme={theme}
            reducedMotion={reducedMotion}
            focusId={focusId}
            activeSection={activeSection}
            onNode={onNode}
          />
          {!reducedMotion && (
            <EffectComposer multisampling={0}>
              <Bloom intensity={0.55} luminanceThreshold={0.6} luminanceSmoothing={0.28} mipmapBlur />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
