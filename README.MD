# 🎨 Colorfly Studio

Generador de paletas de colores en el navegador. Permite generar paletas aleatorias en formato **HEX** o **HSL**, bloquear los colores que quieras conservar, copiarlos con un clic y guardar paletas completas para consultarlas después.

## Índice

- [Características](#características)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instrucciones de uso](#instrucciones-de-uso)
- [Decisiones técnicas](#decisiones-técnicas)
- [Requisitos](#requisitos)
- [Cómo ejecutarlo en local](#cómo-ejecutarlo-en-local)
- [Cómo desplegarlo](#cómo-desplegarlo)
- [Limitaciones conocidas](#limitaciones-conocidas)

## Características

- Generación de paletas de **6, 8 o 9 colores**.
- Dos formatos de color: **HSL** y **HEX**.
- Botón **Lock** por cada color: lo fija para que no cambie al generar una nueva paleta, mientras el resto de las casillas sí se regeneran.
- Botón **Copy** por cada color: copia el código al portapapeles y muestra una notificación (toast) de confirmación.
- Botón **Guardar Paleta**: guarda la paleta actual con un nombre y una fecha, y la agrega a la sección "Paletas guardadas".
- Interfaz responsiva construida solo con HTML, CSS y JavaScript, sin dependencias externas.

## Estructura del proyecto

```
colorfly-studio/
├── index.html          # Estructura principal de la página
├── css/
│   └── style.css       # Estilos de la interfaz
├── js/
│   └── script.js        # Lógica de generación, lock, copy y guardado
└── images/
    └── logo-color-fly-web.png
```

## Instrucciones de uso

1. Abre `index.html` en el navegador.
2. En el panel de control, izquierdo:
   - Elige la **cantidad de colores** de la paleta (6, 8 o 9).
   - Pulsa **Generar paleta** para crear una nueva combinación aleatoria.
3. En el panel de control, derecho:
   - Elige el **formato** de los códigos de color (HSL o HEX).
   - Pulsa **Guardar Paleta** para almacenar la paleta que se está viendo en ese momento. Se te pedirá un nombre para identificarla.
4. En cada casilla de color:
   - Pulsa **Lock** para fijar ese color. Mientras esté bloqueado (borde dorado), no cambiará aunque generes nuevas paletas; vuelve a pulsarlo para desbloquearlo.
   - Pulsa **Copy** para copiar ese código de color al portapapeles.
5. Las paletas guardadas aparecen debajo, cada una con su nombre, fecha y la vista previa de sus colores.

## Decisiones técnicas

- **Sin frameworks ni librerías externas**: todo el proyecto está hecho en HTML, CSS y JavaScript "vanilla" para mantenerlo ligero y fácil de desplegar en cualquier hosting estático.
- **Estado centralizado en `boxStates`**: en lugar de generar el DOM directamente al azar, cada casilla se representa como un objeto `{ color, locked }` guardado en el arreglo `boxStates`. Al generar una nueva paleta, el código recorre ese arreglo y solo reemplaza los colores que **no** están bloqueados, conservando los que sí lo están. Esto evita tener que "leer" el color desde el DOM y hace el comportamiento de Lock predecible.
- **Renderizado declarativo (`renderPalette`)**: la interfaz siempre se reconstruye a partir de `boxStates`, nunca se edita el DOM "a mano" fuera de esa función. Así el HTML y el estado interno nunca quedan desincronizados.
- **Íconos como SVG en línea**: los íconos de candado y de copiar están definidos como cadenas SVG dentro del propio `script.js` (objeto `ICONS`), para no depender de una librería de íconos ni de peticiones adicionales.
- **`navigator.clipboard.writeText`** para copiar códigos de color, por ser la API estándar y nativa del navegador (no requiere librerías).
- **Botones tipo "isla"** para tamaño/formato y una barra translúcida (`backdrop-filter: blur`) para Lock/Copy, buscando una estética moderna tipo "glassmorphism" consistente con el fondo oscuro de la app.
- **Persistencia solo en memoria**: las paletas guardadas viven en la variable `savedPalettes` durante la sesión del navegador. No se usa `localStorage` para mantener el proyecto simple; si se necesita persistencia entre sesiones, es el primer punto de extensión natural.

## Requisitos

- Un navegador moderno (Chrome, Edge, Firefox o Safari actualizados) con soporte para `navigator.clipboard`.
- No se requiere Node.js, ni instalar dependencias, ni un servidor backend: es un proyecto 100% estático (HTML + CSS + JS).
- Opcional: un servidor local simple para evitar restricciones del navegador con `file://` en algunas funciones (recomendado para desarrollo).

## Cómo ejecutarlo en local

**Opción 1 — Abrir directamente el archivo**

1. Descarga o clona el proyecto.
2. Haz doble clic en `index.html`, o ábrelo desde el navegador con `Ctrl/Cmd + O`.

**Opción 2 — Con un servidor local (recomendado)**

Usar un servidor local evita problemas de permisos del navegador con rutas relativas y con la API del portapapeles.

Con Python 3:
```bash
cd colorfly-studio
python3 -m http.server 8080
```
Luego abre `http://localhost:8080` en el navegador.

Con la extensión **Live Server** de VS Code:
1. Abre la carpeta del proyecto en VS Code.
2. Clic derecho sobre `index.html` → "Open with Live Server".

Con Node.js (`npx serve`):
```bash
cd colorfly-studio
npx serve .
```

## Cómo desplegarlo

Al ser un proyecto estático, se puede desplegar en cualquier hosting de archivos estáticos, sin proceso de build:

**GitHub Pages**
1. Sube el proyecto a un repositorio de GitHub.
2. Ve a *Settings → Pages*.
3. En "Source", selecciona la rama (por ejemplo `main`) y la carpeta raíz (`/`).
4. Guarda los cambios; GitHub Pages publicará la URL en unos minutos.

**Netlify**
1. Crea una cuenta en [netlify.com](https://www.netlify.com/).
2. Arrastra la carpeta del proyecto al panel de "Deploys" (drag & drop), o conecta el repositorio de GitHub.
3. Netlify detecta que es un sitio estático y lo publica automáticamente (no necesita comando de build).

**Vercel**
1. Crea una cuenta en [vercel.com](https://vercel.com/).
2. Importa el repositorio del proyecto.
3. Al no tener framework, Vercel lo despliega como sitio estático sin configuración adicional.

En cualquiera de estas opciones, asegúrate de que la estructura de carpetas (`css/`, `js/`, `images/`) se mantenga tal cual respecto a `index.html`, ya que las rutas en el código son relativas.

## Limitaciones conocidas

- Las paletas guardadas y los bloqueos (`Lock`) se pierden al recargar la página, ya que no hay persistencia en `localStorage` ni backend.
- `navigator.clipboard.writeText` requiere un contexto seguro (`https://` o `localhost`); si se abre el proyecto directamente como `file://` en algunos navegadores, copiar puede no funcionar y conviene usar un servidor local.
