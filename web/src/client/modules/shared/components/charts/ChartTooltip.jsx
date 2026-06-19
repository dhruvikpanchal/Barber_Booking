"use client";

import { Tooltip } from "recharts";
import { CHART_TOOLTIP_PROPS } from "./chartStyles.js";

/** Theme-aware Recharts tooltip — avoids default white box / unreadable text. */
export default function ChartTooltip(props) {
  return <Tooltip {...CHART_TOOLTIP_PROPS} {...props} />;
}
