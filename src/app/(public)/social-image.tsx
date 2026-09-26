import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

const isotipoData = await readFile(
  join(process.cwd(), "public/brand/conectar-isotipo.png"),
  "base64",
);
const isotipoSrc = `data:image/png;base64,${isotipoData}`;

export function createSocialImage(size: { width: number; height: number }) {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#2F6BFF",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {/* ImageResponse renders standard img elements through Satori. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          height={280}
          src={isotipoSrc}
          style={{ objectFit: "contain" }}
          width={280}
        />
        <div
          style={{
            fontSize: 54,
            fontWeight: 700,
            letterSpacing: "-1px",
            lineHeight: 1,
            marginTop: 34,
          }}
        >
          Conectar Servicios
        </div>
      </div>
    ),
    size,
  );
}
