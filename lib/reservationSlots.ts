/** Plages horaires (service midi / soir) — minutes depuis minuit pour l’algorithme.
 *
 * Avant : créneaux hardcodés.
 * Maintenant : on génère aussi les créneaux depuis les horaires d’ouverture enregistrés côté admin
 * (`RestaurantSettings.openingHours`).
 */

import type { WeekSchedule } from "@/lib/openingHours";
import { emptyWeekSchedule, getRestaurantLocalParts, validateWeekSchedule } from "@/lib/openingHours";

const LUNCH_START = 12 * 60;
const LUNCH_END = 14 * 60 + 30;
const DINNER_START = 19 * 60;
const DINNER_END = 22 * 60 + 30;

export const SLOT_STEP_MINUTES = 30;
/** Capacité max de réservations par créneau (ajustable selon la salle) */
export const MAX_RESERVATIONS_PER_SLOT = 8;

function minutesToHHmm(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function generateAllSlotTimes(): string[] {
  const slots: string[] = [];
  for (let t = LUNCH_START; t <= LUNCH_END; t += SLOT_STEP_MINUTES) {
    slots.push(minutesToHHmm(t));
  }
  for (let t = DINNER_START; t <= DINNER_END; t += SLOT_STEP_MINUTES) {
    slots.push(minutesToHHmm(t));
  }
  return slots;
}

export function isValidSlot(time: string): boolean {
  return generateAllSlotTimes().includes(time);
}

function hhmmToMinutes(hhmm: string): number {
  const m = hhmm.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return NaN;
  const h = Number.parseInt(m[1], 10);
  const min = Number.parseInt(m[2], 10);
  if (h < 0 || h > 23 || min < 0 || min > 59) return NaN;
  return h * 60 + min;
}

/** Génère les créneaux possibles pour une date donnée, selon les horaires d’ouverture admin. */
export function generateSlotTimesForDate(dateStr: string, openingHours: WeekSchedule | null | undefined, timeZone: string): string[] {
  // Fallback : comportement historique (tant que l’admin n’a rien configuré).
  const schedule = validateWeekSchedule(openingHours) ? openingHours : emptyWeekSchedule();

  const [y, mo, d] = dateStr.split("-").map(Number);
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return [];

  // Important : on calcule le jour de semaine dans le fuseau du restaurant.
  const utcDate = new Date(Date.UTC(y, mo - 1, d));
  const { weekday } = getRestaurantLocalParts(utcDate, timeZone || "UTC");
  const day = schedule[String(weekday)];
  if (!day || day.closed === true) return [];

  const ranges = Array.isArray(day.ranges) ? day.ranges : [];
  const out = new Set<string>();

  for (const r of ranges) {
    const a = hhmmToMinutes(r.start);
    const b = hhmmToMinutes(r.end);
    if (Number.isNaN(a) || Number.isNaN(b) || a > b) continue;

    // On aligne sur le pas (30 min) depuis minuit.
    const start = Math.ceil(a / SLOT_STEP_MINUTES) * SLOT_STEP_MINUTES;
    for (let t = start; t <= b; t += SLOT_STEP_MINUTES) {
      out.add(minutesToHHmm(t));
    }
  }

  return Array.from(out).sort();
}

/** Libellés pour l’UI (FR) */
export function slotLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  return `${String(h).padStart(2, "0")}h${String(m).padStart(2, "0")}`;
}

export function serviceHoursDescription(): string {
  return "Créneaux selon les horaires d’ouverture enregistrés par l’admin (toutes les 30 min).";
}
