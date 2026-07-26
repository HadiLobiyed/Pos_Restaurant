"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadMenuImageViaApi } from "@/lib/upload-menu-image";

type Props = {
  label: string;
  url: string;
  alt?: string;
  onUrlChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
  showAlt?: boolean;
};

export function HomePageImageField({ label, url, alt, onUrlChange, onAltChange, showAlt }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File) {
    setUploading(true);
    setError("");
    const result = await uploadMenuImageViaApi(file);
    setUploading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.path) onUrlChange(result.path);
  }

  return (
    <div className="rounded-xl border border-dark-200 bg-dark-50/40 p-4">
      <p className="mb-2 text-xs font-semibold text-dark-700">{label}</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {url ? (
          <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg border border-dark-200 bg-white">
            <Image src={url} alt="" fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="flex h-24 w-32 shrink-0 items-center justify-center rounded-lg border border-dashed border-dark-300 bg-white text-xs text-dark-400">
            Aucune image
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <input
            type="url"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://… ou uploadez une image"
            className="w-full rounded-lg border border-dark-200 px-3 py-2 text-sm"
          />
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }} />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-dark-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-dark-50 disabled:opacity-50"
          >
            {uploading ? "Envoi…" : "Uploader une photo"}
          </button>
          {showAlt && onAltChange && (
            <input
              type="text"
              value={alt ?? ""}
              onChange={(e) => onAltChange(e.target.value)}
              placeholder="Description de l'image (accessibilité)"
              className="w-full rounded-lg border border-dark-200 px-3 py-2 text-sm"
            />
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-dark-600">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-dark-200 px-3 py-2 text-sm"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-dark-200 px-3 py-2 text-sm"
        />
      )}
    </label>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-2xl border border-dark-200 bg-white shadow-card" open>
      <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-dark-900 marker:content-none [&::-webkit-details-marker]:hidden">
        {title}
      </summary>
      <div className="space-y-4 border-t border-dark-100 px-5 py-4">{children}</div>
    </details>
  );
}
