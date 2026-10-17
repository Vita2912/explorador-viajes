import { crearMapa, destruirMapa } from "./map.js";

export function mostrarDetalleModal(pais, modalElement, modalContentElement) {
  if (!pais || !modalElement || !modalContentElement) return;

  // Imprimir en consola para verificar los datos de la API
  console.log("Objeto del país recibido:", pais);

  const nombre =
    pais.names?.common ?? pais.name?.common ?? "Nombre no disponible";
  const nombreOficial = pais.names?.official ?? pais.name?.official ?? "";

  // Capital (revisa 'capitals' en plural primero)
  let capital = "Capital no disponible";
  if (Array.isArray(pais.capitals) && pais.capitals.length > 0) {
    capital = pais.capitals[0];
  } else if (Array.isArray(pais.capital) && pais.capital.length > 0) {
    capital = pais.capital[0];
  } else if (typeof pais.capital === "string") {
    capital = pais.capital;
  }

  const region = pais.region ?? "Región no disponible";
  const subregion = pais.subregion ?? "Subregión no disponible";
  const poblacion = pais.population
    ? pais.population.toLocaleString("es-MX")
    : "0";

  const bandera =
    pais.flag?.url_png ?? pais.flags?.svg ?? pais.flags?.png ?? "";

  // Mapeo seguro de coordenadas
  let latitud = null;
  let longitud = null;

  if (pais.coordinates) {
    if (
      typeof pais.coordinates.latitud === "number" &&
      typeof pais.coordinates.longitud === "number"
    ) {
      latitud = pais.coordinates.latitud;
      longitud = pais.coordinates.longitud;
    } else if (
      typeof pais.coordinates.lat === "number" &&
      typeof pais.coordinates.lng === "number"
    ) {
      latitud = pais.coordinates.lat;
      longitud = pais.coordinates.lng;
    } else if (
      Array.isArray(pais.coordinates.latlng) &&
      pais.coordinates.latlng.length >= 2
    ) {
      [latitud, longitud] = pais.coordinates.latlng;
    }
  }

  if (latitud === null || longitud === null) {
    if (typeof pais.latitud === "number" && typeof pais.longitud === "number") {
      latitud = pais.latitud;
      longitud = pais.longitud;
    } else if (Array.isArray(pais.latlng) && pais.latlng.length >= 2) {
      [latitud, longitud] = pais.latlng;
    } else if (
      Array.isArray(pais.capitalInfo?.latlng) &&
      pais.capitalInfo.latlng.length >= 2
    ) {
      [latitud, longitud] = pais.capitalInfo.latlng;
    }
  }

  // Inyectar HTML
  modalContentElement.innerHTML = /*html*/ `
    <div class="text-center mb-6">
      <img 
        src="${bandera}" 
        alt="Bandera de ${nombre}" 
        class="w-32 h-20 object-cover mx-auto rounded shadow-sm border mb-3"
      />
      <h3 class="text-2xl font-bold text-slate-900">${nombre}</h3>
      <p class="text-slate-500 text-sm">${nombreOficial}</p>
    </div>

    <div class="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
      <div>
        <p class="text-xs text-slate-500">Capital</p>
        <p class="font-semibold text-slate-800">${capital}</p>
      </div>
      <div>
        <p class="text-xs text-slate-500">Población</p>
        <p class="font-semibold text-slate-800">${poblacion}</p>
      </div>
      <div>
        <p class="text-xs text-slate-500">Región</p>
        <p class="font-semibold text-slate-800">${region}</p>
      </div>
      <div>
        <p class="text-xs text-slate-500">Subregión</p>
        <p class="font-semibold text-slate-800">${subregion}</p>
      </div>
    </div>
  `;

  // Mostrar Modal
  modalElement.classList.remove("hidden");

  // Generar Mapa
  if (typeof latitud === "number" && typeof longitud === "number") {
    crearMapa(latitud, longitud, nombre);
  } else {
    console.warn("Coordenadas no encontradas para este país:", pais);
  }
}

export function cerrarModal(modalElement) {
  if (modalElement) {
    modalElement.classList.add("hidden");
  }
  destruirMapa();
}
