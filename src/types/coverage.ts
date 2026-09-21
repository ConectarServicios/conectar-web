export type CoverageStatus = "available" | "unavailable" | "review" | "not-configured";

export type CoverageReason =
  | "upcoming"
  | "outside-service-area"
  | "ambiguous"
  | "geocoding-error"
  | "missing-configuration";

export type CoverageInput = {
  address: string;
};

export type CoverageResult = {
  address: string;
  status: CoverageStatus;
  reason?: CoverageReason;
};

export interface CoverageProvider {
  checkCoverage(input: CoverageInput): Promise<CoverageResult>;
}
