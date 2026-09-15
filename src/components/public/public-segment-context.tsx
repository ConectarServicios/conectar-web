"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type PublicSegment = "hogar" | "corporativo";

type PublicSegmentContextValue = {
  segment: PublicSegment;
  setSegment: (segment: PublicSegment) => void;
};

const PublicSegmentContext = createContext<PublicSegmentContextValue | null>(null);

export function PublicSegmentProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [segment, setSegment] = useState<PublicSegment>("hogar");
  const value = useMemo(() => ({ segment, setSegment }), [segment]);

  return <PublicSegmentContext value={value}>{children}</PublicSegmentContext>;
}

export function usePublicSegment() {
  const context = useContext(PublicSegmentContext);

  if (!context) {
    throw new Error("usePublicSegment must be used within PublicSegmentProvider");
  }

  return context;
}
