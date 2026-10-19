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
import {
  obtenerFavoritos,
  agregarFavorito,
  eliminarFavorito,
  esFavorito,
} from "./utils/storage.js";

// ESTADO DE LA APLICACIÓN
let paises = [];
let vistaActual = "explorar"; // 'explorar' | 'favoritos'

// REFERENCIAS DEL DOM - VISTA PRINCIPAL
const destinationContainer = document.querySelector("#destinations-container");
const resultsCount = document.querySelector("#results-count");
const searchInput = document.querySelector("#search-input");
const continentFilter = document.querySelector("#continent-filter");
const sortFilter = document.querySelector("#sort-filter");
const searchForm = document.querySelector("#search-form");

// REFERENCIAS DEL DOM - NAVEGACIÓN
const btnExplorar = document.querySelector("#btn-explorar");
const btnFavoritos = document.querySelector("#btn-favoritos");
const sectionTitle = document.querySelector("#section-title");

// REFERENCIAS DEL DOM - MODAL
const modalDetail = document.querySelector("#modal-detail");
const modalContent = document.querySelector("#modal-content");
const btnCloseModal = document.querySelector("#btn-close-modal");

// ACTUALIZAR VISTA CON FILTROS
function actualizarVista() {
  // Determinar qué lista de países usar según la vista actual
  const listaBase = vistaActual === "favoritos" ? obtenerFavoritos() : paises;

  const opciones = {
    search: searchInput?.value || "",
    continent: continentFilter?.value || "all",
    sort: sortFilter?.value || "az",
  };

  const paisesFiltrados = aplicarFiltros(listaBase, opciones);

  renderPaises(paisesFiltrados, destinationContainer);
  actualizarContador(paisesFiltrados.length, resultsCount);
}

/* =========================================
   GESTIÓN DE FAVORITOS 
========================================= */
function toggleFavorito(pais) {
  const codigo = pais.codes?.alpha_3 || pais.cca3;
  const nombre = pais.names?.common || pais.name?.common || "Destino";

  if (esFavorito(codigo)) {
    eliminarFavorito(codigo);

    // Alerta con SweetAlert2 al eliminar
    Swal.fire({
      icon: "info",
      title: "Eliminado de favoritos",
      text: `${nombre} fue eliminado de tus destinos favoritos.`,
      timer: 1800,
      showConfirmButton: false,
    });
  } else {
    agregarFavorito(pais);

    // Alerta con SweetAlert2 al agregar
    Swal.fire({
      icon: "success",
      title: "¡Añadido a favoritos!",
      text: `${nombre} se guardó correctamente en tus favoritos.`,
      timer: 1800,
      showConfirmButton: false,
    });
  }

  // Refrescar la vista actual para actualizar la pantalla
  actualizarVista();
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

  /* =========================================
     ESCUCHADORES DE NAVEGACIÓN 
  ========================================= */
  btnExplorar?.addEventListener("click", () => {
    vistaActual = "explorar";
    if (sectionTitle) sectionTitle.textContent = "Destinos";
    btnExplorar.className =
      "px-4 py-2 bg-blue-600 text-white rounded-lg font-medium cursor-pointer hover:bg-blue-700 transition";
    btnFavoritos.className =
      "px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg font-medium cursor-pointer hover:bg-slate-100 transition";
    actualizarVista();
  });

  btnFavoritos?.addEventListener("click", () => {
    vistaActual = "favoritos";
    if (sectionTitle) sectionTitle.textContent = "Mis Favoritos";
    btnFavoritos.className =
      "px-4 py-2 bg-blue-600 text-white rounded-lg font-medium cursor-pointer hover:bg-blue-700 transition";
    btnExplorar.className =
      "px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg font-medium cursor-pointer hover:bg-slate-100 transition";
    actualizarVista();
  });

  // DELEGACIÓN DE EVENTOS PARA EL BOTÓN "VER MÁS" Y "FAVORITO"
  destinationContainer.addEventListener("click", (e) => {
    // BOTÓN VER MÁS
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

    // BOTÓN AGREGAR/QUITAR FAVORITO
    const btnFavorite = e.target.closest("[data-action='favorite']");
    if (btnFavorite) {
      const countryCode = btnFavorite.dataset.countryCode;

      const paisSeleccionado = paises.find(
        (p) => (p.codes?.alpha_3 || p.cca3) === countryCode,
      );

      if (paisSeleccionado) {
        toggleFavorito(paisSeleccionado);
      }
    }
  });

  // EVENTOS PARA CERRAR EL MODAL
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
