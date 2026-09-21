import type { CoverageProvider } from "../../types/coverage.ts";

export const notConfiguredCoverageProvider: CoverageProvider = {
  async checkCoverage({ address }) {
    return { address, status: "not-configured" };
  },
};
