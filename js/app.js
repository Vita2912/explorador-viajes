console.log("Conexion exitosa");

// IMPORTS
import { obtnerPaises } from "./api/countriesApi.js";
import {
  mostrarCargando,
  mostrarError,
  renderPaises,
  actualizarContador,
} from "./ui/ui.js";
import { aplicarFiltros } from "./utils/filters.js";

// ESTADO DE LA APLICACIÓN
let paises = [];

// REFERENCIAS DEL DOM
const destinationContainer = document.querySelector("#destinations-container");
const resultsCount = document.querySelector("#results-count");
const initialMessage = document.querySelector("#initial-message");
const searchInput = document.querySelector("#search-input");
const continentFilter = document.querySelector("#continent-filter");
const sortFilter = document.querySelector("#sort-filter");
const searchForm = document.querySelector("#search-form");

// ACTUALIZAR VISTA CON FILTROS
function actualizarVista() {
  const opciones = {
    search: searchInput?.value || "",
    continent: continentFilter?.value || "all",
    sort: sortFilter?.value || "az",
  };

  const paisesFiltrados = aplicarFiltros(paises, opciones);

  renderPaises(paisesFiltrados, destinationContainer);
  actualizarContador(paisesFiltrados.length, resultsCount);
}

// INICIALIZACIÓN DE LA APLICACIÓN
async function init() {
  console.log("Explorador de viajes iniciado");
  //resultsCount.textContent = '1 destino';

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => e.preventDefault());
  }

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
  actualizarVista();

  // ESCUCHADORES DE EVENTOS
  searchInput?.addEventListener("input", actualizarVista);
  continentFilter?.addEventListener("change", actualizarVista);
  sortFilter?.addEventListener("change", actualizarVista);
}

// INICIAR APLICACIÓN
init();
