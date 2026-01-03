import { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { Navigation } from './components';
import { Hero } from './components/Hero';
import { Details } from './components/Details';
import { Story } from './components/Story';
import { SeatingLookup } from './components/SeatingLookup';
import { RSVP } from './components/RSVP';
import { Footer } from './components/Footer';
import { Photos } from './components/Photos';
import { RsvpAccessPage } from './components/RsvpAccessPage';
import { TheDay } from './components/TheDay';
import { ReceptionTimeline } from './components/ReceptionTimeline';
import { Etiquette } from './components/Etiquette';
import { BASE_PATH, buildFullPath, normalizeRelativePath } from './utils/routing';
import { Section } from './components/Section';
import { SaveTheDateIntroGate } from './components/SaveTheDateIntroGate';
import { LanguageProvider } from './context/LanguageProvider';
import type { Language } from './i18n';
import { translations } from './i18n';
import { isPreviewEnabled } from './utils/preview';

type PageKey =
  | 'save-the-date'
  | 'rsvp'
  | 'details'
  | 'etiquette'
  | 'story'
  | 'the-day'
  | 'reception'
  | 'seating'
  | 'photos'
  | 'view'
  | 'not-found';

const routeMap: Record<string, PageKey> = {
  '/': 'save-the-date',
  '/save-the-date': 'save-the-date',
  '/rsvp': 'rsvp',
  '/details': 'details',
  '/etiquette': 'etiquette',
  '/the-day': 'the-day',
  '/reception': 'reception',
  '/our-story': 'story',
  '/seating': 'seating',
  '/photos': 'photos',
};

const SUPPORTED_LANGUAGES: Language[] = ['en', 'vi'];
const DEFAULT_LANGUAGE: Language = 'en';

const isLanguage = (value: string): value is Language =>
  SUPPORTED_LANGUAGES.some((lang) => lang === value);

const normalizePagePath = (path: string) => {
  if (!path || path === '/') return '/';
  const trimmed = path.replace(/^\/+/, '').replace(/\/+$/, '');
  return trimmed ? `/${trimmed}` : '/';
};

const parseLocalizedPath = (path: string) => {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) {
    return { language: DEFAULT_LANGUAGE, pagePath: '/' };
  }
  const [first, ...rest] = segments;
  if (isLanguage(first)) {
    const pagePath = rest.length ? `/${rest.join('/')}` : '/';
    return { language: first, pagePath: normalizePagePath(pagePath) };
  }
  return { language: DEFAULT_LANGUAGE, pagePath: normalizePagePath(path) };
};

const buildLocalizedPath = (language: Language, pagePath: string) => {
  const normalizedPage = normalizePagePath(pagePath);
  if (normalizedPage === '/') {
    return `/${language}`;
  }
  return `/${language}${normalizedPage}`;
};

function usePathname() {
  const getPath = () => normalizeRelativePath(window.location.pathname);
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const handler = () => {
      setPath(getPath());
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };
    window.addEventListener('popstate', handler);
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const navigate = (nextPath: string, options?: { replace?: boolean; skipScroll?: boolean }) => {
    const normalized = normalizeRelativePath(nextPath);
    if (normalized === path) return;
    const fullPath = buildFullPath(normalized);
    if (options?.replace) {
      window.history.replaceState({}, '', fullPath || '/');
    } else {
      window.history.pushState({}, '', fullPath || '/');
    }
    setPath(normalized);
    if (!options?.skipScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return { path, navigate };
}

export default function App() {
  const { path, navigate } = usePathname();
  const { language, pagePath } = useMemo(() => parseLocalizedPath(path), [path]);
  const viewToken = useMemo(() => {
    const match = pagePath.match(/^\/r\/([^/]+)$/);
    return match ? match[1] : null;
  }, [pagePath]);
  const page: PageKey = useMemo(() => {
    if (viewToken) return 'view';
    return routeMap[pagePath] ?? 'not-found';
  }, [pagePath, viewToken]);
  const pendingScrollIdRef = useRef<string | null>(null);
  const previewEnabled = isPreviewEnabled();
  const navCopy = translations[language].navigation;
  const navLinks = useMemo(
    () => [
      { path: '/', label: navCopy.saveTheDate },
      { path: '/rsvp', label: navCopy.rsvp },
      { path: '/details', label: navCopy.details },
      { path: '/etiquette', label: navCopy.etiquette },
      { path: '/the-day', label: navCopy.theDay },
      { path: '/reception', label: navCopy.reception },
      { path: '/seating', label: navCopy.seating },
      { path: '/photos', label: navCopy.photos },
      { path: '/our-story', label: navCopy.story },
    ],
    [navCopy]
  );

  useEffect(() => {
    const expectedPath = buildLocalizedPath(language, pagePath);
    if (expectedPath !== path) {
      navigate(expectedPath, { replace: true, skipScroll: true });
    }
  }, [language, pagePath, path, navigate]);

  useEffect(() => {
    if (previewEnabled) return;
    if (page === 'save-the-date') return;
    const target = buildLocalizedPath(language, '/');
    navigate(target, { replace: true, skipScroll: true });
  }, [previewEnabled, page, language, navigate]);

  useEffect(() => {
    if (BASE_PATH && !window.location.pathname.startsWith(BASE_PATH)) {
      const target =
        (BASE_PATH || '') + (path === '/' ? '' : path);
      window.history.replaceState({}, '', target || '/');
    }
  }, [path]);

  useEffect(() => {
    if (!pendingScrollIdRef.current) return;
    if (page !== 'save-the-date') return;
    const el = document.getElementById(pendingScrollIdRef.current);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    pendingScrollIdRef.current = null;
  }, [page]);

  const handleNavigate = useCallback((href: string, targetId?: string) => {
    const normalizedPage = normalizePagePath(href);
    const localizedHref = buildLocalizedPath(language, normalizedPage);
    if (localizedHref !== path) {
      pendingScrollIdRef.current = targetId ?? null;
      navigate(localizedHref);
      return;
    }
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [language, navigate, path]);

  const handleLanguageChange = useCallback((nextLanguage: Language) => {
    if (nextLanguage === language) return;
    const nextPath = buildLocalizedPath(nextLanguage, pagePath);
    navigate(nextPath);
  }, [language, pagePath, navigate]);

  const visibleNavLinks = useMemo(
    () => (previewEnabled ? navLinks : navLinks.filter((link) => link.path === '/')),
    [previewEnabled, navLinks],
  );

  return (
    <LanguageProvider language={language} onChangeLanguage={handleLanguageChange}>
      <div>
        <Navigation
          key={`${language}-${pagePath}`}
          currentPath={pagePath}
          links={visibleNavLinks}
          onNavigate={handleNavigate}
        />

        <main>
          {page === 'save-the-date' && (
            <SaveTheDateIntroGate>
              <div id="hero">
                <Hero />
              </div>
            </SaveTheDateIntroGate>
          )}

          {page === 'rsvp' && <RSVP />}

          {page === 'details' && (
            <>
              <Details />
            </>
          )}

          {page === 'etiquette' && <Etiquette />}

          {page === 'the-day' && <TheDay />}

          {page === 'reception' && <ReceptionTimeline />}

          {page === 'story' && <Story />}

          {page === 'seating' && <SeatingLookup />}

          {page === 'photos' && <Photos />}

          {page === 'view' && viewToken && <RsvpAccessPage token={viewToken} />}

          {page === 'not-found' && (
            <Section className="text-center">
              <h1 className="font-serif text-4xl mb-4">Page not found</h1>
              <p className="font-sans mb-6">
                This page isn’t available yet. Please check back soon.
              </p>
              <button
                className="btn-primary"
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '9999px',
                }}
                onClick={() => handleNavigate('/')}
              >
                Go to Save the Date
              </button>
            </Section>
          )}
        </main>

        <Footer coupleName="David & Jeannie" email="daviiidle@gmail.com" showSocials={false} />
      </div>
    </LanguageProvider>
  );
}
