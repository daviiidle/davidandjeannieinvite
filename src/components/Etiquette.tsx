import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../theme';
import { navigateWithinApp } from '../utils/routing';

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
      className="px-4 py-16 md:py-24"
      style={{
        backgroundColor: theme.colors.background.offWhite,
      }}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {sections.map((column, columnIndex) => (
            <article
              key={`${column.title}-${columnIndex}`}
              className="rounded-3xl bg-white p-6 md:p-8 shadow-sm flex flex-col"
              style={{
                borderRadius: theme.borderRadius['2xl'],
                boxShadow: theme.shadows.sm,
              }}
            >
              <p
                className="font-sans text-xs uppercase tracking-[0.25em] text-center text-slate-500 mb-4"
                style={{
                  fontFamily: theme.typography.fontFamily.sans,
                  letterSpacing: '0.25em',
                }}
              >
                {column.title}
              </p>
              {column.subsections.map((section, idx) => (
                <div key={`${section.heading}-${idx}`} className="mb-6 text-center last:mb-0">
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
                    <ul className="mt-3 space-y-1 text-left inline-block">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="font-sans text-sm text-slate-600"
                          style={{
                            fontFamily: theme.typography.fontFamily.sans,
                            color: theme.colors.text.secondary,
                          }}
                        >
                          • {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
