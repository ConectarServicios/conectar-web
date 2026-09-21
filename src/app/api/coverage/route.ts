import { geoCoverageProvider } from "@/lib/coverage/configured-provider";
import { createCoveragePostHandler } from "@/lib/coverage/route-handler";

export const POST = createCoveragePostHandler(geoCoverageProvider);
