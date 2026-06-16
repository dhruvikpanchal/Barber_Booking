"use client";

import { Heart } from "lucide-react";

export default function FavoriteBarberButton({ isFavorite, onToggle, barberName, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={isFavorite}
      aria-label={
        isFavorite
          ? `Remove ${barberName} from favorites`
          : `Add ${barberName} to favorites`
      }
      className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:px-4 ${
        isFavorite
          ? "border-primary/40 bg-primary/15 text-primary hover:bg-primary/25"
          : "border-outline-variant bg-surface-container text-on-surface-variant hover:border-outline hover:bg-surface-container-high hover:text-on-surface"
      }`}
    >
      <Heart
        className={`h-4 w-4 shrink-0 transition-colors ${
          isFavorite ? "fill-primary text-primary" : ""
        }`}
        aria-hidden
      />
      <span className="hidden sm:inline">
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </span>
      <span className="sm:hidden">{isFavorite ? "Favorited" : "Favorite"}</span>
    </button>
  );
}
