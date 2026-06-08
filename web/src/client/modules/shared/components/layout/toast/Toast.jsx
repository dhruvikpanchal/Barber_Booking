"use client";

import { Toaster } from "sonner";
import { CircleAlert, CircleCheck, CircleX, Info, Loader2 } from "lucide-react";

const toastShell =
  "group toast !w-[min(100vw-2rem,22rem)] !rounded-lg !border !border-outline-variant !bg-surface-container-high/95 !p-4 !font-sans !shadow-[0_8px_32px_rgba(0,0,0,0.45)] !backdrop-blur-md";

export default function Toast() {
  return (
    <Toaster
      theme="dark"
      position="top-right"
      expand={false}
      richColors={false}
      closeButton
      offset={16}
      gap={10}
      duration={4200}
      visibleToasts={4}
      toastOptions={{
        unstyled: false,
        classNames: {
          toast: toastShell,
          title: "!text-on-surface !text-sm !font-semibold !leading-snug",
          description: "!text-on-surface-variant !mt-1 !text-xs !leading-relaxed",
          content: "!gap-1",
          icon: "!mr-0 !mt-0.5 !h-5 !w-5 !shrink-0",
          actionButton:
            "!bg-primary !text-on-primary !rounded-md !px-3 !py-1.5 !text-xs !font-semibold !transition-opacity hover:!opacity-90",
          cancelButton:
            "!border-outline-variant !text-on-surface-variant !rounded-md !border !bg-transparent !px-3 !py-1.5 !text-xs !font-medium hover:!text-on-surface",
          closeButton:
            "!border-outline-variant !bg-surface-container !text-on-surface-variant hover:!text-on-surface !left-auto !right-2 !top-2 !h-6 !w-6 !rounded-md !border !transition-colors",
          success: "!border-l-[3px] !border-l-status-confirmed",
          error: "!border-l-[3px] !border-l-error",
          warning: "!border-l-[3px] !border-l-status-pending",
          info: "!border-l-[3px] !border-l-primary",
          loading: "!border-l-[3px] !border-l-primary",
        },
      }}
      icons={{
        success: <CircleCheck className="text-status-confirmed h-5 w-5" strokeWidth={2.25} aria-hidden />,
        error: <CircleX className="text-error h-5 w-5" strokeWidth={2.25} aria-hidden />,
        warning: <CircleAlert className="text-status-pending h-5 w-5" strokeWidth={2.25} aria-hidden />,
        info: <Info className="text-primary h-5 w-5" strokeWidth={2.25} aria-hidden />,
        loading: <Loader2 className="text-primary h-5 w-5 animate-spin" strokeWidth={2.25} aria-hidden />,
      }}
    />
  );
}
