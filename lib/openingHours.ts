/** Clés 0 = dimanche … 6 = samedi (comme Date.getDay()) */

export type DayRange = { start: string; end: string };
export type DaySchedule = { closed?: boolean; ranges: DayRange[] };
export type WeekSchedule = Record<string, DaySchedule>;

export const WEEKDAY_LABELS_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export function emptyWeekSchedule(): WeekSchedule {
  const s: WeekSchedule = {};
  for (let d = 0; d <= 6; d++) {
    s[String(d)] = { closed: false, ranges: [{ start: "12:00", end: "14:30" }, { start: "19:00", end: "22:30" }] };
  }
  return s;
}

function timeToMinutes(hhmm: string): number {
  const m = hhmm.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return NaN;
  const h = Number.parseInt(m[1], 10);
  const min = Number.parseInt(m[2], 10);
  if (h < 0 || h > 23 || min < 0 || min > 59) return NaN;
  return h * 60 + min;
}

/** Heure actuelle dans le fuseau du restaurant + jour 0–6 */
export function getRestaurantLocalParts(date: Date, timeZone: string): { weekday: number; minutes: number } {
  const tz = timeZone || "UTC";
  const d = new Date(date);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "long",
  });
  const parts = fmt.formatToParts(d);
  const wdStr = parts.find((p) => p.type === "weekday")?.value;
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
  const map: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  const weekday = map[wdStr ?? ""] ?? d.getDay();
  return { weekday, minutes: hour * 60 + minute };
}

function isWithinRanges(minutes: number, ranges: DayRange[]): boolean {
  for (const r of ranges) {
    const a = timeToMinutes(r.start);
    const b = timeToMinutes(r.end);
    if (Number.isNaN(a) || Number.isNaN(b) || a > b) continue;
    if (minutes >= a && minutes <= b) return true;
  }
  return false;
}

/**
 * Si `schedule` est null ou vide → ouvert (comportement par défaut tant que rien n’est enregistré).
 */
export function isRestaurantOpenNow(schedule: WeekSchedule | null | undefined, timeZone: string, now = new Date()): boolean {
  if (schedule == null || typeof schedule !== "object" || Object.keys(schedule).length === 0) {
    return true;
  }

  const { weekday, minutes } = getRestaurantLocalParts(now, timeZone);
  const key = String(weekday);
  const day = schedule[key];
  if (!day) return true;
  if (day.closed === true) return false;
  const ranges = Array.isArray(day.ranges) ? day.ranges : [];
  if (ranges.length === 0) return false;
  return isWithinRanges(minutes, ranges);
}

export function validateWeekSchedule(s: unknown): s is WeekSchedule {
  if (s == null || typeof s !== "object") return false;
  const o = s as Record<string, unknown>;
  for (let d = 0; d <= 6; d++) {
    const key = String(d);
    if (!(key in o)) return false;
    const day = o[key];
    if (day == null || typeof day !== "object") return false;
    const dd = day as Record<string, unknown>;
    if (dd.closed === true) {
      if (dd.ranges != null && !Array.isArray(dd.ranges)) return false;
      continue;
    }
    if (dd.closed !== false && dd.closed !== undefined) return false;
    if (!Array.isArray(dd.ranges)) return false;
    if (dd.ranges.length === 0) return false;
    for (const r of dd.ranges) {
      if (r == null || typeof r !== "object") return false;
      const rr = r as Record<string, unknown>;
      if (typeof rr.start !== "string" || typeof rr.end !== "string") return false;
      if (Number.isNaN(timeToMinutes(rr.start)) || Number.isNaN(timeToMinutes(rr.end))) return false;
      if (timeToMinutes(rr.start) > timeToMinutes(rr.end)) return false;
    }
  }
  return true;
}
