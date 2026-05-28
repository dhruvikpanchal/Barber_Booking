/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Logo from "@/components/layout/primitives/Logo";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

const SidebarCtx = createContext({ collapsed: false, setCollapsed: () => {} });
export const useSidebar = () => useContext(SidebarCtx);

export function SidebarProvider({
  storageKey = "io.sidebar.collapsed",
  children,
}) {
  const [collapsed, setCollapsedState] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(storageKey);
    if (stored != null) setCollapsedState(stored === "1");
  }, [storageKey]);

  const setCollapsed = (v) => {
    setCollapsedState(v);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, v ? "1" : "0");
    }
  };

  return (
    <SidebarCtx.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarCtx.Provider>
  );
}

export function SidebarToggle({ className = "" }) {
  const { collapsed, setCollapsed } = useSidebar();
  return (
    <button
      type="button"
      onClick={() => setCollapsed(!collapsed)}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={`hidden h-10 w-10 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface md:inline-flex ${className}`}
    >
      {collapsed ? (
        <PanelLeftOpen className="h-5 w-5" />
      ) : (
        <PanelLeftClose className="h-5 w-5" />
      )}
    </button>
  );
}

export default function SidebarShell({ children, footer }) {
  const { collapsed } = useSidebar();
  const width = collapsed
    ? "var(--sidebar-collapsed-width)"
    : "var(--sidebar-width)";
  return (
    <aside
      className="hidden h-full shrink-0 border-r border-outline-variant bg-surface-container-lowest transition-[width] duration-200 ease-out md:flex md:flex-col"
      style={{ width }}
      data-collapsed={collapsed ? "true" : "false"}
    >
      <div
        className="flex items-center border-b border-outline-variant px-4"
        style={{ height: "var(--header-height)" }}
      >
        {collapsed ? <Logo compact /> : <Logo />}
      </div>
      <div className="scrollbar-thin flex-1 overflow-y-auto py-4">
        {children}
      </div>
      {footer ? (
        <div className="border-t border-outline-variant p-3">{footer}</div>
      ) : null}
    </aside>
  );
}
