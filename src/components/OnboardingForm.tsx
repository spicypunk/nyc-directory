"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function OnboardingForm({ defaultName }: { defaultName: string }) {
  const [name, setName] = useState(defaultName);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name can't be empty");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-green)]"
        autoFocus
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-[var(--color-green)] hover:bg-[var(--color-green-hover)] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {loading ? "Saving..." : "Continue"}
      </button>
    </form>
  );
}
