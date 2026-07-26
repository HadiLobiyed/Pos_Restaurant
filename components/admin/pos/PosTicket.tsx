"use client";

import { useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import type { PosCartItem } from "@/app/admin/pos/page";
import { printTicketFromSelector } from "@/lib/auto-print";

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
  restaurantName?: string;
  /** Rendu invisible pour impression auto (iframe) */
  autoPrint?: boolean;
  onClose?: () => void;
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
  restaurantName = "Restaurant POS",
  autoPrint = false,
  onClose,
}: PosTicketProps) {
  const isPrintingRef = useRef(false);

  const handlePrint = useCallback(async () => {
    if (isPrintingRef.current) return;
    isPrintingRef.current = true;
    try {
      await printTicketFromSelector("#ticket-content");
    } finally {
      window.setTimeout(() => {
        isPrintingRef.current = false;
      }, 1500);
    }
  }, []);

  const ticketContent = (
    <div id="ticket-content" className="ticket-content-print p-6 font-mono text-sm text-dark-800">
      <div className="text-center space-y-0.5">
        <p className="font-bold text-base">{restaurantName}</p>
        {RESTAURANT_PHONE && <p className="text-dark-600">Tél. {RESTAURANT_PHONE}</p>}
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
        {orderType === "TAKEAWAY" && !publicCode && <p className="text-dark-700">À emporter</p>}
        {orderType === "DELIVERY" && <p className="font-semibold text-dark-800">Livraison</p>}
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

      <table className="mt-4 w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-dark-300">
            <th className="py-1 pr-2">Qté</th>
            <th className="py-1 pr-2">Article</th>
            <th className="py-1 text-right">Prix</th>
            <th className="py-1 pl-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((c) => {
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
                <td className="py-1.5 pl-2 text-right">{((c.price + supSum) * c.quantity).toFixed(2)} DA</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4 space-y-1 border-t border-dark-200 pt-4">
        <div className="flex justify-between">
          <span>Sous-total</span>
          <span>
            {cart
              .reduce((s, c) => {
                const supSum = Array.isArray(c.selectedSupplements)
                  ? c.selectedSupplements.reduce((acc, sup) => acc + Number(sup.price || 0), 0)
                  : 0;
                return s + (c.price + supSum) * c.quantity;
              }, 0)
              .toFixed(2)}{" "}
            DA
          </span>
        </div>
        <div className="flex justify-between pt-1 text-base font-bold">
          <span>Total</span>
          <span>
            {cart
              .reduce((s, c) => {
                const supSum = Array.isArray(c.selectedSupplements)
                  ? c.selectedSupplements.reduce((acc, sup) => acc + Number(sup.price || 0), 0)
                  : 0;
                return s + (c.price + supSum) * c.quantity;
              }, 0)
              .toFixed(2)}{" "}
            DA
          </span>
        </div>
      </div>

      <p className="mt-6 text-center text-dark-600">Merci pour votre visite !</p>
    </div>
  );

  if (autoPrint) {
    if (typeof document === "undefined") return null;
    return createPortal(
      <div className="pointer-events-none absolute left-0 top-0 h-0 w-0 overflow-hidden opacity-0" aria-hidden>
        {ticketContent}
      </div>,
      document.body
    );
  }

  const modal = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-sm overflow-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-dark-200 p-4">
          <h3 className="font-semibold text-dark-800">Ticket</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="rounded bg-primary-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600"
            >
              Imprimer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-dark-300 px-3 py-1.5 text-sm text-dark-700 hover:bg-dark-50"
            >
              Fermer
            </button>
          </div>
        </div>
        {ticketContent}
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}
