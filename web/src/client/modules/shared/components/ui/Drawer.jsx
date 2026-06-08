"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const PLACEMENT_CLASS = {
  left: "justify-start",
  right: "justify-end",
  bottom: "items-end justify-center",
};

const PANEL_PLACEMENT_CLASS = {
  left: "border-r motion-safe:animate-[drawer-panel-in-left_220ms_ease-out]",
  right: "border-l motion-safe:animate-[drawer-panel-in-right_220ms_ease-out]",
  bottom:
    "w-full max-h-[85vh] rounded-t-2xl border-t motion-safe:animate-[drawer-panel-in-bottom_220ms_ease-out]",
};

export default function Drawer({
  open,
  onClose,
  children,
  placement = "right",
  className = "",
  panelClassName = "",
  backdropClassName = "bg-black/60",
  zIndex = "z-50",
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

  const animationClass = animated ? "motion-safe:animate-[drawer-backdrop-in_200ms_ease-out]" : "";
  const panelAnimationClass = animated ? PANEL_PLACEMENT_CLASS[placement] : "";

  const node = (
    <div
      className={`fixed inset-0 ${zIndex} flex ${PLACEMENT_CLASS[placement] ?? PLACEMENT_CLASS.right} ${animationClass}`}
      role="presentation"
    >
      {closeOnBackdrop ? (
        <button
          type="button"
          className={`absolute inset-0 ${backdropClassName}`}
          aria-label="Close panel"
          onClick={onClose}
        />
      ) : (
        <div className={`absolute inset-0 ${backdropClassName}`} aria-hidden />
      )}
      <aside
        className={`relative z-10 h-full max-h-[100dvh] shadow-2xl ${panelAnimationClass} ${panelClassName} ${className}`.trim()}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </aside>
    </div>
  );

  return createPortal(node, document.body);
}
