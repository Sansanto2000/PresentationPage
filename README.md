# PresentationPage

Página personal tipo *link tree* para mi (**Santiago Andres Ponte Ahón**).

Construida con **Next.js 15 (App Router)**, **React 19** y **TypeScript**. Sin backend: todo el
contenido es estático y se edita desde archivos JSON.

## Arranque rápido

```bash
cd links-page
npm install
npm run dev      # http://localhost:3000
```

Producción:

```bash
npm run build
npm run start
```

## Editar el contenido

No hace falta tocar código para actualizar la página:

| Qué cambiar | Archivo |
| --- | --- |
| Nombre, foto, títulos, certificados y pie de página | `links-page/app/data/profile.json` |
| Botones de enlaces (nombre, logo, URL) | `links-page/app/data/links.json` |

Los logos y la foto viven en `links-page/public/` y se referencian por nombre de archivo desde
los JSON.
