"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function AutoRefresh({ intervalSeconds = 10 }: { intervalSeconds?: number }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const refresh = () => router.refresh();

    refresh();

    const id = setInterval(refresh, intervalSeconds * 1000);

    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    const onFocus = () => refresh();

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
    };
  }, [router, intervalSeconds, pathname]);

  return null;
}
