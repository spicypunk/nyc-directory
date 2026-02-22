"use client";

import { useState } from "react";

export function RoomCardDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = description.length > 150;

  return (
    <div className="text-sm text-black/70">
      <p className={!expanded && isLong ? "line-clamp-3" : ""}>
        {description}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[var(--color-green)] text-xs font-medium mt-1 hover:underline"
        >
          {expanded ? "See Less" : "See More"}
        </button>
      )}
    </div>
  );
}
