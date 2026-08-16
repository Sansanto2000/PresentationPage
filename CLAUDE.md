# CLAUDE.md

Guía para asistentes de IA (y para cualquier persona nueva) que trabajen en este repositorio.

## Qué es este proyecto

Página personal tipo *link tree* de **Santiago Andrés Ponte Ahón**. Se distribuye por QR en
tarjetas de presentación, así que la prioridad es: **carga rápida, legible en mobile y con
todos los enlaces a un toque de distancia**.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- CSS plano con *custom properties* (sin Tailwind ni CSS-in-JS)
- Sin backend, sin base de datos: todo el contenido es estático y vive en JSON

## Estructura

```
links-page/
├─ app/
│  ├─ layout.tsx            # Metadata, fuente y <html>/<body>
│  ├─ page.tsx              # Composición de la página (Server Component)
│  ├─ interfaces.tsx        # Tipos compartidos
│  ├─ data/
│  │  ├─ profile.json       # Nombre, títulos, certificados, footer
│  │  └─ links.json         # Botones de enlaces
│  ├─ lib/
│  │  └─ maze.ts            # Generador del laberinto del fondo
│  ├─ molecules/            # Componentes de UI
│  └─ styles/               # Hojas de estilo por componente + tokens
└─ public/
   └─ *.png                 # Logos de los enlaces y foto de perfil
```

## Reglas de código

- **El contenido no se hardcodea en los componentes.** Nombre, títulos, enlaces y textos del
  footer salen de `app/data/*.json`. Si hay que agregar un enlace o un título, se toca el JSON,
  no el TSX.
- Todo dato que venga de JSON tiene su tipo en `app/interfaces.tsx`.
- Los componentes son **Server Components** por defecto. `"use client"` solo donde hay estado o
  efectos (hoy: únicamente el fondo animado).
- Un componente por archivo, con el nombre del archivo igual al del componente.
- Los estilos van en `app/styles/<componente>.css` y se importan desde el componente. Los colores,
  espaciados y tiempos se definen una sola vez como variables CSS en `app/styles/tokens.css`.
- **Accesibilidad no es opcional**: todo enlace lleva texto accesible (`aria-label` si el contenido
  es solo un icono), y toda animación se desactiva bajo `prefers-reduced-motion: reduce`.
- La lógica que no es de UI (por ejemplo, la generación del laberinto) vive en `app/lib/`, sin
  importar React: así se puede leer y probar por separado.
- No se agregan imágenes de terceros con copyright. El fondo se dibuja por código.

## Comandos

```bash
cd links-page
npm install
npm run dev      # desarrollo en http://localhost:3000
npm run build    # build de producción
npm run start    # servir el build
```

## Sincronización con GitHub

Remoto: `https://github.com/Sansanto2000/PresentationPage.git` — rama principal: `main`.

Reglas **obligatorias**:

1. **Formato del mensaje de commit**: `tipo: descripción corta`
   - `tipo` es **`feat`** (funcionalidad o contenido nuevo) o **`fix`** (corrección o arreglo).
   - La descripción es una línea corta en español que explica *qué* se hizo.
   - Ejemplos: `feat: laberinto autogenerado de fondo`, `fix: enlace de contacto roto`.
2. **Un commit por problema.** Si en una tanda se hicieron tres cosas distintas (una funcionalidad,
   un bug y un ajuste visual), se hacen **tres commits**, uno por cada tema. Nunca un commit
   paraguas que junte todo.
3. **No se commitea ni se pushea nada sin aprobación de Santiago.** El asistente hace los cambios
   en el working tree y ahí se detiene. Santiago revisa y **stagea** lo que acepta; recién ahí se
   commitea. En concreto: no correr `git add`, `git commit`, `git push`, `git rm` ni ningún comando
   que toque el índice o el remoto por iniciativa propia.
4. No se reescribe historia publicada (`rebase`, `push --force`) bajo ninguna circunstancia.

## Versionado

Se sigue **SemVer** (`MAJOR.MINOR.PATCH`), y la versión vive en `links-page/package.json`.
El número **no cuenta commits**: describe la naturaleza del cambio publicado.

- **PATCH** (`1.1.0` → `1.1.1`): arreglos que no agregan nada. Un enlace roto, un color mal puesto.
- **MINOR** (`1.1.0` → `1.2.0`): funcionalidad o contenido nuevo que no rompe lo anterior.
  Un título más, una sección, un rediseño.
- **MAJOR** (`1.1.0` → `2.0.0`): cambios incompatibles. En un sitio como este, básicamente
  cambiar la URL pública o rehacerlo de cero.

Una versión agrupa todos los commits de una tanda: diez commits de arreglos siguen siendo un
solo `PATCH`. Al publicar:

1. Actualizar `"version"` en `links-page/package.json`.
2. Etiquetar el merge en `main`: `git tag -a v1.1.0 -m "v1.1.0" && git push origin v1.1.0`.
3. En GitHub, crear la Release a partir de esa etiqueta con un resumen de la tanda.

## Cosas a no romper

- La foto `public/fotoSAPonteAhon.jpg` y los logos de `public/` están referenciados por nombre
  desde los JSON: si se renombran, hay que actualizar el JSON.
- El laberinto se genera con `Math.random` en el navegador: `MazeBackground` es un Client
  Component a propósito. Generarlo en el servidor rompería la hidratación.
- El QR impreso apunta a la raíz del sitio. La ruta `/` tiene que seguir siendo la página completa.
