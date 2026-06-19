"use client";

import { KeyRound } from "lucide-react";
import { Card, SectionHeader } from "./TinyPrimitives.jsx";

export default function OAuthPasswordNotice() {
  return (
    <Card>
      <SectionHeader
        icon={KeyRound}
        label="Password sign-in"
        sub="Your account security"
      />
      <p className="text-sm leading-relaxed text-on-surface-variant">
        You signed in with Google, so password changes are not available for this
        account. Continue using Google sign-in, or contact support if you need to
        add a password to your account.
      </p>
    </Card>
  );
}
