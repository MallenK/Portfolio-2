import React from 'react';
import { PortfolioContent } from '../types';
import { Section, Reveal } from '../components/ui';

interface Props {
  content: PortfolioContent['services'];
  onOpenChat: () => void;
}

const Services: React.FC<Props> = ({ content, onOpenChat }) => (
  <Section id="servicios" index="04" tag={content.tag} title={content.title}>
    <div className="border-t border-hair">
      {content.items.map((s, i) => {
        const num = String(i + 1).padStart(2, '0');
        const interactive = Boolean(s.url || s.action);
        const inner = (
          <>
            <span className="tag-n md:pt-1">{num}</span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-3">
                <span className="text-[clamp(1.1rem,2vw,1.4rem)] font-medium text-fg transition-colors group-hover:text-accent">
                  {s.title}
                </span>
                {interactive && (
                  <span className="font-mono text-[13px] text-fgfaint transition-all group-hover:translate-x-1 group-hover:text-accent">
                    →
                  </span>
                )}
              </span>
              <span className="mt-1.5 block max-w-[54ch] text-[13.5px] leading-relaxed text-fgdim">
                {s.desc}
              </span>
            </span>
          </>
        );
        const cls = 'group flex w-full items-start gap-5 border-b border-hair py-8 text-left md:gap-8';
        return (
          <Reveal key={s.title} delay={i * 50}>
            {s.action === 'open-ai-chat' ? (
              <button className={cls} onClick={onOpenChat}>
                {inner}
              </button>
            ) : s.url ? (
              <a className={cls} href={s.url} target="_blank" rel="noopener noreferrer">
                {inner}
              </a>
            ) : (
              <div className={cls.replace('group ', '')}>{inner}</div>
            )}
          </Reveal>
        );
      })}
    </div>
  </Section>
);

export default Services;
