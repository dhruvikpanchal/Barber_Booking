"use client";

import { useState } from "react";
import { Lock, Check, ShieldCheck, X } from "lucide-react";
import {
  Card,
  SectionHeader,
  FieldLabel,
  PasswordInput,
} from "./TinyPrimitives.jsx";

export default function PasswordSection({ onToast, onSubmit, loading: externalLoading }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const match = form.next === form.confirm;
  const valid = form.current && form.next.length >= 8 && match;
  const busy = externalLoading ?? loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid || busy) return;

    if (!onSubmit) {
      onToast?.("Password update is not available.", "error");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        currentPassword: form.current,
        newPassword: form.next,
      });
      setForm({ current: "", next: "", confirm: "" });
      onToast("Password updated successfully.", "success");
    } catch (err) {
      onToast(err?.message ?? "Could not update password.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <SectionHeader
        icon={Lock}
        label="Change password"
        sub="Update your account login credentials"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FieldLabel>CURRENT PASSWORD</FieldLabel>
          <PasswordInput
            value={form.current}
            onChange={(e) => setForm({ ...form, current: e.target.value })}
            placeholder="Enter current password"
          />
        </div>

        <div className="border-t border-outline-variant" />

        <div>
          <FieldLabel>NEW PASSWORD</FieldLabel>
          <PasswordInput
            value={form.next}
            onChange={(e) => setForm({ ...form, next: e.target.value })}
            placeholder="Min. 8 characters"
          />
        </div>

        <div>
          <FieldLabel>CONFIRM NEW PASSWORD</FieldLabel>
          <PasswordInput
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            placeholder="Re-enter new password"
          />
          {form.confirm && !match && (
            <p className="mt-1.5 flex items-center gap-1 text-[11px] text-error">
              <X className="h-3 w-3" aria-hidden />
              Passwords do not match
            </p>
          )}
          {form.confirm && match && form.confirm.length >= 8 && (
            <p className="mt-1.5 flex items-center gap-1 text-[11px] text-status-confirmed">
              <Check className="h-3 w-3" aria-hidden />
              Passwords match
            </p>
          )}
        </div>

        <div className="flex items-start gap-3 rounded-md border border-outline-variant bg-surface-container px-4 py-3">
          <ShieldCheck
            className="mt-0.5 h-4 w-4 shrink-0 text-primary"
            aria-hidden
          />
          <p className="text-[11px] text-on-surface-variant">
            Use a strong, unique password. Changes apply to your next sign-in.
          </p>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={!valid || busy}
            className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-xs font-semibold tracking-[0.12em] text-on-primary transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {busy ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-on-primary/30 border-t-on-primary" />
                SAVING…
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" aria-hidden />
                UPDATE PASSWORD
              </>
            )}
          </button>
        </div>
      </form>
    </Card>
  );
}
