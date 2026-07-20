
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioContent } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  content: PortfolioContent['projects'];
}

const Projects: React.FC<Props> = ({ content }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const projectOrder = ["05", "02", "04", "01", "03"];

  const orderedProjects = [...content.items].sort(
    (a, b) => projectOrder.indexOf(a.id) - projectOrder.indexOf(b.id)
  );

  useEffect(() => {
    const mm = gsap.matchMedia();
    const cards = cardsRef.current.filter(Boolean);
    const totalCards = cards.length;

    mm.add(
      {
        isDesktop: "(min-width: 769px) and (min-height: 501px)",
        isMobile: "(max-width: 768px), (max-height: 500px)"
      },
      (context) => {
        const { isDesktop, isMobile } = context.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
        };

        if (isDesktop) {
          gsap.set(containerRef.current, {
            height: "100vh",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          });

          gsap.set(cards, {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            y: 60,
            scale: 0.95,
            pointerEvents: "none",
            zIndex: (i) => i + 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              pin: true,
              start: "top top",
              end: () => `+=${window.innerHeight * (totalCards + 2)}`,
              scrub: 1,
              anticipatePin: 1
            }
          });

          tl.fromTo(
            containerRef.current,
            { opacity: 0.95, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
          );

          cards.forEach((card) => {
            tl.to(card, {
              y: 0,
              opacity: 1,
              scale: 1,
              pointerEvents: "auto",
              duration: 1,
              ease: "power3.out"
            });

            tl.to(card, { duration: 0.5 });

            tl.to(card, {
              y: -40,
              opacity: 0,
              scale: 0.98,
              duration: 1,
              ease: "power2.in"
            });
          });

          tl.to(containerRef.current, {
            opacity: 0.95,
            y: -20,
            duration: 0.5,
            ease: "power2.in"
          });
        } else if (isMobile) {
          gsap.set(containerRef.current, {
            height: "auto",
            display: "block",
            position: "relative",
            paddingBottom: "100px"
          });

          gsap.set(cards, {
            position: "relative",
            width: "100%",
            height: "auto",
            opacity: 0,
            y: 50,
            scale: 1,
            zIndex: 1,
            display: "block",
            marginBottom: "3rem",
            clearProps: "left,top,transform"
          });

          cards.forEach((card) => {
            ScrollTrigger.create({
              trigger: card,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
              animation: gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
              })
            });
          });
        }
      }
    );

    return () => mm.revert();
  }, [orderedProjects]);

  return (
    <section ref={sectionRef} className="bg-[#0B0B0B] relative overflow-hidden">
      <div
        ref={containerRef}
        className="w-full max-w-7xl mx-auto px-6 h-screen flex flex-col items-center justify-center"
      >
        <div className="absolute top-12 left-6 z-20 pointer-events-none mix-blend-difference md:block hidden">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#F5C400] font-black mb-4">
            {content.label}
          </h2>
          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white/20">
            {content.title}
          </h3>
        </div>

        <div className="md:hidden w-full pt-24 pb-12">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#F5C400] font-black mb-2">
            {content.label}
          </h2>
          <h3 className="text-4xl font-black uppercase tracking-tighter text-white">
            {content.title}
          </h3>
        </div>

        {orderedProjects.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => {
              if (el) cardsRef.current[index] = el;
            }}
            className="w-full flex items-center justify-center p-0 md:p-12 will-change-transform"
          >
            <div className="relative w-full aspect-[3/4] md:aspect-[16/9] bg-zinc-950 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl z-10 group">
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-40"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-black/50 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 md:gap-8">
                  <div className="max-w-3xl w-full">
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-[#F5C400] font-black mb-3 block">
                      {project.category} — {project.year}
                    </span>

                    <h4 className="text-3xl md:text-7xl font-black uppercase tracking-tighter mb-4 leading-none text-white">
                      {project.title}
                    </h4>

                    <p className="text-white/70 text-sm md:text-lg font-light mb-6 max-w-xl">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-1 md:px-3 bg-white/10 backdrop-blur-md rounded-full text-[8px] md:text-[10px] uppercase font-bold tracking-widest text-white"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 md:w-20 md:h-20 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#F5C400] group-hover:text-black transition-all duration-300 shrink-0 cursor-pointer bg-black/40 backdrop-blur-sm md:bg-transparent"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 md:w-8 md:h-8 -rotate-45"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="absolute top-4 right-4 md:top-8 md:right-8 text-4xl md:text-6xl font-black text-white/5 pointer-events-none uppercase leading-none">
                {project.id}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
