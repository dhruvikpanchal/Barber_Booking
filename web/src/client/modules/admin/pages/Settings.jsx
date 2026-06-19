"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import PasswordSection from "@/client/modules/shared/components/settings/PasswordSection.jsx";
import {
  Card,
  Toggle,
} from "@/client/modules/shared/components/settings/TinyPrimitives.jsx";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import { ADMIN_ALERTS, DIGEST_OPTIONS } from "@/client/modules/admin/constants/adminConstants.js";

function AlertPreferencesSection() {
  const { data, isPending, isError, refetch } = adminHook.Settings.useSettings();
  const updateMutation = adminHook.Settings.useUpdateAlertPreferences();
  const [alerts, setAlerts] = useState({});
  const [digests, setDigests] = useState({});

  useEffect(() => {
    if (data?.alerts) setAlerts(data.alerts);
    if (data?.digests) setDigests(data.digests);
  }, [data]);

  const busy = isPending || updateMutation.isPending;

  const persist = useCallback(
    async (nextAlerts, nextDigests) => {
      try {
        const result = await updateMutation.mutateAsync({
          alerts: nextAlerts,
          digests: nextDigests,
        });
        if (result?.alerts) setAlerts(result.alerts);
        if (result?.digests) setDigests(result.digests);
        toast.success("Notification preferences saved.");
      } catch {
        toast.error("Could not save notification preferences.");
      }
    },
    [updateMutation],
  );

  function toggleAlert(key) {
    const next = { ...alerts, [key]: !alerts[key] };
    setAlerts(next);
    persist(next, digests);
  }

  function toggleDigest(key) {
    const next = { ...digests, [key]: !digests[key] };
    setDigests(next);
    persist(alerts, next);
  }

  if (isError) {
    return (
      <Card>
        <p className="text-on-surface text-sm font-medium">Could not load alert preferences.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-primary mt-2 text-sm font-semibold hover:underline"
        >
          Try again
        </button>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-on-surface text-sm font-semibold tracking-wide">
          Notification alerts
        </h2>
        <p className="text-on-surface-variant mt-0.5 text-xs">
          Choose which platform events trigger admin notifications and email digests.
        </p>
      </div>

      <div className="space-y-5">
        <p className="font-label-caps text-on-surface-variant text-[11px]">Real-time alerts</p>
        {ADMIN_ALERTS.map(({ key, label, sub, icon: Icon }) => (
          <div key={key} className="flex items-start gap-3">
            {Icon ? (
              <span className="bg-primary/15 text-primary mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
            ) : null}
            <Toggle
              checked={Boolean(alerts[key])}
              onChange={() => toggleAlert(key)}
              label={label}
              sub={sub}
              disabled={busy}
            />
          </div>
        ))}
      </div>

      <div className="border-outline-variant/60 mt-8 space-y-5 border-t pt-6">
        <p className="font-label-caps text-on-surface-variant text-[11px]">Email digests</p>
        {DIGEST_OPTIONS.map(({ key, label, sub }) => (
          <Toggle
            key={key}
            checked={Boolean(digests[key])}
            onChange={() => toggleDigest(key)}
            label={label}
            sub={sub}
            disabled={busy}
          />
        ))}
      </div>
    </Card>
  );
}

export default function Settings() {
  const passwordMutation = adminHook.Settings.useUpdatePassword();

  const handleUpdatePassword = useCallback(
    async (data) => {
      const result = await passwordMutation.mutateAsync(data);
      return result;
    },
    [passwordMutation],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-4">
      <div className="max-w-3xl">
        <header className="space-y-2">
          <p className="font-label-caps text-primary">Admin · System</p>

          <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
            Platform Settings
          </h1>

          <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
            Manage security settings, notification preferences, and administrator account controls.
          </p>
        </header>
      </div>

      <div className="grid w-full max-w-3xl gap-6">
        <AlertPreferencesSection />
        <PasswordSection
          onSubmit={handleUpdatePassword}
          loading={passwordMutation.isPending}
          onToast={(message, type = "success") => {
            if (type === "error") toast.error(message);
            else toast.success(message);
          }}
        />
      </div>
    </div>
  );
}
