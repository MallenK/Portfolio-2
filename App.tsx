import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { TRANSLATIONS } from './constants';
import { useTheme, useReducedMotion, useSmoothScroll } from './hooks/useApp';
import Nav from './components/Nav';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Services from './sections/Services';
import Contact from './sections/Contact';

import { CheatProvider } from './context/CheatContext';
import CheatSheet from './components/CheatSheet';
import TimeTravelFX from './components/EasterEggs/TimeTravelFX';
import WorldModeFX from './components/EasterEggs/WorldModeFX';
import GlitchFX from './components/EasterEggs/GlitchFX';
import MessiMode from './components/EasterEggs/MessiMode';
import NavbarEgg from './components/EasterEggs/NavbarEgg';
import Chatbox from './components/Chatbox';

type Lang = 'es' | 'en' | 'cat';

const AppContent: React.FC = () => {
  const { theme, toggle } = useTheme();
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'cat';
    return (localStorage.getItem('portfolio-lang') as Lang) || 'cat';
  });

  const content = useMemo(() => TRANSLATIONS[lang], [lang]);
  useSmoothScroll(!reducedMotion);

  useEffect(() => {
    localStorage.setItem('portfolio-lang', lang);
    document.documentElement.lang = lang === 'cat' ? 'ca' : lang;
  }, [lang]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const openChat = useCallback(() => {
    (document.querySelector('[data-chat-toggle]') as HTMLButtonElement | null)?.click();
  }, []);

  return (
    <>
      <TimeTravelFX />
      <WorldModeFX />
      <GlitchFX />
      <MessiMode />
      <NavbarEgg />

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <span className="font-mono text-sm uppercase tracking-[0.4em] text-fg">
              {content.meta.alias}
            </span>
          </motion.div>
        ) : (
          <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Nav content={content} lang={lang} setLang={setLang} theme={theme} toggleTheme={toggle} />

            <main id="portfolio-content">
              <Hero content={content} theme={theme} reducedMotion={reducedMotion} />
              <About content={content.about} />
              <Projects content={content.projects} ui={content.ui} />
              <Experience content={content.experience} />
              <Services content={content.services} onOpenChat={openChat} />
              <Contact content={content.contact} ui={content.ui} meta={content.meta} />
            </main>

            <CheatSheet />
            <Chatbox lang={lang} content={content as any} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const App: React.FC = () => (
  <CheatProvider>
    <AppContent />
  </CheatProvider>
);

export default App;
