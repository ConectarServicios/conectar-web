import {
  BellRinging,
  SecurityCamera,
  TelevisionSimple,
  WifiHigh,
} from "@phosphor-icons/react/dist/ssr";

import type { ServiceIcon } from "@/data/services/types";

type HomeServiceIconProps = Readonly<{
  icon: ServiceIcon;
  size?: number;
}>;

const iconProps = {
  "aria-hidden": true,
  weight: "duotone",
} as const;

export function HomeServiceIcon({
  icon,
  size = 24,
}: HomeServiceIconProps) {
  switch (icon) {
    case "bell-ring":
      return <BellRinging {...iconProps} size={size} />;
    case "cctv":
      return <SecurityCamera {...iconProps} size={size} />;
    case "tv":
      return <TelevisionSimple {...iconProps} size={size} />;
    case "wifi":
      return <WifiHigh {...iconProps} size={size} />;
    default:
      return null;
  }
}
