/**
 * Detected locale for date/time formatting.
 * Prefers Telegram user language_code (e.g. "ru"), then navigator.language; normalizes to BCP 47 (e.g. "ru-RU").
 */
export function getDetectedLocale(): string {
  if (typeof window === 'undefined') return 'en-US';
  const fromTelegram = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
  const raw = fromTelegram ?? navigator.language ?? 'en';
  const code = raw.split(/[-_]/)[0]?.toLowerCase() ?? 'en';
  const region = code === 'ru' ? 'RU' : code === 'en' ? 'US' : code.toUpperCase();
  return `${code}-${region}`;
}

/**
 * Detected IANA timezone (e.g. "Europe/Moscow"). Use for display; can be wrong under VPN.
 */
export function getDetectedTimezone(): string {
  if (typeof window === 'undefined') return 'UTC';
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';
  } catch {
    return 'UTC';
  }
}

/**
 * Device UTC offset in minutes (e.g. 180 for UTC+3). From system clock, robust to VPN.
 * Use for API day-range so "today" matches what the user sees on the device.
 */
export function getDeviceOffsetMinutes(): number {
  if (typeof window === 'undefined') return 0;
  return -new Date().getTimezoneOffset();
}
