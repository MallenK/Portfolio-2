import React from 'react';
import { PortfolioContent } from '../types';
import { Section, Reveal } from '../components/ui';

interface Props {
  content: PortfolioContent['experience'];
}

const Experience: React.FC<Props> = ({ content }) => (
  <Section id="experiencia" index="03" tag={content.tag} title={content.title}>
    <ol className="border-t border-hair">
      {content.items.map((e, i) => (
        <Reveal key={e.id} as="li" delay={i * 60}>
          <div className="grid gap-4 border-b border-hair py-9 md:grid-cols-[7rem_1fr] md:gap-10 md:py-11">
            <span className="tag-n md:pt-1">{e.period}</span>
            <div>
              <h3 className="text-[clamp(1.2rem,2.2vw,1.6rem)] font-medium tracking-[-0.01em] text-fg">
                {e.role} <span className="text-fgdim">· {e.company}</span>
              </h3>
              <ul className="mt-4 space-y-2">
                {e.achievements.map((a, k) => (
                  <li key={k} className="flex gap-3 text-[14px] leading-relaxed text-fgdim">
                    <span className="mt-1 select-none font-mono text-[10px] text-accent">—</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      ))}
    </ol>
  </Section>
);

export default Experience;
