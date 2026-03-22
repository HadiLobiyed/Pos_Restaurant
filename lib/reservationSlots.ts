/** Plages horaires (service midi / soir) — minutes depuis minuit UTC+0 pour l’algorithme ; horaires affichés en local. */

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

/** Libellés pour l’UI (FR) */
export function slotLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  return `${String(h).padStart(2, "0")}h${String(m).padStart(2, "0")}`;
}

export function serviceHoursDescription(): string {
  return "Midi : 12h00 – 14h30 · Soir : 19h00 – 22h30 (créneaux toutes les 30 min)";
}
