"use client";

import { useState } from "react";
import type { CartItem } from "./MenuClient";

export type OrderContext =
  | { kind: "table"; tableId: string }
  | { kind: "takeaway" }
  | { kind: "delivery" };

export function CartDrawer({
  open,
  onClose,
  cart,
  onUpdate,
  onRemove,
  orderContext,
  onOrderPlaced,
}: {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdate: (menuItemId: string, u: { quantity?: number; comment?: string }) => void;
  onRemove: (menuItemId: string) => void;
  orderContext: OrderContext;
  onOrderPlaced: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [publicCode, setPublicCode] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const isDelivery = orderContext.kind === "delivery";

  async function handlePlaceOrder() {
    if (cart.length === 0) return;
    if (isDelivery) {
      if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
        setError("Renseignez nom, téléphone et adresse.");
        return;
      }
    }
    setError("");
    setSubmitting(true);

    const payload: Record<string, unknown> = {
      items: cart.map((c) => ({
        menuItemId: c.menuItemId,
        quantity: c.quantity,
        comment: c.comment || undefined,
      })),
    };

    if (orderContext.kind === "table") {
      payload.channel = "DINE_IN";
      payload.tableId = orderContext.tableId;
    } else if (orderContext.kind === "takeaway") {
      payload.channel = "TAKEAWAY";
    } else {
      payload.channel = "DELIVERY";
      payload.customerName = customerName.trim();
      payload.customerPhone = customerPhone.trim();
      payload.customerAddress = customerAddress.trim();
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSubmitting(false);
    if (!res.ok) {
      try {
        const data = await res.json();
        setError(data?.error || "Erreur. Réessayez.");
      } catch {
        setError("Erreur. Réessayez.");
      }
      return;
    }
    const data = await res.json();
    setPublicCode(typeof data?.publicCode === "string" ? data.publicCode : null);
    setSuccess(true);
    onOrderPlaced();
    setTimeout(() => {
      onClose();
      setSuccess(false);
      setPublicCode(null);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
    }, 8000);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 flex w-full max-w-md flex-col bg-white shadow-elevated">
        <div className="flex items-center justify-between border-b border-dark-200 p-5">
          <h2 className="text-lg font-bold text-dark-900">Votre commande</h2>
          <button onClick={onClose} className="rounded-xl p-2 text-dark-500 transition hover:bg-dark-100">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 && !success ? (
            <p className="py-10 text-center text-dark-500">Panier vide.</p>
          ) : success ? (
            <div className="py-8 text-center space-y-4">
              <p className="font-medium text-primary-600">Commande envoyée en cuisine !</p>
              {publicCode ? (
                <div className="rounded-2xl border-2 border-primary-200 bg-primary-50 p-6">
                  <p className="text-sm text-dark-600 mb-2">Votre numéro de commande</p>
                  <p className="text-3xl font-bold tracking-wider text-primary-700">{publicCode}</p>
                  <p className="mt-3 text-xs text-dark-500">Présentez ce code au comptoir.</p>
                </div>
              ) : (
                <p className="text-sm text-dark-500">Merci — la cuisine a bien reçu votre commande.</p>
              )}
            </div>
          ) : (
            <>
              {isDelivery && (
                <div className="space-y-3 rounded-xl border border-dark-200 bg-dark-50/50 p-4 mb-2">
                  <p className="text-sm font-semibold text-dark-800">Livraison</p>
                  <input
                    type="text"
                    placeholder="Nom complet"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="input-field text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="input-field text-sm"
                  />
                  <textarea
                    placeholder="Adresse complète"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    rows={3}
                    className="input-field text-sm"
                  />
                </div>
              )}
              {cart.map((c) => (
                <div
                  key={c.menuItemId}
                  className="space-y-2 rounded-xl border border-dark-200 p-4"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-800">{c.name}</span>
                    <span className="text-primary-600 font-medium">
                      {(c.price * c.quantity).toFixed(2)} DA
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdate(c.menuItemId, { quantity: Math.max(0, c.quantity - 1) })}
                      className="w-8 h-8 rounded border border-gray-300 text-gray-600 flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium">{c.quantity}</span>
                    <button
                      onClick={() => onUpdate(c.menuItemId, { quantity: c.quantity + 1 })}
                      className="w-8 h-8 rounded border border-gray-300 text-gray-600 flex items-center justify-center"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemove(c.menuItemId)}
                      className="ml-auto text-sm text-red-600 hover:underline"
                    >
                      Retirer
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Commentaire (optionnel)"
                    value={c.comment}
                    onChange={(e) => onUpdate(c.menuItemId, { comment: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>
              ))}
            </>
          )}
        </div>
        {cart.length > 0 && !success && (
          <div className="border-t border-dark-200 p-5">
            <div className="flex justify-between text-lg font-bold mb-3">
              <span>Total</span>
              <span>{total.toFixed(2)} DA</span>
            </div>
            {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
            <button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="btn-primary w-full py-3.5"
            >
              {submitting ? "Envoi..." : "Valider la commande"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
