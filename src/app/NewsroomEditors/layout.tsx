import type { Metadata } from "next";
import { AppFrame } from "@/components/newsroom/app-frame";

export const metadata: Metadata = {
  title: "News Risk Monitor",
  description: "AI-assisted editorial risk screening system for Thai professional newsroom editors.",
  applicationName: "News Risk Monitor",
  icons: {
    icon: "/news-risk-icon.svg",
    shortcut: "/news-risk-icon.svg",
    apple: "/news-risk-icon.svg",
  },
};

export default function NewsroomEditorsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AppFrame>{children}</AppFrame>;
}
