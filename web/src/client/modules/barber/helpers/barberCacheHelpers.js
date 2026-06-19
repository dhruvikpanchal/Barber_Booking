import { mergeProfileSnippet } from "@/client/lib/auth/profileCache.js";

const DASHBOARD_KEY = ["barberGetDashboard"];

export function seedBarberDashboardQueryCache(queryClient, data) {
  if (!data) return;

  queryClient.setQueryData(DASHBOARD_KEY, data);

  if (data.barber) {
    mergeProfileSnippet(queryClient, "barber", {
      firstName: data.barber.firstName,
      fullName: data.barber.firstName,
      photoUrl: data.barber.photoUrl,
    });
  }
}
