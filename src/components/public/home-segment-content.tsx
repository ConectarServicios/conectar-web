"use client";

import type { ReactNode } from "react";

import { usePublicSegment } from "@/components/public/public-segment-context";

type HomeSegmentContentProps = Readonly<{
  hogar: ReactNode;
  corporativo: ReactNode;
}>;

export function HomeSegmentContent({ hogar, corporativo }: HomeSegmentContentProps) {
  const { segment } = usePublicSegment();

  return segment === "hogar" ? hogar : corporativo;
}
