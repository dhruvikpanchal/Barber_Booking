"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";

export function Badge({ label, color = "primary" }) {
  const styles = {
    primary: "bg-primary/10 text-primary border-primary/20",
    pending:
      "bg-status-pending/10 text-status-pending border-status-pending/20",
    cancelled:
      "bg-status-cancelled/10 text-status-cancelled border-status-cancelled/20",
    confirmed:
      "bg-status-confirmed/10 text-status-confirmed border-status-confirmed/20",
    yellow: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold tracking-wide ${styles[color]}`}
    >
      {label}
    </span>
  );
}

export function ActionButtons({ id, type, onAction }) {
  const [state, setState] = useState("idle");

  const handle = async (action) => {
    setState(`loading-${action}`);
    await new Promise((r) => setTimeout(r, 750));
    setState(action === "accept" ? "accepted" : "declined");
    onAction(id, action);
  };

  if (state === "accepted")
    return (
      <div className="flex items-center gap-1.5 text-status-confirmed text-xs font-medium">
        <Check className="w-3.5 h-3.5" /> Accepted
      </div>
    );
  if (state === "declined")
    return (
      <div className="flex items-center gap-1.5 text-status-cancelled text-xs font-medium">
        <X className="w-3.5 h-3.5" /> Declined
      </div>
    );

  const isModification = type === "modification";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handle("decline")}
        disabled={state.startsWith("loading")}
        className="flex items-center gap-1.5 rounded border border-outline-variant px-3 py-1.5 text-xs
            font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface
            transition-all active:scale-95 disabled:opacity-50"
      >
        {state === "loading-decline" ? (
          <span className="w-3 h-3 border border-current/30 border-t-current rounded-full animate-spin" />
        ) : (
          <X className="w-3.5 h-3.5" />
        )}
        {isModification ? "Deny" : "Decline"}
      </button>
      <button
        onClick={() => handle("accept")}
        disabled={state.startsWith("loading")}
        className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs
            font-semibold text-on-primary hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
      >
        {state === "loading-accept" ? (
          <span className="w-3 h-3 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
        ) : (
          <Check className="w-3.5 h-3.5" />
        )}
        {isModification ? "Approve" : "Accept"}
      </button>
    </div>
  );
}
