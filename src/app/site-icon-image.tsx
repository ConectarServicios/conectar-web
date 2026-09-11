import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

const isotipoData = await readFile(
  join(process.cwd(), "public/brand/conectar-isotipo.png"),
  "base64",
);
const isotipoSrc = `data:image/png;base64,${isotipoData}`;

export function createSiteIcon(size: { width: number; height: number }) {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {/* ImageResponse renders standard img elements through Satori. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          height={size.height}
          src={isotipoSrc}
          style={{ objectFit: "contain" }}
          width={size.width}
        />
      </div>
    ),
    size,
  );
}
