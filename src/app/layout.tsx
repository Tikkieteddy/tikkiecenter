import type { Metadata, Viewport } from "next";
import { AppFrame } from "@/components/operation/app-frame";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tikkie Project Operation Center",
  description: "Internal project request and task tracking center for Tikkie.",
  applicationName: "Tikkie Project Operation Center",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/tikkie-project-logo.jpg",
    shortcut: "/tikkie-project-logo.jpg",
    apple: "/tikkie-project-logo.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: "#1700C7",
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
