const PREVIEW_STORAGE_KEY = 'preview';
const PREVIEW_QUERY_KEY = 'preview';

const getPreviewKey = () => import.meta.env.PREVIEW_KEY ?? '';

const canUseStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readStoredPreviewFlag = () => {
  if (!canUseStorage()) return false;
  try {
    return window.localStorage.getItem(PREVIEW_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

const writeStoredPreviewFlag = () => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(PREVIEW_STORAGE_KEY, 'true');
  } catch {
    // Ignore storage failures (private mode, blocked storage, etc.).
  }
};

const getPreviewQueryValue = () => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(PREVIEW_QUERY_KEY);
};

const clearPreviewQuery = () => {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has(PREVIEW_QUERY_KEY)) return;
  url.searchParams.delete(PREVIEW_QUERY_KEY);
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState({}, '', next || '/');
};

export const isPreviewEnabled = () => {
  if (import.meta.env.DEV) return true;
  if (typeof window === 'undefined') return false;

  const previewKey = getPreviewKey();
  const queryValue = getPreviewQueryValue();
  const hasValidKey = Boolean(previewKey) && queryValue === previewKey;

  if (hasValidKey) {
    writeStoredPreviewFlag();
    clearPreviewQuery();
    return true;
  }

  return readStoredPreviewFlag();
};
