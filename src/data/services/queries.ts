import { serviceCatalog } from "@/data/services/catalog";
import type {
  ServiceDefinition,
  ServiceGroup,
  ServiceSegment,
} from "@/data/services/types";

export function getServicesBySegment(
  segment: ServiceSegment,
): readonly ServiceDefinition[] {
  return serviceCatalog
    .filter((service) =>
      service.segments.some((serviceSegment) => serviceSegment === segment),
    )
    .toSorted((first, second) => first.order - second.order);
}

export function getHomeServicesByGroup(
  group: ServiceGroup,
): readonly ServiceDefinition[] {
  return getServicesBySegment("hogar")
    .filter(
      (service) => service.group === group && service.showOnHomeHogar,
    )
    .toSorted((first, second) => first.order - second.order);
}

export function getCorporateServicesByGroup(
  group: ServiceGroup,
): readonly ServiceDefinition[] {
  return serviceCatalog
    .filter(
      (service) =>
        service.group === group &&
        service.segments.some((segment) => segment === "corporativo") &&
        service.showOnHomeCorporativo,
    )
    .toSorted((first, second) => first.order - second.order);
}
