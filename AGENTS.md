<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Guía del repositorio

## Proyecto

Conectar Web es el sitio público corporativo y el panel administrativo de
**Conectar Servicios**. Usa Next.js 16 con App Router y Turbopack, React,
TypeScript estricto, Tailwind CSS, ESLint, una estructura `src/`, el alias
`@/*` y npm.

## Arquitectura

- `src/app/(public)` contiene las rutas de la web pública y su layout.
- `src/app/admin` contiene exclusivamente el panel administrativo y su layout.
- `src/app/auth` agrupa las pantallas de autenticación. No debe ofrecerse un
  registro administrativo público.
- `src/components/public` y `src/components/admin` alojarán componentes
  específicos de cada experiencia; `src/components/forms` y
  `src/components/ui`, piezas compartidas.
- `src/lib/auth`, `src/lib/supabase`, `src/lib/utils` y
  `src/lib/validations` alojarán infraestructura y lógica compartida, nunca
  componentes visuales. Los tipos compartidos vivirán en `src/types`.
- Supabase se incorporará como backend para PostgreSQL, Auth y Storage. Su
  acceso debe quedar centralizado en `src/lib/supabase`, con clientes de
  servidor y navegador separados cuando se implemente.

No crear archivos vacíos para materializar directorios futuros. Crear cada
carpeta cuando exista una responsabilidad real que ubicar en ella.

## Contenido administrable

No hardcodear información comercial variable: precios, planes, promociones,
servicios, noticias, eventos, preguntas frecuentes, información institucional,
datos de contacto ni redes sociales. Ese contenido provendrá de Supabase y se
gestionará desde `/admin`.

## Calidad

- Mantener TypeScript en modo estricto y evitar `any`.
- Elegir nombres claros, componentes pequeños y responsabilidades acotadas.
- Evitar duplicación y no introducir abstracciones antes de necesitarlas.
- No agregar ni actualizar dependencias sin una justificación técnica concreta.
- No modificar la arquitectura global, dependencias principales o decisiones
  técnicas importantes sin explicar el motivo.
- Antes de escribir código de Next.js, consultar la guía relevante incluida en
  `node_modules/next/dist/docs/` porque esta versión puede contener cambios
  incompatibles con versiones anteriores.

## Frontend

Desarrollar responsive desde el inicio, con HTML semántico, accesibilidad y una
experiencia visual consistente con el diseño corporativo de Conectar Servicios.
Mantener Server Components por defecto y usar Client Components solo cuando
una interacción o API del navegador lo requiera.

### Web pública

Priorizar SEO, rendimiento, metadata, accesibilidad y Server Components cuando
sean adecuados.

### Administración

Priorizar claridad, usabilidad y seguridad para usuarios no técnicos.

## Seguridad

- Nunca exponer secretos ni incluirlos en el repositorio.
- Nunca usar la clave `service_role` de Supabase en código cliente.
- Respetar las futuras políticas Row Level Security (RLS).
- No crear un flujo público de registro de administradores.

## Validaciones

Antes de finalizar una tarea relevante, ejecutar:

```bash
npm run lint
npm run build
```
