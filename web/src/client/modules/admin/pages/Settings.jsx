"use client";

import { useState } from "react";
import MaintenanceSection from "@/client/modules/shared/components/common/settings/MaintenanceSection.jsx";
import PasswordSection from "@/client/modules/shared/components/common/settings/PasswordSection.jsx";
import { Toast } from "@/client/modules/shared/components/common/settings/TinyPrimitives.jsx";
import { SETTINGS_TABS } from "@/client/modules/admin/constants/admin.js";

export default function Settings() {
  const [active, setActive] = useState("maintenance");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

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
          {active === "maintenance" && <MaintenanceSection onToast={showToast} />}
          {active === "password" && <PasswordSection onToast={showToast} />}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
