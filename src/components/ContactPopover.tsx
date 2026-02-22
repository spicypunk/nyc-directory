"use client";

import { useState, useRef, useEffect } from "react";
import { Toast } from "@/components/Toast";

export function ContactPopover({
  email,
  twitterHandle,
}: {
  email: string | null;
  twitterHandle: string;
}) {
  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  async function copyEmail() {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setShowToast(true);
    } catch {
      // Clipboard API may fail if page is not focused
    }
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="bg-[var(--color-green)] hover:bg-[var(--color-green-hover)] text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
      >
        Contact me
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-black/10 py-2 px-1 z-50 flex gap-1">
          {email && (
            <button
              onClick={copyEmail}
              className="p-2 rounded-md hover:bg-black/5 transition-colors"
              title="Copy email"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          )}
          <a
            href={`https://x.com/${twitterHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md hover:bg-black/5 transition-colors"
            title="Open Twitter profile"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      )}

      {showToast && (
        <Toast message="Email copied!" onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}
