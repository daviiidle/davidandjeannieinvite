import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../theme';
import { navigateWithinApp } from '../utils/routing';

const quickNotesMatch = (heading: string) => {
  const normalized = heading.toLowerCase();
  return (
    normalized.includes('quick notes') ||
    normalized.includes('ghi chú nhanh')
  );
};

export function Etiquette() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { duration: 0.8 });
  const { strings } = useLanguage();
  const { etiquette, details } = strings;
  const sections = etiquette.sections ?? details.infoSections ?? [];

  return (
    <section
      id="etiquette-page"
      ref={sectionRef}
      className="py-16 md:py-24"
    >
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          maxWidth: theme.layout.maxWidth,
        }}
      >
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

        <div className="text-center mb-10 md:mb-14">
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
            className="font-serif text-4xl md:text-5xl text-[#8B9DC3] mb-4"
            style={{
              fontFamily: theme.typography.fontFamily.serif,
              color: theme.colors.primary.dustyBlue,
            }}
          >
            {etiquette.pageTitle}
          </h1>
          <p
            className="font-sans text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              color: theme.colors.text.secondary,
            }}
          >
            {etiquette.intro}
          </p>
        </div>

        <div>
          {sections.map((column, columnIndex) => (
            <div
              key={`${column.title}-${columnIndex}`}
              className="etiquette-section"
            >
              <p className="etiquette-section-title">{column.title}</p>
              {column.subsections.map((section, idx) => {
                const isQuickNotes = quickNotesMatch(section.heading);
                const blockClass = isQuickNotes
                  ? 'etiquette-quick-notes'
                  : 'etiquette-subsection';

                return (
                  <div key={`${section.heading}-${idx}`} className={blockClass}>
                    <h2
                      className="font-serif text-2xl text-[#8B9DC3] mb-2"
                      style={{
                        fontFamily: theme.typography.fontFamily.serif,
                        color: theme.colors.primary.dustyBlue,
                      }}
                    >
                      {section.heading}
                    </h2>
                    {section.body && (
                      <p
                        className="font-sans text-sm text-slate-600 leading-relaxed"
                        style={{
                          fontFamily: theme.typography.fontFamily.sans,
                          color: theme.colors.text.secondary,
                        }}
                      >
                        {section.body}
                      </p>
                    )}
                    {section.bullets && (
                      <ul>
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>• {bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
