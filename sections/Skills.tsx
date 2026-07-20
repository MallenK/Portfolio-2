
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioContent } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  content: PortfolioContent['skills'];
}

const Skills: React.FC<Props> = ({ content }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Usamos fromTo para garantizar el estado inicial y final de visibilidad (autoAlpha)
      gsap.fromTo(".skill-card", 
        {
          y: 50,
          autoAlpha: 0
        },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%", // Se activa un poco antes para asegurar visibilidad
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-[#0B0B0B]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#F5C400] mb-8 text-center font-black">
          {content.label}
        </h2>

        <div className="max-w-3xl mx-auto text-center mb-24">
          <p className="text-3xl md:text-5xl font-light text-white leading-tight">
            {content.intro} <span className="text-[#F5C400] font-black italic">{content.introHighlight1}</span> {content.introConnector} <span className="text-[#F5C400] font-black">{content.introHighlight2}</span>.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.items.map((group) => (
            <div
              key={group.category}
              className="skill-card p-10 border border-white/5 rounded-[2rem] bg-zinc-900/10 backdrop-blur-md group hover:border-[#F5C400] transition-all duration-700"
            >
              <h3 className="text-lg font-black uppercase tracking-tight mb-8 text-white group-hover:text-[#F5C400] transition-colors">
                {group.category}
              </h3>
              <ul className="space-y-4">
                {group.skills.map((skill) => (
                  <li key={skill} className="text-white/40 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                    <div className="w-1 h-1 bg-[#F5C400] rounded-full" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
