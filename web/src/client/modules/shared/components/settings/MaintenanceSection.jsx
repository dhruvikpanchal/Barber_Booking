"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Construction, Shield, Wrench } from "lucide-react";
import {
  Card,
  FieldLabel,
  Input,
  SaveButton,
  SectionHeader,
  TextArea,
  Toggle,
} from "./TinyPrimitives.jsx";

const DEFAULT_MESSAGE =
  "Iron & Oak is undergoing scheduled maintenance. We'll be back shortly — thank you for your patience.";

export default function MaintenanceSection({
  onToast,
  initialMaintenance,
  onSave,
  loading: externalLoading,
  disabled = false,
}) {
  const [enabled, setEnabled] = useState(initialMaintenance?.enabled ?? false);
  const [message, setMessage] = useState(initialMaintenance?.message || DEFAULT_MESSAGE);
  const [allowAdmin, setAllowAdmin] = useState(true);
  const [scheduled, setScheduled] = useState(false);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [saving, setSaving] = useState(false);

  const busy = disabled || externalLoading || saving;

  useEffect(() => {
    if (initialMaintenance) {
      setEnabled(initialMaintenance.enabled ?? false);
      setMessage(initialMaintenance.message || DEFAULT_MESSAGE);
    }
  }, [initialMaintenance]);

  const handleSave = async () => {
    if (busy) return;

    if (!onSave) {
      onToast?.("Maintenance settings are not available.", "error");
      return;
    }

    setSaving(true);
    try {
      await onSave({ enabled, message });
      onToast(
        enabled
          ? "Maintenance mode enabled. Public visitors will see the banner."
          : "Maintenance settings saved.",
        enabled ? "info" : "success",
      );
    } catch (err) {
      onToast(err?.message ?? "Could not save maintenance settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <SectionHeader
        icon={Construction}
        label="Maintenance Mode"
        sub="Control platform availability during upgrades or incidents"
      />

      {enabled && (
        <div className="mb-6 flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <div>
            <p className="text-sm font-medium text-on-surface">
              Maintenance is active
            </p>
            <p className="mt-0.5 text-xs text-on-surface-variant">
              Customers and barbers see the maintenance screen. Admins can still
              access the dashboard when allowed below.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="rounded-md border border-outline-variant bg-surface-container p-4">
          <Toggle
            checked={enabled}
            onChange={() => setEnabled((v) => !v)}
            label="Enable maintenance mode"
            sub="Shows a full-screen notice to all non-admin users"
            disabled={busy}
          />
        </div>

        <div>
          <FieldLabel>PUBLIC MESSAGE</FieldLabel>
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Message shown on the maintenance page…"
            disabled={busy}
          />
          <p className="mt-2 text-[11px] text-on-surface-variant">
            {message.length}/500 characters recommended
          </p>
        </div>

        <div className="rounded-md border border-outline-variant bg-surface-container p-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-on-surface">
              Access exceptions
            </span>
          </div>
          <Toggle
            checked={allowAdmin}
            onChange={() => setAllowAdmin((v) => !v)}
            label="Allow admin access"
            sub="Admins can sign in and use the dashboard while maintenance is on"
          />
        </div>

        <div className="rounded-md border border-outline-variant bg-surface-container p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-on-surface-variant" />
            <span className="text-sm font-medium text-on-surface">
              Scheduled window
            </span>
          </div>
          <Toggle
            checked={scheduled}
            onChange={() => setScheduled((v) => !v)}
            label="Schedule maintenance"
            sub="Automatically enable and disable at set times (UTC)"
          />
          {scheduled && (
            <div className="grid gap-4 sm:grid-cols-2 pt-1">
              <div>
                <FieldLabel>STARTS</FieldLabel>
                <Input
                  type="datetime-local"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>ENDS</FieldLabel>
                <Input
                  type="datetime-local"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <SaveButton
          onClick={handleSave}
          saving={busy}
          label="SAVE MAINTENANCE"
          icon={Construction}
        />
      </div>
    </Card>
  );
}
