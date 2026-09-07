import React, { useEffect, useRef, useState } from 'react';

/* ---- Reveal on scroll (IO + CSS) ---- */
export const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
}> = ({ children, className = '', delay = 0, as = 'div' }) => {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in');
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as as any;
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ ['--d' as string]: `${delay}ms` }}>
      {children}
    </Tag>
  );
};

/* ---- Section shell: consistent rhythm + a tag + optional title ---- */
export const Section: React.FC<{
  id: string;
  index: string;
  tag: string;
  title?: string;
  children: React.ReactNode;
}> = ({ id, index, tag, title, children }) => (
  <section id={id} className="relative border-t border-hair px-6 py-20 md:px-12 md:py-28">
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex items-baseline gap-4">
        <span className="tag-n">{index}</span>
        <span className="tag">{tag}</span>
      </div>
      {title && (
        <Reveal delay={60}>
          <h2 className="mt-6 max-w-[24ch] text-[clamp(1.6rem,3.4vw,2.6rem)] font-medium leading-[1.15] tracking-[-0.01em] text-fg">
            {title}
          </h2>
        </Reveal>
      )}
      <div className="mt-14 md:mt-20">{children}</div>
    </div>
  </section>
);

/* ---- clipboard ---- */
export const useCopy = () => {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* mailto still works */
    }
  };
  return { copied, copy };
};

/* ---- smooth scroll to a section id (works with Lenis or native) ---- */
export function scrollToId(id: string) {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
