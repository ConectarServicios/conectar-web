import { serviceCatalog } from "@/data/services/catalog";
import { serviceGroups } from "@/data/services/groups";
import type {
  ServiceDefinition,
  ServiceGroup,
  ServiceGroupDefinition,
  ServiceSegment,
} from "@/data/services/types";

export function getServiceGroups(): readonly ServiceGroupDefinition[] {
  return serviceGroups.toSorted((first, second) => first.order - second.order);
}

export function getPublicServiceGroups(): readonly ServiceGroupDefinition[] {
  return getServiceGroups().filter((group) => group.showOnServicesIndex);
}

export function getPublicServiceGroupsBySegment(
  segment: ServiceSegment,
): readonly ServiceGroupDefinition[] {
  return getPublicServiceGroups().filter((group) =>
    group.segments.includes(segment),
  );
}

export function getServiceGroupBySlug(
  slug: string,
): ServiceGroupDefinition | undefined {
  return serviceGroups.find((group) => group.slug === slug);
}

export function getServicesByGroup(
  group: ServiceGroup,
): readonly ServiceDefinition[] {
  return serviceCatalog
    .filter((service) => service.group === group)
    .toSorted((first, second) => first.order - second.order);
}

export function getServiceBySlugs(
  groupSlug: string,
  serviceSlug: string,
): ServiceDefinition | undefined {
  const group = getServiceGroupBySlug(groupSlug);

  return group
    ? serviceCatalog.find(
        (service) =>
          service.group === group.slug && service.slug === serviceSlug,
      )
    : undefined;
}

export function getServicesBySegment(
  segment: ServiceSegment,
): readonly ServiceDefinition[] {
  return serviceCatalog
    .filter((service) =>
      service.segments.some((serviceSegment) => serviceSegment === segment),
    )
    .toSorted((first, second) => first.order - second.order);
}

export function getIndexableServicePaths(): readonly string[] {
  return serviceCatalog
    .filter((service) => service.hasDetailPage)
    .map((service) => `/servicios/${service.group}/${service.slug}`);
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

const validGroups = new Set(serviceGroups.map(({ slug }) => slug));

if (serviceCatalog.some(({ group }) => !validGroups.has(group))) {
  throw new Error("El catálogo contiene servicios asignados a grupos inexistentes.");
}
