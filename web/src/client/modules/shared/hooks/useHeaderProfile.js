"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { shouldRetryQuery } from "@/client/lib/query/retryPolicy.js";
import { getStoredUser } from "@/client/lib/auth/session.js";
import { barberServices } from "@/client/modules/barber/services/barberServices.jsx";
import { customerServices } from "@/client/modules/customer/services/customerServices.jsx";
import { adminServices } from "@/client/modules/admin/services/adminServices.jsx";

const ROLE_FALLBACK = {
  admin: { name: "Admin", email: "admin@ironandoak.app", photoUrl: null },
  barber: { name: "Barber", email: "", photoUrl: null },
  customer: { name: "Customer", email: "", photoUrl: null },
};

function fromStoredUser(stored, fallback) {
  if (!stored) return fallback;

  const name = stored.fullName?.trim() || fallback.name;
  return {
    name,
    email: stored.email || fallback.email,
    photoUrl: stored.photoUrl ?? null,
  };
}

function fromApiProfile(data, fallback) {
  if (!data) return fallback;

  const name = data.fullName?.trim() || data.name?.trim() || fallback.name;
  return {
    name,
    email: data.email || fallback.email,
    photoUrl: data.photoUrl ?? fallback.photoUrl ?? null,
  };
}

export function useHeaderProfile(role = "customer") {
  const fallback = ROLE_FALLBACK[role] ?? ROLE_FALLBACK.customer;
  const storedUser = useMemo(() => getStoredUser(), []);

  const barberQuery = useQuery({
    queryKey: ["barberGetProfile"],
    queryFn: barberServices.getProfile,
    enabled: role === "barber",
    retry: shouldRetryQuery,
  });

  const customerQuery = useQuery({
    queryKey: ["getProfile"],
    queryFn: customerServices.getProfile,
    enabled: role === "customer",
    retry: shouldRetryQuery,
  });

  const adminQuery = useQuery({
    queryKey: ["profile"],
    queryFn: adminServices.getProfile,
    enabled: role === "admin",
    retry: shouldRetryQuery,
  });

  return useMemo(() => {
    const base = fromStoredUser(storedUser, fallback);

    if (role === "barber" && barberQuery.data) {
      return fromApiProfile(barberQuery.data, base);
    }
    if (role === "customer" && customerQuery.data) {
      return fromApiProfile(customerQuery.data, base);
    }
    if (role === "admin" && adminQuery.data) {
      return fromApiProfile(adminQuery.data, base);
    }

    return base;
  }, [role, storedUser, fallback, barberQuery.data, customerQuery.data, adminQuery.data]);
}
