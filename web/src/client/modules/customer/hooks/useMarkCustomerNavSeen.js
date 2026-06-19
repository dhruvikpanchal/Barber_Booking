"use client";

import { useEffect, useMemo } from "react";
import {
  markCustomerNavSectionSeen,
  resolveCustomerNavUserId,
  useCustomerNavSeenRevision,
} from "@/client/modules/customer/helpers/customerNavSeenStore.js";

/**
 * Marks a customer nav section as seen while the related page is open.
 * Persists the latest item timestamp (or now) to localStorage.
 */
export function useMarkCustomerNavSeen(section, items = [], getTimestamp) {
  useCustomerNavSeenRevision();

  const signature = useMemo(() => {
    if (!getTimestamp) return "";
    return items
      .map((item) => getTimestamp(item))
      .filter(Boolean)
      .join("|");
  }, [items, getTimestamp]);

  useEffect(() => {
    if (!section || !getTimestamp) return;
    const userId = resolveCustomerNavUserId();
    if (!userId) return;
    markCustomerNavSectionSeen(userId, section, items, getTimestamp);
  }, [section, items, getTimestamp, signature]);
}
