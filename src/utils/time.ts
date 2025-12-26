const MELBOURNE_TZ = 'Australia/Melbourne';
const EVENT_LOCAL_START = '2026-10-03T14:00:00';

const numberFromPart = (value?: string) => Number(value ?? '0');

const getTimeZoneOffset = (date: Date, timeZone: string) => {
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
  const filled: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      filled[part.type] = part.value;
    }
  }

  const asUTC = Date.UTC(
    numberFromPart(filled.year),
    numberFromPart(filled.month) - 1,
    numberFromPart(filled.day),
    numberFromPart(filled.hour),
    numberFromPart(filled.minute),
    numberFromPart(filled.second)
  );
  return asUTC - date.getTime();
};

const parseLocalDateTime = (localIso: string) => {
  const [datePart, timePart = '00:00:00'] = localIso.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour = 0, minute = 0, second = 0] = timePart.split(':').map(Number);
  return { year, month, day, hour, minute, second };
};

export const createZonedDate = (localIso: string, timeZone: string) => {
  const parts = parseLocalDateTime(localIso);
  const utcDate = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
  );
  const offset = getTimeZoneOffset(utcDate, timeZone);
  return new Date(utcDate.getTime() - offset);
};

export const EVENT_TIME_ZONE = MELBOURNE_TZ;
export const EVENT_START = createZonedDate(EVENT_LOCAL_START, EVENT_TIME_ZONE);

export const formatWeekday = (locale: string) =>
  new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    timeZone: EVENT_TIME_ZONE,
  }).format(EVENT_START);
