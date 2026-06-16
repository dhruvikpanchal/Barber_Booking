"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { User, Mail, Phone, Camera, Calendar, Sparkles, Briefcase, Save } from "lucide-react";
import {
  mapAdminProfile,
  mapAdminProfileToApi,
} from "@/client/modules/admin/helpers/adminMappers.js";
import { formatMemberSince } from "@/client/modules/admin/helpers/profileHelpers.js";
import {
  Card,
  FieldLabel,
  Input,
  SaveButton,
} from "@/client/modules/shared/components/settings/TinyPrimitives.jsx";
import { toast } from "sonner";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";

export default function AdminProfile() {
  const { data: profileData, isPending, isError, error, refetch } = adminHook.Profile.useProfile();
  const updateMutation = adminHook.Profile.useUpdateProfile();
  const [profile, setProfile] = useState(null);

  const busy = isPending || updateMutation.isPending;

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Failed to load profile");
    }
  }, [isError, error]);

  useEffect(() => {
    if (profileData) setProfile(mapAdminProfile(profileData));
  }, [profileData]);

  const memberLabel = useMemo(() => formatMemberSince(profile?.createdAt), [profile?.createdAt]);

  const handleChange = (field) => (e) => {
    setProfile((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleAvatarChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setProfile((prev) => ({
      ...prev,
      photo: preview,
      photoUrl: preview,
    }));
  }, []);

  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();
      if (busy) return;

      try {
        await toast.promise(updateMutation.mutateAsync(mapAdminProfileToApi(profile)), {
          loading: "Saving profile…",
          success: "Profile updated.",
          error: "Failed to update profile.",
        });
        await refetch();
      } catch {
        /* toast handles error */
      }
    },
    [profile, updateMutation, refetch, busy],
  );

  if (isPending && !profile) {
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
      {/* Top Banner Header */}

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

      {/* Main Grid Content */}
      <div className="py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start lg:gap-8">
          {/* Left Column: Form Editor */}
          <div className="space-y-6">
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
                {/* Avatar Section */}
                <div className="border-outline-variant mb-2 flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-center">
                  <div className="relative mx-auto shrink-0 sm:mx-0">
                    <div className="border-outline-variant bg-surface-container relative h-20 w-20 overflow-hidden rounded-2xl border shadow-inner">
                      {profile?.photoUrl ? (
                        <img
                          src={profile?.photoUrl}
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
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleAvatarChange}
                        className="sr-only"
                        disabled={busy}
                      />
                    </label>
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <p className="text-on-surface text-xs font-semibold">Profile Picture</p>
                    <p className="text-on-surface-variant text-[11px] leading-normal">
                      JPG, PNG or WebP. Under 5MB recommended.
                    </p>
                    <div className="flex justify-center gap-2 pt-0.5 sm:justify-start">
                      <label className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high inline-flex cursor-pointer items-center justify-center rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors">
                        Upload Photo
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={handleAvatarChange}
                          className="sr-only"
                          disabled={busy}
                        />
                      </label>
                      {profile?.photoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setProfile((prev) => ({ ...prev, photo: "" }));
                            toast.success("Photo removed.");
                          }}
                          className="border-outline-variant bg-surface-container-low text-error hover:bg-surface-container inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <FieldLabel>FULL NAME</FieldLabel>
                    <Input
                      value={profile?.fullName}
                      type="text"
                      icon={User}
                      onChange={handleChange("fullName")}
                      placeholder="e.g. Marcus Vance"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FieldLabel>PHONE NUMBER</FieldLabel>
                    <Input
                      value={profile?.phone}
                      type="tel"
                      icon={Phone}
                      onChange={handleChange("phone")}
                      placeholder="e.g. +1 (555) 831-2940"
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

                {/* Submit Action */}
                <div className="border-outline-variant flex justify-end border-t pt-4">
                  <SaveButton
                    type="submit"
                    saving={updateMutation.isPending}
                    label="SAVE CHANGES"
                    icon={Save}
                  />
                </div>
              </form>
            </Card>
          </div>

          {/* Right Column: Profile Card Preview */}
          <aside className="lg:sticky lg:top-4">
            <div className="border-outline-variant bg-surface-container-low relative overflow-hidden rounded-lg border shadow-sm">
              {/* Header Gradient */}
              <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent" />

              {/* Profile Image & Badge */}
              <div className="border-outline-variant/80 relative flex flex-col items-center border-b p-6 text-center">
                <div className="relative h-24 w-24">
                  <div className="from-primary/30 to-primary/5 absolute inset-0 rounded-full bg-gradient-to-br p-[2px]">
                    <div className="border-surface-container bg-surface-container flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2">
                      {profile.photoUrl ? (
                        <img
                          src={profile.photoUrl}
                          alt={profile.fullName || "Admin"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="text-on-surface-variant/45 h-10 w-10" aria-hidden />
                      )}
                    </div>
                  </div>
                  <span className="font-label-caps border-primary/20 bg-primary/10 text-primary absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full border px-2.5 py-0.5 text-[9px] font-semibold tracking-wider">
                    {profile.role}
                  </span>
                </div>

                <h3 className="text-on-surface mt-5 font-serif text-lg font-bold tracking-tight">
                  {profile.fullName?.trim() || "Your Name"}
                </h3>
                <p className="text-on-surface-variant mt-1 inline-flex items-center justify-center gap-1 text-[11px] font-medium">
                  <Sparkles className="text-primary/80 h-3 w-3" aria-hidden />
                  Platform Administrator
                </p>
              </div>

              {/* Account details list */}
              <div className="divide-outline-variant/60 relative divide-y p-4 text-xs">
                <div className="flex items-start gap-3 py-2.5 first:pt-0">
                  <div className="bg-surface-container text-on-surface-variant mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded">
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-label-caps text-on-surface-variant text-[9px] font-medium tracking-wide">
                      EMAIL
                    </p>
                    <p className="text-on-surface font-medium break-all">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 py-2.5">
                  <div className="bg-surface-container text-on-surface-variant mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded">
                    <Phone className="h-3.5 w-3.5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-label-caps text-on-surface-variant text-[9px] font-medium tracking-wide">
                      PHONE
                    </p>
                    <p className="text-on-surface font-medium">
                      {profile.phone?.trim() ? profile.phone : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 py-2.5 last:pb-0">
                  <div className="bg-primary/10 text-primary mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded">
                    <Calendar className="h-3.5 w-3.5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-label-caps text-on-surface-variant text-[9px] font-medium tracking-wide">
                      MEMBER SINCE
                    </p>
                    <p className="text-on-surface font-medium">{memberLabel}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
