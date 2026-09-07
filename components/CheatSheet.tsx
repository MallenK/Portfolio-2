
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCheats, PortfolioMode } from '../context/CheatContext';

const CheatSheet: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { 
    currentMode, setMode,
    triggerGlitch,
    setMessiActive // Trigger para GIFs
  } = useCheats();
  
  useEffect(() => {
    setMounted(true);
    console.log('[UI Floating] CheatSheet mounted & portal ready');
  }, []);

  const handleModeChange = (mode: PortfolioMode) => {
    setMode(currentMode === mode ? 'normal' : mode);
  };

  const handleShowGif = () => {
    setMessiActive(true); // Lanza el componente MessiMode (GifMode)
  };

  const floatingUI = (
    <div className="fixed bottom-6 left-6 z-[9999] font-mono cheat-sheet-layer pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-16 left-0 w-72 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#F5C400]">System Override</h3>
              <span className="text-[10px] text-white/30">v3.2</span>
            </div>
            
            <div className="space-y-4">
              {/* World Mode (Flashlight only now) */}
              <div className="space-y-2">
                 <p className="text-[9px] uppercase text-white/40 font-bold">Visual Tools</p>
                 <CheatToggle 
                   label="Flashlight Mode" 
                   active={currentMode === 'world'} 
                   onClick={() => handleModeChange('world')} 
                 />
              </div>

              {/* Time Travel */}
              <div className="space-y-2">
                 <p className="text-[9px] uppercase text-white/40 font-bold">Time Travel</p>
                 <div className="grid grid-cols-3 gap-1">
                    <ModeBtn label="Normal" active={currentMode === 'normal'} onClick={() => setMode('normal')} />
                    <ModeBtn label="Retro" active={currentMode === 'retro'} onClick={() => setMode('retro')} />
                    <ModeBtn label="Future" active={currentMode === 'future'} onClick={() => setMode('future')} />
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <button 
                  onClick={handleShowGif} 
                  className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest transition-colors rounded border border-white/10 flex items-center justify-center gap-2"
                >
                  <span>🎬</span> Mostrar GIF
                </button>

                <button 
                  onClick={() => { setIsOpen(false); triggerGlitch(); }} 
                  className="w-full py-2 bg-[#F5C400] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors rounded flex items-center justify-center gap-2"
                >
                  <span className="animate-pulse">⚠️</span> Trigger Glitch
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="System override"
        style={{ background: 'var(--bg-2)', borderColor: 'var(--hair)', color: isOpen ? 'var(--bg)' : 'var(--fg-dim)', backgroundColor: isOpen ? 'var(--accent)' : 'var(--bg-2)' }}
        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 relative z-50 ${isOpen ? 'rotate-90 scale-105' : 'hover:opacity-80'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
      </button>
    </div>
  );

  return mounted ? ReactDOM.createPortal(floatingUI, document.body) : null;
};

const CheatToggle: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button onClick={onClick} className="w-full flex justify-between items-center group p-2 rounded hover:bg-white/5 transition-colors text-left bg-black/20">
    <span className="text-[10px] uppercase font-semibold text-white/80 group-hover:text-white transition-colors">{label}</span>
    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${active ? 'bg-[#F5C400]' : 'bg-white/10'}`}>
      <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
  </button>
);

const ModeBtn: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`text-[9px] uppercase font-bold py-2 border rounded transition-all ${active ? 'bg-[#F5C400] text-black border-[#F5C400]' : 'text-white/40 border-white/10 hover:border-white/40'}`}
  >
    {label}
  </button>
);

export default CheatSheet;
