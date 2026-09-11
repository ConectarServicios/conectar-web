import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const alt = "Conectar Servicios — soluciones de conectividad";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const isotipoData = await readFile(
  join(process.cwd(), "public/brand/conectar-isotipo.png"),
  "base64",
);
const isotipoSrc = `data:image/png;base64,${isotipoData}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#071a2f",
          color: "#ffffff",
          display: "flex",
          height: "100%",
          padding: "76px 88px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#f58220",
            height: 10,
            left: 88,
            position: "absolute",
            top: 70,
            width: 96,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 760,
            paddingTop: 28,
          }}
        >
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: "-2px",
              lineHeight: 1.05,
            }}
          >
            Conectar Servicios
          </div>
          <div
            style={{
              color: "#d8e4ee",
              fontSize: 34,
              lineHeight: 1.35,
              marginTop: 32,
            }}
          >
            Soluciones de conectividad para hogares y organizaciones.
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            background: "#ffffff",
            borderRadius: 48,
            display: "flex",
            height: 236,
            justifyContent: "center",
            marginLeft: "auto",
            width: 236,
          }}
        >
          <img
            alt=""
            height={176}
            src={isotipoSrc}
            style={{ objectFit: "contain" }}
            width={176}
          />
        </div>
      </div>
    ),
    size,
  );
}
