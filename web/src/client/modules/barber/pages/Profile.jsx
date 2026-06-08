"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Camera,
  Eye,
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
import { INPUT_CLASS, EXP_TIERS, SPECIALTIES } from "@/client/modules/barber/constants/barber.js";
import { Field, IconInput } from "@/client/modules/shared/components/forms/FormPrimitives.jsx";
import PublicPreview from "@/client/modules/barber/components/Profile/PublicPreview.jsx";
import SectionCard from "@/client/modules/shared/components/ui/SectionCard";
import { INITIAL_PROFILE } from "@/client/modules/barber/data/profileData.js";
import { createId } from "@/client/modules/shared/helpers/createId.js";

export default function BarberProfile() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("shop");

  const displayName = useMemo(
    () => `${profile.firstName} ${profile.lastName}`.trim() || "Your name",
    [profile.firstName, profile.lastName],
  );

  const experienceLabel = useMemo(
    () => EXP_TIERS.find((t) => t.value === profile.experience)?.label ?? "—",
    [profile.experience],
  );

  const sections = [
    { id: "shop", label: "Shop" },
    { id: "barber", label: "Barber" },
    { id: "portfolio", label: "Gallery" },
    { id: "contact", label: "Contact" },
    { id: "preview", label: "Preview" },
  ];

  function patch(updates) {
    setProfile((prev) => ({ ...prev, ...updates }));
  }

  function toggleSpecialty(name) {
    setProfile((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(name)
        ? prev.specialties.filter((s) => s !== name)
        : [...prev.specialties, name],
    }));
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    patch({ photoPreview: URL.createObjectURL(file) });
  }

  function handleGalleryAdd(e) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const added = files.slice(0, 8 - profile.portfolio.length).map((file) => ({
      id: createId(),
      url: URL.createObjectURL(file),
      caption: "",
    }));
    patch({ portfolio: [...profile.portfolio, ...added] });
    e.target.value = "";
  }

  function removeGalleryItem(id) {
    patch({ portfolio: profile.portfolio.filter((p) => p.id !== id) });
  }

  function updateCaption(id, caption) {
    patch({
      portfolio: profile.portfolio.map((p) => (p.id === id ? { ...p, caption } : p)),
    });
  }

  function handleSave() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  }

  function scrollToSection(id) {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-28 md:space-y-8 md:pb-8">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="font-label-caps text-primary">Barber · Profile</p>
          <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
            My profile
          </h1>
          <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
            Manage your shop, barber card, portfolio, and contact details. Clients see the preview
            when browsing and booking.
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
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
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

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(240px,300px)] lg:items-start lg:gap-6">
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
                  />
                </Field>
              </div>
              <Field label="Shop phone">
                <IconInput
                  icon={Phone}
                  type="tel"
                  value={profile.shopPhone}
                  onChange={(e) => patch({ shopPhone: e.target.value })}
                />
              </Field>
              <Field label="Hours">
                <input
                  type="text"
                  value={profile.shopHours}
                  onChange={(e) => patch({ shopHours: e.target.value })}
                  placeholder="Mon–Sat 9am–7pm"
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
                      src={profile.photoPreview}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="112px"
                      unoptimized={profile.photoPreview.startsWith("blob:")}
                    />
                  ) : (
                    <div className="text-on-surface-variant flex h-full w-full items-center justify-center">
                      <User className="h-10 w-10" aria-hidden />
                    </div>
                  )}
                  <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                    <Camera className="text-on-primary h-6 w-6" aria-hidden />
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
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
                        className={INPUT_CLASS}
                      />
                    </Field>
                    <Field label="Last name">
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => patch({ lastName: e.target.value })}
                        className={INPUT_CLASS}
                      />
                    </Field>
                  </div>
                  <div className="border-outline-variant bg-surface-container flex items-center gap-3 rounded-lg border px-4 py-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={profile.availableToday}
                      onClick={() => patch({ availableToday: !profile.availableToday })}
                      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors ${
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
                        onClick={() => patch({ experience: tier.value })}
                        className={`rounded-lg border px-2 py-3 text-center transition-colors ${
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
                        onClick={() => toggleSpecialty(s)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
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
            description="Show your best work — up to 8 photos on your public profile."
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
                      sizes="(max-width: 640px) 50vw, 160px"
                      unoptimized={item.url.startsWith("blob:")}
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(item.id)}
                      aria-label="Remove photo"
                      className="text-on-primary absolute top-1.5 right-1.5 inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/60 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.caption}
                    onChange={(e) => updateCaption(item.id, e.target.value)}
                    placeholder="Caption"
                    className="border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 w-full border-t bg-transparent px-2 py-1.5 text-xs focus:outline-none"
                  />
                </li>
              ))}
              {profile.portfolio.length < 8 ? (
                <li>
                  <label className="border-outline-variant bg-surface-container text-on-surface-variant hover:border-primary hover:text-primary flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed transition-colors">
                    <ImagePlus className="h-6 w-6" aria-hidden />
                    <span className="text-xs font-medium">Add photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
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
                  />
                </Field>
              </div>
              <Field label="Mobile">
                <IconInput
                  icon={Phone}
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => patch({ phone: e.target.value })}
                />
              </Field>
              <Field label="City / area">
                <IconInput
                  icon={MapPin}
                  type="text"
                  value={profile.city}
                  onChange={(e) => patch({ city: e.target.value })}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Instagram" hint="Optional — shown on your public card.">
                  <input
                    type="text"
                    value={profile.instagram}
                    onChange={(e) => patch({ instagram: e.target.value })}
                    placeholder="@yourhandle"
                    className={INPUT_CLASS}
                  />
                </Field>
              </div>
            </div>
          </SectionCard>
        </div>

        <aside id="preview" className="scroll-mt-24 lg:sticky lg:top-4">
          <SectionCard
            icon={Eye}
            title="Public preview"
            description="Matches your customer-facing profile card."
          >
            <div className="-mx-1 sm:mx-0">
              <PublicPreview
                profile={profile}
                displayName={displayName}
                experienceLabel={experienceLabel}
              />
            </div>
            <p className="text-on-surface-variant mt-3 text-[11px] leading-relaxed">
              Star rating and review count are demo values until reviews sync from the platform.
            </p>
          </SectionCard>
        </aside>
      </div>

      <div className="border-outline-variant bg-surface/95 fixed inset-x-0 bottom-[var(--bottom-nav-height)] z-30 border-t px-4 py-3 backdrop-blur md:static md:bottom-auto md:z-auto md:border-t md:bg-transparent md:px-0 md:py-0 md:pt-6">
        <div className="mx-auto flex max-w-6xl flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-on-surface-variant text-center text-xs sm:text-left">
            {saved ? "Profile saved." : "Changes are local until backend is connected."}
          </p>
          <button
            type="button"
            onClick={handleSave}
            className="bg-primary text-on-primary inline-flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] sm:w-auto sm:px-8"
          >
            <Save className="h-4 w-4" aria-hidden />
            {saved ? "Profile saved" : "Save profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
