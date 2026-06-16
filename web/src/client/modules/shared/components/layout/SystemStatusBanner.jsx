"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Database } from "lucide-react";
import {
  getSystemStatus,
  subscribeSystemStatus,
} from "@/client/lib/systemStatus.js";

export default function SystemStatusBanner() {
  const [status, setStatus] = useState(getSystemStatus);

  useEffect(() => subscribeSystemStatus(setStatus), []);

  if (!status.databaseUnavailable && !status.demoMode) return null;

  const isDemo = status.demoMode && !status.databaseUnavailable;

  return (
    <div
      role="status"
      className={`border-b px-4 py-2 text-center text-sm ${
        isDemo
          ? "border-status-pending/30 bg-status-pending/10 text-status-pending"
          : "border-status-cancelled/30 bg-status-cancelled/10 text-status-cancelled"
      }`}
    >
      <p className="inline-flex items-center justify-center gap-2 font-medium">
        {isDemo ? (
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
        ) : (
          <Database className="h-4 w-4 shrink-0" aria-hidden />
        )}
        {isDemo
          ? "Demo mode — sample data is shown because live data could not be loaded."
          : status.message || "Database is temporarily unavailable. Some features may not work."}
      </p>
    </div>
  );
}
