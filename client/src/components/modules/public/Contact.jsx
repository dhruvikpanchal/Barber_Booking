'use client';
import { useState } from 'react';
import Image from 'next/image';
import { FAQ } from '@/constants/Data.js';
import { i8, i9, i10, i11 } from '@/constants/ImagePath.js';

export default function Contact() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO (MERN): POST /api/v1/contact
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e4e2e1]">
      {/* PAGE HERO */}
      <section className="pt-32 pb-20 px-4 md:px-16 bg-[#1b1c1c] border-b border-[#53443c]">
        <div className="max-w-[1280px] mx-auto">
          <span className="text-[10px] tracking-[0.3em] text-[#ffb68c] block mb-4">
            GET IN TOUCH
          </span>
          <h1
            className="text-[40px] md:text-[48px] font-bold tracking-tight text-[#e4e2e1] mb-6"
            style={{ fontFamily: 'Noto Serif, serif' }}
          >
            Contact Us
          </h1>
          <p className="text-[#d8c2b7] text-[18px] max-w-2xl">
            Whether you have a question, want to book a group visit, or just want to say hello —
            we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <main className="py-20 px-4 md:px-16">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* ── LEFT: Contact Info ── */}
            <div className="lg:col-span-4 space-y-8">
              {/* Info Cards */}
              {[
                {
                  icon: i8,
                  title: 'Visit Us',
                  lines: ['124 Industrial Avenue', 'Steel District, New York', 'NY 10012'],
                },
                {
                  icon: i9,
                  title: 'Call Us',
                  lines: ['(212) 555-0178', 'Mon–Fri: 9am–8pm', 'Sat: 8am–6pm · Sun: Closed'],
                },
                {
                  icon: i10,
                  title: 'Email Us',
                  lines: ['hello@ironandoak.com', 'bookings@ironandoak.com'],
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-[#1f2020] border border-[#53443c] p-6 flex gap-5 group hover:border-[#ffb68c] transition-colors"
                >
                  <div className="w-10 h-10 border border-[#53443c] group-hover:border-[#ffb68c] flex items-center justify-center flex-shrink-0 transition-colors">
                    <Image src={card.icon} alt="icon" width={24} height={24} />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest text-[#a08d83] mb-2">
                      {card.title.toUpperCase()}
                    </p>
                    {card.lines.map((l, i) => (
                      <p
                        key={i}
                        className={`text-sm ${i === 0 ? 'text-[#e4e2e1] font-medium' : 'text-[#a08d83]'} mt-0.5`}
                      >
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Social */}
              <div className="bg-[#1f2020] border border-[#53443c] p-6">
                <p className="text-[10px] tracking-widest text-[#a08d83] mb-4">FOLLOW US</p>
                <div className="flex gap-3">
                  {[
                    { label: 'Instagram', handle: '@ironandoak_nyc' },
                    { label: 'Facebook', handle: 'Iron & Oak' },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href="#"
                      className="flex-1 border border-[#53443c] p-3 text-center hover:border-[#ffb68c] transition-colors group"
                    >
                      <p className="text-[10px] tracking-widest text-[#a08d83] group-hover:text-[#ffb68c] transition-colors">
                        {s.label.toUpperCase()}
                      </p>
                      <p className="text-[11px] text-[#e4e2e1] mt-1">{s.handle}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Contact Form ── */}
            <div className="lg:col-span-8">
              {submitted ? (
                <div className="bg-[#1f2020] border border-[#53443c] p-12 text-center h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-[#ffb68c]/10 border border-[#ffb68c]/30 flex items-center justify-center mb-8">
                    <span className="material-symbols-outlined text-[#ffb68c] text-[32px]">
                      check_circle
                    </span>
                  </div>
                  <span className="text-[10px] tracking-[0.3em] text-[#a08d83] block mb-3">
                    MESSAGE SENT
                  </span>
                  <h2
                    className="text-[28px] font-bold mb-4"
                    style={{ fontFamily: 'Noto Serif, serif' }}
                  >
                    Thanks for reaching out
                  </h2>
                  <p className="text-[#a08d83] max-w-sm leading-relaxed mb-8">
                    We&apos;ll get back to you within 24 hours. In the meantime, feel free to book
                    an appointment online.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setForm({
                          name: '',
                          email: '',
                          phone: '',
                          subject: 'general',
                          message: '',
                        });
                      }}
                      className="border border-[#a08d83] text-[#e4e2e1] px-6 py-3 text-[11px] tracking-widest hover:border-[#ffb68c] hover:text-[#ffb68c] transition-colors"
                    >
                      SEND ANOTHER
                    </button>
                    <a
                      href="../user/book-service.html"
                      className="bg-[#ffb68c] text-[#532200] px-6 py-3 text-[11px] tracking-widest hover:opacity-90 transition-opacity"
                    >
                      BOOK NOW
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1f2020] border border-[#53443c] p-8 md:p-10">
                  <p className="text-[10px] tracking-[0.2em] text-[#a08d83] mb-8">
                    SEND US A MESSAGE
                  </p>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] tracking-widest text-[#d8c2b7] mb-2">
                          FULL NAME *
                        </label>
                        <input
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="James Wilson"
                          className="w-full bg-[#131313] border border-[#53443c] px-4 py-3 text-[#e4e2e1] text-sm focus:outline-none focus:border-[#ffb68c] transition-colors placeholder:text-[#a08d83]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest text-[#d8c2b7] mb-2">
                          EMAIL ADDRESS *
                        </label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full bg-[#131313] border border-[#53443c] px-4 py-3 text-[#e4e2e1] text-sm focus:outline-none focus:border-[#ffb68c] transition-colors placeholder:text-[#a08d83]/50"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] tracking-widest text-[#d8c2b7] mb-2">
                          PHONE NUMBER
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+1 (212) 555-0100"
                          className="w-full bg-[#131313] border border-[#53443c] px-4 py-3 text-[#e4e2e1] text-sm focus:outline-none focus:border-[#ffb68c] transition-colors placeholder:text-[#a08d83]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest text-[#d8c2b7] mb-2">
                          SUBJECT
                        </label>
                        <select
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className="w-full bg-[#131313] border border-[#53443c] px-4 py-3 text-[#e4e2e1] text-sm focus:outline-none focus:border-[#ffb68c] transition-colors cursor-pointer"
                        >
                          <option value="general">General Enquiry</option>
                          <option value="booking">Booking Question</option>
                          <option value="group">Group / Event Booking</option>
                          <option value="feedback">Feedback</option>
                          <option value="press">Press & Media</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-widest text-[#d8c2b7] mb-2">
                        MESSAGE *
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us how we can help..."
                        className="w-full bg-[#131313] border border-[#53443c] px-4 py-3 text-[#e4e2e1] text-sm focus:outline-none focus:border-[#ffb68c] transition-colors resize-none placeholder:text-[#a08d83]/50"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#ffb68c] text-[#532200] py-4 text-[12px] font-semibold tracking-[0.2em] hover:opacity-90 active:scale-95 transition-all"
                    >
                      SEND MESSAGE
                    </button>
                    <p className="text-[10px] text-[#a08d83] text-center">
                      We typically respond within 24 hours on business days.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* ── FAQ ── */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <span className="text-[10px] tracking-[0.3em] text-[#ffb68c] block mb-4">
                COMMON QUESTIONS
              </span>
              <h2
                className="text-[32px] font-bold text-[#e4e2e1]"
                style={{ fontFamily: 'Noto Serif, serif' }}
              >
                FAQ
              </h2>
            </div>
            <div className="space-y-3 max-w-3xl mx-auto">
              {FAQ.map((item, i) => (
                <div
                  key={i}
                  className="border border-[#53443c] hover:border-[#ffb68c] transition-colors overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-medium text-[#e4e2e1] text-sm pr-4">{item.q}</span>
                    <span
                      className="material-symbols-outlined text-[#ffb68c] text-[20px] flex-shrink-0 transition-transform duration-300"
                      style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      <Image src={i11} alt="icon" width={24} height={24} />
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 border-t border-[#53443c]">
                      <p className="text-[#a08d83] text-sm leading-relaxed pt-4">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
