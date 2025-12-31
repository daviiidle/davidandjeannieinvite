import { useMemo, useRef, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../theme';
import { navigateWithinApp } from '../utils/routing';
import { Section } from './Section';

interface EtiquetteSection {
  id: string;
  title: string;
  summary: string;
  details: {
    paragraphs: string[];
    bullets: string[];
  };
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section';

const splitBody = (body?: string) => {
  if (!body) return { summary: '', remainder: '' };
  const parts = body.split(/(?<=[.!?])\s+/);
  const summary = parts.shift()?.trim() ?? '';
  const remainder = parts.join(' ').trim();
  return { summary, remainder };
};

export function Etiquette() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { duration: 0.8 });
  const { strings } = useLanguage();
  const { etiquette, details } = strings;
  const sections = etiquette.sections ?? details.infoSections ?? [];
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const structuredSections: EtiquetteSection[] = useMemo(() => {
    const list: EtiquetteSection[] = [];
    sections.forEach((column) => {
      column.subsections.forEach((section) => {
        const { summary, remainder } = splitBody(section.body);
        let lead = summary;
        let remainingBullets = section.bullets ?? [];
        if (!lead && remainingBullets.length) {
          [lead, ...remainingBullets] = remainingBullets;
        }
        const id = slugify(section.heading);
        list.push({
          id,
          title: section.heading,
          summary: lead,
          details: {
            paragraphs: remainder ? [remainder] : [],
            bullets: remainingBullets,
          },
        });
      });
    });
    return list;
  }, [sections]);

  const toggleSection = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const hasDetails = (item: EtiquetteSection) =>
    item.details.paragraphs.length > 0 || item.details.bullets.length > 0;

  return (
    <Section id="etiquette-page" ref={sectionRef}>
      <div className="etiquette-content">
        <button
          type="button"
          onClick={() => navigateWithinApp('/details')}
          className="mb-6 inline-flex items-center text-sm font-medium uppercase tracking-[0.08em] text-left text-slate-600 hover:text-slate-800"
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            letterSpacing: '0.12em',
          }}
        >
          ← {etiquette.backToDetailsLabel}
        </button>

        <div className="etiquette-hero">
          <p
            className="font-sans text-xs uppercase tracking-[0.3em] text-slate-500 mb-3"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              letterSpacing: '0.35em',
            }}
          >
            {etiquette.pageLabel}
          </p>
          <h1
            className="font-serif text-4xl md:text-5xl text-[#8B9DC3]"
            style={{
              fontFamily: theme.typography.fontFamily.serif,
              color: theme.colors.primary.dustyBlue,
              fontSize: theme.typography.heading.h1,
              fontWeight: theme.typography.fontWeight.bold,
              letterSpacing: '0.03em',
              marginBottom: theme.spacing.md,
            }}
          >
            {etiquette.pageTitle}
          </h1>
          <p
            className="font-sans text-base md:text-lg text-slate-600 leading-relaxed etiquette-hero-intro"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              color: theme.colors.text.secondary,
            }}
          >
            {etiquette.intro}
          </p>
        </div>

        {structuredSections.length > 0 && (
          <nav className="etiquette-toc" aria-label="Etiquette sections">
            {structuredSections.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.title}
              </a>
            ))}
          </nav>
        )}

        <div className="etiquette-sections">
          {structuredSections.map((item) => {
            const expandedState = !!expanded[item.id];
            const showDetails = hasDetails(item);
            return (
              <section key={item.id} id={item.id} className="etiquette-block">
                <header className="etiquette-block__heading">
                  <h2>{item.title}</h2>
                  {item.summary && <p className="etiquette-block__summary">{item.summary}</p>}
                </header>

                {showDetails && (
                  <div
                    className={`etiquette-block__details${
                      expandedState ? ' is-open' : ''
                    }`}
                  >
                    {item.details.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {item.details.bullets.length > 0 && (
                      <ul>
                        {item.details.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {showDetails && (
                  <button
                    type="button"
                    className="etiquette-block__toggle"
                    aria-expanded={expandedState}
                    onClick={() => toggleSection(item.id)}
                  >
                    {expandedState
                      ? etiquette.lessDetailsLabel ?? 'Hide details'
                      : etiquette.moreDetailsLabel ?? 'More details'}
                  </button>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
