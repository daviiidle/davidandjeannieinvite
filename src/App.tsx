import { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { Details } from './components/Details';
import { RSVP } from './components/RSVP';
import { Footer } from './components/Footer';
import { RsvpAccessPage } from './components/RsvpAccessPage';
import { TheDay } from './components/TheDay';
import { ReceptionTimeline } from './components/ReceptionTimeline';
import { Etiquette } from './components/Etiquette';
import { BASE_PATH, buildFullPath, normalizeRelativePath } from './utils/routing';
import { RsvpIntroGate } from './components/RsvpIntroGate';
import { LanguageProvider } from './context/LanguageProvider';
import type { Language } from './i18n';
 
const LEGACY_SECTION_TARGETS: Record<string, string> = {
  '/details': 'details',
  '/etiquette': 'etiquette',
  '/the-day': 'the-day',
  '/reception': 'reception',
  '/rsvp': 'rsvp',
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
  const pendingScrollIdRef = useRef<string | null>(null);

  useEffect(() => {
    const expectedPath = buildLocalizedPath(language, pagePath);
    if (expectedPath !== path) {
      navigate(expectedPath, { replace: true, skipScroll: true });
    }
  }, [language, pagePath, path, navigate]);

  useEffect(() => {
    if (BASE_PATH && !window.location.pathname.startsWith(BASE_PATH)) {
      const target =
        (BASE_PATH || '') + (path === '/' ? '' : path);
      window.history.replaceState({}, '', target || '/');
    }
  }, [path]);

  useEffect(() => {
    if (viewToken) return;
    const legacyTarget = LEGACY_SECTION_TARGETS[pagePath];
    const isHome = pagePath === '/';
    if (isHome || !legacyTarget) return;
    pendingScrollIdRef.current = legacyTarget;
    navigate(buildLocalizedPath(language, '/'), { replace: true, skipScroll: true });
  }, [viewToken, pagePath, language, navigate]);

  useEffect(() => {
    if (!pendingScrollIdRef.current) return;
    const el = document.getElementById(pendingScrollIdRef.current);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    pendingScrollIdRef.current = null;
  }, [path, viewToken]);

  useEffect(() => {
    if (pendingScrollIdRef.current) return;
    if (!viewToken) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [path, viewToken]);

  const handleLanguageChange = useCallback((nextLanguage: Language) => {
    if (nextLanguage === language) return;
    const nextPath = buildLocalizedPath(nextLanguage, viewToken ? pagePath : '/');
    navigate(nextPath);
  }, [language, pagePath, viewToken, navigate]);

  return (
    <LanguageProvider language={language} onChangeLanguage={handleLanguageChange}>
      <div>
        <main>
          {viewToken ? (
            <RsvpAccessPage token={viewToken} />
          ) : (
            <>
              <RsvpIntroGate>
                <Details />
              </RsvpIntroGate>
              <Etiquette />
              <TheDay />
              <ReceptionTimeline />
              <RSVP />
            </>
          )}
        </main>

        <Footer coupleName="David & Jeannie" email="daviiidle@gmail.com" showSocials={false} />
      </div>
    </LanguageProvider>
  );
}
