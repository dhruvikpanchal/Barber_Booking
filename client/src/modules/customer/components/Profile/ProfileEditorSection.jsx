"use client";

import { Camera, Mail, MapPin, Phone, User } from "lucide-react";
import {
  Field,
  IconInput,
  IconTextarea,
  SectionCard,
} from "./formPrimitives.jsx";

export default function ProfileEditorSection({ profile, onPatch, onAvatarChange }) {
  return (
    <SectionCard
      icon={User}
      title="Edit your profile"
      description="Your name, phone, address, and photo update your public booking details. Email is managed by your sign-in account."
    >
      <div className="space-y-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative mx-auto shrink-0 sm:mx-0">
            <div className="relative h-[7.5rem] w-[7.5rem] overflow-hidden rounded-2xl border border-outline-variant bg-surface-container shadow-inner">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.fullName || "Profile preview"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-on-surface-variant">
                  <User className="h-10 w-10 opacity-40" aria-hidden />
                </div>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-2 border-surface-container-low bg-primary text-on-primary shadow-md transition-transform hover:scale-105 active:scale-95">
              <Camera className="h-4 w-4" aria-hidden />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={onAvatarChange}
              />
            </label>
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <p className="font-serif text-base font-bold text-on-surface">
              Profile photo
            </p>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              JPG, PNG, or WebP — square images look best. Click the camera
              button to replace your photo.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Full name">
              <IconInput
                icon={User}
                type="text"
                value={profile.fullName}
                onChange={(e) => onPatch({ fullName: e.target.value })}
                placeholder="Your full name"
                autoComplete="name"
              />
            </Field>
          </div>

          <Field label="Phone">
            <IconInput
              icon={Phone}
              type="tel"
              value={profile.phone}
              onChange={(e) => onPatch({ phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
            />
          </Field>

          <Field
            label="Email"
            hint="Contact support to change the email on your account."
          >
            <IconInput
              icon={Mail}
              type="email"
              value={profile.email}
              disabled
              className="cursor-not-allowed opacity-65"
              title="Email is tied to your login"
            />
          </Field>

          <div className="sm:col-span-2">
            <Field
              label="Address"
              hint="Used for directions and shop communications when you book."
            >
              <IconTextarea
                icon={MapPin}
                value={profile.address}
                onChange={(e) => onPatch({ address: e.target.value })}
                placeholder="Street, apartment, city, state, ZIP"
                rows={3}
                autoComplete="street-address"
              />
            </Field>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
