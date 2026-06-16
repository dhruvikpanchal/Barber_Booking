"use client";

import { useState } from "react";
import { Eye, EyeOff, AlertTriangle, CheckCircle2, X, Info } from "lucide-react";

export function SectionHeader({ icon: Icon, label, sub }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="bg-primary/10 border-primary/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border">
        <Icon className="text-primary h-4 w-4" />
      </div>
      <div>
        <h2 className="text-on-surface text-sm font-semibold tracking-wide">{label}</h2>
        {sub && <p className="text-on-surface-variant mt-0.5 text-xs">{sub}</p>}
      </div>
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div
      className={`border-outline-variant bg-surface-container-low rounded-lg border p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function FieldLabel({ children }) {
  return (
    <label className="text-on-surface-variant mb-2 block text-[11px] font-semibold tracking-[0.12em]">
      {children}
    </label>
  );
}

export function Input({ className = "", icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="text-on-surface-variant pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      )}
      <input
        {...props}
        className={`border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:bg-surface-container-high w-full rounded-md border px-3 py-2.5 text-sm transition-colors duration-150 focus:outline-none ${Icon ? "pl-9" : ""} ${className}`}
      />
    </div>
  );
}

export function TextArea({ className = "", rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      {...props}
      className={`border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:bg-surface-container-high w-full resize-y rounded-md border px-3 py-2.5 text-sm transition-colors duration-150 focus:outline-none ${className}`}
    />
  );
}

export function SaveButton({ onClick, saving, label = "SAVE CHANGES", icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="bg-primary text-on-primary flex items-center gap-2 rounded-md px-5 py-2.5 text-xs font-semibold tracking-[0.12em] transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {saving ? (
        <>
          <span className="border-on-primary/30 border-t-on-primary h-3.5 w-3.5 animate-spin rounded-full border-2" />
          SAVING…
        </>
      ) : (
        <>
          {Icon && <Icon className="h-3.5 w-3.5" />}
          {label}
        </>
      )}
    </button>
  );
}

export function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:bg-surface-container-high w-full rounded-md border px-3 py-2.5 pr-10 text-sm transition-colors focus:outline-none"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="text-on-surface-variant hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
      >
        {show ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function Toggle({ checked, onChange, label, sub, disabled }) {
  return (
    <label
      className={`group flex cursor-pointer flex-col items-start gap-4 sm:flex-row${disabled ? "pointer-events-none opacity-40" : ""}`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-on-surface text-sm font-medium">{label}</p>
        {sub && <p className="text-on-surface-variant mt-0.5 text-xs leading-relaxed">{sub}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        type="button"
        onClick={onChange}
        className={`relative mt-0.5 h-6 w-10 shrink-0 rounded-full border transition-all duration-200 ${
          checked
            ? "bg-primary border-primary"
            : "bg-surface-container-highest border-outline-variant"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`}
        />
      </button>
    </label>
  );
}

export function Toast({ message, type = "success", onClose }) {
  const icons = { success: CheckCircle2, error: AlertTriangle, info: Info };
  const Icon = icons[type];
  const colors = {
    success: "border-green-500/30 bg-green-500/10 text-green-400",
    error: "border-red-500/30 bg-red-500/10 text-red-400",
    info: "border-primary/30 bg-primary/10 text-primary",
  };
  return (
    <div
      className={`animate-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-2xl backdrop-blur-sm duration-300 ${colors[type]}`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="text-on-surface text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="text-on-surface-variant hover:text-on-surface ml-2 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
