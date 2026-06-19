"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ADMIN } from "@/client/modules/shared/constants/roles.js";
import { resolveAdminNavSection } from "@/client/modules/admin/constants/adminNavSeenConstants.js";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";

/**
 * Marks the current admin nav section as seen in the database when the admin
 * opens a badge-tracked page (list or detail). Syncs across tabs via Socket.IO.
 */
export default function AdminNavSeenHydrator({ role }) {
  const pathname = usePathname() || "";
  const queryClient = useQueryClient();
  const { mutate: markSeen } = adminHook.NavBadges.useMarkNavSectionSeen();
  const lastMarkedRef = useRef(null);

  useEffect(() => {
    if (role !== ADMIN) return undefined;

    const section = resolveAdminNavSection(pathname);
    if (!section) {
      lastMarkedRef.current = null;
      return undefined;
    }

    const marker = `${section}:${pathname}`;
    if (lastMarkedRef.current === marker) return undefined;
    lastMarkedRef.current = marker;

    markSeen(
      { section },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["adminNavBadges"] });
        },
      },
    );

    return undefined;
  }, [role, pathname, markSeen, queryClient]);

  return null;
}
