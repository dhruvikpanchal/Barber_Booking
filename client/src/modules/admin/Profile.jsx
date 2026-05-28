"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  Camera,
  Shield,
  Calendar,
  Sparkles,
  AlertCircle,
  Briefcase,
  Save,
} from "lucide-react";
import { INITIAL_PROFILE, formatMemberSince } from "../../data/admin/profileData.js";
import {
  Card,
  FieldLabel,
  Input,
  SaveButton,
  Toast,
} from "@/components/common/settings/TinyPrimitives.jsx";

export default function AdminProfile() {
  const [form, setForm] = useState(INITIAL_PROFILE);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const handleCloseToast = useCallback(() => {
    setToast(null);
  }, []);

  const validate = useCallback(() => {
    const nextErrors = {};
    if (!form.fullName.trim()) {
      nextErrors.fullName = "Full name is required";
    } else if (form.fullName.trim().length < 2) {
      nextErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required";
    } else {
      const cleanPhone = form.phone.replace(/[^0-9]/g, "");
      if (cleanPhone.length < 8) {
        nextErrors.phone = "Please enter a valid phone number";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form.fullName, form.phone]);

  const handleAvatarChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Only image files are allowed", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be smaller than 5MB", "error");
      return;
    }

    setForm((prev) => {
      if (prev.photoUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(prev.photoUrl);
      }
      return { ...prev, photoUrl: URL.createObjectURL(file) };
    });

    showToast("Profile photo selected. Save changes to persist.", "info");
    e.target.value = "";
  }, [showToast]);

  const handleSave = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast("Please correct the errors in the form.", "error");
      return;
    }

    setSaving(true);
    // Simulate API update call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    showToast("Profile details updated successfully.", "success");
  }, [validate, showToast]);

  const memberLabel = formatMemberSince(form.joinedAt);

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-4">
      {/* Top Banner Header */}

      <div className="max-w-5xl">
        <header className="space-y-2">
          <p className="font-label-caps text-primary">
            Admin · Profile
          </p>

          <h1 className="font-serif text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
            Admin Settings
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant">
            Manage your administrator account information, contact details,
            security settings, and profile preferences from a single place.
          </p>
        </header>

      </div>

      {/* Main Grid Content */}
      <div className=" py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start lg:gap-8">

          {/* Left Column: Form Editor */}
          <div className="space-y-6">
            <Card>
              <div className="mb-6">
                <h2 className="text-sm font-semibold tracking-wide text-on-surface">
                  Profile Details
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Update your display name, contact phone, and avatar. Email and Role are locked.
                </p>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center border-b border-outline-variant pb-6 mb-2">
                  <div className="relative mx-auto shrink-0 sm:mx-0">
                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container shadow-inner">
                      {form.photoUrl ? (
                        <img
                          src={form.photoUrl}
                          alt={form.fullName || "Profile avatar"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-on-surface-variant">
                          <User className="h-8 w-8 opacity-45" aria-hidden />
                        </div>
                      )}
                    </div>
                    <label className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-surface-container bg-primary text-on-primary shadow transition-transform hover:scale-105 active:scale-95">
                      <Camera className="h-3.5 w-3.5" aria-hidden />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="sr-only"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <p className="text-xs font-semibold text-on-surface">
                      Profile Picture
                    </p>
                    <p className="text-[11px] leading-normal text-on-surface-variant">
                      JPG, PNG or WebP. Under 5MB recommended.
                    </p>
                    <div className="flex justify-center sm:justify-start gap-2 pt-0.5">
                      <label className="inline-flex items-center justify-center rounded-md border border-outline-variant bg-surface-container px-3 py-1.5 text-xs font-semibold text-on-surface cursor-pointer hover:bg-surface-container-high transition-colors">
                        Upload Photo
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="sr-only"
                          onChange={handleAvatarChange}
                        />
                      </label>
                      {form.photoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({ ...prev, photoUrl: "" }));
                            showToast("Photo removed.", "info");
                          }}
                          className="inline-flex items-center justify-center rounded-md border border-outline-variant bg-surface-container-low px-3 py-1.5 text-xs font-semibold text-error hover:bg-surface-container transition-colors"
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
                      type="text"
                      icon={User}
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="e.g. Marcus Vance"
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-error font-medium">
                        <AlertCircle className="h-3 w-3 shrink-0" aria-hidden />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <FieldLabel>PHONE NUMBER</FieldLabel>
                    <Input
                      type="tel"
                      icon={Phone}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. +1 (555) 831-2940"
                    />
                    {errors.phone && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-error font-medium">
                        <AlertCircle className="h-3 w-3 shrink-0" aria-hidden />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <FieldLabel>EMAIL ADDRESS (LOCKED)</FieldLabel>
                    <Input
                      type="email"
                      icon={Mail}
                      value={form.email}
                      disabled
                      className="cursor-not-allowed opacity-60 bg-surface-container-low"
                    />
                  </div>

                  <div>
                    <FieldLabel>ROLE (LOCKED)</FieldLabel>
                    <Input
                      type="text"
                      icon={Briefcase}
                      value={form.role}
                      disabled
                      className="cursor-not-allowed opacity-60 bg-surface-container-low"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end border-t border-outline-variant pt-4">
                  <SaveButton type="submit" saving={saving} label="SAVE CHANGES" icon={Save} />
                </div>
              </form>
            </Card>
          </div>

          {/* Right Column: Profile Card Preview */}
          <aside className="lg:sticky lg:top-4">
            <div className="relative overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low shadow-sm">
              {/* Header Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

              {/* Profile Image & Badge */}
              <div className="relative flex flex-col items-center border-b border-outline-variant/80 p-6 text-center">
                <div className="relative h-24 w-24">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 p-[2px]">
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-surface-container bg-surface-container">
                      {form.photoUrl ? (
                        <img
                          src={form.photoUrl}
                          alt={form.fullName || "Admin"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-10 w-10 text-on-surface-variant/45" aria-hidden />
                      )}
                    </div>
                  </div>
                  <span className="font-label-caps absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[9px] tracking-wider text-primary font-semibold">
                    {form.role}
                  </span>
                </div>

                <h3 className="font-serif mt-5 text-lg font-bold tracking-tight text-on-surface">
                  {form.fullName?.trim() || "Your Name"}
                </h3>
                <p className="mt-1 inline-flex items-center justify-center gap-1 text-[11px] text-on-surface-variant font-medium">
                  <Sparkles className="h-3 w-3 text-primary/80" aria-hidden />
                  Platform Administrator
                </p>
              </div>

              {/* Account details list */}
              <div className="relative divide-y divide-outline-variant/60 p-4 text-xs">
                <div className="flex items-start gap-3 py-2.5 first:pt-0">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-surface-container text-on-surface-variant">
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-label-caps text-[9px] text-on-surface-variant font-medium tracking-wide">
                      EMAIL
                    </p>
                    <p className="break-all font-medium text-on-surface">
                      {form.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 py-2.5">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-surface-container text-on-surface-variant">
                    <Phone className="h-3.5 w-3.5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-label-caps text-[9px] text-on-surface-variant font-medium tracking-wide">
                      PHONE
                    </p>
                    <p className="font-medium text-on-surface">
                      {form.phone?.trim() ? form.phone : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 py-2.5 last:pb-0">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                    <Calendar className="h-3.5 w-3.5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-label-caps text-[9px] text-on-surface-variant font-medium tracking-wide">
                      MEMBER SINCE
                    </p>
                    <p className="font-medium text-on-surface">
                      {memberLabel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Success/Error Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
}
