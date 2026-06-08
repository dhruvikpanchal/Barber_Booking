"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}) {
  useEffect(() => {
    console.error(error);
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      void import("@sentry/nextjs").then((Sentry) => {
        Sentry.captureException(error);
      });
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-bold text-red-600 mb-4">
          Oops!
        </h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Something went wrong
        </h2>

        <p className="text-gray-500 mb-6">
          An unexpected error occurred.
          Please try again.
        </p>

        <button
          onClick={() => reset()}
          className="px-5 py-3 rounded-lg bg-black text-white hover:opacity-90 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}