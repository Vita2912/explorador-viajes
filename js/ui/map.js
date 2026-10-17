// v0.5.0 MAPA: Integración con Leaflet

// INSTANCIA ACTUAL DE MAPA
let mapaActual = null;

// FUNCION DESTRUIR MAPA ACTUAL
export function destruirMapa() {
  // AÑADIMOS UNA VERIFICACIÓN SI HAY ALGUN MAPA
  if (mapaActual) {
    mapaActual.remove();
    mapaActual = null;
  }
}

// FUNCION CREAR MAPA
export function crearMapa(latitud, longitud, nombre) {
  // VALIDAR LAS COORDENADAS
  if (typeof latitud !== "number" || typeof longitud !== "number") {
    console.warn("Coordenadas no disponibles");
    return;
  }

  // MANDAMOS A LLAMAR A LA FUNCION DESTRUIR MAPA
  destruirMapa();

  // INICIALIZAR LEAFLET (Asegúrate de que el div en el HTML tenga id="map")
  mapaActual = L.map("map").setView([latitud, longitud], 4);

  // AGREGAMOS UNA CAPA DE OPENSTREETMAP
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(mapaActual);

  // AGREGAR MARCADOR
  L.marker([latitud, longitud])
    .addTo(mapaActual)
    .bindPopup(/*html*/ `<strong>${nombre}</strong>`)
    .openPopup();

  // CORRECCIÓN PARA MODALES: Reajusta el renderizado del mapa al abrir el modal
  setTimeout(() => {
    if (mapaActual) {
      mapaActual.invalidateSize();
    }
  }, 250);
}
