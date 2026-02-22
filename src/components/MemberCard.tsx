import Image from "next/image";

export interface MemberData {
  id: string;
  name: string;
  twitterHandle: string;
  profileImageUrl: string;
  joinedAt: Date;
  referrerName: string | null;
}

export function MemberCard({ member }: { member: MemberData }) {
  const joinDate = new Date(member.joinedAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-[var(--color-card)] rounded-xl p-4 shadow-sm flex items-center gap-4">
      <Image
        src={member.profileImageUrl}
        alt={member.name}
        width={56}
        height={56}
        className="rounded-full w-14 h-14 object-cover shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-black truncate">{member.name}</p>
        {member.referrerName && (
          <p className="text-sm text-black/50">
            Referred by {member.referrerName}
          </p>
        )}
        <p className="text-sm text-black/50 mt-0.5">
          📅 {joinDate}
        </p>
      </div>

      <a
        href={`https://x.com/${member.twitterHandle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-black/40 hover:text-black/70 transition-colors shrink-0"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
    </div>
  );
}
