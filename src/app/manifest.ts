import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TaskIT",
    short_name: "TaskIT",
    description: "Planejamento de estudos com clareza, calma e foco.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFCF8",
    theme_color: "#B9F227",
    icons: [
      {
        src: "/taskit-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
