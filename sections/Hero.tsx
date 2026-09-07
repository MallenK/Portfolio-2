import React from 'react';
import { PortfolioContent } from '../types';
import Constellation from '../components/map/Constellation';
import { scrollToId } from '../components/ui';
import type { Theme } from '../hooks/useApp';

interface Props {
  content: PortfolioContent;
  theme: Theme;
  reducedMotion: boolean;
}

const Hero: React.FC<Props> = ({ content, theme, reducedMotion }) => {
  const { meta, ui } = content;

  return (
    <header className="relative h-[100svh] w-full overflow-hidden">
      <Constellation
        content={content}
        theme={theme}
        reducedMotion={reducedMotion}
        onNavigate={scrollToId}
      />

      {/* overlay — pointer passes through to the canvas except on interactive bits */}
      <div className="pointer-events-none absolute inset-0 flex flex-col">
        <div className="flex flex-1 flex-col items-center justify-end px-6 pb-[30vh] text-center sm:justify-center sm:pb-0">
          <h1 className="font-mono text-[clamp(1.55rem,6vw,3.7rem)] font-medium uppercase leading-none tracking-[0.16em] text-fg [text-shadow:0_0_30px_var(--bg)]">
            {meta.name}
          </h1>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-fgdim [text-shadow:0_0_16px_var(--bg)]">
            {meta.alias} · {meta.role}
          </p>
          <p className="mt-3 max-w-[30ch] font-sans text-[13px] leading-relaxed text-fgdim/90 [text-shadow:0_0_16px_var(--bg)]">
            {meta.tagline}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 pb-7 md:pb-9">
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.28em] text-fgfaint md:block">
            {ui.mapHint}
          </span>
          <button
            onClick={() => scrollToId('perfil')}
            className="pointer-events-auto group flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-fgdim transition-colors hover:text-fg"
          >
            {ui.scroll}
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden className="transition-transform group-hover:translate-y-0.5">
              <path d="M6 1v10M2 7l4 4 4-4" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Hero;
