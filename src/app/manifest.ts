import type { MetadataRoute } from "next";
import { iconSizes } from "./icon";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ActivityViz",
    short_name: "ActViz",
    description: "Googleマイアクティビティを可視化します。",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: iconSizes.map((size) => ({
      src: `/icon/${size}`,
      sizes: `${size}x${size}`,
      type: "image/png",
    })),
  };
}
