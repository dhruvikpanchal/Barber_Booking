"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import {
  Camera,
  ImagePlus,
  Mail,
  MapPin,
  Phone,
  Save,
  Scissors,
  Store,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  INPUT_CLASS,
  EXP_TIERS,
  SPECIALTIES,
  MAX_PORTFOLIO_IMAGES,
  PHONE_PATTERN,
} from "@/client/modules/barber/constants/barberConstants.js";
import { Field, IconInput } from "@/client/modules/shared/components/forms/FormPrimitives.jsx";
import SectionCard from "@/client/modules/shared/components/ui/SectionCard";
import { barberHook } from "@/client/modules/barber/hooks/barberQuery.jsx";
import {
  mapProfileFromApi,
  mapProfileToApi,
} from "@/client/modules/barber/helpers/barberMappers.js";
import {
  cacheBustUrl,
  extractPhotoUrl,
  mergeBarberProfileWithSession,
  syncProfileAfterMutation,
  syncProfilePhotoEverywhere,
} from "@/client/modules/shared/helpers/profilePhotoHelpers.js";
import { getProfileQueryKey } from "@/client/lib/auth/profileCache.js";

const PORTAL_ROLE = "barber";
const PROFILE_QUERY_KEY = getProfileQueryKey(PORTAL_ROLE);

function isLocalImage(url) {
  return typeof url === "string" && url.startsWith("blob:");
}

function mapGalleryItemFromApi(item) {
  return {
    id: item.id,
    url: item.src ?? item.url,
    caption: item.alt ?? item.caption ?? "",
  };
}

function isValidPhone(value) {
  const trimmed = value?.trim() ?? "";
  return !trimmed || PHONE_PATTERN.test(trimmed);
}

function formatSaveError(err) {
  if (err?.fields && typeof err.fields === "object") {
    const first = Object.values(err.fields).find(Boolean);
    if (first) return String(first);
  }
  return err?.message || "Could not save profile";
}

function applyServerProfile(dto, prev) {
  const mapped = mapProfileFromApi(mergeBarberProfileWithSession(dto));
  if (!mapped) return prev ?? null;

  const keepPreview =
    prev?.photoPreview?.startsWith("blob:") ||
    (prev?.photoPreview && prev.photoPreview !== mapped.photoUrl);

  return {
    ...mapped,
    photoPreview: keepPreview ? prev.photoPreview : mapped.photoUrl || mapped.photoPreview || "",
  };
}

export default function BarberProfile() {
  const queryClient = useQueryClient();
  const {
    data: profileData,
    isPending,
    isError,
    error,
    refetch,
  } = barberHook.Profile.useGetProfile();
  const updateMutation = barberHook.Profile.useUpdateProfile();
  const uploadMutation = barberHook.Profile.useUploadPhoto();
  const uploadGalleryMutation = barberHook.Profile.useUploadGalleryPhoto();
  const updateGalleryMutation = barberHook.Profile.useUpdateGalleryImage();
  const deleteGalleryMutation = barberHook.Profile.useDeleteGalleryImage();

  const [profile, setProfile] = useState(null);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("shop");
  const [isDirty, setIsDirty] = useState(false);
  const isDirtyRef = useRef(false);

  const busy =
    isPending ||
    updateMutation.isPending ||
    uploadMutation.isPending ||
    uploadGalleryMutation.isPending ||
    updateGalleryMutation.isPending ||
    deleteGalleryMutation.isPending;

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Failed to load profile");
    }
  }, [isError, error]);

  useEffect(() => {
    if (!profileData || isDirtyRef.current) return;
    setProfile((prev) => applyServerProfile(profileData, prev));
  }, [profileData]);

  const sections = [
    { id: "shop", label: "Shop" },
    { id: "barber", label: "Barber" },
    { id: "portfolio", label: "Gallery" },
    { id: "contact", label: "Contact" },
  ];

  const patch = useCallback((updates) => {
    isDirtyRef.current = true;
    setIsDirty(true);
    setProfile((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const toggleSpecialty = useCallback((name) => {
    isDirtyRef.current = true;
    setIsDirty(true);
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            specialties: prev.specialties.includes(name)
              ? prev.specialties.filter((s) => s !== name)
              : [...prev.specialties, name],
          }
        : prev,
    );
  }, []);

  const handleAvatarChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file || busy) return;
      e.target.value = "";

      const localPreview = URL.createObjectURL(file);
      patch({ photoPreview: localPreview });

      try {
        const result = await uploadMutation.mutateAsync(file);
        const photoUrl = extractPhotoUrl(result);
        if (photoUrl) {
          const displayUrl = syncProfilePhotoEverywhere(queryClient, PORTAL_ROLE, photoUrl);
          patch({ photoPreview: displayUrl });
        }
        toast.success("Profile photo updated");
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2400);
      } catch (err) {
        patch({ photoPreview: profileData?.photoUrl ? cacheBustUrl(profileData.photoUrl) : "" });
        toast.error(err?.message || "Photo upload failed");
      } finally {
        URL.revokeObjectURL(localPreview);
      }
    },
    [busy, uploadMutation, patch, queryClient, profileData?.photoUrl],
  );

  const handleGalleryAdd = useCallback(
    async (e) => {
      const files = Array.from(e.target.files ?? []);
      if (!files.length || !profile || busy) return;
      e.target.value = "";

      const slotsLeft = MAX_PORTFOLIO_IMAGES - profile.portfolio.length;
      const toUpload = files.slice(0, slotsLeft);

      for (const file of toUpload) {
        try {
          const item = await uploadGalleryMutation.mutateAsync({ file, alt: "" });
          const mapped = mapGalleryItemFromApi(item);
          setProfile((prev) =>
            prev ? { ...prev, portfolio: [...prev.portfolio, mapped] } : prev,
          );
          queryClient.setQueryData(PROFILE_QUERY_KEY, (current) => {
            if (!current) return current;
            const gallery = current.gallery ?? [];
            return {
              ...current,
              gallery: [
                ...gallery,
                {
                  id: mapped.id,
                  src: mapped.url,
                  alt: mapped.caption,
                  sortOrder: gallery.length,
                },
              ],
            };
          });
          toast.success("Photo added to gallery");
        } catch (err) {
          toast.error(err?.message || "Gallery upload failed");
          break;
        }
      }
    },
    [profile, busy, uploadGalleryMutation, queryClient],
  );

  const removeGalleryItem = useCallback(
    async (id) => {
      if (!profile || busy) return;
      const item = profile.portfolio.find((p) => p.id === id);
      if (item?.url?.startsWith("blob:")) {
        patch({ portfolio: profile.portfolio.filter((p) => p.id !== id) });
        return;
      }
      try {
        await toast.promise(deleteGalleryMutation.mutateAsync(id), {
          loading: "Removing photo…",
          success: "Photo removed",
          error: "Could not remove photo",
        });
        patch({ portfolio: profile.portfolio.filter((p) => p.id !== id) });
        await refetch();
      } catch {
        /* toast handles error */
      }
    },
    [profile, busy, patch, deleteGalleryMutation, refetch],
  );

  const updateCaption = useCallback(
    (id, caption) => {
      patch({
        portfolio: profile?.portfolio.map((p) => (p.id === id ? { ...p, caption } : p)) ?? [],
      });
    },
    [patch, profile?.portfolio],
  );

  const saveCaption = useCallback(
    async (id, caption) => {
      const item = profile?.portfolio.find((p) => p.id === id);
      if (!item || isLocalImage(item.url) || busy) return;

      try {
        await updateGalleryMutation.mutateAsync({ id, alt: caption });
        queryClient.setQueryData(PROFILE_QUERY_KEY, (current) => {
          if (!current?.gallery) return current;
          return {
            ...current,
            gallery: current.gallery.map((image) =>
              image.id === id ? { ...image, alt: caption } : image,
            ),
          };
        });
      } catch {
        toast.error("Could not save caption");
      }
    },
    [profile?.portfolio, busy, updateGalleryMutation, queryClient],
  );

  const saveAllCaptions = useCallback(async () => {
    if (!profile?.portfolio?.length || busy) return;

    const tasks = profile.portfolio
      .filter((item) => item.id && !isLocalImage(item.url))
      .map((item) => updateGalleryMutation.mutateAsync({ id: item.id, alt: item.caption ?? "" }));

    if (!tasks.length) return;

    try {
      await Promise.all(tasks);
      queryClient.setQueryData(PROFILE_QUERY_KEY, (current) => {
        if (!current?.gallery) return current;
        const captions = new Map(profile.portfolio.map((item) => [item.id, item.caption ?? ""]));
        return {
          ...current,
          gallery: current.gallery.map((image) => ({
            ...image,
            alt: captions.get(image.id) ?? image.alt,
          })),
        };
      });
    } catch {
      toast.error("Some gallery captions could not be saved");
    }
  }, [profile?.portfolio, busy, updateGalleryMutation, queryClient]);

  const handleSave = useCallback(async () => {
    if (!profile || busy) return;

    const firstName = profile.firstName?.trim() ?? "";
    const lastName = profile.lastName?.trim() ?? "";
    const email = profile.email?.trim() ?? "";

    if (!firstName) {
      toast.error("First name is required.");
      return;
    }
    if (!lastName) {
      toast.error("Last name is required.");
      return;
    }
    if (!email) {
      toast.error("Email is missing. Refresh the page and try again.");
      return;
    }
    if (!isValidPhone(profile.phone) || !isValidPhone(profile.shopPhone)) {
      toast.error("Enter a valid phone number (7–20 digits).");
      return;
    }

    const payload = mapProfileToApi(profile);

    try {
      const updated = await toast.promise(updateMutation.mutateAsync(payload), {
        loading: "Saving profile…",
        success: "Profile saved",
        error: (err) => formatSaveError(err),
      });

      await saveAllCaptions();

      const mapped = applyServerProfile(updated, profile);
      if (mapped) {
        isDirtyRef.current = false;
        setIsDirty(false);
        setProfile(mapped);
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2400);
      }
    } catch {
      /* toast handles error */
    }
  }, [profile, busy, updateMutation, queryClient, saveAllCaptions]);

  function scrollToSection(id) {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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
    <div className="mx-auto max-w-6xl space-y-6 pb-28 md:space-y-8 md:pb-8">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="font-label-caps text-primary">Barber · Profile</p>
          <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
            My profile
          </h1>
          <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
            Manage your shop, barber card, portfolio, and contact details.
          </p>
        </div>

        <nav
          aria-label="Profile sections"
          className="scrollbar-thin -mx-1 flex gap-1 overflow-x-auto pb-1 md:hidden"
        >
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToSection(s.id)}
              disabled={fieldDisabled}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                activeSection === s.id
                  ? "border-primary bg-primary text-on-primary"
                  : "border-outline-variant text-on-surface-variant"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="space-y-6">
          <SectionCard
            id="shop"
            icon={Store}
            title="Shop details"
            description="Where clients find you — address, hours, and shop story."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Shop name">
                  <input
                    type="text"
                    value={profile.shopName}
                    onChange={(e) => patch({ shopName: e.target.value })}
                    placeholder="Steel District"
                    disabled={fieldDisabled}
                    className={INPUT_CLASS}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Address">
                  <IconInput
                    icon={MapPin}
                    type="text"
                    value={profile.shopAddress}
                    onChange={(e) => patch({ shopAddress: e.target.value })}
                    placeholder="Street, city, ZIP"
                    disabled={fieldDisabled}
                  />
                </Field>
              </div>
              <Field label="Shop phone">
                <IconInput
                  icon={Phone}
                  type="tel"
                  value={profile.shopPhone}
                  onChange={(e) => patch({ shopPhone: e.target.value })}
                  disabled={fieldDisabled}
                />
              </Field>
              <Field label="Hours">
                <input
                  type="text"
                  value={profile.shopHours}
                  onChange={(e) => patch({ shopHours: e.target.value })}
                  placeholder="Mon–Sat 9am–7pm"
                  disabled={fieldDisabled}
                  className={INPUT_CLASS}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="About the shop" hint="Shown on your public shop page.">
                  <textarea
                    rows={3}
                    value={profile.shopAbout}
                    onChange={(e) => patch({ shopAbout: e.target.value })}
                    placeholder="Describe the vibe, services, and neighborhood…"
                    disabled={fieldDisabled}
                    className={`${INPUT_CLASS} min-h-[5rem] resize-y py-2.5`}
                  />
                </Field>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="barber"
            icon={Scissors}
            title="Barber details"
            description="Your public identity — photo, bio, experience, and specialties."
          >
            <div className="space-y-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="border-outline-variant bg-surface-container relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-xl border sm:mx-0">
                  {profile.photoPreview ? (
                    <Image
                      key={profile.photoPreview}
                      src={profile.photoPreview}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="112px"
                      unoptimized={isLocalImage(profile.photoPreview)}
                    />
                  ) : (
                    <div className="text-on-surface-variant flex h-full w-full items-center justify-center">
                      <User className="h-10 w-10" aria-hidden />
                    </div>
                  )}
                  <label
                    className={`absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100 ${fieldDisabled ? "pointer-events-none" : "cursor-pointer"}`}
                  >
                    <Camera className="text-on-primary h-6 w-6" aria-hidden />
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={fieldDisabled}
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First name">
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => patch({ firstName: e.target.value })}
                        disabled={fieldDisabled}
                        className={INPUT_CLASS}
                      />
                    </Field>
                    <Field label="Last name">
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => patch({ lastName: e.target.value })}
                        disabled={fieldDisabled}
                        className={INPUT_CLASS}
                      />
                    </Field>
                  </div>
                  <div className="border-outline-variant bg-surface-container flex items-center gap-3 rounded-lg border px-4 py-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={profile.availableToday}
                      disabled={fieldDisabled}
                      onClick={() => patch({ availableToday: !profile.availableToday })}
                      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        profile.availableToday
                          ? "border-primary bg-primary"
                          : "border-outline-variant bg-surface-container-high"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full shadow transition-transform ${
                          profile.availableToday
                            ? "bg-on-primary translate-x-5"
                            : "bg-on-surface-variant translate-x-1"
                        }`}
                      />
                    </button>
                    <span className="text-sm">
                      <span className="text-on-surface block font-medium">Available today</span>
                      <span className="text-on-surface-variant block text-xs">
                        Live on your queue card
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <Field label="Experience level">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {EXP_TIERS.map((tier) => {
                    const active = profile.experience === tier.value;
                    return (
                      <button
                        key={tier.value}
                        type="button"
                        disabled={fieldDisabled}
                        onClick={() => patch({ experience: tier.value })}
                        className={`rounded-lg border px-2 py-3 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                          active
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-outline-variant text-on-surface-variant hover:border-primary/40"
                        }`}
                      >
                        <span className="block text-xs font-semibold">{tier.label}</span>
                        <span className="mt-0.5 block text-[10px] opacity-70">{tier.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Short bio" hint={`${profile.bio.length}/200 characters`}>
                <textarea
                  maxLength={200}
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => patch({ bio: e.target.value })}
                  disabled={fieldDisabled}
                  className={`${INPUT_CLASS} min-h-[5rem] resize-y py-2.5`}
                />
              </Field>

              <Field label="Specialties" hint="Tap to toggle.">
                <div className="flex flex-wrap gap-2">
                  {SPECIALTIES.map((s) => {
                    const active = profile.specialties.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={fieldDisabled}
                        onClick={() => toggleSpecialty(s)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                          active
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-outline-variant text-on-surface-variant"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            id="portfolio"
            icon={ImagePlus}
            title="Portfolio / gallery"
            description={`Photos upload immediately — up to ${MAX_PORTFOLIO_IMAGES} on your public profile.`}
          >
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {profile.portfolio.map((item) => (
                <li
                  key={item.id}
                  className="group border-outline-variant bg-surface-container relative overflow-hidden rounded-lg border"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={item.url}
                      alt={item.caption || "Portfolio"}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="(max-width: 640px) 50vw, 160px"
                      unoptimized={isLocalImage(item.url)}
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(item.id)}
                      disabled={fieldDisabled}
                      aria-label="Remove photo"
                      className="text-on-primary absolute top-1.5 right-1.5 inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/60 opacity-100 transition-opacity disabled:cursor-not-allowed disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.caption}
                    onChange={(e) => updateCaption(item.id, e.target.value)}
                    onBlur={(e) => saveCaption(item.id, e.target.value)}
                    placeholder="Caption"
                    disabled={fieldDisabled}
                    className="border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 w-full border-t bg-transparent px-2 py-1.5 text-xs focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </li>
              ))}
              {profile.portfolio.length < MAX_PORTFOLIO_IMAGES ? (
                <li>
                  <label
                    className={`border-outline-variant bg-surface-container text-on-surface-variant flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed transition-colors ${fieldDisabled ? "pointer-events-none opacity-50" : "hover:border-primary hover:text-primary cursor-pointer"}`}
                  >
                    <ImagePlus className="h-6 w-6" aria-hidden />
                    <span className="text-xs font-medium">Add photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      disabled={fieldDisabled}
                      onChange={handleGalleryAdd}
                    />
                  </label>
                </li>
              ) : null}
            </ul>
          </SectionCard>

          <SectionCard
            id="contact"
            icon={Mail}
            title="Contact info"
            description="How clients and the shop reach you directly."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Email">
                  <IconInput
                    icon={Mail}
                    type="email"
                    value={profile.email}
                    onChange={(e) => patch({ email: e.target.value })}
                    disabled={true}
                  />
                </Field>
              </div>
              <Field label="Mobile">
                <IconInput
                  icon={Phone}
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => patch({ phone: e.target.value })}
                  disabled={fieldDisabled}
                />
              </Field>
              <Field label="City / area">
                <IconInput
                  icon={MapPin}
                  type="text"
                  value={profile.city}
                  onChange={(e) => patch({ city: e.target.value })}
                  disabled={fieldDisabled}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Instagram" hint="Optional — shown on your public card.">
                  <input
                    type="text"
                    value={profile.instagram}
                    onChange={(e) => patch({ instagram: e.target.value })}
                    placeholder="@yourhandle"
                    disabled={fieldDisabled}
                    className={INPUT_CLASS}
                  />
                </Field>
              </div>
            </div>
          </SectionCard>
      </div>

      <div className="border-outline-variant bg-surface/95 fixed inset-x-0 bottom-[var(--bottom-nav-height)] z-30 border-t px-4 py-3 backdrop-blur md:static md:bottom-auto md:z-auto md:border-t md:bg-transparent md:px-0 md:py-0 md:pt-6">
        <div className="mx-auto flex max-w-6xl flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-on-surface-variant text-center text-xs sm:text-left">
            {saved
              ? "Profile saved."
              : isDirty
                ? "You have unsaved changes."
                : "Gallery photos save on upload. Tap Save profile for other changes."}
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={fieldDisabled}
            className="bg-primary text-on-primary inline-flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
          >
            <Save className="h-4 w-4" aria-hidden />
            {saved ? "Profile saved" : "Save profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
