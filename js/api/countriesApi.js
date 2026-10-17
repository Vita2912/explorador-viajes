// COMUNICACIÓN CON LA API PAISES

const API_URL =
  "https://juancognitus.github.io/explorador-viajes-api/paises.json";

// Export me permite exportar mi funcion o lo que manejando a otros archivos js
export async function obtnerPaises() {
  try {
    // RELIZAR LA PETICION
    const response = await fetch(API_URL);

    // VALIDACION DEL OK
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result = await response.json();

    const paises = result;

    //console.log(paises);

    return paises;
  } catch (error) {
    console.log("Error al obtenr los paises: ", error);
    return [];
  }
}

//obtnerPaises();
