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
import { mostrarDetalleModal, cerrarModal } from "./ui/modal.js";

// ESTADO DE LA APLICACIÓN
let paises = [];

// REFERENCIAS DEL DOM - VISTA PRINCIPAL
const destinationContainer = document.querySelector("#destinations-container");
const resultsCount = document.querySelector("#results-count");
const searchInput = document.querySelector("#search-input");
const continentFilter = document.querySelector("#continent-filter");
const sortFilter = document.querySelector("#sort-filter");
const searchForm = document.querySelector("#search-form");

// REFERENCIAS DEL DOM - MODAL (v0.5.0)
const modalDetail = document.querySelector("#modal-detail");
const modalContent = document.querySelector("#modal-content");
const btnCloseModal = document.querySelector("#btn-close-modal");

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

  // ESCUCHADORES DE EVENTOS DE FILTROS
  searchInput?.addEventListener("input", actualizarVista);
  continentFilter?.addEventListener("change", actualizarVista);
  sortFilter?.addEventListener("change", actualizarVista);

  // DELEGACIÓN DE EVENTOS PARA EL BOTÓN "VER MÁS" (v0.5.0)
  destinationContainer.addEventListener("click", (e) => {
    const btnDetail = e.target.closest("[data-action='detail']");
    if (btnDetail) {
      const countryCode = btnDetail.dataset.countryCode;

      // Buscar el país seleccionado en el arreglo global utilizando find()
      const paisSeleccionado = paises.find(
        (p) => (p.codes?.alpha_3 || p.cca3) === countryCode,
      );

      if (paisSeleccionado) {
        mostrarDetalleModal(paisSeleccionado, modalDetail, modalContent);
      }
    }
  });

  // EVENTOS PARA CERRAR EL MODAL (v0.5.0)
  btnCloseModal?.addEventListener("click", () => cerrarModal(modalDetail));

  // Cerrar modal al hacer clic en el fondo oscuro
  modalDetail?.addEventListener("click", (e) => {
    if (e.target === modalDetail) {
      cerrarModal(modalDetail);
    }
  });
}

// INICIAR APLICACIÓN
init();
