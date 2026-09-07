import React, { useEffect, useRef, useState } from 'react';
import { PortfolioContent } from '../types';
import { scrollToId } from './ui';
import type { Theme } from '../hooks/useApp';

type Lang = 'es' | 'en' | 'cat';

interface Props {
  content: PortfolioContent;
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const Nav: React.FC<Props> = ({ content, lang, setLang, theme, toggleTheme }) => {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  const links: [string, string][] = [
    ['perfil', content.nav.perfil],
    ['proyectos', content.nav.proyectos],
    ['experiencia', content.nav.experiencia],
    ['servicios', content.nav.servicios],
    ['contacto', content.nav.contacto]
  ];

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      const d = y - lastY.current;
      if (y > 140 && d > 6) setHidden(true);
      else if (d < -6 || y < 140) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div
        className={`flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-500 md:px-12 md:py-5 ${
          solid ? 'border-b border-hair bg-bg/80 backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <button
          id="navbar-logo"
          onClick={() => go('top')}
          className="font-mono text-sm uppercase tracking-[0.28em] text-fg"
        >
          {content.meta.alias}
        </button>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map(([id, label]) => (
            <button
              key={id}
              onClick={() => go(id)}
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-fgdim transition-colors hover:text-fg"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 md:gap-5">
          <a
            href={`${import.meta.env.BASE_URL}cv.pdf`}
            download="Sergi_Mallen_CV.pdf"
            className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-fgdim transition-colors hover:text-fg sm:inline"
          >
            {content.nav.cv}
          </a>

          <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em]">
            {(['es', 'cat', 'en'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={lang === l ? 'text-accent' : 'text-fgfaint transition-colors hover:text-fg'}
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
            aria-expanded={open}
            className="grid h-8 w-8 place-items-center border border-hair text-fg lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-px w-full bg-current transition-all ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-1.5 h-px w-full bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 h-px w-full bg-current transition-all ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-b border-hair bg-bg/95 backdrop-blur-md transition-[max-height] duration-500 lg:hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col px-6 py-2">
          {links.map(([id, label]) => (
            <button
              key={id}
              onClick={() => go(id)}
              className="border-b border-hair/60 py-4 text-left font-mono text-sm uppercase tracking-[0.2em] text-fg last:border-0"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
