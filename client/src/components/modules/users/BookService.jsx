/* eslint-disable react-hooks/purity */
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image.js';
import { SERVICES, BARBERS, TIME_SLOTS, DAYS } from '@/constants/Data.js';
import { i13, i14, i15, i16, i17 } from '@/constants/ImagePath.js';

const BOOKED_SLOTS = ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'];

const CATS = ['All', 'Haircut', 'Shave', 'Beard', 'Spa', 'Package'];

const inputCls =
  'w-full bg-[#1f2020] border border-[#53443c] px-4 py-3 text-[#e4e2e1] text-sm focus:outline-none focus:border-[#ffb68c] transition-colors placeholder:text-[#d8c2b7]/40 font-[Work_Sans,sans-serif]';
const labelCls =
  'block text-[10px] font-semibold tracking-[0.1em] text-[#d8c2b7] mb-2 font-[Work_Sans,sans-serif]';
const btnPrimary =
  'w-full bg-[#ffb68c] text-[#532200] py-4 text-[12px] font-semibold tracking-[0.2em] font-[Work_Sans,sans-serif] hover:opacity-90 active:scale-95 transition-all cursor-pointer';
const btnOutline =
  'border border-[#a08d83] text-[#e4e2e1] py-4 text-[12px] font-semibold tracking-[0.2em] font-[Work_Sans,sans-serif] hover:border-[#ffb68c] hover:text-[#ffb68c] transition-colors cursor-pointer px-6';

const StepIndicator = ({ step }) => (
  <div className="flex items-center gap-0 mb-10">
    {[
      ['Service', 1],
      ['Barber', 2],
      ['Date & Time', 3],
      ['Details', 4],
      ['Confirm', 5],
    ].map(([label, n], i, arr) => (
      <div key={n} className="flex items-center gap-0">
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 flex items-center justify-center text-[11px] font-semibold tracking-wider border transition-all ${
              step > n
                ? 'bg-[#ffb68c] border-[#ffb68c] text-[#532200]'
                : step === n
                  ? 'border-[#ffb68c] text-[#ffb68c]'
                  : 'border-[#53443c] text-[#a08d83]'
            }`}
          >
            {step > n ? (
              <span className="material-symbols-outlined text-[14px]">
                <Image
                  src={i13}
                  alt="check"
                  width={20}
                  height={20}
                  className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-500 invert brightness-100"
                />
              </span>
            ) : (
              n
            )}
          </div>
          <span
            className={`text-[9px] tracking-widest mt-1 hidden md:block ${step >= n ? 'text-[#ffb68c]' : 'text-[#a08d83]'}`}
          >
            {label.toUpperCase()}
          </span>
        </div>
        {i < arr.length - 1 && (
          <div className={`w-8 md:w-16 h-px mx-1 ${step > n ? 'bg-[#ffb68c]' : 'bg-[#53443c]'}`} />
        )}
      </div>
    ))}
  </div>
);

export default function BookService() {
  const [step, setStep] = useState(1); // 1=Service 2=Barber 3=DateTime 4=Details 5=Confirm 6=Done
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [activeCat, setActiveCat] = useState('All');
  const [form, setForm] = useState({
    name: 'James Wilson',
    email: 'james@example.com',
    phone: '+1 (212) 555-0142',
    notes: '',
  });

  const filteredServices =
    activeCat === 'All' ? SERVICES : SERVICES.filter((s) => s.cat === activeCat);

  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    setBookingId('IOK-' + Math.floor(10000 + Math.random() * 90000));
  }, []);

  // ── STEP 1: Choose Service ──────────────────────────
  if (step === 1)
    return (
      <div className="min-h-screen bg-[#131313] text-[#e4e2e1] p-6 md:p-12">
        <div className="max-w-5xl mx-auto">
          <a
            href="../public/home.html"
            className="text-[#a08d83] text-[11px] tracking-widest hover:text-[#ffb68c] transition-colors flex items-center gap-2 mb-8"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> BACK TO HOME
          </a>
          <div className="mb-10">
            <span className="text-[10px] tracking-[0.3em] text-[#a08d83]">STEP 1 OF 5</span>
            <h1
              className="text-[32px] font-bold tracking-tight text-[#e4e2e1] mt-2"
              style={{ fontFamily: 'Noto Serif, serif' }}
            >
              Choose Your Service
            </h1>
            <p className="text-[#d8c2b7] mt-2">Select a service to begin your booking.</p>
          </div>

          <StepIndicator step={step} />

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 text-[11px] tracking-widest border transition-colors ${activeCat === cat ? 'border-[#ffb68c] text-[#ffb68c]' : 'border-[#53443c] text-[#a08d83] hover:border-[#a08d83]'}`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {filteredServices.map((svc) => (
              <div
                key={svc.id}
                onClick={() => setSelectedService(svc)}
                className={`border p-6 cursor-pointer transition-all relative ${selectedService?.id === svc.id ? 'border-[#ffb68c] bg-[#1f2020]' : 'border-[#53443c] bg-[#1f2020] hover:border-[#a08d83]'}`}
              >
                {svc.popular && (
                  <div className="absolute top-0 right-0 bg-amber-50 text-[#532200] text-[9px] tracking-widest px-1 py-1 font-semibold">
                    <Image
                      src={i14}
                      alt="Popular"
                      width={20}
                      height={20}
                      className="inver brightness-0"
                    />
                  </div>
                )}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3
                      className="text-[16px] sm:text-[18px] lg:text-[20px] font-medium text-[#e4e2e1]"
                      style={{ fontFamily: 'Noto Serif, serif' }}
                    >
                      {svc.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-[#a08d83] tracking-wider">
                        {svc.cat.toUpperCase()}
                      </span>
                      <span className="text-[#53443c]">·</span>
                      <span className="text-[10px] text-[#a08d83] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                        {svc.duration} MIN
                      </span>
                    </div>
                  </div>
                  <span
                    className="text-[22px] font-semibold text-[#ffb68c]"
                    style={{ fontFamily: 'Noto Serif, serif' }}
                  >
                    ${svc.price}
                  </span>
                </div>
                <p className="text-[#d8c2b7] text-sm leading-relaxed mb-4">{svc.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {svc.tags.map((t) => (
                    <span
                      key={t}
                      className="border border-[#53443c] px-2 py-1 text-[9px] tracking-widest text-[#a08d83]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {selectedService?.id === svc.id && (
                  <div className="mt-4 flex items-center gap-2 text-[#ffb68c] text-[11px] tracking-wider">
                    <Image src={i15} alt="Popular" width={20} height={20} />
                    SELECTED
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              disabled={!selectedService}
              onClick={() => setStep(2)}
              className={`${btnPrimary} max-w-xs ${!selectedService ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              CONTINUE →
            </button>
          </div>
        </div>
      </div>
    );

  // ── STEP 2: Choose Barber ──────────────────────────
  if (step === 2)
    return (
      <div className="min-h-screen bg-[#131313] text-[#e4e2e1] p-6 md:p-12">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setStep(1)}
            className="text-[#a08d83] text-[11px] tracking-widest hover:text-[#ffb68c] transition-colors flex items-center gap-2 mb-8"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> BACK
          </button>
          <div className="mb-10">
            <span className="text-[10px] tracking-[0.3em] text-[#a08d83]">STEP 2 OF 5</span>
            <h1
              className="text-[32px] font-bold tracking-tight text-[#e4e2e1] mt-2"
              style={{ fontFamily: 'Noto Serif, serif' }}
            >
              Choose Your Barber
            </h1>
            <p className="text-[#d8c2b7] mt-2">
              Booking: <span className="text-[#ffb68c]">{selectedService?.name}</span> — $
              {selectedService?.price}
            </p>
          </div>
          <StepIndicator step={step} />

          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-5 xl:gap-6 mb-10">
            {BARBERS.map((barber) => (
              <div
                key={barber.id}
                onClick={() => setSelectedBarber(barber)}
                className={`
                  min-h-full
                  border cursor-pointer transition-all duration-300
                  bg-[#1f2020]
                  hover:-translate-y-1 hover:shadow-2xl
                  active:scale-[0.98]

                  ${
                    selectedBarber?.id === barber.id
                      ? 'border-[#ffb68c]'
                      : 'border-[#53443c] hover:border-[#a08d83]'
                  }
                `}
              >
                {barber.img ? (
                  <div className="relative overflow-hidden">
                    <Image
                      src={barber.img}
                      alt={barber.name}
                      width={500}
                      height={600}
                      className="
                      w-full
                      h-[260px]
                      sm:h-[320px]
                      lg:h-[360px]
                      object-cover
                      object-top
                      grayscale
                      hover:grayscale-0
                      transition-all
                      duration-500
                    "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1f2020]/90 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p
                        className="text-[16px] sm:text-[18px] lg:text-[20px] font-medium text-[#e4e2e1]"
                        style={{ fontFamily: 'Noto Serif, serif' }}
                      >
                        {barber.name}
                      </p>
                      <p className="text-[10px] text-[#ffb68c] tracking-wider mt-1">
                        {barber.role.toUpperCase()} {barber.chair ? `· CHAIR ${barber.chair}` : ''}
                      </p>
                    </div>
                    <div
                      className={`absolute top-3 left-3 px-2 py-1 border text-[9px] tracking-widest flex items-center gap-1 bg-[#1f2020] ${barber.available ? 'border-green-500/40 text-green-400' : 'border-red-500/40 text-red-400'}`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${barber.available ? 'bg-green-500' : 'bg-red-500'}`}
                      />
                      {barber.available ? 'AVAILABLE' : 'FULLY BOOKED'}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-[#2a2a2a] flex flex-col items-center justify-center border-b border-[#53443c]">
                    <div className="w-12 h-12 border border-[#53443c] flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-[#a08d83] text-[24px]">
                        shuffle
                      </span>
                    </div>
                    <p className="text-[#ffb68c] text-[10px] tracking-wider">
                      FASTEST AVAILABILITY
                    </p>
                  </div>
                )}
                <div className="p-4 sm:p-5">
                  {barber.img && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {barber.specialties.map((s) => (
                        <span
                          key={s}
                          className="
                            border border-[#53443c]
                            px-2 py-1
                            text-[8px] sm:text-[9px]
                            tracking-wider
                            text-[#a08d83]
                          "
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {!barber.img && (
                    <p className="text-sm text-[#d8c2b7] mb-3">
                      Let us match you with the best available barber for your service and time.
                    </p>
                  )}
                  <div className="flex justify-between items-center text-[9px] sm:text-[10px] gap-3">
                    <span className="text-[#a08d83]">
                      NEXT: <span className="text-[#ffb68c]">{barber.nextSlot}</span>
                    </span>
                    {barber.rating && (
                      <span className="text-[#a08d83]">
                        ★ {barber.rating} ({barber.reviews})
                      </span>
                    )}
                  </div>
                  {selectedBarber?.id === barber.id && (
                    <div className="mt-3 flex items-center gap-2 text-[#ffb68c] text-[11px] tracking-wider border-t border-[#53443c] pt-3">
                      <Image src={i15} alt="Popular" width={20} height={20} />
                      SELECTED
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className={btnOutline}>
              ← BACK
            </button>
            <button
              disabled={!selectedBarber}
              onClick={() => setStep(3)}
              className={`${btnPrimary} max-w-xs ${!selectedBarber ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              CONTINUE →
            </button>
          </div>
        </div>
      </div>
    );

  // ── STEP 3: Date & Time ────────────────────────────
  if (step === 3)
    return (
      <div className="min-h-screen bg-[#131313] text-[#e4e2e1] px-4 py-6 sm:px-6 md:p-12">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setStep(2)}
            className="text-[#a08d83] text-[11px] tracking-widest hover:text-[#ffb68c] transition-colors flex items-center gap-2 mb-8"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            BACK
          </button>

          {/* Heading */}
          <div className="mb-10">
            <span className="text-[10px] tracking-[0.3em] text-[#a08d83]">STEP 3 OF 5</span>

            <h1
              className="text-[26px] sm:text-[32px] font-bold tracking-tight text-[#e4e2e1] mt-2"
              style={{ fontFamily: 'Noto Serif, serif' }}
            >
              Choose Date & Time
            </h1>

            <p className="text-[#d8c2b7] mt-2 text-sm sm:text-base">
              Barber: <span className="text-[#ffb68c]">{selectedBarber?.name}</span>
            </p>
          </div>

          <StepIndicator step={step} />

          {/* Summary Bar */}
          <div className="bg-[#1f2020] border border-[#53443c] p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {selectedBarber?.img && (
                <Image
                  src={selectedBarber.img}
                  alt=""
                  width={100}
                  height={100}
                  className="w-12 h-12 rounded object-cover grayscale shrink-0"
                />
              )}

              <div>
                <p className="text-[11px] tracking-wider text-[#ffb68c]">{selectedService?.name}</p>

                <p className="text-[10px] text-[#a08d83] mt-0.5">
                  with {selectedBarber?.name} · {selectedService?.duration} min
                </p>
              </div>
            </div>

            <p
              className="text-[20px] sm:text-[22px] font-semibold text-[#ffb68c]"
              style={{ fontFamily: 'Noto Serif, serif' }}
            >
              ${selectedService?.price}
            </p>
          </div>

          {/* Day Selector */}
          <div className="mb-8">
            <p className={labelCls}>SELECT DAY</p>

            <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto overflow-y-hidden scrollbar-hide md:overflow-visible touch-pan-x">
              <div className="flex gap-3 md:grid md:grid-cols-6 md:gap-3 w-max md:w-auto">
                {DAYS.map((item, i) => {
                  const active = selectedDay === i;

                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => {
                        setSelectedDay(i);
                        setSelectedSlot(null);
                      }}
                      className={`flex-shrink-0 w-[92px] md:w-full px-3 py-4 border transition-all duration-300 text-center cursor-pointer active:scale-95 ${
                        active
                          ? 'border-[#ffb68c] bg-[#ffb68c]/10'
                          : 'border-[#53443c] hover:border-[#a08d83]'
                      }`}
                    >
                      <div
                        className={`text-[10px] tracking-[0.2em] uppercase font-medium transition-colors duration-300 ${
                          active ? 'text-[#ffb68c]' : 'text-[#a08d83]'
                        }`}
                      >
                        {item.day}
                      </div>

                      <div
                        className={`text-[22px] leading-none mt-2 font-semibold transition-colors duration-300 ${
                          active ? 'text-[#e4e2e1]' : 'text-[#d8c2b7]'
                        }`}
                      >
                        {item.date}
                      </div>

                      <div
                        className={`text-[10px] tracking-[0.15em] uppercase mt-1 transition-colors duration-300 ${
                          active ? 'text-[#ffb68c]' : 'text-[#8b786f]'
                        }`}
                      >
                        {item.month}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-[10px] text-[#a08d83] mt-3 tracking-[0.15em] uppercase">
              {selectedDay !== null ? DAYS[selectedDay].full : 'Select a date'}
            </p>
          </div>

          {/* Time Slots */}
          <div className="mb-10">
            <p className={labelCls}>SELECT TIME</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
              {TIME_SLOTS.map((slot) => {
                const booked = BOOKED_SLOTS.includes(slot);

                return (
                  <button
                    type="button"
                    key={slot}
                    disabled={selectedDay === null || booked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 border text-[11px] tracking-wider transition-all duration-300 active:scale-95 cursor-pointer ${
                      booked
                        ? 'border-[#53443c] text-[#53443c] cursor-not-allowed opacity-40'
                        : selectedSlot === slot
                          ? 'border-[#ffb68c] bg-[#ffb68c]/10 text-[#ffb68c]'
                          : 'border-[#53443c] text-[#a08d83] hover:border-[#a08d83]'
                    } ${selectedDay === null ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-[#ffb68c] bg-[#ffb68c]/10" />

                <span className="text-[10px] text-[#a08d83]">SELECTED</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-[#53443c]" style={{ opacity: 0.4 }} />

                <span className="text-[10px] text-[#a08d83]">BOOKED</span>
              </div>
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
            <button onClick={() => setStep(2)} className={btnOutline}>
              ← BACK
            </button>

            <button
              disabled={!selectedSlot}
              onClick={() => setStep(4)}
              className={`${btnPrimary} w-full sm:w-auto sm:max-w-xs ${
                !selectedSlot ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              CONTINUE →
            </button>
          </div>
        </div>
      </div>
    );

  // ── STEP 4: Client Details ─────────────────────────
  if (step === 4)
    return (
      <div className="min-h-screen bg-[#131313] text-[#e4e2e1] p-6 md:p-12">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setStep(3)}
            className="text-[#a08d83] text-[11px] tracking-widest hover:text-[#ffb68c] transition-colors flex items-center gap-2 mb-8"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> BACK
          </button>
          <div className="mb-10">
            <span className="text-[10px] tracking-[0.3em] text-[#a08d83]">STEP 4 OF 5</span>
            <h1
              className="text-[32px] font-bold tracking-tight text-[#e4e2e1] mt-2"
              style={{ fontFamily: 'Noto Serif, serif' }}
            >
              Your Details
            </h1>
            <p className="text-[#d8c2b7] mt-2">Confirm your contact information for the booking.</p>
          </div>
          <StepIndicator step={step} />

          <div className="bg-[#1f2020] border border-[#53443c] p-8 mb-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>FULL NAME</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                  placeholder="James Wilson"
                />
              </div>
              <div>
                <label className={labelCls}>EMAIL ADDRESS</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  type="email"
                  className={inputCls}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>PHONE NUMBER</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                type="tel"
                className={inputCls}
                placeholder="+1 (212) 555-0100"
              />
            </div>
            <div>
              <label className={labelCls}>NOTES FOR YOUR BARBER (OPTIONAL)</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className={`${inputCls} resize-none`}
                placeholder="e.g. I'd like a low fade with the top left long, similar to last time..."
              />
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-[#1b1c1c] border border-[#53443c] p-6 mb-8">
            <p className="text-[10px] tracking-[0.2em] text-[#a08d83] mb-4">BOOKING SUMMARY</p>
            <div className="space-y-3 text-sm">
              {[
                ['Service', selectedService?.name],
                ['Barber', selectedBarber?.name],
                ['Date', DAYS[selectedDay]?.full],
                ['Time', selectedSlot],
                ['Duration', `${selectedService?.duration} minutes`],
                ['Total', `$${selectedService?.price}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-[#a08d83] text-[11px] tracking-wider">
                    {k.toUpperCase()}
                  </span>
                  <span
                    className={`text-[#e4e2e1] ${k === 'Total' ? 'text-[#ffb68c] font-semibold text-base' : ''}`}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(3)} className={btnOutline}>
              ← BACK
            </button>
            <button onClick={() => setStep(5)} className={`${btnPrimary} max-w-xs`}>
              REVIEW BOOKING →
            </button>
          </div>
        </div>
      </div>
    );

  // ── STEP 5: Confirm ────────────────────────────────
  if (step === 5)
    return (
      <div className="min-h-screen bg-[#131313] text-[#e4e2e1] px-4 py-6 sm:px-6 md:p-12">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setStep(4)}
            className="text-[#a08d83] text-[11px] tracking-widest hover:text-[#ffb68c] transition-colors flex items-center gap-2 mb-8"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            BACK
          </button>

          {/* Heading */}
          <div className="mb-10">
            <span className="text-[10px] tracking-[0.3em] text-[#a08d83]">STEP 5 OF 5</span>

            <h1
              className="text-[28px] sm:text-[36px] font-bold tracking-tight text-[#e4e2e1] mt-2"
              style={{ fontFamily: 'Noto Serif, serif' }}
            >
              Confirm Booking
            </h1>

            <p className="text-[#d8c2b7] mt-2 text-sm sm:text-base">
              Review all details before confirming.
            </p>
          </div>

          <StepIndicator step={step} />

          {/* Full Summary Card */}
          <div className="bg-[#1f2020] border border-[#53443c] overflow-hidden mb-8 shadow-2xl">
            {/* Top Banner */}
            {selectedBarber?.img && (
              <div className="relative h-52 sm:h-64 overflow-hidden">
                <Image
                  src={selectedBarber.img}
                  alt=""
                  width={500}
                  height={500}
                  className="w-full h-full object-cover object-top grayscale"
                  style={{ filter: 'brightness(0.35) grayscale(1)' }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#1f2020] via-[#1f2020]/40 to-transparent" />

                <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                  <p className="text-[10px] tracking-[0.3em] text-[#ffb68c]">YOUR APPOINTMENT</p>

                  <p
                    className="text-[26px] sm:text-[36px] font-bold text-[#e4e2e1] mt-2"
                    style={{ fontFamily: 'Noto Serif, serif' }}
                  >
                    {selectedService?.name}
                  </p>
                </div>
              </div>
            )}

            {/* Details */}
            <div className="p-5 sm:p-8">
              {/* Appointment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-8">
                {[
                  ['Service', selectedService?.name],
                  ['Barber', selectedBarber?.name],
                  ['Date', DAYS[selectedDay]?.full],
                  ['Time', selectedSlot],
                  ['Duration', `${selectedService?.duration} min`],
                  ['Location', '124 Industrial Ave, NY'],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-start gap-3 border border-[#2b2c2c] bg-[#222323] p-4"
                  >
                    <div>
                      <p className="text-[9px] tracking-[0.2em] text-[#a08d83] uppercase">{k}</p>

                      <p className="text-sm sm:text-[15px] text-[#e4e2e1] mt-1 leading-relaxed break-words">
                        {v}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Client + Total */}
              <div className="border-t border-[#53443c] pt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                {/* Client */}
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-[#a08d83]">CLIENT</p>

                  <p className="text-[#e4e2e1] mt-2 text-sm sm:text-base">{form.name}</p>

                  <p className="text-[#a08d83] text-sm break-all mt-1">{form.email}</p>
                </div>

                {/* Total */}
                <div className="sm:text-right">
                  <p className="text-[10px] tracking-[0.2em] text-[#a08d83]">TOTAL</p>

                  <p
                    className="text-[30px] sm:text-[40px] font-bold text-[#ffb68c] mt-1"
                    style={{ fontFamily: 'Noto Serif, serif' }}
                  >
                    ${selectedService?.price}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-[#1b1c1c] border border-[#53443c] p-4 sm:p-5 mb-8 flex items-start gap-3">
            <Image
              src={i17}
              alt="info"
              width={30}
              height={30}
              className="text-[#ffb68c] text-[18px] mt-0.5 shrink-0"
            />

            <p className="text-[11px] sm:text-[12px] text-[#d8c2b7] leading-relaxed">
              Free cancellation up to <strong className="text-[#e4e2e1]">24 hours</strong> before
              your appointment. A confirmation email will be sent to {form.email}.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
            <button onClick={() => setStep(4)} className={`${btnOutline} w-full sm:w-auto`}>
              ← EDIT DETAILS
            </button>

            <button
              onClick={() => setStep(6)}
              className={`${btnPrimary} w-full sm:w-auto sm:max-w-xs`}
            >
              CONFIRM BOOKING ✓
            </button>
          </div>
        </div>
      </div>
    );

  // ── STEP 6: Done ───────────────────────────────────
  return (
    <div className="min-h-screen bg-[#131313] text-[#e4e2e1] flex items-center justify-center px-4 py-10 sm:px-6">
      <div className="max-w-lg w-full">
        {/* Card */}
        <div className="bg-[#1b1c1c] border border-[#53443c] p-6 sm:p-8 md:p-10 shadow-2xl">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full">
              <Image src={i16} alt="check" width={100} height={100} />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <span className="text-[10px] tracking-[0.3em] text-[#a08d83]">BOOKING CONFIRMED</span>

            <h1
              className="text-[28px] sm:text-[36px] font-bold text-[#e4e2e1] mt-3 mb-4 leading-tight"
              style={{ fontFamily: 'Noto Serif, serif' }}
            >
              You&apos;re All Set
            </h1>

            <p className="text-[#d8c2b7] text-sm sm:text-base mb-2">
              Booking ID: <span className="text-[#ffb68c] font-semibold">#{bookingId}</span>
            </p>

            <p className="text-[#d8c2b7] text-sm sm:text-base mb-10 leading-relaxed">
              A confirmation has been sent to{' '}
              <strong className="text-[#e4e2e1] break-all">{form.email}</strong>
            </p>
          </div>

          {/* Summary */}
          <div className="bg-[#222323] border border-[#53443c] p-5 sm:p-6 mb-8 space-y-4">
            {[
              ['Service', selectedService?.name],
              ['Barber', selectedBarber?.name],
              ['Date', DAYS[selectedDay]?.full],
              ['Time', selectedSlot],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex items-start justify-between gap-4 border-b border-[#2e2f2f] pb-3 last:border-none last:pb-0"
              >
                <span className="text-[#a08d83] text-[10px] tracking-[0.2em] uppercase shrink-0">
                  {k}
                </span>

                <span className="text-[#e4e2e1] text-sm sm:text-[15px] text-right">{v}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <a
              href="/dashboard"
              className="
              block w-full
              bg-[#ffb68c]
              text-[#532200]
              py-4
              text-[11px] sm:text-[12px]
              tracking-[0.2em]
              font-semibold
              text-center
              hover:opacity-90
              transition-all
              active:scale-[0.98]
            "
            >
              GO TO DASHBOARD
            </a>

            <button
              onClick={() => {
                setStep(1);
                setSelectedService(null);
                setSelectedBarber(null);
                setSelectedSlot(null);
              }}
              className="
              w-full
              border border-[#a08d83]
              text-[#e4e2e1]
              py-4
              text-[11px] sm:text-[12px]
              tracking-[0.2em]
              hover:border-[#ffb68c]
              hover:text-[#ffb68c]
              transition-all
              active:scale-[0.98]
            "
            >
              BOOK ANOTHER APPOINTMENT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
