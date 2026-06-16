"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import BookingStep1Barber from "@/client/modules/customer/components/Booking/BookingStep1Barber.jsx";
import BookingStep2Services from "@/client/modules/customer/components/Booking/BookingStep2Services.jsx";
import BookingStep3DateTime from "@/client/modules/customer/components/Booking/BookingStep3DateTime.jsx";
import BookingStep4Summary from "@/client/modules/customer/components/Booking/BookingStep4Summary.jsx";
import BookingConfirmed from "@/client/modules/customer/components/Booking/BookingConfirmed.jsx";
import { customerHook } from "@/client/modules/customer/hooks/customerQuery.jsx";
import { buildStartAt } from "@/client/modules/shared/helpers/buildStartAt";
import { STEPS } from "@/client/modules/customer/constants/BookAppointmentConstants.js";

const INITIAL_BOOKING = {
  barber: null,
  services: [],
  date: null,
  time: null,
  timeLabel: null,
};

function canAdvance(step, booking) {
  switch (step) {
    case 0:
      return !!booking.barber;
    case 1:
      return booking.services.length > 0;
    case 2:
      return !!booking.date && !!booking.time;
    default:
      return true;
  }
}

function StepIndicator({ currentStep, totalSteps, disabled = false }) {
  return (
    <>
      <div className="hidden items-center justify-between sm:flex">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const done = idx < currentStep;
          const active = idx === currentStep;
          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    done
                      ? "border-primary bg-primary text-on-primary"
                      : active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-outline-variant bg-surface-container text-on-surface-variant"
                  } ${disabled ? "opacity-50" : ""}`}
                >
                  {done ? (
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8l3.5 3.5L13 4.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={`font-label-caps text-[10px] whitespace-nowrap ${active ? "text-primary" : done ? "text-on-surface-variant" : "text-on-surface-variant/50"}`}
                >
                  {step.label}
                </span>
              </div>
              {idx < totalSteps - 1 && (
                <div
                  className={`mx-2 h-px flex-1 transition-colors duration-300 ${idx < currentStep ? "bg-primary" : "bg-outline-variant"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between sm:hidden">
        <p className="text-on-surface text-sm font-semibold">
          Step {currentStep + 1} of {totalSteps}
          <span className="text-on-surface-variant ml-2 font-normal">
            — {STEPS[currentStep].label}
          </span>
        </p>
        <div className="flex gap-1">
          {STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx < currentStep ? "bg-primary w-4" : idx === currentStep ? "bg-primary w-6" : "bg-outline-variant w-1.5"}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default function BookAppointment() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState(INITIAL_BOOKING);
  const [confirmed, setConfirmed] = useState(false);

  const { data: barbersResult, isPending: barbersPending } =
    customerHook.Booking.useListBookingBarbers({ limit: 50 });
  const confirmMutation = customerHook.Booking.useConfirmBooking();

  const busy = barbersPending || confirmMutation.isPending;

  useEffect(() => {
    const barberId = searchParams.get("barber");
    if (!barberId || !barbersResult) return;
    const items = barbersResult.items ?? [];
    const barber = items.find((b) => b.id === barberId || b.slug === barberId);
    if (barber) setBooking({ ...INITIAL_BOOKING, barber });
  }, [searchParams, barbersResult]);

  const patchBooking = useCallback((updates) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleBarberSelect = useCallback((barber) => {
    setBooking((prev) => ({
      ...INITIAL_BOOKING,
      barber,
    }));
  }, []);

  const handleServiceToggle = useCallback((service) => {
    setBooking((prev) => {
      const exists = prev.services.find((s) => s.id === service.id);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s.id !== service.id)
          : [...prev.services, service],
      };
    });
  }, []);

  const handleDateTimeSelect = useCallback(
    (updates) => {
      patchBooking(updates);
    },
    [patchBooking],
  );

  const handleEditStep = useCallback(
    (stepIndex) => {
      if (!busy) setStep(stepIndex);
    },
    [busy],
  );

  const handleNext = () => {
    if (!busy && canAdvance(step, booking)) setStep((s) => s + 1);
  };
  const handleBack = () => {
    if (!busy) setStep((s) => Math.max(0, s - 1));
  };

  const handleConfirm = async () => {
    if (
      busy ||
      !booking.barber ||
      !booking.date ||
      !booking.time ||
      booking.services.length === 0
    ) {
      return;
    }
    try {
      await toast.promise(
        confirmMutation.mutateAsync({
          barberId: booking.barber.slug ?? booking.barber.id,
          serviceIds: booking.services.map((s) => s.id),
          startAt: buildStartAt(booking.date, booking.time),
          notes: booking.notes ?? "",
        }),
        {
          loading: "Confirming your booking…",
          success: "Appointment booked successfully!",
          error: "Could not confirm booking. Please try again.",
        },
      );
      setConfirmed(true);
    } catch {
      /* toast handles error */
    }
  };

  const handleBookAnother = () => {
    setBooking(INITIAL_BOOKING);
    setStep(0);
    setConfirmed(false);
    router.push("/customer/book-appointment");
  };

  if (confirmed) {
    return (
      <div className="mx-auto max-w-2xl pb-28 md:pb-8">
        <BookingConfirmed booking={booking} onBookAnother={handleBookAnother} />
      </div>
    );
  }

  const currentStepMeta = STEPS[step];
  const isSummaryStep = step === 4;

  return (
    <div className="text-on-surface mx-auto w-full max-w-6xl min-w-0 space-y-6 pb-28 md:space-y-8 md:pb-8">
      <header className="mb-6 space-y-1">
        <p className="font-label-caps text-primary">Customer · Booking</p>
        <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
          Book an appointment
        </h1>
        <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
          Find your barber, choose services, and pick a time. Pay at the chair after your visit.
        </p>
      </header>

      <div className="border-outline-variant bg-surface-container-low mb-6 rounded-xl border px-5 py-4">
        <StepIndicator currentStep={step} totalSteps={STEPS.length} disabled={busy} />
      </div>

      <div className="border-outline-variant bg-surface-container-low rounded-xl border">
        <div className="border-outline-variant border-b px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="border-primary/20 bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg border">
              <currentStepMeta.icon className="text-primary h-4 w-4" />
            </div>
            <div>
              <h2 className="text-on-surface font-serif text-base font-bold">
                {currentStepMeta.title}
              </h2>
              <p className="text-on-surface-variant text-xs">{currentStepMeta.sub}</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {step === 0 && (
            <BookingStep1Barber booking={booking} onSelect={handleBarberSelect} disabled={busy} />
          )}
          {step === 1 && (
            <BookingStep2Services
              booking={booking}
              onToggle={handleServiceToggle}
              disabled={busy}
            />
          )}
          {step === 2 && (
            <BookingStep3DateTime
              booking={booking}
              onSelect={handleDateTimeSelect}
              disabled={busy}
            />
          )}
          {step === 3 && (
            <BookingStep4Summary
              booking={booking}
              onConfirm={handleConfirm}
              confirming={confirmMutation.isPending}
              disabled={busy}
            />
          )}
        </div>
      </div>

      {!isSummaryStep && (
        <div className="border-outline-variant bg-surface/95 fixed inset-x-0 bottom-[var(--bottom-nav-height)] z-30 border-t px-4 py-3 backdrop-blur md:static md:bottom-auto md:z-auto md:mt-5 md:border-t-0 md:bg-transparent md:px-0 md:py-0">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 0 || busy}
              className="border-outline-variant text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface inline-flex h-11 items-center gap-2 rounded-lg border px-5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <div className="flex items-center gap-3">
              <span className="text-on-surface-variant hidden text-xs sm:block">
                {step + 1} / {STEPS.length}
              </span>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={busy || !canAdvance(step, booking)}
                  className="bg-primary text-on-primary inline-flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 12l4-4-4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
