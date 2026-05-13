'use client';
import { useState } from 'react';
import { APPOINTMENTS, HISTORY, statusColors } from '@/constants/Data';

export default function MyBookings() {
  const [tab, setTab] = useState('upcoming');
  const [cancelId, setCancelId] = useState(null);
  const [ratingId, setRatingId] = useState(null);
  const [starHover, setStarHover] = useState(0);
  const [starSelected, setStarSelected] = useState(0);

  return (
    <div className="min-h-screen bg-[#131313] text-[#e4e2e1]">
      <div className="flex min-h-screen">
        {/* MAIN */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden">
          <div className="mb-10">
            <span className="text-[10px] tracking-[0.3em] text-[#ffb68c]">CLIENT PORTAL</span>
            <h1
              className="text-[28px] sm:text-[32px] md:text-[36px] font-bold tracking-tight mt-1 leading-tight"
              style={{ fontFamily: 'Noto Serif, serif' }}
            >
              My Bookings
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-[#53443c] mb-6 scrollbar-hide">
            {[
              ['upcoming', 'Upcoming'],
              ['history', 'History'],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-5 sm:px-8 py-3 whitespace-nowrap text-[11px] tracking-widest border-b-2 transition-colors -mb-px ${tab === key ? 'border-[#ffb68c] text-[#ffb68c]' : 'border-transparent text-[#a08d83] hover:text-[#e4e2e1]'}`}
              >
                {label.toUpperCase()}
              </button>
            ))}
          </div>

          {/* UPCOMING */}
          {tab === 'upcoming' && (
            <div className="space-y-6">
              {APPOINTMENTS.length === 0 ? (
                <div className="text-center py-24 border border-[#53443c] bg-[#1f2020]">
                  <span className="material-symbols-outlined text-[48px] text-[#a08d83] block mb-4">
                    calendar_today
                  </span>
                  <p className="text-[#a08d83] text-[11px] tracking-widest mb-6">
                    NO UPCOMING APPOINTMENTS
                  </p>
                  <a
                    href="book-service.html"
                    className="bg-[#ffb68c] text-[#532200] px-8 py-3 text-[11px] tracking-widest inline-block hover:opacity-90 transition-opacity"
                  >
                    BOOK NOW
                  </a>
                </div>
              ) : (
                APPOINTMENTS.map((appt) => (
                  <div
                    key={appt.id}
                    className="bg-[#1f2020] border border-[#53443c] overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-3 border-b border-[#53443c] bg-[#1b1c1c]">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[9px] tracking-widest px-2 py-1 border ${statusColors[appt.status]}`}
                        >
                          {appt.status.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-[#a08d83]">#{appt.id}</span>
                      </div>
                      <span className="text-[10px] text-[#a08d83]">${appt.price}</span>
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col xl:flex-row gap-6">
                      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <p className="text-[9px] tracking-widest text-[#a08d83] mb-2">SERVICE</p>
                          <p
                            className="text-[18px] font-medium text-[#e4e2e1]"
                            style={{ fontFamily: 'Noto Serif, serif' }}
                          >
                            {appt.service}
                          </p>
                          <p className="text-[#a08d83] text-sm mt-1">{appt.duration} minutes</p>
                        </div>
                        <div>
                          <p className="text-[9px] tracking-widest text-[#a08d83] mb-2">
                            WHEN & WHO
                          </p>
                          <p className="text-[#e4e2e1]">{appt.date}</p>
                          <p className="text-[#ffb68c] text-sm mt-1">{appt.time}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <img
                              src={appt.barberImg}
                              alt=""
                              className="w-6 h-6 object-cover grayscale"
                            />
                            <span className="text-[#d8c2b7] text-sm">{appt.barber}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row xl:flex-col gap-3 justify-end w-full xl:w-auto">
                        <a
                          href="book-service.html"
                          className="border border-[#a08d83] text-[#e4e2e1] px-4 py-2 text-[11px] tracking-widest hover:border-[#ffb68c] hover:text-[#ffb68c] transition-colors text-center"
                        >
                          RESCHEDULE
                        </a>
                        <button
                          onClick={() => setCancelId(appt.id)}
                          className="border border-[#ffb4ab]/50 text-[#ffb4ab] px-4 py-2 text-[11px] tracking-widest hover:bg-[#93000a]/20 transition-colors"
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              <a
                href="book-service.html"
                className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center border border-dashed border-[#53443c] p-6 text-[#a08d83] hover:border-[#ffb68c] hover:text-[#ffb68c] transition-colors group"
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                <span className="text-[11px] tracking-widest">BOOK A NEW APPOINTMENT</span>
              </a>
            </div>
          )}

          {/* HISTORY */}
          {tab === 'history' && (
            <div className="space-y-4">
              {HISTORY.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-[#1f2020] border border-[#53443c] p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className={`text-[9px] tracking-widest px-2 py-0.5 border ${statusColors[appt.status]}`}
                        >
                          {appt.status.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-[#a08d83]">{appt.date}</span>
                      </div>
                      <p className="text-[#e4e2e1] font-medium">{appt.service}</p>
                      <p className="text-[#a08d83] text-sm mt-1">
                        with {appt.barber} · ${appt.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {appt.status === 'completed' &&
                      (appt.rated ? (
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} className="text-[#ffb68c]">
                              ★
                            </span>
                          ))}
                        </div>
                      ) : (
                        <button
                          onClick={() => setRatingId(appt.id)}
                          className="border border-[#53443c] text-[#a08d83] px-4 py-2 text-[11px] tracking-widest hover:border-[#ffb68c] hover:text-[#ffb68c] transition-colors"
                        >
                          LEAVE REVIEW
                        </button>
                      ))}
                    {appt.status === 'completed' && (
                      <a
                        href="book-service.html"
                        className="bg-[#ffb68c] text-[#532200] px-4 py-2 text-[11px] tracking-widest hover:opacity-90 transition-opacity"
                      >
                        REBOOK
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      {/* CANCEL MODAL */}
      {cancelId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#1f2020] border border-[#53443c] p-5 sm:p-8 max-w-sm w-full">
            <div className="w-12 h-12 border border-[#ffb4ab]/40 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[#ffb4ab] text-[24px]">warning</span>
            </div>
            <h3
              className="text-[20px] font-medium mb-3"
              style={{ fontFamily: 'Noto Serif, serif' }}
            >
              Cancel Appointment?
            </h3>
            <p className="text-[#d8c2b7] text-sm mb-8 leading-relaxed">
              This action cannot be undone. A cancellation confirmation will be sent to your email.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setCancelId(null)}
                className="flex-1 border border-[#53443c] py-3 text-[11px] tracking-widest hover:border-[#ffb68c] hover:text-[#ffb68c] transition-colors"
              >
                KEEP IT
              </button>
              <button
                onClick={() => setCancelId(null)}
                className="flex-1 bg-[#93000a] text-[#ffdad6] py-3 text-[11px] tracking-widest hover:opacity-90 transition-opacity"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
      {/* RATING MODAL */}
      {ratingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#1f2020] border border-[#53443c] p-5 sm:p-8 max-w-sm w-full">
            <h3
              className="text-[20px] font-medium mb-2"
              style={{ fontFamily: 'Noto Serif, serif' }}
            >
              Rate Your Experience
            </h3>
            <p className="text-[#a08d83] text-sm mb-6">How was your visit?</p>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setStarHover(star)}
                  onMouseLeave={() => setStarHover(0)}
                  onClick={() => setStarSelected(star)}
                  className={`text-2xl sm:text-3xl transition-colors ${star <= (starHover || starSelected) ? 'text-[#ffb68c]' : 'text-[#53443c]'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              placeholder="Share your experience (optional)..."
              className="w-full bg-[#131313] border border-[#53443c] px-4 py-3 text-[#e4e2e1] text-sm focus:outline-none focus:border-[#ffb68c] resize-none mb-6 placeholder:text-[#a08d83]/50"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setRatingId(null)}
                className="flex-1 border border-[#53443c] py-3 text-[11px] tracking-widest hover:border-[#a08d83] transition-colors"
              >
                SKIP
              </button>
              <button
                onClick={() => setRatingId(null)}
                className="flex-1 bg-[#ffb68c] text-[#532200] py-3 text-[11px] tracking-widest hover:opacity-90 transition-opacity"
              >
                SUBMIT REVIEW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
