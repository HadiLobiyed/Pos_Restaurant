/** Parse l’identifiant table depuis un QR (URL menu ou id brut). Utilisable côté client. */
export function parseTableIdFromScan(text: string): string | null {
  const t = text.trim();
  if (!t) return null;

  try {
    const url = new URL(t);
    const table = url.searchParams.get("table");
    if (table) return table;
  } catch {
    /* pas une URL */
  }

  const menuMatch = t.match(/[?&]table=([^&\s#]+)/i);
  if (menuMatch?.[1]) return decodeURIComponent(menuMatch[1]);

  if (/^c[a-z0-9]{20,}$/i.test(t)) return t;

  return null;
}
