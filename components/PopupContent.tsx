import React, { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { PortfolioContent } from '../types';
import { SOCIAL_LINKS } from '../constants';
import { Reveal, useCopy } from './ui';
import ShinyText from './reactbits/ShinyText';

interface Props {
  nodeId: string;
  anchor: string | null;
  content: PortfolioContent;
  onNavigate: (id: string) => void;
  onOpenChat: () => void;
}

const NODES = ['perfil', 'proyectos', 'experiencia', 'servicios', 'contacto'] as const;

/* ---------------- core / manifiesto ---------------- */
const Core: React.FC<Props> = ({ content, onNavigate }) => (
  <div className="space-y-8">
    <Reveal>
      <p className="max-w-[46ch] text-[clamp(1.15rem,3.6vw,1.6rem)] font-medium leading-[1.4] text-fg">
        {content.meta.statement}
      </p>
    </Reveal>
    <Reveal delay={100}>
      <ul className="border-t border-hair">
        {NODES.map((id, i) => (
          <li key={id}>
            <button
              onClick={() => onNavigate(id)}
              className="group flex w-full items-baseline justify-between border-b border-hair py-4 text-left"
            >
              <span className="font-[var(--font-display)] text-lg font-semibold uppercase tracking-[0.06em] text-fg transition-colors group-hover:text-accentink">
                {content.nav[id]}
              </span>
              <span className="tag-n">{String(i + 1).padStart(2, '0')}</span>
            </button>
          </li>
        ))}
      </ul>
    </Reveal>
  </div>
);

/* ---------------- perfil ---------------- */
const Perfil: React.FC<Props> = ({ content }) => {
  const a = content.about;
  return (
    <div className="space-y-8">
      <Reveal>
        <p className="max-w-[44ch] text-[clamp(1.15rem,3.6vw,1.55rem)] font-medium leading-[1.35] text-fg">
          {a.lead}
        </p>
      </Reveal>
      <Reveal delay={90}>
        <p className="max-w-[56ch] text-[14.5px] leading-[1.75] text-fgdim">{a.body}</p>
      </Reveal>
      <Reveal delay={160}>
        <div className="border-t border-hair">
          {a.skills.map((g) => (
            <div
              key={g.category}
              data-anchor={g.category}
              className="grid gap-1.5 border-b border-hair px-2 py-4 sm:grid-cols-[8rem_1fr] sm:gap-6"
            >
              <span className="font-[var(--font-display)] text-[12px] font-semibold uppercase tracking-[0.12em] text-fg">
                {g.category}
              </span>
              <span className="text-[13px] leading-relaxed text-fgdim">{g.skills.join('  ·  ')}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
};

/* ---------------- proyectos ---------------- */
const Proyectos: React.FC<Props> = ({ content }) => {
  const { projects, ui } = content;
  return (
    <div>
      <Reveal>
        <p className="mb-8 max-w-[40ch] text-[15px] leading-relaxed text-fgdim">{projects.title}</p>
      </Reveal>
      <div className="border-t border-hair">
        {projects.items.map((p, i) => (
          <Reveal key={p.id} delay={i * 50}>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              data-anchor={p.id}
              className="group block border-b border-hair px-2 py-6"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="tag-n">{p.id}</span>
                <h3 className="font-[var(--font-display)] text-[clamp(1.15rem,4vw,1.5rem)] font-semibold leading-tight text-fg transition-colors group-hover:text-accentink">
                  {p.title}
                </h3>
                {p.live && (
                  <span className="flex items-center gap-1.5 font-[var(--font-display)] text-[10px] font-semibold uppercase tracking-[0.16em]">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <ShinyText text={ui.live} color="#b58b00" shineColor="#fde100" speed={3.2} />
                  </span>
                )}
              </div>
              <p className="mt-1.5 font-[var(--font-display)] text-[11px] font-medium uppercase tracking-[0.14em] text-fgdim">
                {p.category} · {p.year} · {ui.roleLabel} {p.role}
              </p>
              <p className="mt-3 max-w-[58ch] text-[13.5px] leading-relaxed text-fgdim">
                {p.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-[var(--font-display)] text-[10px] font-medium uppercase tracking-[0.1em] text-fgfaint">
                {p.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

/* ---------------- experiencia ---------------- */
const Experiencia: React.FC<Props> = ({ content }) => {
  const { experience } = content;
  return (
    <div>
      <Reveal>
        <p className="mb-8 max-w-[40ch] text-[15px] leading-relaxed text-fgdim">{experience.title}</p>
      </Reveal>
      <ol className="border-t border-hair">
        {experience.items.map((e, i) => (
          <Reveal key={e.id} as="li" delay={i * 50}>
            <div
              data-anchor={e.id}
              className="grid gap-3 border-b border-hair px-2 py-6 sm:grid-cols-[5rem_1fr] sm:gap-8"
            >
              <span className="tag-n">{e.period}</span>
              <div>
                <h3 className="font-[var(--font-display)] text-[15px] font-semibold text-fg">
                  {e.role} <span className="text-fgdim">· {e.company}</span>
                </h3>
                <ul className="mt-3 space-y-2">
                  {e.achievements.map((x, k) => (
                    <li key={k} className="flex gap-2.5 text-[13px] leading-relaxed text-fgdim">
                      <span className="mt-1 select-none text-[10px] text-accentink">—</span>
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
};

/* ---------------- servicios ---------------- */
const Servicios: React.FC<Props> = ({ content, onOpenChat }) => {
  const { services } = content;
  return (
    <div>
      <Reveal>
        <p className="mb-8 max-w-[40ch] text-[15px] leading-relaxed text-fgdim">{services.title}</p>
      </Reveal>
      <div className="border-t border-hair">
        {services.items.map((s, i) => {
          const num = String(i + 1).padStart(2, '0');
          const interactive = Boolean(s.url || s.action);
          const inner = (
            <>
              <span className="tag-n pt-0.5">{num}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2.5">
                  <span className="font-[var(--font-display)] text-[15px] font-semibold text-fg transition-colors group-hover:text-accentink">
                    {s.title}
                  </span>
                  {interactive && (
                    <span className="text-[13px] text-fgfaint transition-all group-hover:translate-x-1 group-hover:text-accentink">
                      →
                    </span>
                  )}
                </span>
                <span className="mt-1 block max-w-[52ch] text-[13px] leading-relaxed text-fgdim">
                  {s.desc}
                </span>
              </span>
            </>
          );
          const cls = 'group flex w-full items-start gap-4 border-b border-hair px-2 py-5 text-left';
          return (
            <Reveal key={s.title} delay={i * 45}>
              {s.action === 'open-ai-chat' ? (
                <button data-anchor={String(i)} className={cls} onClick={onOpenChat}>
                  {inner}
                </button>
              ) : s.url ? (
                <a data-anchor={String(i)} className={cls} href={s.url} target="_blank" rel="noopener noreferrer">
                  {inner}
                </a>
              ) : (
                <div data-anchor={String(i)} className={cls.replace('group ', '')}>{inner}</div>
              )}
            </Reveal>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- contacto ---------------- */
type Status = 'idle' | 'sending' | 'sent' | 'error';
const SOCIALS = [
  { label: 'LinkedIn', href: SOCIAL_LINKS.linkedin },
  { label: 'GitHub', href: SOCIAL_LINKS.github },
  { label: 'Instagram', href: SOCIAL_LINKS.instagram },
  { label: 'WhatsApp', href: SOCIAL_LINKS.whatsapp }
];

const Field: React.FC<{ name: string; label: string; type?: string; area?: boolean }> = ({
  name,
  label,
  type = 'text',
  area
}) => (
  <label className="block border-b border-hair pb-2.5 transition-colors focus-within:border-accent">
    <span className="tag">{label}</span>
    {area ? (
      <textarea
        name={name}
        required
        rows={3}
        className="mt-2 w-full resize-none bg-transparent text-base text-fg outline-none placeholder:text-fgfaint"
        placeholder="—"
      />
    ) : (
      <input
        name={name}
        type={type}
        required
        className="mt-2 w-full bg-transparent text-base text-fg outline-none placeholder:text-fgfaint"
        placeholder="—"
      />
    )}
  </label>
);

const Contacto: React.FC<Props> = ({ content }) => {
  const { contact, ui, meta } = content;
  const [status, setStatus] = useState<Status>('idle');
  const { copied, copy } = useCopy();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    const form = e.currentTarget;
    setStatus('sending');
    emailjs
      .send(
        'service_cilgouv',
        'template_7vb1edf',
        {
          name: (form.elements.namedItem('name') as HTMLInputElement).value,
          email: (form.elements.namedItem('email') as HTMLInputElement).value,
          message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
          date: new Date().toLocaleString()
        },
        'iGpB097zxE-0bBxRC'
      )
      .then(() => {
        setStatus('sent');
        form.reset();
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        setStatus('error');
      });
  };

  return (
    <div className="space-y-9">
      <Reveal>
        <p className="max-w-[42ch] text-[15px] leading-relaxed text-fgdim">{contact.line}</p>
      </Reveal>

      <Reveal delay={80}>
        <div>
          <p className="tag">{contact.directLabel}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <a href={`mailto:${SOCIAL_LINKS.email}`} className="text-lg text-fg transition-opacity hover:opacity-80 sm:text-xl">
              <ShinyText text={SOCIAL_LINKS.email} color="#8a8a8a" shineColor="#fde100" speed={4} />
            </a>
            <button
              onClick={() => copy(SOCIAL_LINKS.email)}
              className="border border-hair px-2.5 py-1 font-[var(--font-display)] text-[10px] font-semibold uppercase tracking-[0.16em] text-fgdim transition-colors hover:border-accent hover:text-accentink"
            >
              {copied ? ui.copied : ui.copy}
            </button>
          </div>
        </div>
      </Reveal>

      <Reveal delay={140}>
        <div>
          <p className="tag">{contact.socialLabel}</p>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-fgdim transition-colors hover:text-fg"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={180}>
        <form onSubmit={submit} className="flex flex-col gap-7 border-t border-hair pt-8">
          <Field name="name" label={contact.formName} />
          <Field name="email" label={contact.formEmail} type="email" />
          <Field name="message" label={contact.formIdea} area />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="mt-1 border border-fg py-3.5 font-[var(--font-display)] text-[11px] font-semibold uppercase tracking-[0.24em] text-fg transition-colors hover:border-accent hover:bg-accent hover:text-black disabled:opacity-50"
          >
            {status === 'sending' ? ui.sending : ui.send}
          </button>
          <p
            role="status"
            className={`min-h-[1.1rem] text-[13px] ${
              status === 'error' ? 'text-[#e0857a]' : 'text-accentink'
            }`}
          >
            {status === 'sent' ? ui.sent : status === 'error' ? ui.error : ''}
          </p>
        </form>
      </Reveal>

      <div className="flex flex-col gap-1 border-t border-hair pt-6 font-[var(--font-display)] text-[10px] font-medium uppercase tracking-[0.2em] text-fgfaint sm:flex-row sm:justify-between">
        <span>{meta.name} © 2026</span>
        <span>{contact.footerLoc}</span>
        <span>{contact.footerRole}</span>
      </div>
    </div>
  );
};

const Body: React.FC<Props> = (props) => {
  switch (props.nodeId) {
    case 'core':
      return <Core {...props} />;
    case 'perfil':
      return <Perfil {...props} />;
    case 'proyectos':
      return <Proyectos {...props} />;
    case 'experiencia':
      return <Experiencia {...props} />;
    case 'servicios':
      return <Servicios {...props} />;
    case 'contacto':
      return <Contacto {...props} />;
    default:
      return null;
  }
};

const PopupContent: React.FC<Props> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!props.anchor) return;
    const sel = `[data-anchor="${(window as any).CSS?.escape ? CSS.escape(props.anchor) : props.anchor}"]`;
    const t = setTimeout(() => {
      const el = ref.current?.querySelector(sel) as HTMLElement | null;
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('anchor-hit');
      setTimeout(() => el.classList.remove('anchor-hit'), 2200);
    }, 420);
    return () => clearTimeout(t);
  }, [props.anchor, props.nodeId]);

  return (
    <div ref={ref}>
      <Body {...props} />
    </div>
  );
};

export default PopupContent;
