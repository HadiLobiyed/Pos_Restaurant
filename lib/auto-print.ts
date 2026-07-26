let printFrame: HTMLIFrameElement | null = null;

const TICKET_STYLES = `
  @page { size: 80mm auto; margin: 0; }
  html, body {
    margin: 0;
    padding: 0;
    background: white;
    color: #0f172a;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
    line-height: 1.35;
    width: 80mm;
  }
  body { padding: 0.5rem; box-sizing: border-box; }
  p { margin: 0.15rem 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 0.75rem; }
  th, td { padding: 0.2rem 0.25rem; vertical-align: top; }
  th { border-bottom: 1px solid #cbd5e1; font-weight: 600; }
  tr { border-bottom: 1px solid #f1f5f9; }
  ul { margin: 0.75rem 0 0; padding: 0; list-style: none; }
  li { padding: 0.35rem 0; border-bottom: 1px solid #f1f5f9; }
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .font-bold, .font-semibold { font-weight: 700; }
  .text-base { font-size: 14px; }
  .text-xs { font-size: 10px; }
  .text-\\[10px\\] { font-size: 10px; }
  .mt-4 { margin-top: 0.75rem; }
  .mt-6 { margin-top: 1rem; }
  .pt-4 { padding-top: 0.75rem; }
  .border-t { border-top: 1px solid #e2e8f0; }
  .border-b { border-bottom: 1px solid #e2e8f0; }
  .flex { display: flex; }
  .justify-between { justify-content: space-between; }
  .space-y-0\\.5 > * + * { margin-top: 0.125rem; }
  .space-y-1 > * + * { margin-top: 0.25rem; }
`;

function buildPrintDocument(bodyHtml: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Ticket</title><style>${TICKET_STYLES}</style></head><body>${bodyHtml}</body></html>`;
}

function ensureIframe(): HTMLIFrameElement | null {
  if (typeof document === "undefined") return null;
  if (printFrame?.isConnected) return printFrame;

  printFrame = document.createElement("iframe");
  printFrame.setAttribute("title", "Impression ticket");
  printFrame.setAttribute("aria-hidden", "true");
  printFrame.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;visibility:hidden";
  document.body.appendChild(printFrame);
  return printFrame;
}

function printFromWindow(win: Window): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      win.removeEventListener("afterprint", finish);
      resolve();
    };

    win.addEventListener("afterprint", finish);

    window.setTimeout(() => {
      try {
        win.focus();
        win.print();
      } catch {
        finish();
      }
    }, 120);

    window.setTimeout(finish, 10000);
  });
}

/** Prépare l’iframe d’impression (sans ouvrir de nouvelle page). */
export function prepareAutoPrintFrame(): void {
  ensureIframe();
}

export function waitForNextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

/** Imprime le HTML du ticket dans une iframe invisible — jamais la page POS. */
export function printTicketHtml(html: string): Promise<void> {
  if (typeof document === "undefined" || !html.trim()) return Promise.resolve();

  const frame = ensureIframe();
  const win = frame?.contentWindow;
  if (!win) return Promise.resolve();

  const doc = win.document;
  doc.open();
  doc.write(buildPrintDocument(html));
  doc.close();

  return printFromWindow(win);
}

/** Imprime uniquement le ticket (80 mm) — pas la page entière. */
export function printTicketFromSelector(
  selector = "#ticket-content, .ticket-content-print"
): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();

  const el = document.querySelector(selector);
  if (!el) return Promise.resolve();

  return printTicketHtml(el.innerHTML);
}
