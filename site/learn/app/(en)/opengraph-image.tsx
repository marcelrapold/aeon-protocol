import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "ÆON Learn — any subject, deeply researched, built around you";

export default function Image() {
  return renderOgImage({
    title: "Any subject. Deeply researched. Built around you.",
    subtitle: "Teach me Austrian Economics using learn.rapold.io — the open protocol for agent-orchestrated learning.",
  });
}
