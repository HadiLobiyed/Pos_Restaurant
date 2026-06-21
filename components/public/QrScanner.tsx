"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { parseTableIdFromScan } from "@/lib/tableQr";

type Props = {
  onScan: (tableId: string) => void;
  onError?: (message: string) => void;
};

const SCAN_INTERVAL_MS = 200;

type BarcodeDetectorLike = {
  detect: (src: ImageBitmapSource) => Promise<Array<{ rawValue: string }>>;
};

export function QrScanner({ onScan, onError }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const scanningRef = useRef(false);
  const lastScanRef = useRef(0);
  const detectorRef = useRef<BarcodeDetectorLike | null>(null);
  const [active, setActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [manualUrl, setManualUrl] = useState("");

  const stopCamera = useCallback(() => {
    scanningRef.current = false;
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

  const decodeWithJsQr = useCallback(
    (video: HTMLVideoElement, canvas: HTMLCanvasElement): string | null => {
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (w <= 0 || h <= 0) return null;

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return null;

      ctx.drawImage(video, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "attemptBoth",
      });
      return code?.data ?? null;
    },
    []
  );

  const scanFrame = useCallback(async () => {
    if (!scanningRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    const now = performance.now();
    if (now - lastScanRef.current >= SCAN_INTERVAL_MS) {
      lastScanRef.current = now;
      try {
        const detector = detectorRef.current;
        if (detector) {
          const codes = await detector.detect(video);
          if (codes.length > 0 && codes[0].rawValue) {
            handleDecoded(codes[0].rawValue);
            return;
          }
        } else {
          const value = decodeWithJsQr(video, canvas);
          if (value) {
            handleDecoded(value);
            return;
          }
        }
      } catch {
        /* frame ignorée */
      }
    }

    rafRef.current = requestAnimationFrame(scanFrame);
  }, [decodeWithJsQr, handleDecoded]);

  const startCamera = useCallback(async () => {
    setCameraError(false);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(true);
      onError?.("Accès caméra indisponible sur ce navigateur. Collez le lien du QR ci-dessous.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      video.srcObject = stream;
      video.playsInline = true;
      await video.play();

      const BarcodeDetectorCtor = (
        window as unknown as {
          BarcodeDetector?: new (opts: { formats: string[] }) => BarcodeDetectorLike;
        }
      ).BarcodeDetector;
      detectorRef.current = BarcodeDetectorCtor
        ? new BarcodeDetectorCtor({ formats: ["qr_code"] })
        : null;

      setActive(true);
      scanningRef.current = true;
      lastScanRef.current = 0;
      rafRef.current = requestAnimationFrame(scanFrame);
    } catch {
      setCameraError(true);
      onError?.("Accès caméra refusé ou indisponible. Collez le lien du QR ci-dessous.");
    }
  }, [onError, scanFrame]);

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
        <video ref={videoRef} className="aspect-square w-full object-cover" playsInline muted autoPlay />
        <canvas ref={canvasRef} className="hidden" aria-hidden />
        {active && !cameraError && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-48 w-48 rounded-xl border-2 border-primary-400/80" />
          </div>
        )}
        {cameraError && (
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
      {!cameraError && (
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
