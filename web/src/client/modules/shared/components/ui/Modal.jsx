"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const SIZE_CLASS = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export default function Modal({
  open,
  onClose,
  children,
  size = "md",
  className = "",
  panelClassName = "",
  backdropClassName = "bg-black/60",
  zIndex = "z-50",
  labelledBy,
  describedBy,
  role = "dialog",
  closeOnEscape = true,
  closeOnBackdrop = true,
  animated = true,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !closeOnEscape) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEscape, onClose]);

  if (!open || !mounted) return null;

  const animationClass = animated
    ? "motion-safe:animate-[modal-backdrop-in_200ms_ease-out]"
    : "";
  const panelAnimationClass = animated
    ? "motion-safe:animate-[modal-panel-in_200ms_ease-out]"
    : "";

  const node = (
    <div
      className={`fixed inset-0 ${zIndex} flex items-center justify-center p-4 ${animationClass}`}
      role="presentation"
    >
      {closeOnBackdrop ? (
        <button
          type="button"
          className={`absolute inset-0 ${backdropClassName} ${animationClass}`}
          aria-label="Close dialog"
          onClick={onClose}
        />
      ) : (
        <div className={`absolute inset-0 ${backdropClassName}`} aria-hidden />
      )}
      <div
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className={`relative z-10 w-full ${SIZE_CLASS[size] ?? SIZE_CLASS.md} ${panelAnimationClass} ${panelClassName} ${className}`.trim()}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
