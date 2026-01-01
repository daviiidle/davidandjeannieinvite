// Flip LAUNCH_SITE in your environment to control which pages are public.
// - true: all pages available
// - false: only Save-the-Date (/) is accessible
const rawLaunchSite = String(import.meta.env.LAUNCH_SITE ?? 'true').toLowerCase();

export const LAUNCH_SITE = rawLaunchSite === 'true';
export const PREVIEW_KEY = String(import.meta.env.PREVIEW_KEY ?? '');
