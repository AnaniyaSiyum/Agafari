/**
 * LockWindow value object enforces the 48-hour RSVP lock boundary consistently.
 * Computes boundary in UTC and ensures single source of truth across API and Cron.
 */
export class LockWindow {
  public static readonly LOCK_WINDOW_MS = 48 * 60 * 60 * 1000; // 48 Hours in milliseconds

  public static isLocked(eventDateStr: string | Date, now: Date = new Date()): boolean {
    if (!eventDateStr) return false;
    const eventTime = typeof eventDateStr === 'string' ? new Date(eventDateStr).getTime() : eventDateStr.getTime();
    if (isNaN(eventTime)) return false;
    
    const nowTime = now.getTime();
    const timeUntilEvent = eventTime - nowTime;
    return timeUntilEvent <= LockWindow.LOCK_WINDOW_MS;
  }
}
