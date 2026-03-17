"use client";

import { useEffect } from "react";
import type { PosCartItem } from "@/app/admin/pos/page";

const RESTAURANT_NAME = "Restaurant POS";
const RESTAURANT_PHONE = "";

type PosTicketProps = {
  orderNumber: number;
  cart: PosCartItem[];
  tableNumber?: number;
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

export function PosTicket({ orderNumber, cart, tableNumber, onClose, onPrint }: PosTicketProps) {
  const subtotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const total = subtotal;

  useEffect(() => {
    document.body.classList.add("ticket-modal-open");
    return () => document.body.classList.remove("ticket-modal-open");
  }, []);

  return (
    <div className="ticket-modal-container fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:!fixed print:!top-0 print:!left-0 print:!right-auto print:!inset-auto print:!flex print:!justify-start print:!items-start print:bg-white print:p-0">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full max-h-[90vh] overflow-auto print:max-h-none print:shadow-none print:max-w-[80mm]">
        <div className="p-4 border-b border-dark-200 flex justify-between items-center print:hidden">
          <h3 className="font-semibold text-dark-800">Ticket</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onPrint}
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

        <div id="ticket-content" className="ticket-content-print p-6 font-mono text-sm text-dark-800">
          <div className="text-center space-y-0.5">
            <p className="font-bold text-base">{RESTAURANT_NAME}</p>
            {RESTAURANT_PHONE && (
              <p className="text-dark-600">Tél. {RESTAURANT_PHONE}</p>
            )}
          </div>

          <div className="mt-4 space-y-1 border-t border-dark-200 pt-4">
            <p>
              Commande #{orderNumber}
              {tableNumber != null && ` · Table ${tableNumber}`}
            </p>
            <p className="text-dark-600">{formatDate()}</p>
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
              {cart.map((c) => (
                <tr key={c.menuItemId} className="border-b border-dark-100">
                  <td className="py-1.5 pr-2">{c.quantity}</td>
                  <td className="py-1.5 pr-2">{c.name}</td>
                  <td className="py-1.5 text-right">{c.price.toFixed(2)} €</td>
                  <td className="py-1.5 pl-2 text-right">
                    {(c.price * c.quantity).toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 space-y-1 border-t border-dark-200 pt-4">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>

          <p className="text-center mt-6 text-dark-600">Merci pour votre visite !</p>
        </div>
      </div>
    </div>
  );
}
