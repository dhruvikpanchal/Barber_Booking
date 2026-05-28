"use client";

import { useState } from "react";
import { Scissors } from "lucide-react";
import DangerSection from "@/components/common/settings/DangerSection.jsx";
import PasswordSection from "@/components/common/settings/PasswordSection.jsx";
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
    <div className="mx-auto max-w-6xl space-y-8 pb-4 bg-background text-on-surface">
      {/* ── Page Header ── */}
      <header className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Scissors className="h-4 w-4 text-primary" />
            <p className="font-label-caps text-primary">Barber · Settings</p>
          </div>

          <h1 className="font-serif text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
            Settings
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant">
            Manage your account security, preferences, and barber workspace
            settings.
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* ── Left: Vertical Nav ── */}
          <nav className="md:w-52 shrink-0">
            <div
              className="md:sticky md:top-24 space-y-0.5 overflow-x-auto md:overflow-x-visible
              flex md:flex-col flex-row gap-1 md:gap-0.5"
            >
              {TABS.map(({ id, icon: Icon, label }) => {
                const isDanger = id === "danger";
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActive(id)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all
                      whitespace-nowrap text-left
                      ${
                        active === id
                          ? isDanger
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-primary/10 text-primary border border-primary/20"
                          : `border border-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface
                           ${isDanger ? "hover:text-red-400" : ""}`
                      }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{label}</span>
                    {active === id && (
                      <div className="ml-auto w-1 h-1 rounded-full bg-current opacity-60 hidden md:block" />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* ── Right: Content ── */}
          <div className="flex-1 min-w-0">
            {active === "password" && <PasswordSection onToast={showToast} />}
            {active === "danger" && <DangerSection onToast={showToast} />}
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
