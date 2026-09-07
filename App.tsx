import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { TRANSLATIONS } from './constants';
import { useTheme, useReducedMotion } from './hooks/useApp';
import MapScreen from './components/MapScreen';
import Popup from './components/Popup';

import ClickSpark from './components/reactbits/ClickSpark';
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
  const [active, setActive] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'cat';
    return (localStorage.getItem('portfolio-lang') as Lang) || 'cat';
  });

  const content = useMemo(() => TRANSLATIONS[lang], [lang]);

  useEffect(() => {
    localStorage.setItem('portfolio-lang', lang);
    document.documentElement.lang = lang === 'cat' ? 'ca' : lang;
  }, [lang]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(t);
  }, []);

  const openChat = useCallback(() => {
    setActive(null);
    setTimeout(
      () => (document.querySelector('[data-chat-toggle]') as HTMLButtonElement | null)?.click(),
      120
    );
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
            exit={{ opacity: 0, transition: { duration: 0.45 } }}
          >
            <span className="font-[var(--font-display)] text-sm font-bold uppercase tracking-[0.4em] text-fg">
              {content.meta.alias}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div id="portfolio-content" className="h-[100svh]">
              <ClickSpark sparkColor="#fde100" sparkCount={8} sparkRadius={18} sparkSize={9} duration={430}>
                <MapScreen
                  content={content}
                  theme={theme}
                  toggleTheme={toggle}
                  lang={lang}
                  setLang={setLang}
                  reducedMotion={reducedMotion}
                  active={active}
                  onOpen={setActive}
                />
              </ClickSpark>
            </div>

            <Popup
              nodeId={active}
              content={content}
              onClose={() => setActive(null)}
              onNavigate={(id) => setActive(id)}
              onOpenChat={openChat}
            />

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
