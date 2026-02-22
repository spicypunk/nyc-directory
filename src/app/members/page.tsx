import { db } from "@/db";
import { users } from "@/db/schema";
import { MembersList } from "./members-list";
import type { MemberData } from "@/components/MemberCard";

export default async function MembersPage() {
  let members: MemberData[] = [];

  try {
    const allUsers = await db.select().from(users);

    const nameById = new Map(allUsers.map((u) => [u.id, u.name]));

    members = allUsers.map((u) => ({
      id: u.id,
      name: u.name,
      twitterHandle: u.twitterHandle,
      profileImageUrl: u.profileImageUrl,
      joinedAt: u.joinedAt,
      referrerName: u.referredBy ? (nameById.get(u.referredBy) ?? null) : null,
    }));
  } catch {
    // DB not reachable — render empty state
  }

  return <MembersList members={members} />;
}
