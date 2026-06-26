"use client";

import { createPortal } from "react-dom";
import { format } from "date-fns";
import {
  KITCHEN_STATION_LABELS,
  type KitchenStation,
} from "@/lib/kitchenStations";

type KitchenItem = {
  quantity: number;
  comment: string | null;
  menuItem: { name: string };
  supplements?: Array<{ name: string }>;
};

type KitchenPrintTicketProps = {
  headline: string;
  createdAt: string;
  station: KitchenStation;
  items: KitchenItem[];
};

export function KitchenPrintTicket({
  headline,
  createdAt,
  station,
  items,
}: KitchenPrintTicketProps) {
  const ticket = (
    <div className="ticket-print-root fixed inset-0 z-[200] pointer-events-none opacity-0 print:opacity-100 print:pointer-events-auto">
      <div className="ticket-modal-container bg-white font-mono text-sm text-dark-800">
        <div className="ticket-content-print p-4">
          <div className="text-center border-b border-dark-300 pb-2 mb-3">
            <p className="font-bold text-base">{KITCHEN_STATION_LABELS[station]}</p>
            <p className="text-xs text-dark-600">Bon de préparation</p>
          </div>
          <p className="font-bold text-base">{headline}</p>
          <p className="text-dark-600 text-xs mt-1">
            {format(new Date(createdAt), "dd/MM/yyyy HH:mm:ss")}
          </p>
          <ul className="mt-4 space-y-2 border-t border-dark-200 pt-3">
            {items.map((oi, idx) => (
              <li key={idx} className="border-b border-dark-100 pb-2 last:border-0">
                <p className="font-semibold">
                  {oi.quantity}x {oi.menuItem.name}
                </p>
                {oi.comment && (
                  <p className="text-xs text-amber-800 mt-0.5">Note : {oi.comment}</p>
                )}
                {Array.isArray(oi.supplements) && oi.supplements.length > 0 && (
                  <p className="text-xs text-dark-600 mt-0.5">
                    + {oi.supplements.map((s) => s.name).join(", ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(ticket, document.body);
}
