"use client";

import { useEffect, useRef, useState } from "react";
import { useHydrated } from "@/client/modules/shared/hooks/useHydrated.js";

/**
 * Fixed-size wrapper for Recharts ResponsiveContainer.
 * Waits for client mount and a measurable container before rendering charts.
 */
export function ChartContainer({ className = "", children }) {
  const hydrated = useHydrated();
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hydrated) return;

    const node = ref.current;
    if (!node) return;

    const measure = () => {
      const { width, height } = node.getBoundingClientRect();
      setReady(width > 0 && height > 0);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [hydrated]);

  return (
    <div
      ref={ref}
      className={`min-h-14 min-w-0 ${className}`.trim()}
      style={{ minWidth: 1, minHeight: 56 }}
    >
      {ready ? children : null}
    </div>
  );
}
