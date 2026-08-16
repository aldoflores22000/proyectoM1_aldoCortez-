// Elementos
const btn = document.getElementById("generate-btn");
const saveBtn = document.getElementById("save-btn");
const paletteSizeSelect = document.getElementById("palette-size");
const paletteContainer = document.getElementById("palette-container");
const feedback = document.getElementById("feedback");
const formatRadios = document.querySelectorAll("input[name='format']");
const savedList = document.getElementById("saved-list");

let savedPalettes = [];

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

// Generar paleta
function generatePalette() {
  paletteContainer.innerHTML = "";
  const size = parseInt(paletteSizeSelect.value);

  let format = "hex";
  formatRadios.forEach(radio => { if (radio.checked) format = radio.value; });

  for (let i = 0; i < size; i++) {
    const color = format === "hex" ? getRandomHex() : getRandomHSL();

    const colorBox = document.createElement("div");
    colorBox.classList.add("color-box");
    colorBox.style.backgroundColor = color;

    const codeText = document.createElement("p");
    codeText.classList.add("color-code");
    codeText.textContent = color;

    codeText.addEventListener("click", () => {
      navigator.clipboard.writeText(color);
      showToast(`Código ${color} copiado ✅`);
    });

