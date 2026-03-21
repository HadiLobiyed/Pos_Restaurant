"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PosCartItem } from "@/app/admin/pos/page";
import { PosTicket } from "./PosTicket";

type Table = { id: string; number: number; reserved: boolean };

export function PosOrderSidebar({
  cart,
  ticketCart,
  tables,
  orderType,
  setOrderType,
  tableId,
  setTableId,
  pax,
  setPax,
  orderNumber,
  orderPublicCode,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  customerAddress,
  setCustomerAddress,
  onUpdateQuantity,
  onRemoveItem,
  onReset,
  onAfterOrderCreated,
  loadedOrderId,
}: {
  cart: PosCartItem[];
  /** Contenu du ticket (panier actuel ou dernier envoi) */
  ticketCart: PosCartItem[];
  tables: Table[];
  orderType: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  setOrderType: (t: "DINE_IN" | "TAKEAWAY" | "DELIVERY") => void;
  tableId: string | null;
  setTableId: (id: string | null) => void;
  pax: number;
  setPax: (n: number) => void;
  orderNumber: number;
  orderPublicCode: string | null;
  customerName: string;
  setCustomerName: (v: string) => void;
  customerPhone: string;
  setCustomerPhone: (v: string) => void;
  customerAddress: string;
  setCustomerAddress: (v: string) => void;
  onUpdateQuantity: (menuItemId: string, qty: number) => void;
  onRemoveItem: (menuItemId: string) => void;
  onReset: () => void;
  onAfterOrderCreated: (order: { publicCode?: string | null }) => void;
  loadedOrderId?: string | null;
}) {
  const router = useRouter();
  const [sending, setSending] = useState<"kot" | "bill" | "bill_payment" | "encaisser" | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [showTicket, setShowTicket] = useState(false);

  const subtotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const total = subtotal;
  const tableNumber = tableId && Array.isArray(tables) ? tables.find((t) => t.id === tableId)?.number : undefined;

  async function sendKot(andPrint = false) {
    if (orderType === "DINE_IN" && !tableId) {
      setMessage({ type: "error", text: "Choisissez une table." });
      return;
    }
    if (orderType === "DELIVERY") {
      if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
        setMessage({ type: "error", text: "Renseignez nom, téléphone et adresse (livraison)." });
        return;
      }
    }
    if (cart.length === 0) {
      setMessage({ type: "error", text: "Panier vide." });
      return;
    }
    setSending("kot");
    setMessage(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: orderType,
          ...(tableId ? { tableId } : {}),
          ...(orderType === "DELIVERY"
            ? {
                customerName: customerName.trim(),
                customerPhone: customerPhone.trim(),
                customerAddress: customerAddress.trim(),
              }
            : {}),
          items: cart.map((c) => ({ menuItemId: c.menuItemId, quantity: c.quantity, comment: c.comment })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur envoi cuisine");
      }
      const order = await res.json();
      setMessage({ type: "ok", text: "Commande envoyée en cuisine (KOT)." });
      onAfterOrderCreated(order);
      if (andPrint) setTimeout(() => window.print(), 300);
    } catch (e) {
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Erreur" });
    } finally {
      setSending(null);
    }
  }

  async function encaisser() {
    if (!loadedOrderId) return;
    setSending("encaisser");
    setMessage(null);
    try {
      const payRes = await fetch("/api/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: loadedOrderId, status: "PAID" }),
      });
      if (!payRes.ok) throw new Error("Erreur encaissement");
      setMessage({ type: "ok", text: "Paiement enregistré." });
      onReset();
      router.push("/admin/dashboard");
    } catch (e) {
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Erreur" });
    } finally {
      setSending(null);
    }
  }

  async function sendBill(markPaid: boolean) {
    if (orderType === "DINE_IN" && !tableId) {
      setMessage({ type: "error", text: "Choisissez une table." });
      return;
    }
    if (orderType === "DELIVERY") {
      if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
        setMessage({ type: "error", text: "Renseignez nom, téléphone et adresse (livraison)." });
        return;
      }
    }
    if (cart.length === 0) {
      setMessage({ type: "error", text: "Panier vide." });
      return;
    }
    setSending(markPaid ? "bill_payment" : "bill");
    setMessage(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: orderType,
          ...(tableId ? { tableId } : {}),
          ...(orderType === "DELIVERY"
            ? {
                customerName: customerName.trim(),
                customerPhone: customerPhone.trim(),
                customerAddress: customerAddress.trim(),
              }
            : {}),
          items: cart.map((c) => ({ menuItemId: c.menuItemId, quantity: c.quantity, comment: c.comment })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur création commande");
      }
      const order = await res.json();
      if (markPaid && order?.id) {
        const payRes = await fetch("/api/payments", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id, status: "PAID" }),
        });
        if (!payRes.ok) throw new Error("Erreur enregistrement paiement");
      }
      setMessage({
        type: "ok",
        text: markPaid ? "Facture créée et marquée payée." : "Facture créée.",
      });
      onAfterOrderCreated(order);
    } catch (e) {
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Erreur" });
    } finally {
      setSending(null);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3 border-b border-dark-200 p-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-medium text-dark-600 transition hover:text-dark-900"
          >
            Réinitialiser
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-dark-600">Type :</span>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as "DINE_IN" | "TAKEAWAY" | "DELIVERY")}
            className="input-field w-auto py-2 text-sm"
          >
            <option value="DINE_IN">Sur place</option>
            <option value="TAKEAWAY">À emporter</option>
            <option value="DELIVERY">Livraison</option>
          </select>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-dark-600">Table</span>
          <select
            value={tableId ?? ""}
            onChange={(e) => setTableId(e.target.value || null)}
            disabled={orderType !== "DINE_IN"}
            className="input-field flex-1 py-2 text-sm disabled:opacity-50"
          >
            <option value="">— Choisir —</option>
            {(Array.isArray(tables) ? tables : []).map((t) => (
              <option key={t.id} value={t.id}>
                Table {t.number} {t.reserved ? "(réservée)" : ""}
              </option>
            ))}
          </select>
        </div>
        {orderType === "DELIVERY" && (
          <div className="space-y-2 rounded-xl border border-primary-200 bg-primary-50/40 p-3">
            <p className="text-xs font-semibold text-primary-900">Livraison (sur le ticket)</p>
            <input
              type="text"
              placeholder="Nom du client"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="input-field w-full py-2 text-sm"
            />
            <input
              type="tel"
              placeholder="Téléphone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="input-field w-full py-2 text-sm"
            />
            <textarea
              placeholder="Adresse complète"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              rows={2}
              className="input-field w-full py-2 text-sm resize-none"
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-dark-600">Commande #</span>
          <span className="font-semibold text-dark-800">{orderNumber}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-dark-600">Couverts</span>
          <input
            type="number"
            min={1}
            value={pax}
            onChange={(e) => setPax(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="input-field w-20 py-2 text-center text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto border-b border-dark-200 p-5">
        <h3 className="mb-3 text-sm font-semibold text-dark-800">Commande</h3>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-dark-400">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-sm">Aucun article</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {cart.map((c) => (
              <li
                key={c.menuItemId}
                className="flex items-center gap-2 border-b border-dark-100 pb-3 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-dark-800">{c.name}</p>
                  <p className="text-dark-500">{(c.price * c.quantity).toFixed(2)} DA</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(c.menuItemId, c.quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded border border-dark-200 text-dark-600 transition hover:bg-dark-50"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{c.quantity}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(c.menuItemId, c.quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded border border-dark-200 text-dark-600 transition hover:bg-dark-50"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveItem(c.menuItemId)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                  title="Supprimer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-2 border-t border-dark-200 p-5">
        <div className="flex justify-between border-t border-dark-200 pt-3 text-base font-bold">
          <span>Total</span>
          <span className="text-primary-600">{total.toFixed(2)} DA</span>
        </div>

        {message && (
          <p
            className={`text-sm ${
              message.type === "ok" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 pt-3">
          {loadedOrderId ? (
            <button
              type="button"
              onClick={encaisser}
              disabled={sending !== null || cart.length === 0}
              className="col-span-2 rounded-xl bg-green-600 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
            >
              {sending === "encaisser" ? "Encaissement..." : "Encaisser"}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => sendKot(false)}
                disabled={sending !== null || cart.length === 0}
                className="rounded-xl bg-dark-700 py-2.5 text-sm font-medium text-white transition hover:bg-dark-800 disabled:opacity-50"
              >
                {sending === "kot" ? "Envoi..." : "KOT"}
              </button>
              <button
                type="button"
                onClick={() => sendBill(false)}
                disabled={sending !== null || cart.length === 0}
                className="rounded-xl bg-primary-500 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50"
              >
                {sending === "bill" ? "..." : "Facture"}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setShowTicket(true)}
            disabled={ticketCart.length === 0}
            className="col-span-2 rounded-xl border-2 border-dark-300 py-2.5 text-sm font-medium text-dark-700 transition hover:bg-dark-50 disabled:opacity-50"
          >
            Ticket
          </button>
        </div>
      </div>

      {showTicket && (
        <PosTicket
          orderNumber={orderNumber}
          cart={ticketCart}
          tableNumber={tableNumber}
          orderType={orderType}
          publicCode={orderPublicCode}
          customerName={customerName}
          customerPhone={customerPhone}
          customerAddress={customerAddress}
          onClose={() => setShowTicket(false)}
          onPrint={() => window.print()}
        />
      )}
    </div>
  );
}
