'use client';
import { useState } from 'react';
import { SECTIONS } from '@/constants/Data.js';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#131313] text-[#e4e2e1]">
      {/* PAGE HERO */}
      <section className="pt-32 pb-16 px-4 md:px-16 bg-[#1b1c1c] border-b border-[#53443c]">
        <div className="max-w-[900px] mx-auto">
          <span className="text-[10px] tracking-[0.3em] text-[#ffb68c] block mb-4">LEGAL</span>
          <h1
            className="text-[40px] font-bold tracking-tight text-[#e4e2e1] mb-4"
            style={{ fontFamily: 'Noto Serif, serif' }}
          >
            Privacy Policy
          </h1>
          <p className="text-[#a08d83] text-sm">
            Last updated: October 29, 2024 · Effective: November 1, 2024
          </p>
          <p className="text-[#d8c2b7] mt-4 text-base leading-relaxed max-w-2xl">
            This Privacy Policy describes how Iron & Oak Barbershop (&quot;we&quot;, &quot;us&quot;,
            or &quot;our&quot;) collects, uses, and shares information about you when you use our
            services.
          </p>
        </div>
      </section>

      <main className="py-16 px-4 md:px-16">
        <div className="max-w-[900px] mx-auto">
          {/* Quick Nav */}
          <div className="bg-[#1f2020] border border-[#53443c] p-6 mb-12">
            <p className="text-[10px] tracking-widest text-[#a08d83] mb-4">TABLE OF CONTENTS</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SECTIONS.map((s, i) => (
                <a
                  key={i}
                  href={`#section-${i}`}
                  className="flex items-center gap-2 text-sm text-[#d8c2b7] hover:text-[#ffb68c] transition-colors py-1"
                >
                  <span className="text-[#53443c] text-[10px]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s.title}
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {SECTIONS.map((s, i) => (
              <div key={i} id={`section-${i}`} className="border-l-2 border-[#53443c] pl-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-label-caps text-[10px] text-[#ffb68c] tracking-widest">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2
                    className="text-[20px] font-bold text-[#e4e2e1]"
                    style={{ fontFamily: 'Noto Serif, serif' }}
                  >
                    {s.title}
                  </h2>
                </div>
                <div className="space-y-4">
                  {s.content.split('\n\n').map((para, j) => (
                    <p key={j} className="text-[#a08d83] leading-relaxed text-sm">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 bg-[#1f2020] border border-[#53443c] p-8">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-[#ffb68c] text-[24px] mt-0.5">
                help
              </span>
              <div>
                <h3 className="text-[#e4e2e1] font-medium mb-2">Questions about your privacy?</h3>
                <p className="text-[#a08d83] text-sm leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please
                  reach out to us directly.
                </p>
                <a
                  href="contact.html"
                  className="border border-[#53443c] text-[#d8c2b7] px-5 py-2 text-[11px] tracking-widest hover:border-[#ffb68c] hover:text-[#ffb68c] transition-colors inline-block"
                >
                  CONTACT US
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
