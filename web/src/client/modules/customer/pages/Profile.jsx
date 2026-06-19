"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { getStoredUser } from "@/client/lib/auth/session.js";
import {
  cacheBustUrl,
  extractPhotoUrl,
  mergeCustomerProfileWithSession,
  syncProfileAfterMutation,
  syncProfilePhotoEverywhere,
} from "@/client/modules/shared/helpers/profilePhotoHelpers.js";
import ProfileEditorSection from "@/client/modules/customer/components/Profile/ProfileEditorSection.jsx";
import { customerHook } from "@/client/modules/customer/hooks/customerQuery.jsx";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";

const PORTAL_ROLE = "customer";

function mapProfileFromApi(dto, prev) {
  const merged = mergeCustomerProfileWithSession(dto);
  if (!merged) return null;

  const keepPreview =
    prev?.photoPreview?.startsWith("blob:") ||
    (prev?.photoPreview && prev.photoPreview !== merged.photoUrl);

  return {
    ...merged,
    photoPreview: keepPreview ? prev.photoPreview : (merged.photoUrl ?? ""),
  };
}

export default function Profile() {
  const queryClient = useQueryClient();
  const { data: profileData, isPending, isError, error, refetch } = customerHook.Profile.useGetProfile();
  const updateMutation = customerHook.Profile.useUpdateProfile();
  const uploadMutation = customerHook.Profile.useUploadProfilePhoto();

  const [profile, setProfile] = useState(null);
  const [saved, setSaved] = useState(false);

  const busy = isPending || updateMutation.isPending || uploadMutation.isPending;
  const displayPhotoUrl = profile?.photoPreview || profile?.photoUrl || null;

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Failed to load profile");
    }
  }, [isError, error]);

  useEffect(() => {
    if (!profileData) return;
    setProfile((prev) => mapProfileFromApi(profileData, prev));
  }, [profileData]);

  const patch = useCallback((updates) => {
    setProfile((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const handleAvatarChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file || busy) return;
      e.target.value = "";

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a JPG, PNG, or WebP image.");
        return;
      }

      const localPreview = URL.createObjectURL(file);
      const previousPreview = profile?.photoPreview ?? profile?.photoUrl ?? "";
      patch({ photoPreview: localPreview });

      try {
        const result = await uploadMutation.mutateAsync(file);
        const nextPhotoUrl = extractPhotoUrl(result);
        if (!nextPhotoUrl) {
          throw new Error("Upload succeeded but no photo URL was returned.");
        }

        const displayUrl = syncProfilePhotoEverywhere(queryClient, PORTAL_ROLE, nextPhotoUrl);
        patch({ photoUrl: nextPhotoUrl, photoPreview: displayUrl });
        toast.success("Profile photo updated");
        setSaved(true);
        window.setTimeout(() => setSaved(false), 3200);
      } catch (err) {
        patch({ photoPreview: previousPreview ? cacheBustUrl(previousPreview) : "" });
        toast.error(err?.message || "Photo upload failed");
      } finally {
        window.requestAnimationFrame(() => {
          URL.revokeObjectURL(localPreview);
        });
      }
    },
    [busy, uploadMutation, patch, profile?.photoPreview, profile?.photoUrl, queryClient],
  );

  const handleSave = useCallback(async () => {
    if (!profile || busy) return;

    const stored = getStoredUser();
    const trimmedName = profile.fullName?.trim() ?? "";
    if (trimmedName.length < 2) {
      toast.error("Full name must be at least 2 characters.");
      return;
    }

    const email = profile.email?.trim() || stored?.email || "";

    if (!email) {
      toast.error("Email is missing. Refresh the page and try again.");
      return;
    }

    try {
      const updated = await updateMutation.mutateAsync({
        fullName: trimmedName,
        email,
        phone: profile.phone?.trim() ?? "",
        address: profile.address?.trim() ?? "",
      });

      const mapped = mapProfileFromApi(updated, profile);
      setProfile(mapped);
      syncProfileAfterMutation(queryClient, PORTAL_ROLE, updated);
      toast.success("Profile saved");
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3200);
    } catch (err) {
      toast.error(err?.message || "Could not save profile");
    }
  }, [profile, busy, updateMutation, queryClient]);

  if (isPending && !profile) {
    return <PageLoader label="Loading profile..." className="mx-auto max-w-6xl" />;
  }

  if (!profile) {
    return (
      <div className="text-on-surface mx-auto max-w-6xl py-16 text-center">
        <p>{error?.message ?? "Profile unavailable."}</p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isPending}
          className="text-primary mt-3 text-sm font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="text-on-surface mx-auto w-full max-w-6xl min-w-0 space-y-6 md:space-y-8">
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

      <ProfileEditorSection
        profile={profile}
        photoUrl={displayPhotoUrl}
        onPatch={patch}
        onAvatarChange={handleAvatarChange}
        disabled={busy}
      />

      <div className="border-outline-variant bg-surface/95 fixed inset-x-0 bottom-[var(--bottom-nav-height)] z-30 border-t px-4 py-3 backdrop-blur md:static md:bottom-auto md:z-auto md:border-t-0 md:bg-transparent md:px-0 md:py-0 md:pt-4">
        <div className="mx-auto flex max-w-5xl flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-on-surface-variant text-center text-xs sm:text-left">
            {saved ? "Your profile was saved." : "Changes are saved to your account."}
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={busy}
            className="bg-primary text-on-primary inline-flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-semibold tracking-wide transition-opacity hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
          >
            <Save className="h-4 w-4 shrink-0" aria-hidden />
            {updateMutation.isPending ? "Saving…" : "Save changes"}
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
