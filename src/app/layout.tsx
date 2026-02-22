import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DirectoryNYC",
  description: "An invite-only NYC co-living community directory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
