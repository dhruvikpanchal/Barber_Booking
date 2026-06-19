"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { User, Mail, Phone, Camera, Briefcase, Save } from "lucide-react";
import {
  mapAdminProfile,
  mapAdminProfileToApi,
} from "@/client/modules/admin/helpers/adminMappers.js";
import {
  cacheBustUrl,
  extractPhotoUrl,
  mergeAdminProfileWithSession,
  syncProfileAfterMutation,
  syncProfilePhotoEverywhere,
} from "@/client/modules/shared/helpers/profilePhotoHelpers.js";
import {
  Card,
  FieldLabel,
  Input,
  SaveButton,
} from "@/client/modules/shared/components/settings/TinyPrimitives.jsx";
import { toast } from "sonner";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import { regionConfig } from "@/config/region.js";
import {
  PROFILE_PHOTO_ACCEPT,
  validateProfilePhoto,
} from "@/client/lib/auth/photoLimits.js";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";

const PORTAL_ROLE = "admin";

function mapProfileFromApi(api, prev) {
  const merged = mergeAdminProfileWithSession(mapAdminProfile(api));
  if (!merged) return null;

  const keepPreview =
    prev?.photoPreview?.startsWith("blob:") ||
    (prev?.photoPreview && prev.photoPreview !== merged.photoUrl);

  return {
    ...merged,
    photoPreview: keepPreview ? prev.photoPreview : (merged.photoUrl ?? ""),
  };
}

export default function AdminProfile() {
  const queryClient = useQueryClient();
  const { data: profileData, isPending, isError, error, refetch } = adminHook.Profile.useProfile();
  const updateMutation = adminHook.Profile.useUpdateProfile();
  const uploadMutation = adminHook.Profile.useUploadProfilePhoto();
  const [profile, setProfile] = useState(null);

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

  const handleChange = (field) => (e) => {
    patch({ [field]: e.target.value });
  };

  const handleAvatarChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file || busy) return;
      e.target.value = "";

      const validationError = validateProfilePhoto(file);
      if (validationError) {
        toast.error(validationError);
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
        patch({
          photo: nextPhotoUrl,
          photoUrl: nextPhotoUrl,
          photoPreview: displayUrl,
        });
        toast.success("Profile photo updated");
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

  const handleSave = useCallback(
    async (e) => {
      e?.preventDefault?.();
      if (busy || !profile) return;

      const fullName = profile.fullName?.trim() ?? "";
      if (fullName.length < 2) {
        toast.error("Full name must be at least 2 characters.");
        return;
      }

      try {
        const updated = await updateMutation.mutateAsync(mapAdminProfileToApi(profile));
        const mapped = mapProfileFromApi(updated, profile);
        setProfile(mapped);
        syncProfileAfterMutation(queryClient, PORTAL_ROLE, updated);
        toast.success("Profile updated.");
      } catch (err) {
        toast.error(err?.message || "Failed to update profile.");
      }
    },
    [profile, updateMutation, busy, queryClient],
  );

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
          disabled={busy}
          className="text-primary mt-3 text-sm font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          Try again
        </button>
      </div>
    );
  }

  const fieldDisabled = busy;

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-4">
      <div className="max-w-5xl">
        <header className="space-y-2">
          <p className="font-label-caps text-primary">Admin · Profile</p>

          <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
            Admin Settings
          </h1>

          <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
            Manage your administrator account information, contact details, security settings, and
            profile preferences from a single place.
          </p>
        </header>
      </div>

      <div className="py-6">
        <div className="max-w-3xl">
          <Card>
              <div className="mb-6">
                <h2 className="text-on-surface text-sm font-semibold tracking-wide">
                  Profile Details
                </h2>
                <p className="text-on-surface-variant mt-0.5 text-xs">
                  Update your display name, contact phone, and avatar. Email and Role are locked.
                </p>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="border-outline-variant mb-2 flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-center">
                  <div className="relative mx-auto shrink-0 sm:mx-0">
                    <div className="border-outline-variant bg-surface-container relative h-20 w-20 overflow-hidden rounded-2xl border shadow-inner">
                      {displayPhotoUrl ? (
                        <img
                          key={displayPhotoUrl}
                          src={displayPhotoUrl}
                          alt={profile?.fullName || "Profile avatar"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-on-surface-variant flex h-full items-center justify-center">
                          <User className="h-8 w-8 opacity-45" aria-hidden />
                        </div>
                      )}
                    </div>
                    <label className="border-surface-container bg-primary text-on-primary absolute -right-1.5 -bottom-1.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border shadow transition-transform hover:scale-105 active:scale-95">
                      <Camera className="h-3.5 w-3.5" aria-hidden />
                      <input
                        type="file"
                        accept={PROFILE_PHOTO_ACCEPT}
                        onChange={handleAvatarChange}
                        className="sr-only"
                        disabled={fieldDisabled}
                      />
                    </label>
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <p className="text-on-surface text-xs font-semibold">Profile Picture</p>
                    <p className="text-on-surface-variant text-[11px] leading-normal">
                      JPG, PNG or WebP. Max 4 MB.
                    </p>
                    <div className="flex justify-center gap-2 pt-0.5 sm:justify-start">
                      <label className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high inline-flex cursor-pointer items-center justify-center rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors">
                        Upload Photo
                        <input
                          type="file"
                          accept={PROFILE_PHOTO_ACCEPT}
                          onChange={handleAvatarChange}
                          className="sr-only"
                          disabled={fieldDisabled}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <FieldLabel>FULL NAME</FieldLabel>
                    <Input
                      value={profile?.fullName}
                      type="text"
                      icon={User}
                      onChange={handleChange("fullName")}
                      placeholder="e.g. Marcus Vance"
                      disabled={fieldDisabled}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FieldLabel>PHONE NUMBER</FieldLabel>
                    <Input
                      value={profile?.phone}
                      type="tel"
                      icon={Phone}
                      onChange={handleChange("phone")}
                      placeholder={`e.g. ${regionConfig.phoneExample}`}
                      disabled={fieldDisabled}
                    />
                  </div>

                  <div>
                    <FieldLabel>EMAIL ADDRESS (LOCKED)</FieldLabel>
                    <Input
                      type="email"
                      icon={Mail}
                      value={profile?.email}
                      disabled
                      className="bg-surface-container-low cursor-not-allowed opacity-60"
                    />
                  </div>

                  <div>
                    <FieldLabel>ROLE (LOCKED)</FieldLabel>
                    <Input
                      type="text"
                      icon={Briefcase}
                      value={profile?.role}
                      disabled
                      className="bg-surface-container-low cursor-not-allowed opacity-60"
                    />
                  </div>
                </div>

                <div className="border-outline-variant flex justify-end border-t pt-4">
                  <SaveButton
                    type="submit"
                    onClick={handleSave}
                    saving={updateMutation.isPending}
                    label="SAVE CHANGES"
                    icon={Save}
                  />
                </div>
              </form>
            </Card>
        </div>
      </div>
    </div>
  );
}
