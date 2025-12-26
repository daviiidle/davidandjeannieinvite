export interface CalendarEventDetails {
  title: string;
  location: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  description?: string;
}

const encodeText = (value: string) => encodeURIComponent(value);

const escapeICSValue = (value: string) =>
  value.replace(/,/g, '\\,').replace(/;/g, '\\;');

const normalizeDate = (value: string) => value.replace(/-/g, '');

const addDays = (date: string, days: number) => {
  const [year, month, day] = date.split('-').map(Number);
  const d = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
  d.setUTCDate(d.getUTCDate() + days);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(
    d.getUTCDate()
  ).padStart(2, '0')}`;
};

const resolveEndDate = (start: string, end?: string) =>
  normalizeDate(end ?? addDays(start, 1));

export const createGoogleCalendarLink = (event: CalendarEventDetails) => {
  const start = normalizeDate(event.startDate);
  const end = resolveEndDate(event.startDate, event.endDate);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    location: event.location,
  });
  if (event.description) {
    params.set('details', event.description);
  }
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const createAppleCalendarLink = (event: CalendarEventDetails) => {
  const start = normalizeDate(event.startDate);
  const end = resolveEndDate(event.startDate, event.endDate);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//David & Jeannie//Save The Date//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${escapeICSValue(event.title)}`,
    `LOCATION:${escapeICSValue(event.location)}`,
  ];
  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICSValue(event.description)}`);
  }
  lines.push('END:VEVENT', 'END:VCALENDAR');
  const icsContent = lines.join('\r\n');
  return `data:text/calendar;charset=utf-8,${encodeText(icsContent)}`;
};
