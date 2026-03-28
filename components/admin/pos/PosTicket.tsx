"use client";

import { useCallback, useEffect } from "react";
import type { PosCartItem } from "@/app/admin/pos/page";

const RESTAURANT_NAME = "Restaurant POS";
const RESTAURANT_PHONE = "";

type PosTicketProps = {
  orderNumber: number;
  cart: PosCartItem[];
  tableNumber?: number;
  orderType?: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  publicCode?: string | null;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  onClose: () => void;
  onPrint: () => void;
};

function formatDate() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${day}/${month}/${year} ${String(h12).padStart(2, "0")}:${m} ${ampm}`;
}

// Isolated print styles injected into the popup window.
// This approach is 100% reliable — no CSS visibility tricks,
// no page-break guessing. The popup contains ONLY the ticket HTML.
const PRINT_STYLES = `
  @page { size: 80mm auto; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 80mm;
    font-family: monospace;
    font-size: 12px;
    color: #1e293b;
    background: white;
  }
  .ticket { width: 80mm; padding: 8px; }
  .text-center { text-align: center; }
  .text-right  { text-align: right; }
  .text-left   { text-align: left; }
  .font-bold   { font-weight: bold; }
  .font-semibold { font-weight: 600; }
  .text-base   { font-size: 14px; }
  .text-dark-500 { color: #64748b; }
  .text-dark-600 { color: #475569; }
  .text-dark-700 { color: #334155; }
  .text-dark-800 { color: #1e293b; }
  .text-dark-900 { color: #0f172a; }
  .whitespace-pre-wrap { white-space: pre-wrap; }
  .mt-3  { margin-top: 12px; }
  .mt-4  { margin-top: 16px; }
  .mt-6  { margin-top: 24px; }
  .pt-1  { padding-top: 4px; }
  .pt-4  { padding-top: 16px; }
  .p-3   { padding: 12px; }
  .py-1  { padding-top: 4px; padding-bottom: 4px; }
  .py-1-5 { padding-top: 6px; padding-bottom: 6px; }
  .pr-2  { padding-right: 8px; }
  .pl-2  { padding-left: 8px; }
  .space-y-0-5 > * + * { margin-top: 2px; }
  .space-y-1   > * + * { margin-top: 4px; }
  .border-t { border-top: 1px solid #cbd5e1; }
  .border-dark-100 { border-color: #f1f5f9; }
  .border-dark-200 { border-color: #e2e8f0; }
  .border-dark-300 { border-color: #cbd5e1; }
  .rounded { border-radius: 4px; }
  .bg-muted { background: rgba(248,250,252,0.8); }
  .leading-relaxed { line-height: 1.625; }
  .text-xs { font-size: 10px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { vertical-align: top; }
  .w-full { width: 100%; }
  .flex { display: flex; }
  .justify-between { justify-content: space-between; }
`;

export function PosTicket({
  orderNumber,
  cart,
  tableNumber,
  orderType = "DINE_IN",
  publicCode,
  customerName,
  customerPhone,
  customerAddress,
  onClose,
  onPrint,
}: PosTicketProps) {
  const subtotal = cart.reduce((s, c) => {
    const supSum = Array.isArray(c.selectedSupplements)
      ? c.selectedSupplements.reduce(
          (acc, sup) => acc + Number(sup.price || 0),
          0
        )
      : 0;
    return s + (c.price + supSum) * c.quantity;
  }, 0);
  const total = subtotal;

  useEffect(() => {
    // Keep body class in sync for any future CSS needs
    document.body.classList.add("ticket-modal-open");
    return () => document.body.classList.remove("ticket-modal-open");
  }, []);

  const handlePrint = useCallback(() => {
    const content = document.getElementById("ticket-content");
    if (!content) return;

    // Open a clean popup containing ONLY the ticket HTML.
    // The browser has nothing else to paginate → guaranteed 1 page.
    const win = window.open("", "_blank", "width=340,height=600");
    if (!win) {
      // Popup blocked — fall back to window.print()
      window.print();
      onPrint();
      return;
    }

    win.document.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Ticket #${orderNumber}</title>
    <style>${PRINT_STYLES}</style>
  </head>
  <body>
    <div class="ticket">${content.innerHTML}</div>
  </body>
</html>`);

    win.document.close();
    win.focus();

    // Give the browser ~300 ms to lay out before printing
    setTimeout(() => {
      win.print();
      win.close();
    }, 300);

    onPrint();
  }, [onPrint, orderNumber]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="p-4 border-b border-dark-200 flex justify-between items-center">
          <h3 className="font-semibold text-dark-800">Ticket</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded bg-primary-500 text-white text-sm font-medium hover:bg-primary-600"
            >
              Imprimer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-dark-300 text-dark-700 text-sm hover:bg-dark-50"
            >
              Fermer
            </button>
          </div>
        </div>

        {/* Ticket content — this div is cloned into the popup for printing */}
        <div
          id="ticket-content"
          className="p-6 font-mono text-sm text-dark-800"
        >
          <div className="text-center space-y-0.5">
            <p className="font-bold text-base">{RESTAURANT_NAME}</p>
            {RESTAURANT_PHONE && (
              <p className="text-dark-600">Tél. {RESTAURANT_PHONE}</p>
            )}
          </div>

          <div className="mt-4 space-y-1 border-t border-dark-200 pt-4">
            <p>
              {publicCode ? (
                <>
                  N° commande{" "}
                  <span className="font-bold">{publicCode}</span>
                  <span className="text-dark-500">
                    {" "}
                    · Ticket #{orderNumber}
                  </span>
                </>
              ) : (
                <>
                  Commande #{orderNumber}
                  {tableNumber != null && ` · Table ${tableNumber}`}
                </>
              )}
            </p>
            {orderType === "TAKEAWAY" && !publicCode && (
              <p className="text-dark-700">À emporter</p>
            )}
            {orderType === "DELIVERY" && (
              <p className="font-semibold text-dark-800">Livraison</p>
            )}
            <p className="text-dark-600">{formatDate()}</p>
            {orderType === "DELIVERY" &&
              (customerName?.trim() ||
                customerPhone?.trim() ||
                customerAddress?.trim()) && (
                <div className="mt-3 space-y-1 rounded border border-dark-200 bg-dark-50/80 p-3 text-left text-xs leading-relaxed">
                  <p className="font-semibold text-dark-900">Client</p>
                  {customerName?.trim() && <p>{customerName.trim()}</p>}
                  {customerPhone?.trim() && (
                    <p>Tél. {customerPhone.trim()}</p>
                  )}
                  {customerAddress?.trim() && (
                    <p className="whitespace-pre-wrap">
                      {customerAddress.trim()}
                    </p>
                  )}
                </div>
              )}
          </div>

          <table className="w-full mt-4 border-collapse text-left">
            <thead>
              <tr className="border-b border-dark-300">
                <th className="py-1 pr-2">Qté</th>
                <th className="py-1 pr-2">Article</th>
                <th className="py-1 text-right">Prix</th>
                <th className="py-1 pl-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((c) =>
                (() => {
                  const supSum = Array.isArray(c.selectedSupplements)
                    ? c.selectedSupplements.reduce(
                        (acc, sup) => acc + Number(sup.price || 0),
                        0
                      )
                    : 0;
                  const supNames = Array.isArray(c.selectedSupplements)
                    ? c.selectedSupplements.map((s) => s.name).join(", ")
                    : "";
                  return (
                    <tr key={c.menuItemId} className="border-b border-dark-100">
                      <td className="py-1.5 pr-2">{c.quantity}</td>
                      <td className="py-1.5 pr-2">
                        <div>{c.name}</div>
                        {supSum > 0 && (
                          <div className="text-[10px] text-dark-600">
                            + {supNames}
                          </div>
                        )}
                      </td>
                      <td className="py-1.5 text-right">
                        {(c.price + supSum).toFixed(2)} DA
                      </td>
                      <td className="py-1.5 pl-2 text-right">
                        {((c.price + supSum) * c.quantity).toFixed(2)} DA
                      </td>
                    </tr>
                  );
                })()
              )}
            </tbody>
          </table>

          <div className="mt-4 space-y-1 border-t border-dark-200 pt-4">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} DA</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1">
              <span>Total</span>
              <span>{total.toFixed(2)} DA</span>
            </div>
          </div>

          <p className="text-center mt-6 text-dark-600">
            Merci pour votre visite !
          </p>
        </div>
      </div>
    </div>
  );
}
