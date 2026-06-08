"use client";
import ErrorPage from "@/client/modules/shared/components/ui/Error.jsx";

export default function Error({ error, reset }) {
  return <ErrorPage error={error} reset={reset} />;
}
