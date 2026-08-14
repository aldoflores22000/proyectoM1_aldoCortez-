// 1. Tomamos los elementos del HTML
const btn = document.getElementById("generate-btn");
const paletteSizeSelect = document.getElementById("palette-size");
const paletteContainer = document.getElementById("palette-container");
const feedback = document.getElementById("feedback");

// 2. Función para generar un color aleatorio en HEX
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// 3. Función principal para crear la paleta
function generatePalette() {
  // Limpiamos el contenedor antes de generar
  paletteContainer.innerHTML = "";

  // Tomamos el tamaño elegido (6, 8 o 9)
  const size = parseInt(paletteSizeSelect.value);

  // Creamos los cuadros de colores
  for (let i = 0; i < size; i++) {
    const color = getRandomColor();

    // Creamos el div del color
    const colorBox = document.createElement("div");
    colorBox.classList.add("color-box");
    colorBox.style.backgroundColor = color;
    colorBox.setAttribute("aria-label", `Color ${color}`);
    colorBox.setAttribute("tabindex", "0");

    // Texto con el código HEX
    const codeText = document.createElement("p");
    codeText.classList.add("color-code");
    codeText.textContent = color;

    // Metemos el texto dentro del cuadro
    colorBox.appendChild(codeText);

    // Agregamos el cuadro al contenedor
    paletteContainer.appendChild(colorBox);
  }

  // Feedback visible
  feedback.textContent = `Se generó una paleta de ${size} colores 🎨`;
}

// 4. Conectamos el botón con la función
btn.addEventListener("click", generatePalette);

// 5. Generamos una paleta apenas carga la página
window.addEventListener("DOMContentLoaded", generatePalette);

// 1. Tomamos también el formato elegido
const formatRadios = document.querySelectorAll("input[name='format']");

// Función para generar color en HEX
function getRandomHex() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Función para generar color en HSL
function getRandomHSL() {
  const h = Math.floor(Math.random() * 360);   // tono
  const s = Math.floor(Math.random() * 100);   // saturación
  const l = Math.floor(Math.random() * 100);   // luminosidad
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// Función principal
function generatePalette() {
  paletteContainer.innerHTML = "";
  const size = parseInt(paletteSizeSelect.value);

  // Detectamos formato seleccionado
  let format = "hex";
  formatRadios.forEach(radio => {
    if (radio.checked) format = radio.value;
  });

  for (let i = 0; i < size; i++) {
    const color = format === "hex" ? getRandomHex() : getRandomHSL();

    const colorBox = document.createElement("div");
    colorBox.classList.add("color-box");
    colorBox.style.backgroundColor = color;
    colorBox.setAttribute("aria-label", `Color ${color}`);
    colorBox.setAttribute("tabindex", "0");

    // Texto con el código
    const codeText = document.createElement("p");
    codeText.classList.add("color-code");
    codeText.textContent = color;

    // Copiar al hacer clic
    codeText.addEventListener("click", () => {
      navigator.clipboard.writeText(color);
      feedback.textContent = `Código ${color} copiado ✅`;
    });

    colorBox.appendChild(codeText);
    paletteContainer.appendChild(colorBox);
  }

  feedback.textContent = `Se generó una paleta de ${size} colores en formato ${format.toUpperCase()} 🎨`;
}

// Botón y carga inicial
btn.addEventListener("click", generatePalette);
window.addEventListener("DOMContentLoaded", generatePalette);

