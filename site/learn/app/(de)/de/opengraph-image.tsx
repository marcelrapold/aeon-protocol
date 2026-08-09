import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "AEON Learn — jedes Thema, tief recherchiert, um dich gebaut";

export default function Image() {
  return renderOgImage({
    title: "Jedes Thema. Tief recherchiert. Um dich gebaut.",
    subtitle: "Teach me Austrian Economics using learn.rapold.io — das offene Protokoll für agent-orchestriertes Lernen.",
  });
}
