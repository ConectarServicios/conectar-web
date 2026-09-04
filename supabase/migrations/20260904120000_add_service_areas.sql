-- Introduce the service-area hierarchy without removing or rewriting legacy services.
create table public.service_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  icon text,
  public_url text check (
    public_url is null
    or public_url = '/'
    or public_url ~ '^/[^/]'
    or public_url ~* '^https?://'
  ),
  featured boolean not null default false,
  active boolean not null default true,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger service_areas_set_updated_at before update on public.service_areas
for each row execute function public.set_updated_at();

create index service_areas_public_order_idx on public.service_areas (display_order) where active;
create index service_areas_featured_idx on public.service_areas (featured) where featured;

alter table public.services add column service_area_id uuid
references public.service_areas (id) on delete restrict;
create index services_service_area_order_idx
on public.services (service_area_id, display_order) where active;

alter table public.service_areas enable row level security;
create policy "Public can read active service areas" on public.service_areas
for select to anon, authenticated using (active);
create policy "Administrators can manage service areas" on public.service_areas
for all to authenticated
using ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'))
with check ((select public.current_admin_role()) in ('editor', 'admin', 'super_admin'));

revoke all on table public.service_areas from public, anon, authenticated;
grant select on table public.service_areas to anon;
grant select, insert, update, delete on table public.service_areas to authenticated;

insert into public.service_areas
  (name, slug, short_description, description, icon, public_url, display_order)
values
  ('Internet y Wi-Fi', 'internet-wifi', 'Conectividad por fibra óptica y soluciones para mejorar la cobertura y estabilidad de tu red.', 'Soluciones de conectividad para hogares, con acceso a Internet por fibra óptica y alternativas para ampliar la cobertura Wi-Fi.', 'wifi', null, 1),
  ('Conectar Play', 'conectar-play', 'Televisión y entretenimiento para disfrutar en distintos dispositivos.', 'Servicio de televisión y streaming para clientes de Internet Conectar, con más de 100 canales y acceso desde múltiples dispositivos.', 'play', '/conectar-play', 2),
  ('Seguridad y Monitoreo', 'seguridad-monitoreo', 'Soluciones de seguridad, videoseguridad y monitoreo para hogares y organizaciones.', 'Sistemas de alarma, videoseguridad, monitoreo y control para acompañar distintas necesidades de protección.', 'security', null, 3),
  ('Conectividad para Empresas', 'conectividad-empresas', 'Infraestructura y conectividad para empresas, industrias y organizaciones.', 'Soluciones de Internet, redes, fibra óptica e interconexión pensadas para entornos empresariales.', 'business', null, 4),
  ('Data Center y Servicios Digitales', 'data-center-servicios-digitales', 'Infraestructura física y virtual, servidores y servicios digitales para organizaciones.', 'Servicios de Data Center, servidores, almacenamiento, dominios, DNS y correo para acompañar operaciones empresariales.', 'server', null, 5),
  ('Software y Tecnología', 'software-tecnologia', 'Desarrollo de software y soluciones tecnológicas adaptadas a distintas necesidades.', 'Desarrollo de aplicaciones, sistemas, integraciones, telemetría, soporte, comunicaciones y otras soluciones tecnológicas.', 'software', null, 6)
on conflict (slug) do nothing;

-- Existing canonical slugs keep all editorial text; only their relationship is set.
with canonical(area_slug, name, slug, short_description, display_order) as (values
  ('internet-wifi', 'Internet residencial por fibra óptica', 'internet-residencial-fibra-optica', 'Conectividad para el hogar mediante tecnología de fibra óptica FTTH.', 1),
  ('internet-wifi', 'WiFi Power Mesh', 'wifi-power-mesh', 'Soluciones para ampliar la cobertura y mejorar la estabilidad de la red Wi-Fi.', 2),
  ('conectar-play', 'Conectar Play', 'conectar-play', 'Televisión y streaming para clientes de Internet Conectar.', 1),
  ('conectar-play', 'Stick para Conectar Play', 'stick-conectar-play', 'Una alternativa para disfrutar Conectar Play en televisores no compatibles.', 2),
  ('seguridad-monitoreo', 'Alarmas monitoreadas', 'alarmas-monitoreadas', 'Sistemas de alarma y monitoreo adaptados a distintas necesidades de protección.', 1),
  ('seguridad-monitoreo', 'Videoseguridad y cámaras', 'videoseguridad-camaras', 'Soluciones de cámaras y videoseguridad para hogares y organizaciones.', 2),
  ('seguridad-monitoreo', 'Centros de monitoreo', 'centros-monitoreo', 'Tecnología e infraestructura para la gestión centralizada de alertas.', 3),
  ('seguridad-monitoreo', 'Control de acceso', 'control-acceso', 'Soluciones para gestionar el ingreso a espacios e instalaciones.', 4),
  ('seguridad-monitoreo', 'Monitoreo de activos', 'monitoreo-activos', 'Herramientas tecnológicas para el seguimiento y control de activos.', 5),
  ('seguridad-monitoreo', 'Botón de pánico y emergencia', 'boton-panico-emergencia', 'Dispositivos de alerta para situaciones de emergencia.', 6),
  ('seguridad-monitoreo', 'Soluciones IoT para seguridad', 'iot-seguridad', 'Dispositivos conectados para complementar soluciones de seguridad.', 7),
  ('conectividad-empresas', 'Internet corporativo', 'internet-corporativo', 'Conectividad a Internet pensada para empresas y organizaciones.', 1),
  ('conectividad-empresas', 'Internet simétrico', 'internet-simetrico', 'Conectividad con velocidades equivalentes de carga y descarga.', 2),
  ('conectividad-empresas', 'Interconexión de sucursales', 'interconexion-sucursales', 'Soluciones para vincular redes entre distintas sedes.', 3),
  ('conectividad-empresas', 'Redes de datos', 'redes-datos', 'Diseño e implementación de infraestructura para transmisión de datos.', 4),
  ('conectividad-empresas', 'Cableado estructurado', 'cableado-estructurado', 'Infraestructura organizada de cableado para entornos de trabajo.', 5),
  ('conectividad-empresas', 'Redes Wi-Fi empresariales', 'redes-wifi-empresariales', 'Soluciones inalámbricas diseñadas para espacios empresariales.', 6),
  ('conectividad-empresas', 'Redes ópticas y FTTH', 'redes-opticas-ftth', 'Infraestructura de fibra óptica para redes de acceso y distribución.', 7),
  ('conectividad-empresas', 'Enlaces punto a punto por fibra', 'enlaces-punto-punto-fibra', 'Conexiones de fibra óptica entre ubicaciones específicas.', 8),
  ('conectividad-empresas', 'Mantenimiento de redes ópticas', 'mantenimiento-redes-opticas', 'Servicios técnicos para acompañar la operación de redes de fibra.', 9),
  ('conectividad-empresas', 'Medición y certificación de fibra', 'medicion-certificacion-fibra', 'Medición técnica de enlaces e instalaciones de fibra óptica.', 10),
  ('data-center-servicios-digitales', 'Housing', 'housing', 'Espacio e infraestructura para alojar equipamiento tecnológico.', 1),
  ('data-center-servicios-digitales', 'Servidores físicos', 'servidores-fisicos', 'Infraestructura de servidores físicos para operaciones organizacionales.', 2),
  ('data-center-servicios-digitales', 'VPS / Servidores virtuales', 'vps-servidores-virtuales', 'Recursos de servidor virtual adaptables a diferentes necesidades.', 3),
  ('data-center-servicios-digitales', 'Storage', 'storage', 'Soluciones de almacenamiento para información y operaciones digitales.', 4),
  ('data-center-servicios-digitales', 'Administración de dominios', 'administracion-dominios', 'Gestión de dominios para la presencia digital de organizaciones.', 5),
  ('data-center-servicios-digitales', 'DNS primario y secundario', 'dns-primario-secundario', 'Servicios DNS para la resolución de dominios.', 6),
  ('data-center-servicios-digitales', 'Correo con dominio', 'correo-con-dominio', 'Cuentas de correo asociadas al dominio de cada organización.', 7),
  ('data-center-servicios-digitales', 'Servicios de mail para campañas', 'mail-campanas', 'Infraestructura de correo para comunicaciones y campañas.', 8),
  ('software-tecnologia', 'Desarrollo de software a medida', 'desarrollo-software-medida', 'Soluciones de software desarrolladas según necesidades específicas.', 1),
  ('software-tecnologia', 'Aplicaciones y sistemas web', 'aplicaciones-sistemas-web', 'Desarrollo de herramientas y sistemas accesibles desde la web.', 2),
  ('software-tecnologia', 'Aplicaciones móviles', 'aplicaciones-moviles', 'Desarrollo de aplicaciones para dispositivos móviles.', 3),
  ('software-tecnologia', 'Integraciones de sistemas', 'integraciones-sistemas', 'Conexión entre plataformas y sistemas para acompañar procesos.', 4),
  ('software-tecnologia', 'Soporte y administración', 'soporte-administracion', 'Acompañamiento técnico y administración de soluciones tecnológicas.', 5),
  ('software-tecnologia', 'Telemetría', 'telemetria', 'Soluciones para recopilar y visualizar datos de forma remota.', 6),
  ('software-tecnologia', 'Comunicaciones', 'comunicaciones', 'Herramientas tecnológicas para facilitar las comunicaciones.', 7),
  ('software-tecnologia', 'Ciberseguridad', 'ciberseguridad', 'Soluciones orientadas a proteger sistemas, redes e información.', 8),
  ('software-tecnologia', 'Hardware y soluciones tecnológicas', 'hardware-soluciones-tecnologicas', 'Equipamiento y soluciones tecnológicas para distintas necesidades.', 9)
), inserted as (
  insert into public.services (name, slug, short_description, display_order, service_area_id)
  select c.name, c.slug, c.short_description, c.display_order, a.id
  from canonical c join public.service_areas a on a.slug = c.area_slug
  on conflict (slug) do nothing
  returning id
)
update public.services s set service_area_id = a.id
from canonical c join public.service_areas a on a.slug = c.area_slug
where s.slug = c.slug and s.service_area_id is distinct from a.id;
