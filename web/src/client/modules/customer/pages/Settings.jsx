"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Scissors } from "lucide-react";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import { clearAuthSession } from "@/client/lib/auth/session.js";
import DangerSection from "@/client/modules/shared/components/settings/DangerSection.jsx";
import PasswordSection from "@/client/modules/shared/components/settings/PasswordSection.jsx";
import { TABS } from "@/client/modules/shared/constants/settings.js";
import { customerHook } from "@/client/modules/customer/hooks/customerQuery.jsx";

export default function Settings() {
  const router = useRouter();
  const [active, setActive] = useState("password");

  const passwordMutation = customerHook.Settings.useUpdatePassword();
  const deleteMutation = customerHook.Settings.useDeleteAccount();

  const busy = passwordMutation.isPending || deleteMutation.isPending;

  const showToast = (message, type = "success") => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else toast(message);
  };

  const handleUpdatePassword = useCallback(
    (data) => passwordMutation.mutateAsync(data),
    [passwordMutation],
  );

  const handleDeleteAccount = useCallback(async () => {
    await deleteMutation.mutateAsync();
    clearAuthSession();
    router.push(routes.auth.login);
  }, [deleteMutation, router]);

  return (
    <div className="text-on-surface mx-auto w-full max-w-6xl min-w-0 space-y-6 pb-28 md:space-y-8 md:pb-8">
      <header className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Scissors className="text-primary h-4 w-4" />
            <p className="font-label-caps text-primary">Customer · Settings</p>
          </div>

          <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
            Settings
          </h1>

          <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
            Manage your account security and preferences.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <nav className="shrink-0 md:w-52">
            <div className="flex flex-row gap-1 space-y-0.5 overflow-x-auto pb-1 md:sticky md:top-4 md:flex-col md:gap-0.5 md:overflow-x-visible md:pb-0">
              {TABS.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => !busy && setActive(id)}
                  disabled={busy}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium whitespace-nowrap transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                    active === id
                      ? id === "danger"
                        ? "border border-red-500/20 bg-red-500/10 text-red-400"
                        : "bg-primary/10 text-primary border-primary/20 border"
                      : `text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border border-transparent ${id === "danger" ? "hover:text-red-400" : ""}`
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                  {active === id && (
                    <div className="ml-auto hidden h-1 w-1 rounded-full bg-current opacity-60 md:block" />
                  )}
                </button>
              ))}
            </div>
          </nav>

          <div className="min-w-0 flex-1 space-y-6">
            {active === "password" && (
              <PasswordSection
                onToast={showToast}
                onSubmit={handleUpdatePassword}
                loading={passwordMutation.isPending}
              />
            )}
            {active === "danger" && (
              <DangerSection
                onToast={showToast}
                onDelete={handleDeleteAccount}
                deleting={deleteMutation.isPending}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
