'use client';

import { useState } from 'react';
import { categories, Haircuts } from '@/constants/Data.js';
import SmallServiceCard from '@/components/ui/SmallServiceCard.jsx';

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <main className="bg-[#131313] text-[#e4e2e1] min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-16 bg-[#1b1c1c] border-b border-[#53443c]">
        <div className="max-w-[1280px] mx-auto">
          <span className="text-[#ffb68c] tracking-[0.3em] block mb-4 text-xs font-semibold">
            THE FULL MENU
          </span>

          <h1 className="text-[40px] md:text-6xl text-[#e4e2e1] mb-6 font-black">Our Services</h1>

          <p className="text-[#d8c2b7] text-lg leading-relaxed max-w-2xl">
            Every service is performed by a trained specialist using premium tools and products. All
            prices include consultation, styling, and finishing.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mt-10">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2 text-xs font-semibold tracking-[0.1em] border transition-colors ${
                  activeCategory === category.id
                    ? 'border-[#ffb68c] text-[#ffb68c]'
                    : 'border-[#53443c] text-[#d8c2b7] hover:border-[#ffb68c] hover:text-[#ffb68c]'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="py-20 px-4 md:px-16 bg-[#131313]">
        <div className="max-w-[1280px] mx-auto">
          {/* Haircuts */}
          {(activeCategory === 'all' || activeCategory === 'haircut') && (
            <div className="mb-20">
              <div className="flex items-center gap-6 mb-10">
                <h2 className="text-4xl font-bold text-[#e4e2e1]">Haircuts</h2>

                <div className="flex-1 h-px bg-[#53443c]"></div>

                <span className="text-[#a08d83] text-xs tracking-[0.1em]">4 SERVICES</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Haircuts.map((service) => (
                  <SmallServiceCard
                    key={service.keyValue}
                    title={service.title}
                    duration={service.duration}
                    badge={service.badge}
                    price={service.price}
                    description={service.description}
                    tags={service.tags}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CTA Banner */}
      <section className="py-24 px-4 md:px-16 bg-[#ffb68c] text-[#532200]">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Not sure which service is right for you?
            </h2>

            <p className="text-lg leading-relaxed">
              Our barbers are happy to advise during a complimentary consultation. Walk in or book a
              quick call.
            </p>
          </div>

          <a
            href="/contact"
            className="bg-[#532200] text-[#ffb68c] px-12 py-5 text-xs font-semibold tracking-[0.2em] hover:opacity-90 transition-opacity whitespace-nowrap inline-block"
          >
            GET IN TOUCH
          </a>
        </div>
      </section>
    </main>
  );
}
