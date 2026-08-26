# Conectar Web

Conectar Web es la nueva plataforma de **Conectar Servicios**. Reunirá el sitio
web público corporativo y un panel en `/admin` desde el que se administrará su
contenido. La infraestructura de Supabase está preparada como backend para las
próximas funcionalidades de datos y autenticación.

## Stack

- Next.js 16 (App Router y Turbopack)
- React y TypeScript estricto
- Tailwind CSS
- ESLint
- npm

## Desarrollo local

Instalá las dependencias:

```bash
npm install
```

Copiá el archivo de variables de entorno y completá las credenciales públicas
del proyecto Supabase (sin agregar claves secretas):

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-clave-publicable
```

Iniciá el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Migraciones de Supabase

El esquema de datos se versiona en `supabase/migrations`. Aplicá las migraciones
con el flujo de Supabase CLI correspondiente al entorno; no edites el esquema
remoto sin crear una migración reproducible. La migración inicial crea el
contenido administrable, sus grants explícitos y policies RLS.

Después de crear el primer usuario en Supabase Auth, vinculalo manualmente desde
un contexto de base de datos con privilegios de propietario (por ejemplo, el
SQL Editor) reemplazando el UUID del ejemplo:

```sql
insert into public.profiles (id, full_name, role)
values ('<AUTH_USER_UUID>', 'Administrador', 'super_admin');
```

No uses una sesión de cliente para este bootstrap ni guardes UUID, emails,
contraseñas o claves reales en el repositorio. Los perfiles posteriores se
administran bajo RLS por un `super_admin`.

## Validaciones

Ejecutá el análisis estático:

```bash
npm run lint
```

Generá el build de producción:

```bash
npm run build
```
