import NextAuth from "next-auth";
import Twitter from "next-auth/providers/twitter";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { generateReferralCode, getReferrerByCode } from "@/lib/referral";
import { cookies } from "next/headers";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      twitterHandle: string;
      profileImageUrl: string;
      referralCode: string;
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getString(obj: any, ...keys: string[]): string {
  for (const key of keys) {
    if (typeof obj?.[key] === "string") return obj[key];
    if (typeof obj?.data?.[key] === "string") return obj.data[key];
  }
  return "";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Twitter],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "twitter") return false;

      const twitterId = account.providerAccountId;
      const twitterHandle = getString(profile, "username", "screen_name");
      const name = getString(profile, "name") || twitterHandle;
      const profileImageUrl = getString(
        profile,
        "profile_image_url",
        "picture",
      );

      // Check if user already exists — allow returning users through
      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.twitterId, twitterId))
        .limit(1);

      if (existing) {
        // Update profile data on each sign-in
        await db
          .update(users)
          .set({
            name,
            twitterHandle: twitterHandle || existing.twitterHandle,
            profileImageUrl: profileImageUrl || existing.profileImageUrl,
          })
          .where(eq(users.twitterId, twitterId));
        return true;
      }

      // New user — require a valid referral code (invite-only)
      // Note: cookies() is a Next.js server API; works here because the signIn
      // callback runs within the Auth.js route handler context.
      const cookieStore = await cookies();
      const referralCode = cookieStore.get("referralCode")?.value;

      if (!referralCode) return false;

      const referrer = await getReferrerByCode(referralCode);
      if (!referrer) return false;

      await db.insert(users).values({
        name,
        twitterHandle: twitterHandle || twitterId,
        twitterId,
        profileImageUrl: profileImageUrl || "",
        referralCode: generateReferralCode(),
        referredBy: referrer.id,
      });

      return true;
    },

    // JWT custom claims are set on initial sign-in only. If user data changes
    // server-side (e.g. profile update on another device), the JWT on this
    // device stays stale until the user signs out and back in. This is the
    // expected trade-off of the JWT strategy (no DB lookup per request).
    async jwt({ token, account }) {
      if (account) {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.twitterId, account.providerAccountId))
          .limit(1);

        if (user) {
          token.userId = user.id;
          token.twitterHandle = user.twitterHandle;
          token.profileImageUrl = user.profileImageUrl;
          token.referralCode = user.referralCode;
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.userId as string,
        name: token.name as string,
        twitterHandle: token.twitterHandle as string,
        profileImageUrl: token.profileImageUrl as string,
        referralCode: token.referralCode as string,
      };
      return session;
    },
  },
});
