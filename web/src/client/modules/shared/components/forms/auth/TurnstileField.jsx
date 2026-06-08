"use client";

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
  if (!isTurnstileEnabled()) return null;

  return (
    <div className={className}>
      <Turnstile
        siteKey={TURNSTILE_SITE_KEY}
        onSuccess={onToken}
        onExpire={() => {
          onToken("");
          onExpire?.();
        }}
        options={{ theme: "dark", size: "flexible" }}
      />
    </div>
  );
}
