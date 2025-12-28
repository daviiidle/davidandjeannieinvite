const DEFAULT_RSVP_BASE =
  'https://script.google.com/macros/s/AKfycbywfwlEOj9Jq_6CAqykndkQ117WMa_U3Vjov2O6JTbYDVdzew0qIqTvV6YQBGoQNCMywQ/exec';

const rawBase =
  (import.meta.env.VITE_RSVP_ENDPOINT as string | undefined) ?? DEFAULT_RSVP_BASE;

const RSVP_API_BASE_URL = normalizeBaseUrl(rawBase);

function normalizeBaseUrl(value: string) {
  if (!value) return '';
  return value.trim().replace(/\/+$/, '');
}

const withAction = (action: string) => {
  if (!RSVP_API_BASE_URL) {
    return '';
  }
  const separator = RSVP_API_BASE_URL.includes('?') ? '&' : '?';
  return `${RSVP_API_BASE_URL}${separator}action=${encodeURIComponent(action)}`;
};

export const RSVP_ENDPOINTS = {
  submit: withAction('rsvp'),
  fetch: withAction('rsvp'),
  update: withAction('rsvp/update'),
  intent: withAction('intent'),
};

const rawSaveTheDate =
  (import.meta.env.VITE_SAVE_THE_DATE_WEBHOOK_URL as string | undefined)?.trim();

export const SAVE_THE_DATE_WEBHOOK_URL =
  rawSaveTheDate && rawSaveTheDate.length > 0 ? rawSaveTheDate : RSVP_ENDPOINTS.intent;

export function withQueryParams(
  url: string,
  params: Record<string, string | number | undefined>
): string {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== ''
  );
  if (!entries.length) {
    return url;
  }
  const queryString = entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${queryString}`;
}

export { RSVP_API_BASE_URL };
