import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { rooms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AddRoomForm } from "@/components/AddRoomForm";

export default async function EditRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;

  const [room] = await db
    .select()
    .from(rooms)
    .where(eq(rooms.id, id))
    .limit(1);

  if (!room) {
    notFound();
  }

  if (room.posterId !== session.user.id) {
    redirect("/");
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <div className="bg-[var(--color-card)] rounded-2xl shadow-sm border border-black/5 p-6 sm:p-8">
        <h1 className="text-xl font-bold mb-6">Edit Room</h1>
        <AddRoomForm
          roomId={room.id}
          initialValues={{
            title: room.title,
            description: room.description,
            photoUrl: room.photoUrl,
            neighborhood: room.neighborhood,
            priceRange: room.priceRange,
            roommateCount: room.roommateCount,
            externalLink: room.externalLink,
          }}
        />
      </div>
    </main>
  );
}
