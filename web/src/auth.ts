import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { eq } from "drizzle-orm";
import { db, users } from "@/server/db";
import { ROLES } from "@/server/shared/constants/roles";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET ?? process.env.JWT_ACCESS_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return false;
      if (!user.email) return false;

      const email = user.email.toLowerCase();
      const existing = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existing) {
        if (existing.role !== ROLES.CUSTOMER) return false;
        if (!existing.googleId) {
          await db
            .update(users)
            .set({
              googleId: account.providerAccountId,
              emailVerified: true,
              photoUrl: existing.photoUrl ?? user.image ?? null,
            })
            .where(eq(users.id, existing.id));
        }
        return true;
      }

      const displayName = user.name?.trim() || email.split("@")[0] || "Customer";
      const nameParts = displayName.split(/\s+/).filter(Boolean);

      await db.insert(users).values({
        email,
        firstName: nameParts[0] ?? "Customer",
        lastName: nameParts.slice(1).join(" ") || "-",
        fullName: displayName,
        googleId: account.providerAccountId,
        photoUrl: user.image ?? null,
        role: ROLES.CUSTOMER,
        isActive: true,
        emailVerified: true,
      });
      return true;
    },
  },
});
