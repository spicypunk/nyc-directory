"use client";

import { useState, useMemo } from "react";
import { MemberCard, type MemberData } from "@/components/MemberCard";

type SortOption = "date-desc" | "date-asc" | "alpha";

const sortLabels: Record<SortOption, string> = {
  "date-desc": "Join date - Descending",
  "date-asc": "Join date - Ascending",
  alpha: "Alphabetical",
};

export function MembersList({ members }: { members: MemberData[] }) {
  const [sort, setSort] = useState<SortOption>("date-desc");

  const sorted = useMemo(() => {
    const copy = [...members];
    switch (sort) {
      case "date-desc":
        return copy.sort(
          (a, b) =>
            new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime(),
        );
      case "date-asc":
        return copy.sort(
          (a, b) =>
            new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime(),
        );
      case "alpha":
        return copy.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [members, sort]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="bg-white border border-black/15 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-green)]/30"
        >
          {(Object.entries(sortLabels) as [SortOption, string][]).map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ),
          )}
        </select>

        <span className="text-sm text-black/50">
          {members.length} total member{members.length !== 1 && "s"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sorted.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </main>
  );
}
