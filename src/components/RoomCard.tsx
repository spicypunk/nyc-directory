import Image from "next/image";
import { ContactPopover } from "@/components/ContactPopover";
import { RoomCardDescription } from "./RoomCardDescription";

export type RoomWithPoster = {
  id: string;
  title: string;
  description: string;
  photoUrl: string;
  neighborhood: string;
  priceRange: string;
  roommateCount: number;
  isAvailable: boolean;
  externalLink: string | null;
  poster: {
    name: string;
    email: string | null;
    twitterHandle: string;
    profileImageUrl: string;
  };
};

export function RoomCard({ room }: { room: RoomWithPoster }) {
  return (
    <div className="bg-[var(--color-card)] rounded-xl shadow-sm p-4 flex flex-col gap-3">
      {/* Top section: photo + info */}
      <div className="flex gap-3">
        {/* Circular room photo */}
        <div className="shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={room.photoUrl}
              alt={room.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Title with availability dot */}
          <div className="flex items-start gap-1.5">
            {room.isAvailable && (
              <span className="mt-1.5 shrink-0 w-2.5 h-2.5 rounded-full bg-[var(--color-green)]" />
            )}
            <h3 className="text-sm font-semibold leading-tight line-clamp-2">
              {room.title}
            </h3>
            {room.externalLink && (
              <a
                href={room.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 mt-0.5 text-black/40 hover:text-black/70 transition-colors"
                title="External link"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            )}
          </div>

          {/* Poster info */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <Image
              src={room.poster.profileImageUrl}
              alt={room.poster.name}
              width={20}
              height={20}
              className="rounded-full"
            />
            <a
              href={`https://x.com/${room.poster.twitterHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-black/60 hover:text-black/80 transition-colors"
            >
              {room.poster.name}
            </a>
          </div>

          {/* Contact button */}
          <div className="mt-2">
            <ContactPopover
              email={room.poster.email}
              twitterHandle={room.poster.twitterHandle}
            />
          </div>
        </div>
      </div>

      {/* Description with expand */}
      <RoomCardDescription description={room.description} />

      {/* Bottom metadata bar */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-black/60 border-t border-black/5 pt-2">
        <span>📍 {room.neighborhood}</span>
        <span>💰 {room.priceRange}</span>
        <span>👥 {room.roommateCount} roommate{room.roommateCount !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}
