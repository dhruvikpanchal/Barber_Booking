/** Shared Recharts tooltip styles — uses theme CSS variables for light/dark surfaces. */

export const CHART_TOOLTIP_STYLE = {
  borderRadius: "12px",
  border: "1px solid var(--color-outline-variant)",
  backgroundColor: "var(--color-surface-container-high)",
  color: "var(--color-on-surface)",
  padding: "8px 12px",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
};

export const CHART_TOOLTIP_LABEL_STYLE = {
  color: "var(--color-on-surface-variant)",
  marginBottom: 4,
  fontSize: 11,
  fontWeight: 600,
};

export const CHART_TOOLTIP_ITEM_STYLE = {
  color: "var(--color-on-surface)",
  fontSize: 12,
  padding: 0,
};

export const CHART_TOOLTIP_PROPS = {
  cursor: { fill: "var(--color-on-surface)", opacity: 0.06 },
  contentStyle: CHART_TOOLTIP_STYLE,
  labelStyle: CHART_TOOLTIP_LABEL_STYLE,
  itemStyle: CHART_TOOLTIP_ITEM_STYLE,
  wrapperStyle: { zIndex: 50, outline: "none" },
};

/** @type {import("recharts").XAxisProps["tick"]} */
export const CHART_AXIS_TICK = {
  fill: "var(--color-on-surface-variant)",
  fontSize: 11,
};
