import { useEffect, useState, useMemo } from 'react';
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

type PageKey =
  | 'save-the-date'
  | 'rsvp'
  | 'details'
  | 'story'
  | 'the-day'
  | 'reception'
  | 'seating'
  | 'photos'
  | 'view'
  | 'not-found';

const BASE_PATH = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');

const routeMap: Record<string, PageKey> = {
  '/': 'save-the-date',
  '/save-the-date': 'save-the-date',
  '/rsvp': 'rsvp',
  '/details': 'details',
  '/the-day': 'the-day',
  '/reception': 'reception',
  '/our-story': 'story',
  '/seating': 'seating',
  '/photos': 'photos',
};

const navLinks = [
  { path: '/', label: 'Save the Date', targetId: 'hero' },
  { path: '/rsvp', label: 'RSVP' },
  { path: '/details', label: 'Details' },
  { path: '/the-day', label: 'The Day' },
  { path: '/reception', label: 'Reception' },
  { path: '/seating', label: 'Seating' },
  { path: '/photos', label: 'Photos' },
  { path: '/our-story', label: 'Our Story' },
];

const normalizeRelativePath = (pathname: string) => {
  let relative = pathname;
  if (BASE_PATH && relative.startsWith(BASE_PATH)) {
    relative = relative.slice(BASE_PATH.length) || '/';
  }
  if (!relative.startsWith('/')) {
    relative = `/${relative}`;
  }
  return relative || '/';
};

function usePathname() {
  const getPath = () => normalizeRelativePath(window.location.pathname);
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const handler = () => setPath(getPath());
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const navigate = (nextPath: string) => {
    const normalized = nextPath.replace(/\/+$/, '') || '/';
    if (normalized === path) return;
    const fullPath =
      (BASE_PATH || '') + (normalized === '/' ? '' : normalized);
    window.history.pushState({}, '', fullPath || '/');
    setPath(normalized);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { path, navigate };
}

export default function App() {
  const { path, navigate } = usePathname();
  const viewToken = useMemo(() => {
    const match = path.match(/^\/r\/([^/]+)$/);
    return match ? match[1] : null;
  }, [path]);
  const page: PageKey = useMemo(() => {
    if (viewToken) return 'view';
    return routeMap[path] ?? 'not-found';
  }, [path, viewToken]);
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);

  useEffect(() => {
    if (BASE_PATH && !window.location.pathname.startsWith(BASE_PATH)) {
      const target =
        (BASE_PATH || '') + (path === '/' ? '' : path);
      window.history.replaceState({}, '', target || '/');
    }
  }, [path]);

  useEffect(() => {
    if (!pendingScrollId) return;
    if (page !== 'save-the-date') return;
    const el = document.getElementById(pendingScrollId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setPendingScrollId(null);
    }
  }, [pendingScrollId, page]);

  return (
    <div>
      <Navigation
        currentPath={path}
        links={navLinks}
        onNavigate={(href, targetId) => {
          if (href !== path) {
            navigate(href);
            setPendingScrollId(targetId ?? null);
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
        }}
      />

      <main>
        {page === 'save-the-date' && (
          <>
            <div id="hero">
              <Hero />
            </div>
          </>
        )}

        {page === 'rsvp' && <RSVP />}

        {page === 'details' && (
          <>
            <Details />
          </>
        )}

        {page === 'the-day' && <TheDay />}

        {page === 'reception' && <ReceptionTimeline />}

        {page === 'story' && <Story />}

        {page === 'seating' && <SeatingLookup />}

        {page === 'photos' && <Photos />}

        {page === 'view' && viewToken && <RsvpAccessPage token={viewToken} />}

        {page === 'not-found' && (
          <section className="px-4 py-32 text-center">
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
              onClick={() => navigate('/')}
            >
              Go to Save the Date
            </button>
          </section>
        )}
      </main>

      <Footer coupleName="David & Jeannie" email="daviiidle@gmail.com" showSocials={false} />
    </div>
  );
}
