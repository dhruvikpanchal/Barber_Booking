"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Heart, User, SlidersHorizontal, ArrowUpDown, Star, CheckCircle, X } from "lucide-react";
import customerServices from "@/client/modules/customer/services/customerServices.jsx";
import SavedBarberCard from "@/client/modules/customer/components/Favorites/SavedBarberCard.jsx";
import FavoritesEmpty from "@/client/modules/customer/components/Favorites/FavoritesEmpty.jsx";
import { BARBER_SORTS } from "@/client/modules/customer/constants/favorites.js";
import { routes } from "@/client/config/routes/routes.js";

function sortBarbers(list, key) {
  return [...list].sort((a, b) => {
    switch (key) {
      case "rating":
        return b.rating - a.rating;
      case "visits":
        return b.totalVisits - a.totalVisits;
      case "price":
        return a.startingPrice - b.startingPrice;
      case "available":
        return (b.available ? 1 : 0) - (a.available ? 1 : 0);
      default:
        return new Date(b.savedAt) - new Date(a.savedAt);
    }
  });
}

function Toast({ toast, onDismiss }) {
  if (!toast) return null;
  const colors = {
    success: "border-status-confirmed/30 bg-status-confirmed/10 text-status-confirmed",
    info: "border-primary/30 bg-primary/10 text-primary",
    warn: "border-status-pending/30 bg-status-pending/10 text-status-pending",
  };
  return (
    <div
      className={`fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-sm ${colors[toast.type] ?? colors.info}`}
    >
      <span className="text-on-surface text-sm font-medium">{toast.message}</span>
      <button
        onClick={onDismiss}
        className="text-on-surface-variant hover:text-on-surface ml-1 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function StatsStrip({ barbers }) {
  const totalVisits = [...barbers].reduce((s, x) => s + (x.totalVisits ?? 0), 0);
  const avgRating =
    barbers.length > 0
      ? (barbers.reduce((s, b) => s + b.rating, 0) / barbers.length).toFixed(1)
      : "—";
  const availableNow = barbers.filter((b) => b.available).length;

  const stats = [
    { label: "Saved Barbers", value: barbers.length, icon: User },
    { label: "Total Visits", value: totalVisits, icon: CheckCircle },
    { label: "Avg Barber Rating", value: avgRating, icon: Star },
    { label: "Available Now", value: availableNow, icon: CheckCircle },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="border-outline-variant bg-surface-container-low flex items-center gap-3 rounded-xl border px-4 py-3.5"
        >
          <div className="border-primary/20 bg-primary/8 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border">
            <Icon className="text-primary h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-on-surface font-serif text-xl leading-none font-bold">{value}</p>
            <p className="text-on-surface-variant mt-0.5 truncate text-[11px]">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SortDropdown({ options, value, onChange }) {
  return (
    <div className="relative flex items-center gap-2">
      <ArrowUpDown className="text-on-surface-variant pointer-events-none absolute left-3 h-3.5 w-3.5" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-outline-variant bg-surface-container text-on-surface focus:border-primary h-9 appearance-none rounded-lg border pr-9 pl-8 text-xs font-medium transition-colors focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
      <SlidersHorizontal className="text-on-surface-variant pointer-events-none absolute right-3 h-3.5 w-3.5" />
    </div>
  );
}

export default function Favorites() {
  const router = useRouter();
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [barberSort, setBarberSort] = useState("savedAt");
  const [toast, setToast] = useState(null);

  const loadFavorites = useCallback(() => {
    setLoading(true);
    customerServices
      .listFavorites({ sort: barberSort })
      .then(setBarbers)
      .catch(() => setBarbers([]))
      .finally(() => setLoading(false));
  }, [barberSort]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  function showToast(message, type = "info") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleRemoveBarber(id) {
    const removed = barbers.find((b) => b.id === id);
    try {
      await customerServices.removeFavorite(id);
      setBarbers((prev) => prev.filter((b) => b.id !== id));
      showToast(`${removed?.name ?? "Barber"} removed from favourites.`, "warn");
    } catch (err) {
      showToast(err?.message ?? "Could not remove favorite.", "warn");
    }
  }

  function handleBookBarber(barber) {
    router.push(`${routes.customer.bookAppointment}?barber=${encodeURIComponent(barber.id)}`);
  }

  const sortedBarbers = useMemo(() => sortBarbers(barbers, barberSort), [barbers, barberSort]);

  return (
    <div className="mx-auto max-w-6xl pb-28 md:pb-10">
      <header className="mb-6">
        <div className="mb-1 flex items-center gap-2">
          <Heart className="text-primary h-4 w-4" />
          <span className="text-on-surface-variant text-[10px] font-semibold tracking-[0.15em] uppercase">
            Customer · Favourites
          </span>
        </div>
        <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
          My Favourites
        </h1>
        <p className="text-on-surface-variant mt-1 max-w-xl text-sm leading-relaxed">
          Your saved barbers — ready for a quick booking whenever you are.
        </p>
      </header>

      {barbers.length > 0 && (
        <div className="mb-6">
          <StatsStrip barbers={barbers} />
        </div>
      )}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {barbers.length > 1 && (
          <SortDropdown options={BARBER_SORTS} value={barberSort} onChange={setBarberSort} />
        )}
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container h-72 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : barbers.length === 0 ? (
        <FavoritesEmpty tab="barbers" />
      ) : (
        <>
          <p className="text-on-surface-variant mb-4 text-xs">
            <span className="text-on-surface font-semibold">{barbers.length}</span> saved barber
            {barbers.length !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedBarbers.map((barber) => (
              <SavedBarberCard
                key={barber.id}
                barber={barber}
                onRemove={handleRemoveBarber}
                onBook={handleBookBarber}
              />
            ))}
          </div>
        </>
      )}

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
