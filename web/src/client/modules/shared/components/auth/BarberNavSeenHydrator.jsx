"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { BARBER } from "@/client/modules/shared/constants/roles.js";
import { resolveBarberNavSection } from "@/client/modules/barber/constants/barberNavSeenConstants.js";
import { barberHook } from "@/client/modules/barber/hooks/barberQuery.jsx";

/**
 * Marks the current barber nav section as seen in the database when the barber
 * opens a badge-tracked page (list or detail). Syncs across tabs via Socket.IO.
 */
export default function BarberNavSeenHydrator({ role }) {
  const pathname = usePathname() || "";
  const queryClient = useQueryClient();
  const { mutate: markSeen } = barberHook.NavBadges.useMarkNavSectionSeen();
  const lastMarkedRef = useRef(null);

  useEffect(() => {
    if (role !== BARBER) return undefined;

    const section = resolveBarberNavSection(pathname);
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
          queryClient.invalidateQueries({ queryKey: ["barberNavBadges"] });
        },
      },
    );

    return undefined;
  }, [role, pathname, markSeen, queryClient]);

  return null;
}
