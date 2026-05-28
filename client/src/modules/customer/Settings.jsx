"use client";

import { useState } from "react";
import { Scissors } from "lucide-react";
import PasswordSection from "@/components/common/settings/PasswordSection.jsx";
import DangerZoneSection from "@/components/common/settings/DangerSection.jsx";
import { Toast } from "@/components/common/settings/TinyPrimitives.jsx";
import { TABS } from "../../constants/shared/settings.js";

export default function Settings() {
  const [active, setActive] = useState("password");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="text-on-surface mx-auto w-full max-w-6xl min-w-0 space-y-6 pb-28 md:space-y-8 md:pb-8">
      {/* Page header */}
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
          {/* Sidebar nav */}
          <nav className="shrink-0 md:w-52">
            <div className="flex flex-row gap-1 space-y-0.5 overflow-x-auto pb-1 md:sticky md:top-4 md:flex-col md:gap-0.5 md:overflow-x-visible md:pb-0">
              {TABS.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActive(id)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium whitespace-nowrap transition-all ${
                    active === id
                      ? "bg-primary/10 text-primary border-primary/20 border"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border border-transparent"
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

          {/* Main content */}
          <div className="min-w-0 flex-1 space-y-6">
            {active === "password" && <PasswordSection onToast={showToast} />}
            {active === "danger" && <DangerZoneSection onToast={showToast} />}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
