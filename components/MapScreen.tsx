import React from 'react';
import { PortfolioContent } from '../types';
import Constellation from './map/Constellation';
import type { Theme } from '../hooks/useApp';

type Lang = 'es' | 'en' | 'cat';

interface Props {
  content: PortfolioContent;
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  reducedMotion: boolean;
  onOpen: (id: string) => void;
}

const MapScreen: React.FC<Props> = ({
  content,
  theme,
  toggleTheme,
  lang,
  setLang,
  reducedMotion,
  onOpen
}) => {
  const { meta, ui, nav } = content;

  return (
    <div className="relative h-[100svh] w-full overflow-hidden">
      <Constellation
        content={content}
        theme={theme}
        reducedMotion={reducedMotion}
        onNavigate={onOpen}
      />

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
        {/* ---- top HUD ---- */}
        <div className="flex items-start justify-between">
          <button
            id="navbar-logo"
            onClick={() => onOpen('core')}
            className="pointer-events-auto font-[var(--font-display)] text-sm font-bold uppercase tracking-[0.22em] text-fg"
          >
            {meta.alias}
          </button>

          <div className="pointer-events-auto flex items-center gap-3 sm:gap-4">
            <a
              href={`${import.meta.env.BASE_URL}cv.pdf`}
              download="Sergi_Mallen_CV.pdf"
              className="font-[var(--font-display)] text-[11px] font-semibold uppercase tracking-[0.14em] text-fgdim transition-colors hover:text-fg"
            >
              {nav.cv}
            </a>
            <div className="flex items-center gap-1.5 font-[var(--font-display)] text-[11px] font-semibold uppercase tracking-[0.1em]">
              {(['es', 'cat', 'en'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={lang === l ? 'text-accentink' : 'text-fgdim transition-colors hover:text-fg'}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              className="grid h-8 w-8 place-items-center rounded-full border border-hair text-fgdim transition-colors hover:text-fg"
            >
              {theme === 'dark' ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.7" />
                  <path
                    d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ---- bottom: identity + hint ---- */}
        <div className="flex flex-col items-center gap-4 pb-10 text-center sm:pb-6">
          <div>
            <h1 className="font-[var(--font-display)] text-[clamp(1.5rem,7vw,3.2rem)] font-extrabold uppercase leading-none tracking-[0.12em] text-fg [text-shadow:0_0_26px_var(--bg),0_0_26px_var(--bg)]">
              {meta.name}
            </h1>
            <p className="mt-3 max-w-[30ch] text-[12.5px] leading-relaxed text-fgdim [text-shadow:0_0_14px_var(--bg)]">
              {meta.tagline}
            </p>
          </div>
          <span className="font-[var(--font-display)] text-[9px] font-medium uppercase tracking-[0.28em] text-fgfaint">
            {ui.mapHint}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapScreen;
