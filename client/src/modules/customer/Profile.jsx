"use client";

import { useCallback, useState } from "react";
import { CheckCircle, Save } from "lucide-react";
import ProfileSummaryCard from "./components/Profile/ProfileSummaryCard.jsx";
import ProfileEditorSection from "./components/Profile/ProfileEditorSection.jsx";
import { INITIAL_PROFILE } from "../../data/customer/profileData.js";

export default function Profile() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [saved, setSaved] = useState(false);

  const patch = useCallback((updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleAvatarChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfile((prev) => {
      if (prev.photoUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(prev.photoUrl);
      }
      return { ...prev, photoUrl: URL.createObjectURL(file) };
    });
    e.target.value = "";
  }, []);

  const handleSave = useCallback(() => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3200);
  }, []);

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6 pb-28 text-on-surface md:space-y-8 md:pb-8">
      <header className="space-y-2">
        <p className="font-label-caps text-primary">Customer · Profile</p>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
          My profile
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          Keep your contact details and photo current so shops and barbers
          recognize you at check-in.
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

        <aside className="order-1 lg:order-2 lg:sticky lg:top-4">
          <ProfileSummaryCard
            fullName={profile.fullName}
            email={profile.email}
            phone={profile.phone}
            photoUrl={profile.photoUrl}
            joinedAt={profile.joinedAt}
          />
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-[var(--bottom-nav-height)] z-30 border-t border-outline-variant bg-surface/95 px-4 py-3 backdrop-blur md:static md:bottom-auto md:z-auto md:border-t-0 md:bg-transparent md:px-0 md:py-0 md:pt-4">
        <div className="mx-auto flex max-w-5xl flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-xs text-on-surface-variant sm:text-left">
            {saved
              ? "Your profile was saved locally. Connect a backend to persist changes."
              : "Edits stay in this browser until an account API is connected."}
          </p>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold tracking-wide text-on-primary transition-opacity hover:opacity-90 active:scale-[0.98] sm:w-auto sm:px-8"
          >
            <Save className="h-4 w-4 shrink-0" aria-hidden />
            Save changes
          </button>
        </div>
      </div>

      {saved ? (
        <div
          className="fixed bottom-24 right-4 z-50 flex max-w-sm items-center gap-2.5 rounded-lg border border-status-confirmed/25 bg-surface-container-high px-4 py-3 shadow-xl md:bottom-6 md:right-6"
          role="status"
        >
          <CheckCircle
            className="h-5 w-5 shrink-0 text-status-confirmed"
            aria-hidden
          />
          <span className="text-sm font-medium text-on-surface">
            Profile updated — looks great.
          </span>
        </div>
      ) : null}
    </div>
  );
}
