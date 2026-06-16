"use client";

import { useEffect, useState } from "react";
import { Construction } from "lucide-react";

const DEFAULT_MESSAGE =
  "Iron & Oak is undergoing scheduled maintenance. We'll be back shortly — thank you for your patience.";

export default function MaintenancePage() {
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  useEffect(() => {
    fetch("/api/v1/public/maintenance", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        const data = body?.data ?? body;
        if (data?.message) setMessage(data.message);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-background text-on-surface flex min-h-screen items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <div className="bg-primary/10 border-primary/20 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border">
          <Construction className="text-primary h-8 w-8" aria-hidden />
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight md:text-3xl">
          Under maintenance
        </h1>
        <p className="text-on-surface-variant mt-4 text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
