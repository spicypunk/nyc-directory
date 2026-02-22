"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";

const PRICE_RANGES = [
  "< $1500",
  "$1500 - $1999",
  "$2000 - $2499",
  "$2500 - $2999",
  "$3000+",
];

export function AddRoomForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [roommateCount, setRoommateCount] = useState("");
  const [externalLink, setExternalLink] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        photoUrl,
        neighborhood,
        priceRange,
        roommateCount: roommateCount === "" ? null : parseInt(roommateCount, 10),
        externalLink: externalLink || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      if (data.errors) {
        setErrors(data.errors);
      } else {
        setErrors({ form: data.error || "Something went wrong" });
      }
      setSubmitting(false);
      return;
    }

    router.push("/");
  }

  const inputClass =
    "w-full rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-green)] focus:border-transparent transition-shadow";
  const labelClass = "block text-sm font-medium text-black/70 mb-1";
  const errorClass = "text-red-600 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.form && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errors.form}
        </p>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder='e.g. "Sunny room in Williamsburg 2BR"'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
        {errors.title && <p className={errorClass}>{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe the room, amenities, move-in date, etc."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass + " resize-y"}
        />
        {errors.description && (
          <p className={errorClass}>{errors.description}</p>
        )}
      </div>

      {/* Photo URL */}
      <div>
        <label htmlFor="photoUrl" className={labelClass}>
          Photo URL
        </label>
        <input
          id="photoUrl"
          type="url"
          placeholder="https://example.com/photo.jpg"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          className={inputClass}
        />
        {errors.photoUrl && <p className={errorClass}>{errors.photoUrl}</p>}
      </div>

      {/* Neighborhood + Price Range row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="neighborhood" className={labelClass}>
            Neighborhood
          </label>
          <select
            id="neighborhood"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className={inputClass}
          >
            <option value="">Select neighborhood</option>
            {(
              Object.entries(NEIGHBORHOODS) as [
                string,
                readonly string[],
              ][]
            ).map(([borough, hoods]) => (
              <optgroup key={borough} label={borough}>
                {hoods.map((hood) => (
                  <option key={hood} value={hood}>
                    {hood}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.neighborhood && (
            <p className={errorClass}>{errors.neighborhood}</p>
          )}
        </div>

        <div>
          <label htmlFor="priceRange" className={labelClass}>
            Price Range
          </label>
          <select
            id="priceRange"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className={inputClass}
          >
            <option value="">Select price range</option>
            {PRICE_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
          {errors.priceRange && (
            <p className={errorClass}>{errors.priceRange}</p>
          )}
        </div>
      </div>

      {/* Roommate Count */}
      <div>
        <label htmlFor="roommateCount" className={labelClass}>
          Number of Roommates
        </label>
        <input
          id="roommateCount"
          type="number"
          min="0"
          placeholder="0"
          value={roommateCount}
          onChange={(e) => setRoommateCount(e.target.value)}
          className={inputClass + " max-w-32"}
        />
        {errors.roommateCount && (
          <p className={errorClass}>{errors.roommateCount}</p>
        )}
      </div>

      {/* External Link */}
      <div>
        <label htmlFor="externalLink" className={labelClass}>
          External Link{" "}
          <span className="font-normal text-black/40">(optional)</span>
        </label>
        <input
          id="externalLink"
          type="url"
          placeholder="https://notion.so/your-listing"
          value={externalLink}
          onChange={(e) => setExternalLink(e.target.value)}
          className={inputClass}
        />
        {errors.externalLink && (
          <p className={errorClass}>{errors.externalLink}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[var(--color-green)] hover:bg-[var(--color-green-hover)] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Adding..." : "Add Room"}
      </button>
    </form>
  );
}
