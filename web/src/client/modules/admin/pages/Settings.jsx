"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import MaintenanceSection from "@/client/modules/shared/components/settings/MaintenanceSection.jsx";
import PasswordSection from "@/client/modules/shared/components/settings/PasswordSection.jsx";
import { SETTINGS_TABS } from "@/client/modules/admin/constants/adminConstants.js";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";

export default function Settings() {
  const [active, setActive] = useState("maintenance");

  const settingsQuery = adminHook.Settings.useSettings();
  const maintenanceMutation = adminHook.Settings.useUpdateMaintenanceSettings();
  const passwordMutation = adminHook.Settings.useUpdatePassword();

  const busy =
    settingsQuery.isPending || maintenanceMutation.isPending || passwordMutation.isPending;

  useEffect(() => {
    if (settingsQuery.isError) {
      toast.error(settingsQuery.error?.message || "Could not load settings.");
    }
  }, [settingsQuery.isError, settingsQuery.error]);

  const handleSaveMaintenance = useCallback(
    async (data) => {
      const result = await maintenanceMutation.mutateAsync(data);
      await settingsQuery.refetch();
      return result;
    },
    [maintenanceMutation, settingsQuery],
  );

  const handleUpdatePassword = useCallback(
    async (data) => {
      const result = await passwordMutation.mutateAsync(data);
      return result;
    },
    [passwordMutation],
  );

  if (settingsQuery.isPending && !settingsQuery.data) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 pb-4">
        <div className="bg-surface-container h-24 animate-pulse rounded-xl" />
        <div className="bg-surface-container h-64 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (settingsQuery.isError && !settingsQuery.data) {
    return (
      <div className="text-on-surface mx-auto max-w-7xl py-16 text-center">
        <p className="font-medium">Could not load settings.</p>
        <button
          type="button"
          onClick={() => settingsQuery.refetch()}
          disabled={busy}
          className="text-primary mt-3 text-sm font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-4">
      <div className="max-w-6xl">
        <header className="space-y-2">
          <p className="font-label-caps text-primary">Admin · System</p>

          <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
            Platform Settings
          </h1>

          <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
            Configure platform-wide preferences, maintenance mode, security settings, and
            administrator account controls.
          </p>
        </header>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <nav className="shrink-0 md:w-52">
          <div className="flex flex-row gap-1 overflow-x-auto pb-1 md:flex-col md:gap-0.5 md:overflow-x-visible md:pb-0">
            {SETTINGS_TABS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className={`flex items-center gap-3 rounded-md border px-3 py-2.5 text-left text-sm font-medium whitespace-nowrap transition-all ${
                  active === id
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-transparent"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span>{label}</span>
                {active === id && (
                  <div className="ml-auto hidden h-1 w-1 rounded-full bg-current opacity-60 md:block" />
                )}
              </button>
            ))}
          </div>
        </nav>

        <div className="min-w-0 flex-1">
          {active === "maintenance" && (
            <MaintenanceSection
              initialMaintenance={settingsQuery.data?.maintenance}
              onSave={handleSaveMaintenance}
              loading={maintenanceMutation.isPending}
              disabled={busy}
              onToast={(message, type = "success") => {
                if (type === "error") toast.error(message);
                else if (type === "info") toast.info(message);
                else toast.success(message);
              }}
            />
          )}
          {active === "password" && (
            <PasswordSection
              onSubmit={handleUpdatePassword}
              loading={passwordMutation.isPending}
              onToast={(message, type = "success") => {
                if (type === "error") toast.error(message);
                else toast.success(message);
              }}
            />
          )}
        </div>
      </div>

      {settingsQuery.isPending && (
        <p className="text-on-surface-variant flex items-center justify-center gap-2 text-xs">
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          Refreshing settings…
        </p>
      )}
    </div>
  );
}
