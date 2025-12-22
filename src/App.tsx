import { useEffect, useState, useMemo } from 'react';
import { Navigation } from './components';
import { Hero } from './components/Hero';
import { Details } from './components/Details';
import { Story } from './components/Story';
import { SeatingLookup } from './components/SeatingLookup';
import { RSVP } from './components/RSVP';
import { Footer } from './components/Footer';

type PageKey = 'home' | 'details' | 'seating' | 'photos' | 'not-found';

const BASE_PATH = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');

const routeMap: Record<string, PageKey> = {
  '/': 'home',
  '/details': 'details',
  '/seating': 'seating',
  '/photos': 'photos',
};

const navLinks = [
  { path: '/', label: 'RSVP' },
  { path: '/details', label: 'Details' },
  { path: '/seating', label: 'Seating' },
  { path: '/photos', label: 'Photos' },
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
  const page: PageKey = useMemo(() => routeMap[path] ?? 'not-found', [path]);

  useEffect(() => {
    if (BASE_PATH && !window.location.pathname.startsWith(BASE_PATH)) {
      const target =
        (BASE_PATH || '') + (path === '/' ? '' : path);
      window.history.replaceState({}, '', target || '/');
    }
  }, [path]);

  return (
    <div>
      <Navigation
        currentPath={path}
        links={navLinks}
        onNavigate={(href) => {
          navigate(href);
        }}
      />

      <main>
        {page === 'home' && (
          <>
            <Hero />
            <RSVP />
          </>
        )}

        {page === 'details' && (
          <>
            <Details />
            <Story />
          </>
        )}

        {page === 'seating' && <SeatingLookup />}

        {page === 'photos' && (
          <section
            className="px-4 py-20 text-center"
            style={{ maxWidth: '720px', margin: '0 auto' }}
          >
            <h1 className="font-serif mb-6 text-4xl text-primary">
              Photo Album
            </h1>
            <p className="font-sans text-lg text-muted-foreground mb-10">
              We’re preparing a shared gallery with QR codes so guests can upload
              and browse the memories from the celebration. Stay tuned!
            </p>
            <div
              style={{
                borderRadius: '24px',
                border: '1px dashed rgba(139,157,195,0.5)',
                padding: '3rem',
                background: 'rgba(139,157,195,0.05)',
              }}
            >
              <p className="font-sans text-sm uppercase tracking-[0.3em] text-muted-foreground">
                Coming Soon
              </p>
            </div>
          </section>
        )}

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
