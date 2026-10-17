// INTERFAZ DE USUARIO
// Funciones encargadas de actualizar el DOM

// FUNCION DE ESTADO DE CARGA
export function mostrarCargando(contenedor) {
  // Mostrar estado de carga
  // MOSTRAR ESTADO DE CARGA
  contenedor.innerHTML = /*html*/ `
  <div class="
                col-span-full
                bg-white
                border
                border-dashed
                border-slate-300
                rounded-xl
                p-12
                text-center
            ">
  <div class="text-5xl mb-4">
    🌎
  </div>

  <h3 class="
            text-xl
            font-semibold
            text-slate-800
            mb-2
        ">
    Cargando destinos
  </h3>

  <p>
    Estamos consultando información de páises alrededor del mundo...
  </p>
  </div>
  `;
}

// MOSTRAR ERROR
export function mostrarError(contenedor) {
  // Mostrar error al cargar
  // MOSTRAR UN MENSAJE SI OCURRE UN ERROR
  contenedor.innerHTML = /*html*/ `
    <div class="
                col-span-full
                bg-red-50
                border
                border-red-200
                rounded-xl
                p-12
                text-center
            ">
    <div class="text-5xl mb-4">
       ⚠️
    </div>

    <h3 class="
                text-xl
                font-semibold
                text-slate-800
                mb-2
            ">
      No fue posible cargar los paises
    </h3>

    <p class="text-slate-500">
      Verifica tu conexión e intenta nuevamente. 
    </p>
    </div>
    `;
}

// ACTUALIZAR EL CONTADOR
export function actualizarContador(total, elementoContador) {
  // Actualizar contador
  elementoContador.textContent = `${total} destinos`;
}

export function renderPaises(paises, contenedor) {
  // Validacion
  if (paises.length === 0) {
    contenedor.innerHTML = /*html*/ `
    
    <div class="
                col-span-full
                bg-white
                border
                border-dashed
                border-slate-300
                rounded-xl
                p-12
                text-center
            ">
    
      <div class="text-5xl mb-4">
        🔎
      </div>

      <h3 class="
                    text-xl
                    font-semibold
                    text-slate-800
                    mb-2
                ">
        No se encontraron destinos
      </h3>

      <p class="text-slate-500">
        Intenta cambiar los criterios de busqueda
      </p>
    
    </div>
     
    `;

    return;
  }

  // UTIlizar map para el renderizado
  const tarjetas = paises
    .map((pais) => {
      // Obtener nombre
      const nombre = pais.names?.common ?? "Nombre no disponible";

      // Obtener region
      const region = pais.region ?? "Región no disponible";

      // Obtener población
      const poblacion = pais.population ?? 0;

      // Obtener bandera
      const bandera = pais.flag?.url_png ?? "";

      // Obtener codigo
      const codigo = pais.codes?.alpha_3 ?? "";

      const poblaciónFormateada = poblacion.toLocaleString("es-MX");

      return /*html*/ `
    
    <article class="
            bg-white
            rounded-xl
            border
            border-slate-200
            overflow-hidden
            shadow-sm
            hover:shadow-md
            transition
        ">
      <!--BANDERA-->
      <div class="
                h-48
                bg-slate-100
                overflow-hidden
            ">
        <img src="${bandera}" alt="${nombre}">
      </div>

      <!--INFORMACION DEL DESTINO-->
      <div class="p-5">

        <div class="
                    flex
                    items-start
                    justify-between
                    gap-4
                    mb-4
                ">

          <div>
            <h3 class="
                            text-xl
                            font-bold
                            text-slate-900
                        ">
              ${nombre}
            </h3>

            <p class="text-sm text-slate-500">
              ${region}
            </p>

          </div>

          <span class="
                        px-3
                        py-1
                        bg-blue-50
                        text-blue-600
                        text-xs
                        font-medium
                        rounded-full
                    ">
            ${codigo}
          </span>
        
        </div>

        <!--POBLACIÓN-->

        <div class="mb-5">

          <p class="text-xs text-slate-500">
            Población
          </p>

          <p class="
                        text-lg
                        font-semibold
                        text-slate-800
                    ">
            ${poblaciónFormateada}
          </p>
        
        </div>

        <!--ACCIONES-->
        <div class="flex gap-3">
        
          <button type='button' data-action='detail' data-country-code='${codigo}' class="
                        flex-1
                        px-4
                        py-2
                        bg-blue-600
                        text-white
                        rounded-lg
                        font-medium
                        cursor-pointer
                        hover:bg-blue-700
                        transition
                    ">
            Ver mas
          </button>

          <button type="button" data-action="favorite" data-country-code="${codigo}" aria-label="Agregar ${nombre} a favoritos" class="
                        px-4
                        py-2
                        border
                        border-slate-300
                        text-slate-600
                        rounded-lg
                        cursor-pointer
                        hover:bg-slate-100
                        transition
                    " >
            ♡
          </button>

        </div>
      
      </div>
    
    </article>
    
    `;
    })
    .join("");

  contenedor.innerHTML = tarjetas;
}

// VARIABLE PARA CONSERVAR LA INSTANCIA DEL MAPA LEAFLET
let map = null;

// RENDERIZAR DETALLE DEL PAÍS EN EL MODAL (v0.5.0)
export function renderDetalleModal(pais, contenedorDetalle) {
  const nombre = pais.names?.common ?? "Nombre no disponible";
  const nombreOficial = pais.names?.official ?? "";
  const region = pais.region ?? "Región no disponible";
  const subregion = pais.subregion ?? "Subregión no disponible";
  const capital = pais.capital?.[0] ?? "Capital no disponible";
  const poblacion = pais.population
    ? pais.population.toLocaleString("es-MX")
    : "0";
  const bandera = pais.flag?.url_png ?? "";

  contenedorDetalle.innerHTML = /*html*/ `
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
}

// INICIALIZAR Y ACTUALIZAR MAPA INTERACTIVO CON LEAFLET (v0.5.0)
export function renderMapa(latlng, nombrePais, capitalPais) {
  if (!latlng || latlng.length < 2) return;

  const [lat, lng] = latlng;

  // Si ya existe un mapa instanciado, se destruye para liberar el contenedor
  if (map) {
    map.remove();
  }

  // Crear mapa en el contenedor #map
  map = L.map("map").setView([lat, lng], 5);

  // Cargar capa OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Agregar marcador interactivo
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<b>${nombrePais}</b><br>${capitalPais}`)
    .openPopup();

  // Reajustar dimensiones para evitar renders recortados en modales
  setTimeout(() => {
    map.invalidateSize();
  }, 200);
}
