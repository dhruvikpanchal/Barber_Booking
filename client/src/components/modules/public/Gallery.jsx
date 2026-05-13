/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import { GALLERY_ITEMS, CATS } from '@/constants/Data';
import { ZoomInIcon, XIcon } from 'lucide-react';
import Image from 'next/image';

export default function Gallery() {
  const [activeCat, setActiveCat] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const filtered =
    activeCat === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((i) => i.cat === activeCat);

  return (
    <div className="min-h-screen bg-[#131313] text-[#e4e2e1]">
      {/* PAGE HERO */}
      <section className="pt-32 pb-20 px-4 md:px-16 bg-[#1b1c1c] border-b border-[#53443c]">
        <span className="text-[10px] tracking-[0.3em] text-[#ffb68c] block mb-4">THE WORK</span>
        <h1
          className="text-[40px] md:text-[48px] font-bold tracking-tight text-[#e4e2e1] mb-6"
          style={{ fontFamily: 'Noto Serif, serif' }}
        >
          Gallery
        </h1>
        <p className="text-[#d8c2b7] text-[18px] max-w-2xl">
          A showcase of precision craft. Every cut, every shave, every detail — captured from the
          chairs of Iron & Oak.
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mt-10">
          {CATS.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCat(c.key)}
              className={`px-5 py-2 text-[11px] tracking-widest border transition-colors ${activeCat === c.key ? 'border-[#ffb68c] text-[#ffb68c]' : 'border-[#53443c] text-[#a08d83] hover:border-[#a08d83] hover:text-[#d8c2b7]'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* GALLERY GRID */}
      <main className="px-4 md:px-16 py-16">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[10px] tracking-widest text-[#a08d83] mb-8">
            {filtered.length} IMAGES
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setLightbox(item)}
                className="group cursor-pointer relative overflow-hidden border border-[#53443c] hover:border-[#ffb68c] transition-colors"
              >
                <Image
                  src={item.img}
                  alt={item.label}
                  width={500}
                  height={500}
                  className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-[#e4e2e1] font-medium text-sm">{item.label}</p>
                  <p className="text-[#ffb68c] text-[10px] tracking-wider mt-1">
                    {item.barber.toUpperCase()}
                  </p>
                </div>
                {/* zoom icon */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-[#131313]/80 border border-[#53443c] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomInIcon className="text-[16px] text-[#ffb68c]" />
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <span className="material-symbols-outlined text-[48px] text-[#53443c] block mb-4">
                photo_library
              </span>
              <p className="text-[#a08d83] text-[11px] tracking-widest">
                NO IMAGES IN THIS CATEGORY
              </p>
            </div>
          )}
        </div>
      </main>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
          onClick={(e) => e.target === e.currentTarget && setLightbox(null)}
        >
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-12 right-0 text-[#a08d83] hover:text-[#ffb68c] transition-colors flex items-center gap-2 text-[11px] tracking-widest"
            >
              <XIcon className="text-[18px] cursor-pointer" /> CLOSE
            </button>
            <img
              src={lightbox.img}
              alt={lightbox.label}
              className="w-full object-cover border border-[#53443c]"
            />
            <div className="bg-[#1f2020] border border-[#53443c] border-t-0 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-[#e4e2e1] font-medium">{lightbox.label}</p>
                <p className="text-[#ffb68c] text-[10px] tracking-wider mt-1">
                  {lightbox.barber.toUpperCase()}
                </p>
              </div>
              <span
                className={`text-[9px] tracking-widest px-3 py-1 border ${
                  lightbox.cat === 'haircut'
                    ? 'border-[#ffb68c]/40 text-[#ffb68c] bg-[#ffb68c]/10'
                    : lightbox.cat === 'shave'
                      ? 'border-blue-400/40 text-blue-400 bg-blue-400/10'
                      : lightbox.cat === 'beard'
                        ? 'border-green-400/40 text-green-400 bg-green-400/10'
                        : 'border-[#a08d83]/40 text-[#a08d83] bg-[#a08d83]/10'
                }`}
              >
                {lightbox.cat.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
