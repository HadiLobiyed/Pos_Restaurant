"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { parseTableIdFromScan } from "@/lib/tableQr";

type Props = {
  onScan: (tableId: string) => void;
  onError?: (message: string) => void;
};

export function QrScanner({ onScan, onError }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const [active, setActive] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [supportsCamera, setSupportsCamera] = useState(true);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setActive(false);
  }, []);

  const handleDecoded = useCallback(
    (text: string) => {
      const tableId = parseTableIdFromScan(text);
      if (!tableId) {
        onError?.("QR code non reconnu. Scannez le code affiché sur votre table.");
        return;
      }
      stopCamera();
      onScan(tableId);
    },
    [onError, onScan, stopCamera]
  );

  const startCamera = useCallback(async () => {
    setSupportsCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setActive(true);

      const Detector = typeof window !== "undefined" ? (window as unknown as { BarcodeDetector?: new (opts: { formats: string[] }) => { detect: (src: ImageBitmapSource) => Promise<Array<{ rawValue: string }>> } }).BarcodeDetector : undefined;

      if (!Detector) {
        onError?.("Votre navigateur ne permet pas la lecture automatique. Collez le lien du QR ci-dessous.");
        setSupportsCamera(false);
        return;
      }

      const detector = new Detector({ formats: ["qr_code"] });

      const tick = async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes.length > 0 && codes[0].rawValue) {
            handleDecoded(codes[0].rawValue);
            return;
          }
        } catch {
          /* frame ignorée */
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setSupportsCamera(false);
      onError?.("Accès caméra refusé ou indisponible. Collez le lien du QR ci-dessous.");
    }
  }, [handleDecoded, onError]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  function submitManual(e: React.FormEvent) {
    e.preventDefault();
    handleDecoded(manualUrl);
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border-2 border-white/20 bg-black/40">
        <video ref={videoRef} className="aspect-square w-full object-cover" playsInline muted />
        {active && supportsCamera && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-48 w-48 rounded-xl border-2 border-primary-400/80" />
          </div>
        )}
        {!supportsCamera && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-900/80 p-4 text-center text-sm text-dark-200">
            Caméra indisponible — utilisez le champ ci-dessous.
          </div>
        )}
      </div>
      <p className="text-center text-xs text-dark-300">
        Placez le QR code de votre table dans le cadre.
      </p>
      <form onSubmit={submitManual} className="space-y-2">
        <label className="block text-xs font-semibold text-dark-200">Ou collez le lien du QR</label>
        <input
          type="text"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          placeholder="https://…/menu?table=…"
          className="w-full rounded-xl border border-white/20 bg-dark-900/50 px-3 py-2 text-sm text-white placeholder:text-dark-500 focus:border-primary-400 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full rounded-xl border border-white/30 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          Valider le lien
        </button>
      </form>
      {supportsCamera && (
        <button
          type="button"
          onClick={() => (active ? stopCamera() : startCamera())}
          className="w-full rounded-xl border border-white/20 py-2 text-xs text-dark-300 hover:bg-white/5"
        >
          {active ? "Arrêter la caméra" : "Relancer la caméra"}
        </button>
      )}
    </div>
  );
}
