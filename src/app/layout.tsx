import type { Metadata, Viewport } from "next";
import { AppFrame } from "@/components/operation/app-frame";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tikkie Project Operation Center",
  description: "Internal project request and task tracking center for Tikkie.",
  applicationName: "ttdLab",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0F1A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
