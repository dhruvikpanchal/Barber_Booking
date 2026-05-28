"use client";

import { useState } from "react";
import { X } from "lucide-react";

/**
 * @param {{ images: Array<{ id: string, src: string, alt: string }> }} props
 */
export default function BarberGallery({ images }) {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section
      id="gallery"
      className="scroll-mt-28 rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-6"
    >
      <header className="mb-4">
        <h2 className="font-serif text-lg font-bold text-on-surface">
          Gallery & portfolio
        </h2>
        <p className="mt-0.5 text-xs text-on-surface-variant">
          Recent work and shop moments
        </p>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {images.map((img, index) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setLightbox(img)}
            className={`group relative overflow-hidden rounded-lg border border-outline-variant bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              index === 0 ? "col-span-2 row-span-2 aspect-[4/3] sm:aspect-auto sm:min-h-[220px]" : "aspect-square"
            }`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {lightbox ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-on-surface"
            aria-label="Close gallery"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </section>
  );
}
