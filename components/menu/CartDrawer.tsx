"use client";

import { useState } from "react";
import type { CartItem } from "./MenuClient";

export function CartDrawer({
  open,
  onClose,
  cart,
  onUpdate,
  onRemove,
  onSubmit,
  tableId,
  onOrderPlaced,
}: {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdate: (menuItemId: string, u: { quantity?: number; comment?: string }) => void;
  onRemove: (menuItemId: string) => void;
  onSubmit: () => void;
  tableId: string;
  onOrderPlaced: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  async function handlePlaceOrder() {
    if (cart.length === 0) return;
    setError("");
    setSubmitting(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableId,
        items: cart.map((c) => ({
          menuItemId: c.menuItemId,
          quantity: c.quantity,
          comment: c.comment || undefined,
        })),
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      try {
        const data = await res.json();
        setError(data?.error || "Erreur. Réessayez.");
      } catch {
        setError(res.status === 404 ? "Table introuvable. Scannez le QR code de votre table." : "Erreur. Réessayez.");
      }
      return;
    }
    setSuccess(true);
    onOrderPlaced();
    setTimeout(() => {
      onClose();
      setSuccess(false);
    }, 1500);
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
            <p className="py-10 text-center font-medium text-primary-600">Commande envoyée en cuisine !</p>
          ) : (
            cart.map((c) => (
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
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Comment (e.g. no onions)"
                  value={c.comment}
                  onChange={(e) => onUpdate(c.menuItemId, { comment: e.target.value })}
                  className="input-field text-sm"
                />
              </div>
            ))
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
              {submitting ? "Sending..." : "Place order"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
