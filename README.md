# Quill 2 Explorer

> Plantilla de referencia para integrar el editor WYSIWYG **Quill 2** en cualquier proyecto web.  
> Vanilla HTML · CSS · JavaScript — sin framework ni bundler.

**[Ver demo →](http://docs.homium.tech/quill)**

---

## Tabla de contenidos

1. [Instalación y primera ejecución](#1-instalación-y-primera-ejecución)
2. [Estructura del proyecto](#2-estructura-del-proyecto)
3. [Componentes disponibles](#3-componentes-disponibles)
4. [Cómo activar o desactivar componentes](#4-cómo-activar-o-desactivar-componentes)
5. [Cómo editar estilos](#5-cómo-editar-estilos)
6. [Cómo inicializar múltiples editores](#6-cómo-inicializar-múltiples-editores)

---

## 1. Instalación y primera ejecución

### Requisitos

- Node.js 18+
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Pasos

```bash
# 1. Clona el repositorio
git clone https://github.com/homium-tech/quill.git
cd quill

# 2. Instala las dependencias
npm install

# 3. Abre en el navegador
open index.html

# — o con servidor local (recomendado) —
npx serve .
# http://localhost:3000
```

> Las dependencias (`quill`, `katex`) se sirven desde `node_modules/` — no hay build step.  
> `highlight.js` se carga desde CDN, requiere conexión a internet.

---

## 2. Estructura del proyecto

```
quill/
├── index.html        ← layout + imports de librerías
├── style.css         ← estilos (Design System HOMIUM)
├── main.js           ← configuración del editor y lógica de toggles
├── assets/
│   └── logo/         ← logos SVG de HOMIUM
├── node_modules/
│   ├── quill/dist/   ← quill.js (UMD) + quill.snow.css
│   └── katex/dist/   ← katex.min.js + katex.min.css + fonts/
└── package.json
```

---

## 3. Componentes disponibles

### Grupos de toolbar

Cada grupo es un bloque de botones en la barra de herramientas. Se definen en `TOOLBAR_GROUPS` dentro de `main.js`.

| Clave        | Botones que incluye                            |
|--------------|------------------------------------------------|
| `formatting` | Negrita, cursiva, subrayado, tachado           |
| `headers`    | H1, H2, H3, normal                             |
| `script`     | Superíndice, subíndice                         |
| `fontFamily` | Selector de tipografía                         |
| `fontSize`   | Pequeño, normal, grande, enorme                |
| `colors`     | Color de texto, color de fondo                 |
| `lists`      | Lista ordenada, viñetas, indentado             |
| `align`      | Alineación (izquierda, centro, derecha, just.) |
| `links`      | Link, imagen, video                            |
| `codeQuote`  | Cita, bloque de código                         |
| `formula`    | Fórmula matemática (requiere KaTeX)            |
| `clean`      | Limpiar formato                                |

### Módulos

Los módulos son funcionalidades que Quill carga al inicializarse.

| Clave     | Función                                                       |
|-----------|---------------------------------------------------------------|
| `history` | Deshacer/rehacer con `Ctrl+Z` / `Ctrl+Y`                     |
| `syntax`  | Resaltado de sintaxis en bloques de código (usa highlight.js) |
| `table`   | Inserción y edición de tablas (nativo de Quill 2)             |

---

## 4. Cómo activar o desactivar componentes

### Desde la interfaz

Usa los toggles del panel izquierdo. El editor se reinicializa automáticamente conservando el contenido.

### Desde el código — estado inicial

En `main.js`, edita el objeto `state` para controlar qué está activo al cargar:

```js
const state = {
  groups: {
    formatting: true,   // true = visible en toolbar
    headers:    true,
    script:     false,  // false = oculto
    fontFamily: false,
    fontSize:   false,
    colors:     true,
    lists:      true,
    align:      true,
    links:      true,
    codeQuote:  true,
    formula:    false,
    clean:      true,
  },
  modules: {
    history: true,
    syntax:  false,
    table:   false,
  },
};
```

### Agregar un grupo nuevo

1. Define el grupo en `TOOLBAR_GROUPS`:

```js
const TOOLBAR_GROUPS = {
  // ... grupos existentes ...

  extra: {
    label: 'Extras',
    items: [{ script: 'sub' }, { script: 'super' }, 'strike'],
  },
};
```

2. Agrégalo al estado:

```js
const state = {
  groups: {
    // ... grupos existentes ...
    extra: false,  // desactivado por defecto
  },
};
```

El toggle aparece automáticamente en el panel — no necesitas tocar el HTML.

### Eliminar un grupo permanentemente

Borra su entrada de `TOOLBAR_GROUPS` y de `state.groups`. No hay más archivos que editar.

---

## 5. Cómo editar estilos

Todos los estilos están en `style.css`. Los colores se controlan con tokens CSS al inicio del archivo:

```css
:root {
  --homium-purple: #290640;  /* fondo principal del panel y header */
  --homium-cyan:   #00ffff;  /* acentos, toggles activos, bordes */
  --homium-green:  #5aeaa2;  /* acentos secundarios                */
}
```

### Colores del área de edición

El editor usa fondo blanco. Para cambiarlo:

```css
.editor-area {
  background: #ffffff;        /* fondo del área */
}

#editor-wrapper .ql-editor {
  color: var(--purple-700);   /* color del texto */
}

#editor-wrapper .ql-toolbar.ql-snow {
  background: #faf7fc;        /* fondo de la toolbar */
}
```

### Tipografía

El proyecto usa **Rubik** (Google Fonts). Para cambiarla:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');

:root {
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

### Ancho del editor

```css
#editor-wrapper .ql-editor {
  max-width: 740px;  /* usa 100% para ancho completo */
}
```

### Tema de sintaxis (highlight.js)

Cambia el `<link>` en `index.html`:

```html
<!-- Tema actual -->
<link rel="stylesheet" href=".../styles/atom-one-dark.min.css">

<!-- Alternativas: github-dark, monokai, dracula, vs2015 -->
<link rel="stylesheet" href=".../styles/github-dark.min.css">
```

---

## 6. Cómo inicializar múltiples editores

Cada instancia de Quill es independiente — solo necesitan contenedores distintos.

### HTML

```html
<div id="editor-titulo"></div>
<div id="editor-cuerpo"></div>
<div id="editor-notas"></div>
```

### JavaScript

```js
// Toolbar mínimo — solo formato básico
const editorTitulo = new Quill('#editor-titulo', {
  theme: 'snow',
  modules: {
    toolbar: [['bold', 'italic']],
  },
  placeholder: 'Escribe el título...',
});

// Toolbar completo con syntax highlighting
// Requiere highlight.js cargado antes de este script
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
    syntax: { hljs: window.hljs },
  },
  placeholder: 'Escribe el contenido...',
});

// Sin toolbar — el usuario escribe texto sin opciones de formato
const editorNotas = new Quill('#editor-notas', {
  theme: 'snow',
  modules: { toolbar: false },
  placeholder: 'Notas internas...',
});
```

### Leer el contenido

```js
const delta = editorCuerpo.getContents();      // Delta (formato interno)
const html  = editorCuerpo.getSemanticHTML();  // HTML semántico
const texto = editorCuerpo.getText();          // Texto plano
```

### Detectar cambios

```js
editorCuerpo.on('text-change', (delta, oldDelta, source) => {
  if (source === 'user') {
    console.log(editorCuerpo.getSemanticHTML());
  }
});
```

---

## Dependencias

| Paquete        | Versión | Uso                                  | Carga        |
|----------------|---------|--------------------------------------|--------------|
| `quill`        | 2.0.3   | Editor WYSIWYG                       | node_modules |
| `katex`        | 0.17.0  | Renderizado de fórmulas matemáticas  | node_modules |
| `highlight.js` | 11.10.0 | Resaltado de sintaxis en código      | CDN          |

---

> Construido con el **HOMIUM Design System** · *Tecnología sin complicaciones.*
