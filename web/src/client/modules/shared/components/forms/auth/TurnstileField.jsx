"use client";

import { useEffect, useRef, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { isTurnstileEnabled, TURNSTILE_SITE_KEY } from "@/client/lib/turnstile.js";

/**
 * @param {{
 *   onToken: (token: string) => void;
 *   onExpire?: () => void;
 *   className?: string;
 * }} props
 */
export default function TurnstileField({ onToken, onExpire, className = "" }) {
  const containerRef = useRef(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (!isTurnstileEnabled()) return;

    const node = containerRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldMount(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!isTurnstileEnabled()) return null;

  return (
    <div ref={containerRef} className={className} aria-hidden={!shouldMount}>
      {shouldMount ? (
        <Turnstile
          siteKey={TURNSTILE_SITE_KEY}
          onSuccess={onToken}
          onExpire={() => {
            onToken("");
            onExpire?.();
          }}
          options={{ theme: "dark", size: "flexible" }}
        />
      ) : (
        <div className="h-[65px] w-full" />
      )}
    </div>
  );
}
