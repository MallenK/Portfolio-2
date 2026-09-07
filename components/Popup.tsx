import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioContent } from '../types';
import PopupContent from './PopupContent';

interface Props {
  nodeId: string | null;
  content: PortfolioContent;
  onClose: () => void;
  onNavigate: (id: string) => void;
  onOpenChat: () => void;
}

const titleFor = (id: string, c: PortfolioContent) => {
  switch (id) {
    case 'core':
      return c.ui.indexTitle;
    case 'perfil':
      return c.nav.perfil;
    case 'proyectos':
      return c.nav.proyectos;
    case 'experiencia':
      return c.nav.experiencia;
    case 'servicios':
      return c.nav.servicios;
    case 'contacto':
      return c.nav.contacto;
    default:
      return '';
  }
};

const NUM: Record<string, string> = {
  core: '00',
  perfil: '01',
  proyectos: '02',
  experiencia: '03',
  servicios: '04',
  contacto: '05'
};

const Popup: React.FC<Props> = ({ nodeId, content, onClose, onNavigate, onOpenChat }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!nodeId) return;
    document.body.classList.add('popup-open');
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => panelRef.current?.focus(), 30);
    return () => {
      document.body.classList.remove('popup-open');
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
      prev?.focus?.();
    };
  }, [nodeId, onClose]);

  return (
    <AnimatePresence>
      {nodeId && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            aria-label={content.ui.close}
            onClick={onClose}
            className="absolute inset-0 bg-[var(--scrim)] backdrop-blur-[3px]"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={titleFor(nodeId, content)}
            tabIndex={-1}
            initial={{ y: 40, opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="relative flex max-h-[92svh] w-full flex-col border border-hair bg-bg outline-none sm:max-h-[85vh] sm:max-w-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-hair px-5 py-4 sm:px-8 sm:py-6">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="tag-n">{NUM[nodeId]}</span>
                  <span className="tag">{titleFor(nodeId, content)}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="group -mr-1 -mt-1 flex items-center gap-2 p-1 font-[var(--font-display)] text-[11px] font-semibold uppercase tracking-[0.2em] text-fgdim transition-colors hover:text-accentink"
              >
                {content.ui.close}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
            </header>

            <div className="overflow-y-auto px-5 py-7 sm:px-8 sm:py-9">
              <PopupContent
                nodeId={nodeId}
                content={content}
                onNavigate={onNavigate}
                onOpenChat={onOpenChat}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
