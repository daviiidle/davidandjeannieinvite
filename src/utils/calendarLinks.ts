import { formatUtcDateTime } from './time';

export interface CalendarEventDetails {
  title: string;
  location: string;
  start: Date;
  end: Date;
  description?: string;
  timeZone: string;
}

const encodeText = (value: string) => encodeURIComponent(value);

const escapeICSValue = (value: string) =>
  value.replace(/,/g, '\\,').replace(/;/g, '\\;');

const formatLocalForICS = (date: Date, timeZone: string) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  const parts = formatter.formatToParts(date);
  const values: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      values[part.type] = part.value;
    }
  }
  return `${values.year}${values.month}${values.day}T${values.hour}${values.minute}${values.second}`;
};

export const createGoogleCalendarLink = (event: CalendarEventDetails) => {
  const datesParam = `${formatUtcDateTime(event.start)}/${formatUtcDateTime(event.end)}`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: datesParam,
    location: event.location,
    ctz: event.timeZone,
  });
  if (event.description) {
    params.set('details', event.description);
  }
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const createAppleCalendarLink = (event: CalendarEventDetails) => {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//David & Jeannie//Save The Date//EN',
    `X-WR-TIMEZONE:${event.timeZone}`,
    'BEGIN:VEVENT',
    `DTSTART;TZID=${event.timeZone}:${formatLocalForICS(event.start, event.timeZone)}`,
    `DTEND;TZID=${event.timeZone}:${formatLocalForICS(event.end, event.timeZone)}`,
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
