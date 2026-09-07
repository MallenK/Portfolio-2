import React from 'react';
import { PortfolioContent } from '../types';
import { Section, Reveal } from '../components/ui';

interface Props {
  content: PortfolioContent['projects'];
  ui: PortfolioContent['ui'];
}

const Projects: React.FC<Props> = ({ content, ui }) => (
  <Section id="proyectos" index="02" tag={content.tag} title={content.title}>
    <div className="border-t border-hair">
      {content.items.map((p, i) => (
        <Reveal key={p.id} delay={i * 60}>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid gap-4 border-b border-hair py-9 md:grid-cols-[3rem_1fr_auto] md:gap-8 md:py-11"
          >
            <span className="tag-n md:pt-1.5">{p.id}</span>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <h3 className="text-[clamp(1.4rem,2.6vw,2rem)] font-medium leading-tight tracking-[-0.01em] text-fg transition-colors group-hover:text-accent">
                  {p.title}
                </h3>
                {p.live && (
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                    <span className="h-1 w-1 rounded-full bg-accent" />
                    {ui.live}
                  </span>
                )}
              </div>
              <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-fgdim">
                {p.category} · {p.year}
              </p>
              <p className="mt-4 max-w-[58ch] text-[14px] leading-relaxed text-fgdim">
                {p.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fgfaint">
                {p.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>

            <div className="flex items-start justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-fgdim md:flex-col md:items-end md:text-right">
              <span>
                {ui.roleLabel} · <span className="text-fg">{p.role}</span>
              </span>
              <span className="flex items-center gap-1.5 text-fg transition-transform group-hover:translate-x-1">
                {ui.open}
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d="M2 10 10 2M4 2h6v6" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </span>
            </div>
          </a>
        </Reveal>
      ))}
    </div>
  </Section>
);

export default Projects;
