import { ImageResponse } from "next/og";
import { BRAND_HEX, MARK_NODES, MARK_PATH, MARK_VIEWBOX } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BRAND_HEX,
          borderRadius: 40,
        }}
      >
        <svg width="120" height="120" viewBox={MARK_VIEWBOX}>
          <path
            d={MARK_PATH}
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {MARK_NODES.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" fill="#ffffff" />
          ))}
        </svg>
      </div>
    ),
    size,
  );
}
