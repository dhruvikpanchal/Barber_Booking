"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ResponsiveContainer } from "recharts";
import { useHydrated } from "@/client/modules/shared/hooks/useHydrated.js";

const ChartSizeContext = createContext(null);

/**
 * Fixed-size wrapper for Recharts charts.
 * Waits for client mount and a measurable container, then supplies pixel dimensions
 * so ResponsiveContainer never receives invalid -1 sizes in flex/grid layouts.
 */
export function ChartContainer({ className = "", children }) {
  const hydrated = useHydrated();
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!hydrated) return;

    const node = ref.current;
    if (!node) return;

    const measure = () => {
      const { width, height } = node.getBoundingClientRect();
      const w = Math.max(0, Math.floor(width));
      const h = Math.max(0, Math.floor(height));
      setSize((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [hydrated]);

  const ready = size.width > 0 && size.height > 0;

  return (
    <ChartSizeContext.Provider value={ready ? size : null}>
      <div
        ref={ref}
        className={`min-h-14 min-w-0 ${className}`.trim()}
        style={{ minWidth: 0, minHeight: 56 }}
      >
        {ready ? children : null}
      </div>
    </ChartSizeContext.Provider>
  );
}

/** ResponsiveContainer backed by measured pixel dimensions from ChartContainer. */
export function ChartResponsiveContainer({ children, ...props }) {
  const size = useContext(ChartSizeContext);
  if (!size) return null;

  return (
    <ResponsiveContainer width={size.width} height={size.height} {...props}>
      {children}
    </ResponsiveContainer>
  );
}
