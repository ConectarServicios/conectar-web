import { serviceCatalog } from "@/data/services/catalog";
import type { ServiceDefinition, ServiceGroup } from "@/data/services/types";

export function getCorporateServicesByGroup(
  group: ServiceGroup,
): readonly ServiceDefinition[] {
  return serviceCatalog
    .filter(
      (service) =>
        service.group === group &&
        service.segments.includes("corporativo") &&
        service.showOnHomeCorporativo,
    )
    .toSorted((first, second) => first.order - second.order);
}
