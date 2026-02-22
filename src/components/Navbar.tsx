"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Toast } from "@/components/Toast";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session) return null;

  const activeTab = pathname === "/members" ? "members" : "rooms";

  async function copyInviteLink() {
    const url = `${window.location.origin}/?referralCode=${session!.user.referralCode}`;
    await navigator.clipboard.writeText(url);
    setShowToast(true);
  }

  return (
    <nav className="border-b border-black/10">
      <div className="mx-auto max-w-3xl px-4">
        {/* Top row */}
        <div className="flex items-center justify-between h-14">
          {/* X/Twitter icon */}
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/60 hover:text-black"
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

          {/* Title */}
          <h1 className="font-[family-name:var(--font-playfair)] text-xl font-bold">
            DirectoryNYC
          </h1>

          {/* Right: Invite button + Avatar */}
          <div className="flex items-center gap-3">
            <button
              onClick={copyInviteLink}
              className="bg-[var(--color-green)] hover:bg-[var(--color-green-hover)] text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              Invite
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="rounded-full overflow-hidden w-8 h-8"
              >
                <Image
                  src={session.user.profileImageUrl}
                  alt={session.user.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-black/10 py-1 z-50">
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-black/5 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 pb-3">
          <Link
            href="/"
            className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-colors ${
              activeTab === "rooms"
                ? "border-black text-black"
                : "border-transparent text-black/50 hover:text-black/70"
            }`}
          >
            Rooms
          </Link>
          <Link
            href="/members"
            className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-colors ${
              activeTab === "members"
                ? "border-black text-black"
                : "border-transparent text-black/50 hover:text-black/70"
            }`}
          >
            Members
          </Link>
        </div>
      </div>

      {showToast && (
        <Toast message="Link copied!" onClose={() => setShowToast(false)} />
      )}
    </nav>
  );
}
