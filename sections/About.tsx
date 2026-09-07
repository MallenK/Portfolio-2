import React from 'react';
import { PortfolioContent } from '../types';
import { Section, Reveal } from '../components/ui';

interface Props {
  content: PortfolioContent['about'];
}

const About: React.FC<Props> = ({ content }) => (
  <Section id="perfil" index="01" tag={content.tag}>
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        <Reveal>
          <p className="text-[clamp(1.4rem,2.8vw,2.1rem)] font-medium leading-[1.28] tracking-[-0.01em] text-fg">
            {content.lead}
          </p>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-8 max-w-[54ch] text-[15px] leading-[1.75] text-fgdim">{content.body}</p>
        </Reveal>
      </div>

      <div className="lg:col-span-5">
        <Reveal delay={80}>
          <p className="tag mb-6">{content.skillsTag}</p>
        </Reveal>
        <div className="border-t border-hair">
          {content.skills.map((g, i) => (
            <Reveal key={g.category} delay={i * 70}>
              <div className="grid grid-cols-1 gap-2 border-b border-hair py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-fg">
                  {g.category}
                </span>
                <span className="text-[13px] leading-relaxed text-fgdim">
                  {g.skills.join('  ·  ')}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </Section>
);

export default About;
