const basePath = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');

export const BASE_PATH = basePath;

const normalizeInputPath = (path: string) => {
  if (!path) return '/';
  const hasLeadingSlash = path.startsWith('/');
  const normalized = path.replace(/\/+$/, '') || '/';
  return hasLeadingSlash ? normalized : `/${normalized}`;
};

export const normalizeRelativePath = (pathname: string) => {
  let relative = pathname || '/';
  if (BASE_PATH && relative.startsWith(BASE_PATH)) {
    relative = relative.slice(BASE_PATH.length) || '/';
  }
  if (!relative.startsWith('/')) {
    relative = `/${relative}`;
  }
  return relative || '/';
};

export const buildFullPath = (path: string) => {
  const normalized = normalizeInputPath(path);
  return (BASE_PATH || '') + (normalized === '/' ? '' : normalized);
};

export const navigateWithinApp = (path: string) => {
  if (typeof window === 'undefined') return;
  const normalized = normalizeInputPath(path);
  const current = normalizeRelativePath(window.location.pathname);
  if (normalized === current) return;
  const fullPath = buildFullPath(normalized);
  window.history.pushState({}, '', fullPath || '/');
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
