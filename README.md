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

## Validaciones

Ejecutá el análisis estático:

```bash
npm run lint
```

Generá el build de producción:

```bash
npm run build
```
