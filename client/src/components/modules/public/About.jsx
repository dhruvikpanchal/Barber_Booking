/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import { VALUES } from '@/constants/Data.js';
import { Scissors, Handshake, Crown, ScrollText } from 'lucide-react';
import Image from 'next/image';

export default function About() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#131313] text-[#e4e2e1]">
      {/* HERO */}
      <section className="relative pt-32 pb-32 px-4 md:px-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1600&q=80"
            alt="Iron & Oak interior"
            className="w-full h-full object-cover grayscale brightness-[0.2]"
          />
        </div>
        <div className="relative max-w-[1280px] mx-auto">
          <span className="text-[10px] tracking-[0.3em] text-[#ffb68c] block mb-4">OUR STORY</span>
          <h1
            className="text-[48px] md:text-[72px] font-bold tracking-tight text-[#e4e2e1] leading-tight mb-8 max-w-3xl"
            style={{ fontFamily: 'Noto Serif, serif' }}
          >
            Precision. Heritage. Brotherhood.
          </h1>
          <p className="text-[#d8c2b7] text-[18px] max-w-2xl leading-relaxed">
            Iron & Oak was built on a single conviction: that every man deserves a barbershop that
            respects his time, his style, and his craft. Since 2016, we&apos;ve been delivering on
            that promise — one cut at a time.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-4 md:px-16 bg-[#1f2020] border-y border-[#53443c]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            ['3,200+', 'CLIENTS SERVED'],
            ['5', 'MASTER BARBERS'],
            ['4.9★', 'AVERAGE RATING'],
            ['8+', 'YEARS IN BUSINESS'],
          ].map(([num, label]) => (
            <div key={label} className="text-center">
              <p
                className="text-[36px] font-bold text-[#ffb68c] mb-2"
                style={{ fontFamily: 'Noto Serif, serif' }}
              >
                {num}
              </p>
              <p className="text-[10px] tracking-widest text-[#a08d83]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="py-32 px-4 md:px-16 bg-[#131313]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[10px] tracking-[0.3em] text-[#ffb68c] block mb-4">
              OUR PHILOSOPHY
            </span>
            <h2
              className="text-[36px] font-bold text-[#e4e2e1] mb-8"
              style={{ fontFamily: 'Noto Serif, serif' }}
            >
              A Legacy Carved in Steel and Wood
            </h2>
            <div className="space-y-6 text-[#d8c2b7] text-[16px] leading-relaxed">
              <p>
                At Iron & Oak, we believe that grooming is more than a routine — it is a ritual of
                restoration. Founded on the principles of classic barbering, we have fused
                traditional techniques with modern aesthetics to create an experience that honors
                the individual.
              </p>
              <p>
                Every tool in our kit is chosen for its balance and edge. Every product on our
                shelves is vetted for its purity and performance. We don&apos;t just cut hair — we
                sculpt confidence.
              </p>
              <p>
                The name says it all. Iron for the precision, the tools, the discipline. Oak for the
                durability, the warmth, the community. Together — a barbershop built to last.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -left-6 border-2 border-[#53443c] p-4 bg-[#131313] z-10">
              <span
                className="text-[28px] font-bold text-[#ffb68c]"
                style={{ fontFamily: 'Noto Serif, serif' }}
              >
                EST.
              </span>
              <span
                className="text-[28px] font-bold text-[#e4e2e1]"
                style={{ fontFamily: 'Noto Serif, serif' }}
              >
                {' '}
                2016
              </span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80"
              alt="Barber at work"
              className="w-full aspect-[4/5] object-cover border border-[#53443c]"
            />
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-32 px-4 md:px-16 bg-[#1b1c1c]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-20">
            <span className="text-[10px] tracking-[0.3em] text-[#ffb68c] block mb-4">
              WHAT WE STAND FOR
            </span>
            <h2
              className="text-[40px] font-bold text-[#e4e2e1]"
              style={{ fontFamily: 'Noto Serif, serif' }}
            >
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-[#1f2020] border border-[#53443c] hover:border-[#ffb68c] transition-colors p-8 group"
              >
                <div className="w-12 h-12 border border-[#53443c] group-hover:border-[#ffb68c] flex items-center justify-center mb-6 transition-colors">
                  {/* {v.icon} */}
                  {v.icon === 'Scissors' ? (
                    <Scissors className="w-6 h-6 text-[#ffb68c]" />
                  ) : v.icon === 'Handshake' ? (
                    <Handshake className="w-6 h-6 text-[#ffb68c]" />
                  ) : v.icon === 'Crown' ? (
                    <Crown className="w-6 h-6 text-[#ffb68c]" />
                  ) : (
                    <ScrollText className="w-6 h-6 text-[#ffb68c]" />
                  )}
                </div>
                <h3
                  className="text-[18px] font-medium text-[#e4e2e1] mb-4 group-hover:text-[#ffb68c] transition-colors"
                  style={{ fontFamily: 'Noto Serif, serif' }}
                >
                  {v.title}
                </h3>
                <p className="text-[#a08d83] text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
