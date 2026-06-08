"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  X,
  Info,
} from "lucide-react";

export function SectionHeader({ icon: Icon, label, sub }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-on-surface tracking-wide">
          {label}
        </h2>
        {sub && <p className="text-xs text-on-surface-variant mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-lg border border-outline-variant bg-surface-container-low p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function FieldLabel({ children }) {
  return (
    <label className="block text-[11px] tracking-[0.12em] font-semibold text-on-surface-variant mb-2">
      {children}
    </label>
  );
}

export function Input({ className = "", icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
      )}
      <input
        {...props}
        className={`w-full rounded-md border border-outline-variant bg-surface-container px-3 py-2.5 text-sm
            text-on-surface placeholder:text-on-surface-variant/40
            focus:border-primary focus:outline-none focus:bg-surface-container-high
            transition-colors duration-150
            ${Icon ? "pl-9" : ""}
            ${className}`}
      />
    </div>
  );
}

export function TextArea({ className = "", rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      {...props}
      className={`w-full resize-y rounded-md border border-outline-variant bg-surface-container px-3 py-2.5 text-sm
          text-on-surface placeholder:text-on-surface-variant/40
          focus:border-primary focus:outline-none focus:bg-surface-container-high
          transition-colors duration-150 ${className}`}
    />
  );
}

export function SaveButton({
  onClick,
  saving,
  label = "SAVE CHANGES",
  icon: Icon,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-xs font-semibold
          tracking-[0.12em] text-on-primary transition-all hover:opacity-90 active:scale-95
          disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {saving ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
          SAVING…
        </>
      ) : (
        <>
          {Icon && <Icon className="w-3.5 h-3.5" />}
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
        className="w-full rounded-md border border-outline-variant bg-surface-container px-3 py-2.5 pr-10 text-sm
            text-on-surface placeholder:text-on-surface-variant/40
            focus:border-primary focus:outline-none focus:bg-surface-container-high transition-colors"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
      >
        {show ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
    </div>
  );
}

export function Toggle({ checked, onChange, label, sub, disabled }) {
  return (
    <label
      className={`flex items-start gap-4 cursor-pointer group flex-col sm:flex-row${disabled ? "opacity-40 pointer-events-none" : ""}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm text-on-surface font-medium">{label}</p>
        {sub && (
          <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
            {sub}
          </p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        type="button"
        onClick={onChange}
        className={`relative shrink-0 mt-0.5 w-10 h-6 rounded-full border transition-all duration-200
            ${
              checked
                ? "bg-primary border-primary"
                : "bg-surface-container-highest border-outline-variant"
            }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
              ${checked ? "translate-x-4" : "translate-x-0"}`}
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
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border px-4 py-3
        shadow-2xl backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-300 ${colors[type]}`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="text-sm font-medium text-on-surface">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
