import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { PortfolioContent } from '../types';
import { SOCIAL_LINKS } from '../constants';
import { Section, Reveal, useCopy } from '../components/ui';

interface Props {
  content: PortfolioContent['contact'];
  ui: PortfolioContent['ui'];
  meta: PortfolioContent['meta'];
}

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
  <label className="block border-b border-hair pb-3 transition-colors focus-within:border-accent">
    <span className="tag">{label}</span>
    {area ? (
      <textarea
        name={name}
        required
        rows={3}
        className="mt-2 w-full resize-none bg-transparent text-lg text-fg outline-none placeholder:text-fgfaint md:text-xl"
        placeholder="—"
      />
    ) : (
      <input
        name={name}
        type={type}
        required
        className="mt-2 w-full bg-transparent text-lg text-fg outline-none placeholder:text-fgfaint md:text-xl"
        placeholder="—"
      />
    )}
  </label>
);

const Contact: React.FC<Props> = ({ content, ui, meta }) => {
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
    <Section id="contacto" index="05" tag={content.tag} title={content.title}>
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <p className="max-w-[42ch] text-[15px] leading-relaxed text-fgdim">{content.line}</p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-12">
              <p className="tag">{content.directLabel}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  className="text-xl text-fg transition-colors hover:text-accent md:text-2xl"
                >
                  {SOCIAL_LINKS.email}
                </a>
                <button
                  onClick={() => copy(SOCIAL_LINKS.email)}
                  className="border border-hair px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fgdim transition-colors hover:border-accent hover:text-accent"
                >
                  {copied ? ui.copied : ui.copy}
                </button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-10">
              <p className="tag">{content.socialLabel}</p>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] text-fgdim transition-colors hover:text-fg"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <form onSubmit={submit} className="flex flex-col gap-8">
            <Field name="name" label={content.formName} />
            <Field name="email" label={content.formEmail} type="email" />
            <Field name="message" label={content.formIdea} area />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-1 border border-fg py-4 font-mono text-[11px] uppercase tracking-[0.28em] text-fg transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
            >
              {status === 'sending' ? ui.sending : ui.send}
            </button>
            <p role="status" className={`min-h-[1.2rem] text-[13px] ${status === 'error' ? 'text-[#e0857a]' : 'text-accent'}`}>
              {status === 'sent' ? ui.sent : status === 'error' ? ui.error : ''}
            </p>
          </form>
        </Reveal>
      </div>

      <div className="mt-24 flex flex-col items-start justify-between gap-3 border-t border-hair pt-8 font-mono text-[10px] uppercase tracking-[0.24em] text-fgfaint sm:flex-row sm:items-center">
        <span>{meta.name} © 2026</span>
        <span>{content.footerLoc}</span>
        <span>{content.footerRole}</span>
      </div>
    </Section>
  );
};

export default Contact;
