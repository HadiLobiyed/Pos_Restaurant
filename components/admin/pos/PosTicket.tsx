"use client";

import { useEffect } from "react";
import type { PosCartItem } from "@/app/admin/pos/page";

const RESTAURANT_NAME = "Restaurant POS";
const RESTAURANT_PHONE = "";

type PosTicketProps = {
  orderNumber: number;
  cart: PosCartItem[];
  tableNumber?: number;
  /** Sur place / à emporter / livraison */
  orderType?: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  /** Code client CMD-xxx si commande web ou déjà créée */
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
      ? c.selectedSupplements.reduce((acc, sup) => acc + Number(sup.price || 0), 0)
      : 0;
    return s + (c.price + supSum) * c.quantity;
  }, 0);
  const total = subtotal;

  useEffect(() => {
    document.body.classList.add("ticket-modal-open");
    return () => document.body.classList.remove("ticket-modal-open");
  }, []);

  return (
    <div className="ticket-modal-container fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full max-h-[90vh] overflow-auto print:max-h-none print:overflow-visible print:shadow-none print:max-w-[80mm]">
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
              {publicCode ? (
                <>
                  N° commande <span className="font-bold">{publicCode}</span>
                  <span className="text-dark-500"> · Ticket #{orderNumber}</span>
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
              (customerName?.trim() || customerPhone?.trim() || customerAddress?.trim()) && (
                <div className="mt-3 space-y-1 rounded border border-dark-200 bg-dark-50/80 p-3 text-left text-xs leading-relaxed">
                  <p className="font-semibold text-dark-900">Client</p>
                  {customerName?.trim() && <p>{customerName.trim()}</p>}
                  {customerPhone?.trim() && <p>Tél. {customerPhone.trim()}</p>}
                  {customerAddress?.trim() && <p className="whitespace-pre-wrap">{customerAddress.trim()}</p>}
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
              {cart.map((c) => (
                (() => {
                  const supSum = Array.isArray(c.selectedSupplements)
                    ? c.selectedSupplements.reduce((acc, sup) => acc + Number(sup.price || 0), 0)
                    : 0;
                  const supNames = Array.isArray(c.selectedSupplements)
                    ? c.selectedSupplements.map((s) => s.name).join(", ")
                    : "";
                  return (
                <tr key={c.menuItemId} className="border-b border-dark-100">
                  <td className="py-1.5 pr-2">{c.quantity}</td>
                  <td className="py-1.5 pr-2">
                    <div>{c.name}</div>
                    {supSum > 0 && <div className="text-[10px] text-dark-600">+ {supNames}</div>}
                  </td>
                  <td className="py-1.5 text-right">{(c.price + supSum).toFixed(2)} DA</td>
                  <td className="py-1.5 pl-2 text-right">
                    {((c.price + supSum) * c.quantity).toFixed(2)} DA
                  </td>
                </tr>
                  );
                })()
              ))}
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

          <p className="text-center mt-6 text-dark-600">Merci pour votre visite !</p>
        </div>
      </div>
    </div>
  );
}
