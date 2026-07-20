
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CustomCursor from './components/CustomCursor';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Services from './sections/Services';
import Contact from './sections/Contact';
import { TRANSLATIONS } from './constants';

// Easter Eggs Imports
import { CheatProvider } from './context/CheatContext';
import CheatSheet from './components/CheatSheet';
import TimeTravelFX from './components/EasterEggs/TimeTravelFX';
import WorldModeFX from './components/EasterEggs/WorldModeFX';
import GlitchFX from './components/EasterEggs/GlitchFX';
import MessiMode from './components/EasterEggs/MessiMode';
import NavbarEgg from './components/EasterEggs/NavbarEgg';
import Chatbox from './components/Chatbox';

gsap.registerPlugin(ScrollTrigger);

type Lang = 'es' | 'en' | 'cat';

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-lang');
      return (saved as Lang) || 'cat';
    }
    return 'cat';
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLElement>(null); // REF PARA SMART NAVBAR
  const content = TRANSLATIONS[lang];

  useEffect(() => {
    localStorage.setItem('portfolio-lang', lang);
  }, [lang]);

  // SMART NAVBAR LOGIC (Apple/Medium Style)
  useEffect(() => {
    if (isLoading) return; // No adjuntar listeners hasta que cargue la app

    let lastScrollY = window.scrollY;
    const navbar = navbarRef.current;

    const handleScroll = () => {
      if (!navbar) return;

      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      // 1. Ignorar micro-scrolls (Threshold 10px)
      if (Math.abs(delta) < 10) return;

      // 2. Zona Segura Superior (Siempre visible si < 50px)
      if (currentScrollY < 50) {
        gsap.to(navbar, { y: '0%', duration: 0.3, ease: 'power2.out' });
        lastScrollY = currentScrollY;
        return;
      }

      // 3. Determinar dirección y animar
      if (delta > 0) {
        // SCROLL DOWN -> HIDE
        gsap.to(navbar, { y: '-100%', duration: 0.35, ease: 'power2.out' });
      } else {
        // SCROLL UP -> SHOW
        gsap.to(navbar, { y: '0%', duration: 0.35, ease: 'power2.out' });
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 180);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;
    ScrollTrigger.refresh();
  }, [isLoading, lang]);

  return (
    <div ref={containerRef} className="relative selection:bg-[#F5C400] selection:text-black bg-[#0B0B0B]">
      {/* Hide cursor on touch devices strictly via CSS media query if preferred, but component handles basic visibility */}
      <div className="hidden md:block">
        <CustomCursor />
      </div>
      
      {/* GLOBAL EASTER EGG LAYERS */}
      <TimeTravelFX />
      <WorldModeFX />
      <GlitchFX />
      <MessiMode />
      <NavbarEgg />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6"
            exit={{ 
              y: '-100%',
              transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } 
            }}
          >
            <div className="flex flex-col items-center w-full max-w-sm">
               <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-between w-full mb-4 px-1"
               >
                <span className="text-[10px] uppercase tracking-[0.5em] text-[#F5C400] font-bold">Sergi Mallén</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white font-mono">{Math.min(progress, 100)}%</span>
               </motion.div>
               <div className="w-full h-[1px] bg-zinc-900 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#F5C400]"
                  style={{ width: `${progress}%` }}
                  transition={{ type: 'spring', stiffness: 30 }}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.main
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* WRAPPER ID FOR RETRO FILTERS SCOPING */}
            <div id="portfolio-content" className="w-full h-full relative">
              {/* Navbar adjusted padding for mobile (p-4) vs desktop (p-10) */}
              <nav 
                ref={navbarRef}
                className="fixed top-0 left-0 w-full z-50 p-4 md:p-10 flex justify-between items-center mix-blend-difference will-change-transform"
              >
                {/* ID added for NavbarEgg target */}
                <div id="navbar-logo" className="text-xl font-black tracking-tighter uppercase text-white cursor-pointer">
                  S.Mallén<span className="text-[#F5C400]"> / MallenK</span>
                </div>
                <div className="flex gap-8 items-center">
                   <div className="hidden md:flex gap-12 items-center">
                    <a href="#projects" className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60 hover:text-[#F5C400] transition-colors">{content.nav.projects}</a>
                    <a href="#about" className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60 hover:text-[#F5C400] transition-colors">{content.nav.about}</a>
                    <a
                      href={`${import.meta.env.BASE_URL}cv.pdf`}
                      download="Sergi_Mallen_CV.pdf"
                      className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60 hover:text-[#F5C400] transition-colors"
                    >
                      {content.nav.cv}
                    </a>
                    <a href="#contact" className="px-8 py-3 bg-[#F5C400] text-black rounded-full text-[10px] uppercase tracking-widest font-black hover:bg-white transition-colors">{content.nav.contact}</a>
                  </div>
                  <div className="flex gap-3 text-[10px] font-black uppercase tracking-widest text-white">
                    {(['es', 'cat', 'en'] as Lang[]).map((l) => (
                      <button 
                        key={l} 
                        onClick={() => setLang(l)}
                        className={`${lang === l ? 'text-[#F5C400]' : 'text-white/40'} hover:text-white transition-colors`}
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </nav>

              <Hero content={content.hero} />
              <div id="about"><About content={content.about} /></div>
              <div id="services"><Services content={content.services} /></div>
              <div id="projects"><Projects content={content.projects} /></div>
              <div id="skills"><Skills content={content.skills} /></div>
              <Experience content={content.experience} />
              
              <section className="min-h-[50vh] md:min-h-screen bg-[#F5C400] text-black flex items-center justify-center overflow-hidden">
                 <div className="text-center px-6">
                    <h2 className="text-[14vw] font-black uppercase leading-[0.8] tracking-tighter">
                      Crafting<br/>Digital<br/>Logic
                    </h2>
                 </div>
              </section>

              <div id="contact"><Contact content={content.contact} /></div>
            </div>
            
            {/* UI ELEMENTS OUTSIDE PORTFOLIO-CONTENT (UNAFFECTED BY RETRO FILTERS) */}
            <CheatSheet />
            <Chatbox lang={lang} content={content} />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CheatProvider>
      <AppContent />
    </CheatProvider>
  );
};

export default App;
