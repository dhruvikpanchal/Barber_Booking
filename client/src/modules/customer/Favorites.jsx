"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  User,
  SlidersHorizontal,
  ArrowUpDown,
  Star,
  CheckCircle,
  X,
} from "lucide-react";

import { SAVED_BARBERS } from "../../data/customer/favoritesData.js";
import SavedBarberCard from "./components/Favorites/SavedBarberCard.jsx";
import FavoritesEmpty from "./components/Favorites/FavoritesEmpty.jsx";

// ── Sort options ──────────────────────────────────────────────────────────────
const BARBER_SORTS = [
  { key: "savedAt", label: "Recently Saved" },
  { key: "rating", label: "Highest Rated" },
  { key: "visits", label: "Most Visited" },
  { key: "price", label: "Price: Low–High" },
  { key: "available", label: "Available First" },
];

const SHOP_SORTS = [
  { key: "savedAt", label: "Recently Saved" },
  { key: "rating", label: "Highest Rated" },
  { key: "visits", label: "Most Visited" },
  { key: "price", label: "Price: Low–High" },
  { key: "open", label: "Open Now First" },
];

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

function sortShops(list, key) {
  return [...list].sort((a, b) => {
    switch (key) {
      case "rating":
        return b.rating - a.rating;
      case "visits":
        return b.totalVisits - a.totalVisits;
      case "price":
        return a.startingPrice - b.startingPrice;
      case "open":
        return (b.isOpen ? 1 : 0) - (a.isOpen ? 1 : 0);
      default:
        return new Date(b.savedAt) - new Date(a.savedAt);
    }
  });
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toast, onDismiss }) {
  if (!toast) return null;
  const colors = {
    success:
      "border-status-confirmed/30 bg-status-confirmed/10 text-status-confirmed",
    info: "border-primary/30 bg-primary/10 text-primary",
    warn: "border-status-pending/30 bg-status-pending/10 text-status-pending",
  };
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-sm
        ${colors[toast.type] ?? colors.info}`}
    >
      <span className="text-sm font-medium text-on-surface">
        {toast.message}
      </span>
      <button
        onClick={onDismiss}
        className="ml-1 text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Stats strip ───────────────────────────────────────────────────────────────
function StatsStrip({ barbers }) {
  const totalVisits = [...barbers].reduce(
    (s, x) => s + (x.totalVisits ?? 0),
    0,
  );
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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3.5"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/8">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-serif text-xl font-bold text-on-surface leading-none">
              {value}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-on-surface-variant">
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Sort dropdown ─────────────────────────────────────────────────────────────
function SortDropdown({ options, value, onChange }) {
  return (
    <div className="relative flex items-center gap-2">
      <ArrowUpDown className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-on-surface-variant" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none rounded-lg border border-outline-variant bg-surface-container pl-8 pr-9 text-xs font-medium text-on-surface transition-colors focus:border-primary focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
      <SlidersHorizontal className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-on-surface-variant" />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Favorites() {
  const router = useRouter();
  const [barbers, setBarbers] = useState(SAVED_BARBERS);
  const [barberSort, setBarberSort] = useState("savedAt");
  const [toast, setToast] = useState(null);

  function showToast(message, type = "info") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  // Remove handlers
  function handleRemoveBarber(id) {
    const removed = barbers.find((b) => b.id === id);
    setBarbers((prev) => prev.filter((b) => b.id !== id));
    showToast(`${removed?.name ?? "Barber"} removed from favourites.`, "warn");
  }

  // Quick book handlers → redirect to booking with pre-selection
  function handleBookBarber(barber) {
    router.push("/customer/book-appointment");
  }

  // Sorted lists
  const sortedBarbers = useMemo(
    () => sortBarbers(barbers, barberSort),
    [barbers, barberSort],
  );

  return (
    <div className="mx-auto max-w-6xl pb-28 md:pb-10">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <header className="mb-6">
        <div className="mb-1 flex items-center gap-2">
          <Heart className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant">
            Customer · Favourites
          </span>
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
          My Favourites
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-on-surface-variant">
          Your saved barbers — ready for a quick booking whenever you are.
        </p>
      </header>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      {(barbers.length > 0 || shops.length > 0) && (
        <div className="mb-6">
          <StatsStrip barbers={barbers} />
        </div>
      )}

      {/* ── Tabs + sort row ───────────────────────────────────────────────── */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {barbers.length > 1 && (
          <SortDropdown
            options={BARBER_SORTS}
            value={barberSort}
            onChange={setBarberSort}
          />
        )}
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      {"barbers" && (
        <>
          {barbers.length === 0 ? (
            <FavoritesEmpty tab="barbers" />
          ) : (
            <>
              {/* Results count */}
              <p className="mb-4 text-xs text-on-surface-variant">
                <span className="font-semibold text-on-surface">
                  {barbers.length}
                </span>{" "}
                saved barber{barbers.length !== 1 ? "s" : ""}
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
        </>
      )}

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
