"use client";

import { useEffect } from "react";

function upsertLink(rel: string, href: string) {
  let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

/** Met à jour titre et favicon côté client (navigation SPA + après changement admin). */
export function BrandingHead() {
  useEffect(() => {
    fetch("/api/restaurant-settings")
      .then((r) => r.json())
      .then((d) => {
        const name = typeof d.restaurantName === "string" ? d.restaurantName.trim() : "";
        if (name) document.title = name;

        const logoUrl = typeof d.logoUrl === "string" ? d.logoUrl.trim() : "";
        const v = typeof d.logoUpdatedAt === "string" ? d.logoUpdatedAt : "1";
        const iconHref = logoUrl
          ? `${logoUrl}${logoUrl.includes("?") ? "&" : "?"}v=${encodeURIComponent(v)}`
          : "/api/branding/favicon";

        upsertLink("icon", iconHref);
        upsertLink("shortcut icon", iconHref);
      })
      .catch(() => {});
  }, []);

  return null;
}
