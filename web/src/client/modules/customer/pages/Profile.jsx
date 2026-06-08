"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle, Save } from "lucide-react";
import ProfileSummaryCard from "@/client/modules/customer/components/Profile/ProfileSummaryCard.jsx";
import ProfileEditorSection from "@/client/modules/customer/components/Profile/ProfileEditorSection.jsx";
import customerServices from "@/client/modules/customer/services/customerServices.jsx";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    customerServices
      .getProfile()
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "Failed to load profile");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const patch = useCallback((updates) => {
    setProfile((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const handleAvatarChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";
      try {
        const updated = await customerServices.uploadProfilePhoto(file);
        setProfile((prev) =>
          prev ? { ...prev, photoUrl: updated.photoUrl ?? prev.photoUrl } : prev,
        );
        setSaved(true);
        window.setTimeout(() => setSaved(false), 3200);
      } catch (err) {
        setError(err?.message ?? "Photo upload failed");
      }
    },
    [],
  );

  const handleSave = useCallback(async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await customerServices.updateProfile({
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone ?? "",
        address: profile.address ?? "",
      });
      setProfile(updated);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3200);
    } catch (err) {
      setError(err?.message ?? "Could not save profile");
    } finally {
      setSaving(false);
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 pb-28">
        <div className="bg-surface-container h-32 animate-pulse rounded-xl" />
        <div className="bg-surface-container h-64 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-on-surface mx-auto max-w-6xl py-16 text-center">
        <p>{error ?? "Profile unavailable."}</p>
      </div>
    );
  }

  return (
    <div className="text-on-surface mx-auto w-full max-w-6xl min-w-0 space-y-6 pb-28 md:space-y-8 md:pb-8">
      <header className="space-y-2">
        <p className="font-label-caps text-primary">Customer · Profile</p>
        <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
          My profile
        </h1>
        <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
          Keep your contact details and photo current so shops and barbers recognize you at
          check-in.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-8">
        <div className="order-2 lg:order-1">
          <ProfileEditorSection
            profile={profile}
            onPatch={patch}
            onAvatarChange={handleAvatarChange}
          />
        </div>

        <aside className="order-1 lg:sticky lg:top-4 lg:order-2">
          <ProfileSummaryCard
            fullName={profile.fullName}
            email={profile.email}
            phone={profile.phone}
            photoUrl={profile.photoUrl}
            joinedAt={profile.joinedAt}
          />
        </aside>
      </div>

      <div className="border-outline-variant bg-surface/95 fixed inset-x-0 bottom-[var(--bottom-nav-height)] z-30 border-t px-4 py-3 backdrop-blur md:static md:bottom-auto md:z-auto md:border-t-0 md:bg-transparent md:px-0 md:py-0 md:pt-4">
        <div className="mx-auto flex max-w-5xl flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-on-surface-variant text-center text-xs sm:text-left">
            {error
              ? error
              : saved
                ? "Your profile was saved."
                : "Changes are saved to your account."}
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-on-primary inline-flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-semibold tracking-wide transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-50 sm:w-auto sm:px-8"
          >
            <Save className="h-4 w-4 shrink-0" aria-hidden />
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {saved ? (
        <div
          className="border-status-confirmed/25 bg-surface-container-high fixed right-4 bottom-24 z-50 flex max-w-sm items-center gap-2.5 rounded-lg border px-4 py-3 shadow-xl md:right-6 md:bottom-6"
          role="status"
        >
          <CheckCircle className="text-status-confirmed h-5 w-5 shrink-0" aria-hidden />
          <span className="text-on-surface text-sm font-medium">
            Profile updated — looks great.
          </span>
        </div>
      ) : null}
    </div>
  );
}
