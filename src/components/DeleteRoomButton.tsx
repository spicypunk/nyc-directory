"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteRoomButton({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/rooms/${roomId}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    }
    setDeleting(false);
    setConfirming(false);
  }

  if (confirming) {
    return (
      <span className="flex gap-2 text-xs">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="font-medium text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Confirm delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="font-medium text-black/50 hover:text-black/80 transition-colors"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs font-medium text-red-500/70 hover:text-red-600 transition-colors"
    >
      Delete
    </button>
  );
}
