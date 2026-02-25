import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!name) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 },
    );
  }

  const [updated] = await db
    .update(users)
    .set({ name, hasOnboarded: true })
    .where(eq(users.id, session.user.id))
    .returning();

  return NextResponse.json({ user: updated });
}
