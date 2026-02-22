export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { rooms, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ALL_NEIGHBORHOODS } from "@/lib/neighborhoods";

const PRICE_RANGES = [
  "< $1500",
  "$1500 - $1999",
  "$2000 - $2499",
  "$2500 - $2999",
  "$3000+",
];

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
      posterId: rooms.posterId,
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

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const errors: Record<string, string> = {};

  if (!body.title?.trim()) {
    errors.title = "Title is required";
  }
  if (!body.description?.trim()) {
    errors.description = "Description is required";
  }
  if (!body.photoUrl?.trim()) {
    errors.photoUrl = "Photo URL is required";
  }
  if (!body.neighborhood || !ALL_NEIGHBORHOODS.includes(body.neighborhood)) {
    errors.neighborhood = "Please select a valid neighborhood";
  }
  if (!body.priceRange || !PRICE_RANGES.includes(body.priceRange)) {
    errors.priceRange = "Please select a price range";
  }
  if (
    body.roommateCount == null ||
    !Number.isInteger(body.roommateCount) ||
    body.roommateCount < 0
  ) {
    errors.roommateCount = "Roommate count must be a non-negative integer";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const [created] = await db
    .insert(rooms)
    .values({
      posterId: session.user.id,
      title: body.title.trim(),
      description: body.description.trim(),
      photoUrl: body.photoUrl.trim(),
      neighborhood: body.neighborhood,
      priceRange: body.priceRange,
      roommateCount: body.roommateCount,
      externalLink: body.externalLink?.trim() || null,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
