# Conectar Web

Conectar Web es la nueva plataforma de **Conectar Servicios**. Reunirá el sitio
web público corporativo y un panel en `/admin` desde el que se administrará su
contenido. Esta primera etapa establece la arquitectura base; la integración
con Supabase se incorporará en tareas posteriores.

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
