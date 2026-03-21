import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Telephonia.ai — AI Voice Agents That Close Deals",
  description: "Replace your cold-calling team with AI voice agents indistinguishable from real humans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
