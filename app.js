const inputLimite = document.getElementById("limite");
const inputParrafo = document.getElementById("parrafo");
const inputPalabra = document.getElementById("palabra");
const botonBuscar = document.getElementById("buscar");
const salida = document.getElementById("salida");

function crearWorker(fn) {
  const blob = new Blob(["onmessage = " + fn.toString()], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  return new Worker(url);
}

// Worker 1: Criba de Eratóstenes para primos
function workerPrimos(e) {
  const limite = e.data;
  let esPrimo = new Uint8Array(limite + 1);
  esPrimo[0] = 1;
  if (limite >= 1) esPrimo[1] = 1;
  const raiz = Math.floor(Math.sqrt(limite));

  for (let i = 2; i <= raiz; i++) {
    if (!esPrimo[i]) {
      for (let j = i * i; j <= limite; j += i) {
        esPrimo[j] = 1;
      }
    }
  }

  let primos = [];
  for (let i = 2; i <= limite; i++) {
    if (!esPrimo[i]) primos.push(i);
  }

  // Muestra solo los primeros 100 para no saturar
  const preview = primos.slice(0, 100).join(", ");
  postMessage(`Se encontraron ${primos.length} primos hasta ${limite}\nPrimeros 100:\n${preview}`);
}

// Worker 2: Búsqueda binaria de palabra en párrafo
function workerBusquedaBinaria(e) {
  const { parrafo, palabra } = e.data;
  let palabras = parrafo
    .toLowerCase()
    .replace(/[^\w\sáéíóúüñ]/g, "")
    .split(/\s+/)
    .filter(Boolean);
  palabras.sort();
  let low = 0;
  let high = palabras.length - 1;
  let found = false;
  const target = palabra.toLowerCase();
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (palabras[mid] === target) {
      found = true;
      break;
    } else if (palabras[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  postMessage(found ? `La palabra "${palabra}" SÍ existe en el párrafo.` :
                      `La palabra "${palabra}" NO existe en el párrafo.`);
}

botonBuscar.addEventListener("click", () => {
  
  const limite = parseInt(inputLimite.value);
  const parrafo = inputParrafo.value;
  const palabra = inputPalabra.value;

  const wPrimos = crearWorker(workerPrimos);
  const wBinaria = crearWorker(workerBusquedaBinaria);

  wPrimos.onmessage = (e) => {
    salida.textContent += `\nPrimos:\n${e.data}\n`;
  };

  wBinaria.onmessage = (e) => {
    salida.textContent += `\n${e.data}\n`;
  };

  wPrimos.postMessage(limite);
  wBinaria.postMessage({ parrafo, palabra });
});

