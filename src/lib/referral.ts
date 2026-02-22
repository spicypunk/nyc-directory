import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export function generateReferralCode(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}

export async function getReferrerByCode(code: string) {
  const [referrer] = await db
    .select()
    .from(users)
    .where(eq(users.referralCode, code))
    .limit(1);
  return referrer ?? null;
}
