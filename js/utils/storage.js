/* =========================================
   GESTIÓN DE LOCALSTORAGE - FAVORITOS
========================================= */

const FAVORITES_KEY = "explorador_paises_favoritos";

// OBTENER FAVORITOS DE LOCALSTORAGE
export function obtenerFavoritos() {
  const favoritos = localStorage.getItem(FAVORITES_KEY);
  return favoritos ? JSON.parse(favoritos) : [];
}

// GUARDAR FAVORITOS EN LOCALSTORAGE
export function guardarFavoritos(favoritos) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritos));
}

// VERIFICAR SI UN PAÍS ES FAVORITO
export function esFavorito(codigo) {
  const favoritos = obtenerFavoritos();
  return favoritos.some(
    (favorito) => (favorito.codes?.alpha_3 || favorito.cca3) === codigo,
  );
}

/* =========================================
   AGREGAR FAVORITO
========================================= */
export function agregarFavorito(pais) {
  const favoritos = obtenerFavoritos();
  const codigo = pais.codes?.alpha_3 || pais.cca3;

  const yaExiste = favoritos.some(
    (favorito) => (favorito.codes?.alpha_3 || favorito.cca3) === codigo,
  );

  if (yaExiste) {
    return false;
  }

  favoritos.push(pais);
  guardarFavoritos(favoritos);
  return true;
}

/* =========================================
   ELIMINAR FAVORITO
========================================= */
export function eliminarFavorito(codigo) {
  const favoritos = obtenerFavoritos();
  const favoritosActualizados = favoritos.filter(
    (pais) => (pais.codes?.alpha_3 || pais.cca3) !== codigo,
  );

  guardarFavoritos(favoritosActualizados);
  return favoritosActualizados;
}
