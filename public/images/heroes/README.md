# Fotografías de los heroes — PENDIENTES

Este borrador prepara la composición responsive; **las fotografías todavía no están incorporadas**. Los SVG `hogar-pending.svg` y `corporativo-pending.svg` son marcadores creados para esta tarea, no fotografías ni recursos de Pexels. Incluyen un rótulo visible para que no se confundan con una entrega terminada. No aprobar ni publicar el cambio con estos marcadores.

## Recursos seleccionados, aún no descargados

- Hogar: Vlada Karpovich, Pexels 4050334. https://www.pexels.com/photo/content-young-woman-using-laptop-in-modern-living-room-4050334/
- Corporativo: Brett Sayles, Pexels 4508751. https://www.pexels.com/photo/server-racks-on-data-center-4508751/
- Licencia consultada el 12 de octubre de 2026: https://www.pexels.com/license/. Permite uso en sitios web y marketing, modificación y uso gratuito sin atribución obligatoria. No implica respaldo de las personas o marcas representadas.

La descarga desde `images.pexels.com` devolvió HTTP 403 en el entorno de trabajo. No se atribuye procedencia fotográfica a los SVG ni se incluyen URLs remotas en el componente.

## Para completar las imágenes antes de aprobar

Descargar las fotografías desde las páginas originales, comprobar que coincidan con los autores e IDs indicados y registrar aquí la procedencia, licencia, fecha y transformaciones de los archivos efectivamente incorporados. Revisar también marcas visibles y el encuadre final.

Guardar versiones locales WebP de hasta 1200 px de ancho (objetivo inferior a 200 KB por imagen), reemplazar las rutas de los SVG en `hero-section.tsx` por los archivos reales y retirar los marcadores y el TODO. `next/image` ya tiene `fill`, `sizes` y carga anticipada; adaptará las fotografías raster a cada dispositivo sin cambiar infraestructura.

## Revisión local

```sh
git fetch origin
git switch codex/modernizar-heroes
npm ci
# Usar la configuración pública de desarrollo habitual en .env.local.
npm run dev
```

Abrir http://localhost:3000/ y http://localhost:3000/corporativo. Revisar escritorio (1440 y 1024 px), tablet (768 px) y móvil (390 y 320 px). Confirmar los botones, el aviso importante de Hogar cuando exista y ausencia de desplazamiento horizontal. El PR debe continuar como borrador hasta incorporar las fotografías y completar la revisión visual.
