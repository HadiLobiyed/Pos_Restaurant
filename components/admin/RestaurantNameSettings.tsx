"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export function RestaurantNameSettings() {
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoUpdatedAt, setLogoUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyBranding = useCallback((d: Record<string, unknown>) => {
    if (typeof d.restaurantName === "string") setName(d.restaurantName);
    setLogoUrl(typeof d.logoUrl === "string" && d.logoUrl.trim() ? d.logoUrl.trim() : null);
    setLogoUpdatedAt(typeof d.logoUpdatedAt === "string" ? d.logoUpdatedAt : null);
  }, []);

  const syncDocumentBranding = useCallback((restaurantName: string, url: string | null, updatedAt: string | null) => {
    if (restaurantName.trim()) document.title = restaurantName.trim();
    const iconHref = url
      ? `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(updatedAt ?? Date.now().toString())}`
      : "/api/branding/favicon";
    for (const rel of ["icon", "shortcut icon"]) {
      let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = iconHref;
    }
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/restaurant-settings")
      .then((r) => r.json())
      .then((d) => applyBranding(d))
      .catch(() => {
        setName("");
        setLogoUrl(null);
      })
      .finally(() => setLoading(false));
  }, [applyBranding]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/restaurant-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantName: name }),
    });
    setSaving(false);
    if (res.ok) {
      const d = await res.json();
      applyBranding(d);
      syncDocumentBranding(d.restaurantName ?? name, logoUrl, logoUpdatedAt);
      setMessage("Nom enregistré — visible dans l’onglet du navigateur, le POS et les tickets.");
    } else {
      const d = await res.json().catch(() => ({}));
      setMessage(typeof d.error === "string" ? d.error : "Erreur à l'enregistrement.");
    }
  }

  async function uploadLogo(file: File) {
    setUploadingLogo(true);
    setMessage("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/restaurant-settings/logo", { method: "POST", body: fd });
    setUploadingLogo(false);
    if (res.ok) {
      const d = await res.json();
      applyBranding(d);
      syncDocumentBranding(name, d.logoUrl ?? null, d.logoUpdatedAt ?? null);
      setMessage("Logo enregistré — favicon et barre admin mis à jour.");
    } else {
      const d = await res.json().catch(() => ({}));
      const details = typeof d.details === "string" ? ` — ${d.details}` : "";
      setMessage(`${typeof d.error === "string" ? d.error : "Erreur upload."}${details}`);
    }
  }

  async function removeLogo() {
    if (!confirm("Supprimer le logo personnalisé et revenir au logo par défaut ?")) return;
    setUploadingLogo(true);
    setMessage("");
    const res = await fetch("/api/admin/restaurant-settings", { method: "DELETE" });
    setUploadingLogo(false);
    if (res.ok) {
      const d = await res.json();
      applyBranding(d);
      syncDocumentBranding(name, null, null);
      setMessage("Logo supprimé.");
    } else {
      setMessage("Impossible de supprimer le logo.");
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadLogo(file);
    e.target.value = "";
  }

  const logoPreview = logoUrl
    ? `${logoUrl}${logoUrl.includes("?") ? "&" : "?"}v=${encodeURIComponent(logoUpdatedAt ?? "1")}`
    : null;

  if (loading) {
    return (
      <div className="mb-8 rounded-2xl border border-dark-200 bg-white p-6 text-dark-500 shadow-card">
        Chargement…
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-2xl border border-dark-200 bg-white p-6 shadow-card">
      <h2 className="mb-1 text-lg font-semibold text-dark-900">Identité du restaurant</h2>
      <p className="mb-6 text-sm text-dark-600">
        Le nom et le logo s&apos;affichent dans l&apos;onglet du navigateur, la barre latérale admin, le POS et les
        tickets.
      </p>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <form onSubmit={saveName} className="min-w-0 flex-1">
          <label className="mb-1 block text-xs font-semibold text-dark-600">Nom du restaurant</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            required
            className="mb-4 w-full max-w-md rounded-xl border border-dark-200 px-3 py-2 text-sm text-dark-900 focus:border-primary-400 focus:outline-none"
            placeholder="Mon restaurant"
          />
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Enregistrement…" : "Enregistrer le nom"}
          </button>
        </form>

        <div className="w-full max-w-xs shrink-0">
          <label className="mb-2 block text-xs font-semibold text-dark-600">Logo (favicon)</label>
          <div className="flex items-center gap-4 rounded-xl border border-dark-200 bg-dark-50/50 p-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dark-200 bg-white">
              {logoPreview ? (
                <Image src={logoPreview} alt="Logo" width={64} height={64} className="h-full w-full object-contain" unoptimized />
              ) : (
                <span className="text-2xl font-bold text-primary-600">{name.charAt(0).toUpperCase() || "R"}</span>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onFileChange}
              />
              <button
                type="button"
                disabled={uploadingLogo}
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-xl border border-dark-300 bg-white px-3 py-2 text-sm font-medium text-dark-800 hover:bg-dark-50 disabled:opacity-50"
              >
                {uploadingLogo ? "Envoi…" : "Choisir un logo"}
              </button>
              {logoUrl && (
                <button
                  type="button"
                  disabled={uploadingLogo}
                  onClick={removeLogo}
                  className="w-full text-xs text-red-600 hover:underline disabled:opacity-50"
                >
                  Supprimer le logo
                </button>
              )}
              <p className="text-[11px] leading-snug text-dark-500">JPG, PNG ou WebP — max 5 Mo. Stocké sur Supabase.</p>
            </div>
          </div>
        </div>
      </div>

      {message && <p className="mt-4 text-sm text-dark-600">{message}</p>}
    </div>
  );
}
