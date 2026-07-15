// ---------------------------------------------------------------------------
// Toolbar group definitions — each entry becomes one toolbar "group" (array)
// ---------------------------------------------------------------------------
const TOOLBAR_GROUPS = {
  formatting: {
    label: 'Formato de texto',
    items: ['bold', 'italic', 'underline', 'strike'],
  },
  headers: {
    label: 'Encabezados',
    items: [{ header: [1, 2, 3, false] }],
  },
  script: {
    label: 'Superíndice / Subíndice',
    items: [{ script: 'sub' }, { script: 'super' }],
  },
  fontFamily: {
    label: 'Tipografía',
    items: [{ font: [] }],
  },
  fontSize: {
    label: 'Tamaño de fuente',
    items: [{ size: ['small', false, 'large', 'huge'] }],
  },
  colors: {
    label: 'Colores',
    items: [{ color: [] }, { background: [] }],
  },
  lists: {
    label: 'Listas e indentación',
    items: [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
  },
  align: {
    label: 'Alineación',
    items: [{ align: [] }],
  },
  links: {
    label: 'Enlaces y multimedia',
    items: ['link', 'image', 'video'],
  },
  codeQuote: {
    label: 'Código y cita',
    items: ['blockquote', 'code-block'],
  },
  formula: {
    label: 'Fórmula (KaTeX)',
    items: ['formula'],
    requires: 'katex',
  },
  clean: {
    label: 'Limpiar formato',
    items: ['clean'],
  },
};

// ---------------------------------------------------------------------------
// Module definitions
// ---------------------------------------------------------------------------
const MODULE_DEFS = {
  history: {
    label: 'Historial (Deshacer / Rehacer)',
    description: 'Atajos Ctrl+Z / Ctrl+Y',
  },
  syntax: {
    label: 'Resaltado de sintaxis',
    description: 'Colorea bloques de código — requiere highlight.js',
    requires: 'hljs',
  },
  table: {
    label: 'Tabla',
    description: 'Insertar y editar tablas (Quill 2 nativo)',
  },
};

// ---------------------------------------------------------------------------
// Application state — edit defaults here to change initial config
// ---------------------------------------------------------------------------
const state = {
  groups: {
    formatting: true,
    headers: true,
    script: false,
    fontFamily: false,
    fontSize: false,
    colors: true,
    lists: true,
    align: true,
    links: true,
    codeQuote: true,
    formula: false,
    clean: true,
  },
  modules: {
    history: true,
    syntax: false,
    table: false,
  },
};

// ---------------------------------------------------------------------------
// Quill instance management
// ---------------------------------------------------------------------------
let quill = null;
let savedContent = null;

function buildToolbar() {
  return Object.entries(state.groups)
    .filter(([key, enabled]) => {
      if (!enabled) return false;
      const def = TOOLBAR_GROUPS[key];
      if (def.requires === 'katex' && !window.katex) return false;
      return true;
    })
    .map(([key]) => TOOLBAR_GROUPS[key].items);
}

function buildModulesConfig() {
  const modules = {};

  modules.toolbar = buildToolbar();

  if (state.modules.history) {
    modules.history = { delay: 1000, maxStack: 100, userOnly: true };
  }

  if (state.modules.syntax && window.hljs) {
    modules.syntax = { hljs: window.hljs };
  }

  if (state.modules.table) {
    modules.table = true;
  }

  return modules;
}

function initQuill() {
  if (quill) {
    try {
      savedContent = quill.getContents();
    } catch (_) {
      savedContent = null;
    }
  }

  const container = document.getElementById('editor-wrapper');
  container.innerHTML = '<div id="editor"></div>';

  quill = new Quill('#editor', {
    theme: 'snow',
    modules: buildModulesConfig(),
    placeholder: 'Comienza a escribir aquí…',
  });

  if (savedContent && savedContent.ops && savedContent.ops.length > 1) {
    quill.setContents(savedContent, 'silent');
  }
}

// ---------------------------------------------------------------------------
// Toggle panel rendering
// ---------------------------------------------------------------------------
function renderPanel() {
  renderGroupToggles();
  renderModuleToggles();
}

function renderGroupToggles() {
  const container = document.getElementById('group-toggles');
  container.innerHTML = '';

  Object.entries(TOOLBAR_GROUPS).forEach(([key, def]) => {
    const disabled = def.requires === 'katex' && !window.katex;
    const enabled = state.groups[key];

    const row = document.createElement('label');
    row.className = 'toggle-row' + (disabled ? ' toggle-row--disabled' : '');
    row.title = disabled ? 'KaTeX no está cargado' : '';

    row.innerHTML = `
      <span class="toggle-label">${def.label}</span>
      <span class="toggle-switch">
        <input type="checkbox" ${enabled ? 'checked' : ''} ${disabled ? 'disabled' : ''} data-key="${key}" data-type="group">
        <span class="toggle-knob"></span>
      </span>
    `;
    container.appendChild(row);
  });
}

function renderModuleToggles() {
  const container = document.getElementById('module-toggles');
  container.innerHTML = '';

  Object.entries(MODULE_DEFS).forEach(([key, def]) => {
    const disabled = def.requires === 'hljs' && !window.hljs;
    const enabled = state.modules[key];

    const row = document.createElement('label');
    row.className = 'toggle-row' + (disabled ? ' toggle-row--disabled' : '');
    row.title = def.description + (disabled ? ' (highlight.js no está cargado)' : '');

    row.innerHTML = `
      <span class="toggle-label">
        ${def.label}
        <small class="toggle-desc">${def.description}</small>
      </span>
      <span class="toggle-switch">
        <input type="checkbox" ${enabled ? 'checked' : ''} ${disabled ? 'disabled' : ''} data-key="${key}" data-type="module">
        <span class="toggle-knob"></span>
      </span>
    `;
    container.appendChild(row);
  });
}

// ---------------------------------------------------------------------------
// Event handling
// ---------------------------------------------------------------------------
function onToggleChange(e) {
  const input = e.target;
  if (input.tagName !== 'INPUT' || input.type !== 'checkbox') return;

  const key = input.dataset.key;
  const type = input.dataset.type;

  if (type === 'group') {
    state.groups[key] = input.checked;
  } else if (type === 'module') {
    state.modules[key] = input.checked;
  }

  initQuill();
}

// ---------------------------------------------------------------------------
// Delta / HTML export panel
// ---------------------------------------------------------------------------
function initExportPanel() {
  const btn = document.getElementById('btn-show-delta');
  const panel = document.getElementById('export-panel');
  const deltaOut = document.getElementById('out-delta');
  const htmlOut = document.getElementById('out-html');

  btn.addEventListener('click', () => {
    const visible = panel.style.display !== 'none';
    if (visible) {
      panel.style.display = 'none';
      btn.textContent = 'Ver Delta / HTML';
    } else {
      deltaOut.textContent = JSON.stringify(quill.getContents(), null, 2);
      htmlOut.textContent = quill.getSemanticHTML();
      panel.style.display = 'block';
      btn.textContent = 'Ocultar Delta / HTML';
    }
  });
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
function initPanelDrawer() {
  const btn     = document.getElementById('btn-panel-toggle');
  const panel   = document.getElementById('toggle-panel');
  const overlay = document.getElementById('panel-overlay');

  function openPanel() {
    panel.classList.add('is-open');
    overlay.classList.add('is-visible');
    btn.classList.add('is-open');
    btn.setAttribute('aria-label', 'Cerrar panel');
  }

  function closePanel() {
    panel.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-label', 'Abrir panel de configuración');
  }

  btn.addEventListener('click', () => {
    panel.classList.contains('is-open') ? closePanel() : openPanel();
  });

  overlay.addEventListener('click', closePanel);
}

document.addEventListener('DOMContentLoaded', () => {
  renderPanel();
  initQuill();
  initExportPanel();
  initPanelDrawer();

  document.getElementById('toggle-panel').addEventListener('change', onToggleChange);
});
