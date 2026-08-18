// Elementos principales
const btn = document.getElementById("generate-btn");
const saveBtn = document.getElementById("save-btn");
const paletteContainer = document.getElementById("palette-container");
const feedback = document.getElementById("feedback");
const savedList = document.getElementById("saved-list");

// Botones tipo isla
const sizeButtons = document.querySelectorAll(".size-btn");
const formatButtons = document.querySelectorAll(".format-btn");

let currentSize = 6;
let currentFormat = "hsl";
let savedPalettes = [];

// Estado de cada casilla: { color, locked }
let boxStates = [];

// Iconos SVG usados en los botones de cada color-box
const ICONS = {
  lockClosed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>`,
  lockOpen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 7.6-1.8"></path></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`
};

// Activar botones de tamaño
sizeButtons.forEach(b => {
  b.addEventListener("click", () => {
    sizeButtons.forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    currentSize = parseInt(b.dataset.size);
    generatePalette();
  });
});

// Activar botones de formato
formatButtons.forEach(b => {
  b.addEventListener("click", () => {
    formatButtons.forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    currentFormat = b.dataset.format;
    generatePalette();
  });
});

// Generar HEX
function getRandomHex() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Generar HSL
function getRandomHSL() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 100);
  const l = Math.floor(Math.random() * 100);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function getRandomColor() {
  return currentFormat === "hex" ? getRandomHex() : getRandomHSL();
}

// Generar paleta (respeta las casillas bloqueadas)
function generatePalette() {
  const newStates = [];
  for (let i = 0; i < currentSize; i++) {
    const prev = boxStates[i];
    if (prev && prev.locked) {
      newStates.push(prev); // mantiene el color bloqueado
    } else {
      newStates.push({ color: getRandomColor(), locked: false });
    }
  }
  boxStates = newStates;
  renderPalette();
  feedback.textContent = `Se generó una paleta de ${currentSize} colores en formato ${currentFormat.toUpperCase()} 🎨`;
}

// Dibuja todas las casillas a partir de boxStates
function renderPalette() {
  paletteContainer.innerHTML = "";
  boxStates.forEach((state, index) => {
    paletteContainer.appendChild(buildColorBox(state, index));
  });
}

// Construye una casilla individual con sus botones Lock y Copy
function buildColorBox(state, index) {
  const colorBox = document.createElement("div");
  colorBox.classList.add("color-box");
  if (state.locked) colorBox.classList.add("locked");
  colorBox.style.backgroundColor = state.color;

  const codeText = document.createElement("p");
  codeText.classList.add("color-code");
  codeText.textContent = state.color;

  const actions = document.createElement("div");
  actions.classList.add("box-actions");

  // Botón Lock
  const lockBtn = document.createElement("button");
  lockBtn.classList.add("action-btn", "lock-btn");
  lockBtn.type = "button";
  lockBtn.title = state.locked ? "Desbloquear color" : "Bloquear color";
  lockBtn.innerHTML = `${state.locked ? ICONS.lockClosed : ICONS.lockOpen}<span>Lock</span><span class="dot"></span>`;
  lockBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    boxStates[index].locked = !boxStates[index].locked;
    renderPalette();
  });

  const divider = document.createElement("span");
  divider.classList.add("action-divider");

  // Botón Copy
  const copyBtn = document.createElement("button");
  copyBtn.classList.add("action-btn", "copy-btn");
  copyBtn.type = "button";
  copyBtn.title = "Copiar código";
  copyBtn.innerHTML = `${ICONS.copy}<span>Copy</span><span class="dot"></span>`;
  copyBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(state.color);
    showToast(`Código ${state.color} copiado ✅`);
  });

  actions.appendChild(lockBtn);
  actions.appendChild(divider);
  actions.appendChild(copyBtn);

  colorBox.appendChild(codeText);
  colorBox.appendChild(actions);

  return colorBox;
}

// Guardar paleta con nombre
saveBtn.addEventListener("click", () => {
  const colors = boxStates.map(s => s.color);
  if (colors.length > 0) {
    const name = prompt("Ingresa un nombre para la paleta:");
    const palette = {
      name: name || "Paleta sin nombre",
      colors,
      date: new Date().toLocaleString()
    };
    savedPalettes.push(palette);
    renderSavedPalettes();
    showToast("Paleta guardada ✅");
  }
});

// Renderizar paletas guardadas
function renderSavedPalettes() {
  savedList.innerHTML = "";
  savedPalettes.forEach(palette => {
    const paletteCard = document.createElement("div");
    paletteCard.classList.add("saved-palette");

    const title = document.createElement("h3");
    title.textContent = palette.name;
    paletteCard.appendChild(title);

    const date = document.createElement("p");
    date.textContent = `Guardada: ${palette.date}`;
    paletteCard.appendChild(date);

    const colorsDiv = document.createElement("div");
    colorsDiv.classList.add("colors");

    palette.colors.forEach(color => {
      const colorBox = document.createElement("div");
      colorBox.classList.add("color-box");
      colorBox.style.backgroundColor = color;
      colorsDiv.appendChild(colorBox);
    });

    paletteCard.appendChild(colorsDiv);
    savedList.appendChild(paletteCard);
  });
}

// Toast flotante
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Eventos
btn.addEventListener("click", generatePalette);
window.addEventListener("DOMContentLoaded", generatePalette);

