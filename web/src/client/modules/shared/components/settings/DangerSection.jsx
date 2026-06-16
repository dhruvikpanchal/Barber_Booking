"use client";

import { useState } from "react";
import { Trash2, Check, AlertTriangle } from "lucide-react";
import { Card, SectionHeader } from "./TinyPrimitives.jsx";

export default function DangerSection({ onToast, onDelete, deleting: externalDeleting }) {
  const [phase, setPhase] = useState("idle"); // idle | confirm | typing | deleting | done
  const [typed, setTyped] = useState("");
  const CONFIRM_PHRASE = "DELETE MY ACCOUNT";
  const deleting = phase === "deleting" || externalDeleting;

  const handleDelete = async () => {
    if (typed !== CONFIRM_PHRASE || deleting) return;
    setPhase("deleting");

    if (!onDelete) {
      setPhase("typing");
      onToast?.("Account deletion is not available.", "error");
      return;
    }

    try {
      await onDelete();
      setPhase("done");
    } catch (err) {
      setPhase("typing");
      onToast?.(err?.message ?? "Could not delete account.", "error");
    }
  };

  return (
    <Card className="border-red-500/20 bg-red-500/5">
      <SectionHeader
        icon={Trash2}
        label="Danger Zone"
        sub="Irreversible and destructive actions"
      />

      {phase === "done" ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-sm text-on-surface font-semibold">
            Account deletion scheduled
          </p>
          <p className="text-xs text-on-surface-variant mt-2 max-w-xs mx-auto">
            Your account will be permanently deleted in 30 days. You can cancel
            by logging in and visiting settings.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Delete account card */}
          <div className="rounded-md border border-red-500/20 bg-surface-container overflow-hidden">
            <div className="flex items-start justify-between gap-4 p-4 flex-col sm:flex-row">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface">
                  Delete account
                </p>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Permanently delete your Iron & Oak account, all bookings,
                  reviews, and personal data. This action cannot be undone.
                </p>
              </div>
              {phase === "idle" && (
                <button
                  type="button"
                  onClick={() => setPhase("confirm")}
                  className="shrink-0 flex items-center gap-1.5 rounded border border-red-500/40 px-3 py-2 text-xs font-medium text-red-400
                      hover:bg-red-500/10 transition-all active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              )}
            </div>

            {/* Confirmation panel */}
            {(phase === "confirm" || phase === "typing") && (
              <div className="border-t border-red-500/20 bg-red-500/5 p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-red-300">
                      Before you continue
                    </p>
                    <ul className="text-[11px] text-on-surface-variant space-y-1 list-disc list-inside">
                      <li>All your upcoming bookings will be cancelled</li>
                      <li>Your reviews and ratings will be removed</li>
                      <li>You will lose access to all loyalty points</li>
                      <li>This account cannot be recovered after 30 days</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] text-on-surface-variant mb-2">
                    Type{" "}
                    <span className="font-mono font-bold text-red-300">
                      {CONFIRM_PHRASE}
                    </span>{" "}
                    to confirm
                  </p>
                  <input
                    type="text"
                    value={typed}
                    onChange={(e) => {
                      setTyped(e.target.value);
                      setPhase("typing");
                    }}
                    placeholder={CONFIRM_PHRASE}
                    className="w-full rounded border border-red-500/30 bg-surface-container px-3 py-2.5 text-sm
                        font-mono text-on-surface placeholder:text-on-surface-variant/30
                        focus:border-red-400 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPhase("idle");
                      setTyped("");
                    }}
                    className="flex-1 rounded border border-outline-variant px-4 py-2.5 text-xs font-medium text-on-surface-variant
                        hover:bg-surface-container-high transition-colors active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={typed !== CONFIRM_PHRASE || deleting}
                    className="flex-1 flex items-center justify-center gap-2 rounded bg-red-600 px-4 py-2.5 text-xs font-semibold
                        text-white hover:bg-red-700 transition-colors active:scale-95
                        disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {deleting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Deleting…
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        Confirm Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
