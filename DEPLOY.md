# Despliegue en Linux con Docker

## Requisitos

- Git
- Docker Engine
- Plugin Docker Compose (`docker compose`)
- Nginx instalado en el host

Nginx permanece fuera de Docker y deberá hacer proxy hacia
`http://127.0.0.1:3001`. La configuración concreta de Nginx dependerá del
futuro dominio.

## Instalación inicial

1. Clone el repositorio y entre al directorio del proyecto:

   ```bash
   git clone https://github.com/ConectarServicios/conectar-web.git
   cd conectar-web
   ```

2. Cree el archivo de variables y complete todos sus valores con las
   credenciales y URL del entorno de producción:

   ```bash
   cp .env.example .env
   ```

   Las variables `NEXT_PUBLIC_*` se incorporan al cliente durante la
   construcción. `SUPABASE_SERVICE_ROLE_KEY` se entrega únicamente al
   contenedor en tiempo de ejecución. **Nunca suba `.env` a Git.**

3. Construya y levante el servicio:

   ```bash
   docker compose build
   docker compose up -d
   ```

La aplicación escucha en el puerto `3000` dentro del contenedor. Compose lo
publica exclusivamente como `127.0.0.1:3001` en el host, no directamente en
Internet.

## Verificación

```bash
docker compose ps
docker compose logs --tail=100 conectar-web
curl -I http://127.0.0.1:3001/
```

Los logs se emiten por stdout/stderr y pueden seguirse con:

```bash
docker compose logs -f conectar-web
```

## Actualización

```bash
git pull origin main
docker compose build
docker compose up -d
```

Como alternativa, reconstruya y levante en un solo comando:

```bash
docker compose up -d --build
```

## Detención

```bash
docker compose down
```
