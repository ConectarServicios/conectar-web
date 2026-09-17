import {
  ArrowLeftRight,
  BellRing,
  Binary,
  Boxes,
  BrickWall,
  Cable,
  Cctv,
  Cloud,
  DatabaseBackup,
  EthernetPort,
  Gauge,
  GitBranch,
  MailCheck,
  Network,
  Phone,
  Radar,
  RadioTower,
  ServerCog,
  ShieldCheck,
  Tv,
  Warehouse,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import type { ServiceIcon } from "@/data/services/types";

const serviceIcons = {
  "arrow-left-right": ArrowLeftRight,
  "bell-ring": BellRing,
  binary: Binary,
  boxes: Boxes,
  "brick-wall": BrickWall,
  cable: Cable,
  cctv: Cctv,
  cloud: Cloud,
  "database-backup": DatabaseBackup,
  "ethernet-port": EthernetPort,
  gauge: Gauge,
  "git-branch": GitBranch,
  "mail-check": MailCheck,
  network: Network,
  phone: Phone,
  radar: Radar,
  "radio-tower": RadioTower,
  "server-cog": ServerCog,
  "shield-check": ShieldCheck,
  tv: Tv,
  warehouse: Warehouse,
  wifi: Wifi,
} satisfies Record<ServiceIcon, LucideIcon>;

type ServiceCatalogIconProps = {
  icon: ServiceIcon;
  size?: number;
};

export function ServiceCatalogIcon({
  icon,
  size = 23,
}: ServiceCatalogIconProps) {
  const Icon = serviceIcons[icon];

  return <Icon aria-hidden="true" size={size} strokeWidth={2} />;
}
