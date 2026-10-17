/**
 * js/utils/filters.js
 * Módulo para filtrar y ordenar los destinos.
 */

export function filtrarPorTexto(paises, search = "") {
  const query = search.trim().toLowerCase();
  if (!query) return paises;

  return paises.filter((pais) => {
    // La API usa 'nombre' para español y 'names.common' para inglés
    const nombreEs = (pais.nombre || "").toLowerCase();
    const nombreEn = (pais.names?.common || "").toLowerCase();

    return nombreEs.includes(query) || nombreEn.includes(query);
  });
}

export function filtrarPorContinente(paises, continente = "all") {
  if (continente === "all" || !continente) return paises;

  // Normalizamos por si el option manda "Americas" o "América"
  return paises.filter((pais) => {
    const region = (pais.region || "").toLowerCase();
    const filtro = continente.toLowerCase();

    if (filtro.includes("americ") || filtro === "americas") {
      return region.includes("americ");
    }
    return region === filtro;
  });
}

export function ordenarPaises(paises, orden = "az") {
  return [...paises].sort((a, b) => {
    const nombreA = a.nombre || a.names?.common || "";
    const nombreB = b.nombre || b.names?.common || "";

    if (orden === "za") {
      return nombreB.localeCompare(nombreA, "es", { sensitivity: "base" });
    }
    return nombreA.localeCompare(nombreB, "es", { sensitivity: "base" });
  });
}

export function aplicarFiltros(
  paises,
  { search = "", continent = "all", sort = "az" } = {},
) {
  let resultado = filtrarPorTexto(paises, search);
  resultado = filtrarPorContinente(resultado, continent);
  resultado = ordenarPaises(resultado, sort);
  return resultado;
}
