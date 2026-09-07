import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { atmos } from './atmos';
import type { Theme } from '../../hooks/useApp';

const VgpuBackground = lazy(() => import('./VgpuBackground'));
const Galaxy = lazy(() => import('../reactbits/Galaxy'));

type Props = { theme: Theme; reducedMotion: boolean };

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Painted fallback — no GPU at all, or while a layer streams in. */
const StaticBg: React.FC = () => (
  <div
    aria-hidden
    className="fixed inset-0 -z-10"
    style={{
      background:
        'radial-gradient(130% 90% at 20% 0%, rgba(253,225,0,0.14), transparent 55%), radial-gradient(90% 80% at 100% 100%, rgba(253,225,0,0.06), transparent 60%), var(--bg)'
    }}
  />
);

const Background: React.FC<Props> = ({ theme, reducedMotion }) => {
  const [mode, setMode] = useState<'vgpu' | 'galaxy' | 'static'>(() => {
    if (typeof window === 'undefined') return 'static';
    if ((navigator as any).gpu) return 'vgpu';
    return hasWebGL() ? 'galaxy' : 'static';
  });

  useEffect(() => {
    atmos.light = theme === 'light' ? 1 : 0;
  }, [theme]);

  const fallToGalaxy = useCallback(() => {
    setMode(hasWebGL() ? 'galaxy' : 'static');
  }, []);

  if (mode === 'static') return <StaticBg />;

  if (mode === 'galaxy') {
    return (
      <div aria-hidden className="fixed inset-0 -z-10">
        <Suspense fallback={<StaticBg />}>
          <Galaxy
            className="h-full w-full"
            hueShift={theme === 'light' ? 44 : 46}
            saturation={0.85}
            density={0.85}
            glowIntensity={0.32}
            twinkleIntensity={0.4}
            rotationSpeed={0.02}
            speed={0.7}
            mouseRepulsion={false}
            mouseInteraction={!reducedMotion}
            disableAnimation={reducedMotion}
            transparent={false}
            lightMode={theme === 'light'}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <Suspense fallback={<StaticBg />}>
      <VgpuBackground onUnsupported={fallToGalaxy} />
    </Suspense>
  );
};

export default Background;
