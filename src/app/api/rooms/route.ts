export const dynamic = "force-dynamic";

import { db } from "@/db";
import { rooms, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const results = await db
    .select({
      id: rooms.id,
      title: rooms.title,
      description: rooms.description,
      photoUrl: rooms.photoUrl,
      neighborhood: rooms.neighborhood,
      priceRange: rooms.priceRange,
      roommateCount: rooms.roommateCount,
      isAvailable: rooms.isAvailable,
      externalLink: rooms.externalLink,
      createdAt: rooms.createdAt,
      updatedAt: rooms.updatedAt,
      poster: {
        name: users.name,
        twitterHandle: users.twitterHandle,
        profileImageUrl: users.profileImageUrl,
      },
    })
    .from(rooms)
    .innerJoin(users, eq(rooms.posterId, users.id))
    .orderBy(desc(rooms.updatedAt));

  return Response.json(results);
}
