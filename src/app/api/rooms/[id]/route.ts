import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { rooms } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [room] = await db
    .select()
    .from(rooms)
    .where(eq(rooms.id, id))
    .limit(1);

  if (!room) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (room.posterId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const {
    title,
    description,
    photoUrl,
    neighborhood,
    priceRange,
    roommateCount,
    externalLink,
  } = body;

  const [updated] = await db
    .update(rooms)
    .set({
      title,
      description,
      photoUrl,
      neighborhood,
      priceRange,
      roommateCount: Number(roommateCount),
      externalLink: externalLink || null,
      updatedAt: new Date(),
    })
    .where(eq(rooms.id, id))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [room] = await db
    .select()
    .from(rooms)
    .where(eq(rooms.id, id))
    .limit(1);

  if (!room) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (room.posterId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.delete(rooms).where(eq(rooms.id, id));

  return NextResponse.json({ success: true });
}
