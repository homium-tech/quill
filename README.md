# Quill 2 Explorer

> Plantilla de referencia para integrar el editor WYSIWYG **Quill 2** en cualquier proyecto web.  
> Vanilla HTML · CSS · JavaScript — sin framework ni bundler.

---

## Tabla de contenidos

1. [Instalación y primera ejecución](#1-instalación-y-primera-ejecución)
2. [Estructura del proyecto](#2-estructura-del-proyecto)
3. [Componentes disponibles](#3-componentes-disponibles)
4. [Cómo activar o desactivar componentes](#4-cómo-activar-o-desactivar-componentes)
5. [Cómo editar estilos](#5-cómo-editar-estilos)
6. [Cómo inicializar múltiples editores](#6-cómo-inicializar-múltiples-editores)
7. [Subir a GitHub](#7-subir-a-github)

---

## 1. Instalación y primera ejecución

### Requisitos

- Node.js 18+ (solo para instalar dependencias vía npm)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Pasos

```bash
# 1. Clona el repositorio
git clone https://github.com/TU_USUARIO/quill-explorer.git
cd quill-explorer

# 2. Instala las dependencias
npm install

# 3. Abre directamente en el navegador
open index.html

# — o sirve con un servidor local (recomendado para evitar restricciones CORS) —
npx serve .
# Luego abre http://localhost:3000
```

> **Nota:** No hay build step. Las dependencias (`quill`, `katex`) se sirven directamente desde `node_modules/`.  
> `highlight.js` se carga desde CDN — requiere conexión a internet.

---

## 2. Estructura del proyecto

```
quill-explorer/
├── index.html          ← Página principal: layout + imports
├── style.css           ← Todos los estilos (Design System HOMIUM)
├── main.js             ← Lógica del editor, toggles y configuración
├── assets/
│   └── logo/           ← Logos SVG de HOMIUM
├── node_modules/
│   ├── quill/dist/     ← quill.js (UMD) + quill.snow.css
│   └── katex/dist/     ← katex.min.js + katex.min.css + fonts/
└── package.json
```

---

## 3. Componentes disponibles

### Grupos de toolbar

Cada grupo es un bloque de botones en la barra de herramientas. Se definen en `main.js` dentro de `TOOLBAR_GROUPS`.

| Clave         | Botones que incluye                          |
|---------------|----------------------------------------------|
| `formatting`  | Negrita, cursiva, subrayado, tachado         |
| `headers`     | H1, H2, H3, normal                           |
| `script`      | Superíndice, subíndice                       |
| `fontFamily`  | Selector de tipografía                       |
| `fontSize`    | Pequeño, normal, grande, enorme              |
| `colors`      | Color de texto, color de fondo               |
| `lists`       | Lista ordenada, lista con viñetas, indentado |
| `align`       | Alineación (izquierda, centro, derecha, just.) |
| `links`       | Link, imagen, video                          |
| `codeQuote`   | Cita, bloque de código                       |
| `formula`     | Fórmula matemática (requiere KaTeX)          |
| `clean`       | Limpiar formato                              |

### Módulos

Los módulos son funcionalidades adicionales que Quill carga junto con el editor.

| Clave     | Función                                                    |
|-----------|------------------------------------------------------------|
| `history` | Habilita deshacer/rehacer (`Ctrl+Z` / `Ctrl+Y`)           |
| `syntax`  | Resaltado de sintaxis en bloques de código (usa highlight.js) |
| `table`   | Inserción y edición de tablas (nativo de Quill 2)          |

---

## 4. Cómo activar o desactivar componentes

### Desde la interfaz (en tiempo real)

Usa los toggles del panel izquierdo. El editor se reinicializa automáticamente conservando el contenido.

### Desde el código — estado inicial

En `main.js`, edita el objeto `state` para cambiar qué está activo al cargar:

```js
// main.js
const state = {
  groups: {
    formatting: true,   // ← true = activo, false = desactivado
    headers:    true,
    script:     false,  // oculto del toolbar
    fontFamily: false,
    fontSize:   false,
    colors:     true,
    lists:      true,
    align:      true,
    links:      true,
    codeQuote:  true,
    formula:    false,  // requiere window.katex
    clean:      true,
  },
  modules: {
    history: true,
    syntax:  false,     // requiere window.hljs
    table:   false,
  },
};
```

### Agregar un grupo nuevo

1. Agrégalo a `TOOLBAR_GROUPS` en `main.js`:

```js
const TOOLBAR_GROUPS = {
  // ... grupos existentes ...

  // Nuevo grupo — botones inline directos
  divider: {
    label: 'Línea divisoria',
    items: ['divider'],          // nombre del blot personalizado
  },
};
```

2. Agrégalo al estado inicial en `state.groups`:

```js
const state = {
  groups: {
    // ... grupos existentes ...
    divider: false,   // desactivado por defecto
  },
};
```

3. Agrega el toggle en la interfaz — se genera automáticamente al ejecutar `renderGroupToggles()`.

### Eliminar un grupo permanentemente

Simplemente borra su entrada de `TOOLBAR_GROUPS` y de `state.groups`. No necesitas tocar el HTML ni otros archivos.

---

## 5. Cómo editar estilos

Todos los estilos están en `style.css`. La primera sección define los tokens del Design System HOMIUM:

```css
:root {
  --homium-purple: #290640;  /* color de fondo principal */
  --homium-cyan:   #00ffff;  /* acentos, CTAs, toggles activos */
  --homium-green:  #5aeaa2;  /* acentos secundarios */
}
```

### Cambiar colores del editor

El área de edición usa tema claro (fondo blanco). Para cambiarlo edita esta sección:

```css
/* style.css — área del editor */
.editor-area {
  background: #ffffff;        /* ← fondo del área */
}

#editor-wrapper .ql-editor {
  color: var(--purple-700);   /* ← color del texto */
}

#editor-wrapper .ql-toolbar.ql-snow {
  background: #faf7fc;        /* ← fondo de la toolbar */
}
```

### Cambiar la tipografía

El proyecto usa **Rubik** (Google Fonts). Para cambiarla:

```css
/* style.css — al inicio */
@import url('https://fonts.googleapis.com/css2?family=TU_FUENTE&display=swap');

:root {
  --font-sans: 'Tu Fuente', system-ui, sans-serif;
}
```

### Cambiar el ancho máximo del editor

```css
#editor-wrapper .ql-editor {
  max-width: 740px;   /* ← ajusta a tu gusto, o usa 100% para ancho completo */
}
```

### Cambiar el tema de highlight.js

Reemplaza el `<link>` de CDN en `index.html`:

```html
<!-- index.html -->
<!-- Tema actual: atom-one-dark -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/atom-one-dark.min.css">

<!-- Otros disponibles: github-dark, monokai, dracula, vs2015 -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/github-dark.min.css">
```

---

## 6. Cómo inicializar múltiples editores

Quill no tiene limitación de instancias — cada instancia es independiente y se vincula a un contenedor DOM distinto.

### HTML

```html
<!-- index.html -->
<div id="editor-titulo"></div>
<div id="editor-cuerpo"></div>
<div id="editor-notas"></div>
```

### JavaScript

```js
// Cada instancia recibe su propio selector y configuración
const editorTitulo = new Quill('#editor-titulo', {
  theme: 'snow',
  modules: {
    toolbar: [['bold', 'italic']],   // toolbar mínimo
  },
  placeholder: 'Escribe el título...',
});

const editorCuerpo = new Quill('#editor-cuerpo', {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
    ],
    history: { delay: 1000, maxStack: 100 },
    syntax: { hljs: window.hljs },   // requiere highlight.js cargado
  },
  placeholder: 'Escribe el contenido...',
});

const editorNotas = new Quill('#editor-notas', {
  theme: 'snow',
  modules: {
    toolbar: false,   // sin toolbar — solo texto plano
  },
  placeholder: 'Notas internas...',
});
```

### Leer el contenido de cada instancia

```js
// Delta (formato interno de Quill)
const deltaCuerpo = editorCuerpo.getContents();

// HTML semántico
const htmlCuerpo = editorCuerpo.getSemanticHTML();

// Texto plano
const textoCuerpo = editorCuerpo.getText();
```

### Escuchar cambios en tiempo real

```js
editorCuerpo.on('text-change', (delta, oldDelta, source) => {
  if (source === 'user') {
    console.log('El usuario editó:', editorCuerpo.getSemanticHTML());
  }
});
```

---

## 7. Subir a GitHub

### Primera vez

```bash
# 1. Inicializa git en el proyecto
git init

# 2. Crea el .gitignore para no subir node_modules
echo "node_modules/" > .gitignore

# 3. Agrega todos los archivos
git add .

# 4. Primer commit
git commit -m "feat: Quill 2 Explorer — plantilla WYSIWYG"

# 5. Crea el repositorio en GitHub (requiere GitHub CLI instalado)
gh repo create quill-explorer --public --source=. --remote=origin --push

# — o si prefieres hacerlo manual —
# Crea el repo en https://github.com/new, luego:
git remote add origin https://github.com/TU_USUARIO/quill-explorer.git
git branch -M main
git push -u origin main
```

### Actualizaciones posteriores

```bash
git add .
git commit -m "descripción del cambio"
git push
```

### ¿Qué NO subir?

El archivo `.gitignore` ya excluye `node_modules/`. Los usuarios que clonan el repo solo necesitan ejecutar `npm install` para restaurar las dependencias.

```
# .gitignore
node_modules/
.DS_Store
```

---

## Dependencias

| Paquete        | Versión  | Uso                              | Carga          |
|----------------|----------|----------------------------------|----------------|
| `quill`        | ^2.0.3   | Editor WYSIWYG principal         | node_modules   |
| `katex`        | latest   | Renderizado de fórmulas matemáticas | node_modules |
| `highlight.js` | 11.10.0  | Resaltado de sintaxis en código  | CDN            |

---

> Construido con el **HOMIUM Design System.**  
> *Tecnología sin complicaciones.*
