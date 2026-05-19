import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tikkie Project Operation Center",
    short_name: "Tikkie Ops",
    description: "Internal project request and task tracking center for Tikkie.",
    start_url: "/login",
    display: "standalone",
    background_color: "#F4F7FF",
    theme_color: "#1700C7",
    icons: [
      {
        src: "/tikkie-project-icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/tikkie-project-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
