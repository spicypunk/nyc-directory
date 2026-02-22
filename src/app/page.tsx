export const dynamic = "force-dynamic";

import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { rooms, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { RoomCard, type RoomWithPoster } from "@/components/RoomCard";

function groupRoomsByRecency(rooms: (RoomWithPoster & { updatedAt: Date })[]) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000);

  const groups: { label: string; rooms: RoomWithPoster[] }[] = [
    { label: "Updated today", rooms: [] },
    { label: "Updated this week", rooms: [] },
    { label: "Updated earlier", rooms: [] },
  ];

  for (const room of rooms) {
    const updated = new Date(room.updatedAt);
    if (updated >= todayStart) {
      groups[0].rooms.push(room);
    } else if (updated >= weekAgo) {
      groups[1].rooms.push(room);
    } else {
      groups[2].rooms.push(room);
    }
  }

  return groups.filter((g) => g.rooms.length > 0);
}

export default async function RoomsPage() {
  const session = await auth();

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
      updatedAt: rooms.updatedAt,
      posterId: rooms.posterId,
      poster: {
        name: users.name,
        email: users.email,
        twitterHandle: users.twitterHandle,
        profileImageUrl: users.profileImageUrl,
      },
    })
    .from(rooms)
    .innerJoin(users, eq(rooms.posterId, users.id))
    .orderBy(desc(rooms.updatedAt));

  const groups = groupRoomsByRecency(results);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      {/* CTA Banner */}
      <div className="bg-[var(--color-card)] rounded-xl shadow-sm p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-black/70">
          🏠 Have a group house, sublet, or vacant room? Add your space to be
          discovered by people looking for housing
        </p>
        <Link
          href="/rooms/new"
          className="shrink-0 bg-[var(--color-green)] hover:bg-[var(--color-green-hover)] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Add my space
        </Link>
      </div>

      {/* Grouped room listings */}
      {groups.map((group) => (
        <section key={group.label} className="mb-8">
          <h2 className="text-sm font-semibold text-black/50 uppercase tracking-wide mb-3">
            {group.label}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                currentUserId={session?.user?.id}
              />
            ))}
          </div>
        </section>
      ))}

      {groups.length === 0 && (
        <p className="text-center text-black/40 py-12">
          No rooms listed yet. Be the first to add one!
        </p>
      )}
    </main>
  );
}
