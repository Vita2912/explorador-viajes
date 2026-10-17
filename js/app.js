console.log("Conexion exitosa");

// IMPORTS
import { obtnerPaises } from "./api/countriesApi.js";
import {
  mostrarCargando,
  mostrarError,
  renderPaises,
  actualizarContador,
} from "./ui/ui.js";

// ESTADO DE LA APLICACIÓN
let paises = [];

// REFERENCIAS DEL DOM
const destinationContainer = document.querySelector("#destinations-container");
const resultsCount = document.querySelector("#results-count");
const initialMessage = document.querySelector("#initial-message");

// INICIALIZACIÓN DE LA APLICACIÓN
async function init() {
  console.log("Explorador de viajes iniciado");
  //resultsCount.textContent = '1 destino';

  // MOSTRAR RESULTADOS DE LA CARGA
  mostrarCargando(destinationContainer);

  // OBTENER PAISES DESDE LA API
  paises = await obtnerPaises();
  console.log("Paises obtenidos: ", paises);

  // Validar Paises
  if (paises.length === 0) {
    mostrarError(destinationContainer);

    actualizarContador(0, resultsCount);

    return;
  }

  // RENDERIZAR DESTINOS
  renderPaises(paises, destinationContainer);

  actualizarContador(paises.length, resultsCount);
}

// INICIAR APLICACIÓN
init();
