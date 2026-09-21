export type CoverageStatus = "available" | "unavailable" | "review" | "not-configured";

export type CoverageInput = {
  address: string;
};

export type CoverageResult = {
  address: string;
  status: CoverageStatus;
};

export interface CoverageProvider {
  checkCoverage(input: CoverageInput): Promise<CoverageResult>;
}
