// ===========================================
// REAL MADRID SPA
// JSON LOCAL
// ===========================================

// ===========================================
// URL DEL JSON
// ===========================================

const URL = "./madrid.json";


// ===========================================
// VARIABLES
// ===========================================

let offset = 0;

const limite = 10;

let todosLosJugadores = [];


// ===========================================
// ELEMENTOS DEL DOM
// ===========================================

const jugadoresContainer =
    document.getElementById("pokemonContainer");

const detailContainer =
    document.getElementById("detailContainer");

const previousBtn =
    document.getElementById("previousBtn");

const nextBtn =
    document.getElementById("nextBtn");

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");

const counter =
    document.getElementById("pokemonCounter");


// ===========================================
// LOADING
// ===========================================

function mostrarLoading() {

    loading.classList.remove("hidden");

}


function ocultarLoading() {

    loading.classList.add("hidden");

}


// ===========================================
// ERROR
// ===========================================

function mostrarError(mensaje) {

    errorMessage.textContent = mensaje;

    errorMessage.classList.remove("hidden");

    setTimeout(() => {

        errorMessage.classList.add("hidden");

    }, 3000);

}


// ===========================================
// CARGAR JSON
// ===========================================

async function cargarJugadores() {

    mostrarLoading();

    try {

        console.log("Cargando:", URL);


        const respuesta =
            await fetch(URL);


        if (!respuesta.ok) {

            throw new Error(
                `HTTP ${respuesta.status}`
            );

        }


        const datos =
            await respuesta.json();


        console.log(
            "JSON recibido:",
            datos
        );


        // =====================================
        // COMPROBAR ESTRUCTURA
        // =====================================

        if (
            !datos.jugadores
        ) {

            throw new Error(
                "El JSON no contiene 'jugadores'"
            );

        }


        // =====================================
        // UNIR LAS CATEGORÍAS
        // =====================================

        todosLosJugadores = [

            ...(datos.jugadores.porteros || []),

            ...(datos.jugadores.defensas || []),

            ...(datos.jugadores.centrocampistas || []),

            ...(datos.jugadores.delanteros || [])

        ];


        console.log(
            "Total jugadores:",
            todosLosJugadores.length
        );


        // =====================================
        // COMPROBAR JUGADORES
        // =====================================

        if (
            todosLosJugadores.length === 0
        ) {

            throw new Error(
                "No hay jugadores"
            );

        }


        // =====================================
        // MOSTRAR
        // =====================================

        offset = 0;

        mostrarJugadores();


    } catch (error) {

        console.error(
            "Error:",
            error
        );

        mostrarError(
            "No se pudo cargar madrid.json"
        );

    } finally {

        ocultarLoading();

    }

}


// ===========================================
// MOSTRAR JUGADORES
// ===========================================

function mostrarJugadores() {

    jugadoresContainer.innerHTML = "";


    const inicio = offset;

    const fin =
        offset + limite;


    const jugadores =
        todosLosJugadores.slice(
            inicio,
            fin
        );


    counter.textContent =
        `${todosLosJugadores.length} jugadores`;


    jugadores.forEach(
        jugador => {

            crearCard(jugador);

        }
    );


    actualizarPaginacion();

}


// ===========================================
// CREAR TARJETA
// ===========================================

function crearCard(jugador) {

    const card =
        document.createElement("article");


    card.classList.add("card");


    const clase =
        obtenerClasePosicion(
            jugador.posicion
        );


    card.innerHTML = `

        <div class="player-number">

            #${jugador.dorsal}

        </div>


        <div class="player-icon">

            ⚽

        </div>


        <div class="card-body">

            <p class="id">

                Dorsal ${jugador.dorsal}

            </p>


            <h3>

                ${jugador.nombre}

            </h3>


            <span class="tipo ${clase}">

                ${jugador.posicion}

            </span>


            <button>

                Ver información

            </button>

        </div>

    `;


    card
        .querySelector("button")
        .addEventListener(
            "click",
            () => {

                mostrarDetalle(jugador);

            }
        );


    jugadoresContainer.appendChild(card);

}


// ===========================================
// DETALLE DEL JUGADOR
// ===========================================

function mostrarDetalle(jugador) {

    const clase =
        obtenerClasePosicion(
            jugador.posicion
        );


    detailContainer.innerHTML = `

        <div class="detail-number">

            #${jugador.dorsal}

        </div>


        <div class="detail-icon">

            ⚽

        </div>


        <h2>

            ${jugador.nombre}

        </h2>


        <span class="tipo ${clase}">

            ${jugador.posicion}

        </span>


        <div class="player-info">

            <p>

                <strong>Equipo:</strong>

                Real Madrid

            </p>


            <p>

                <strong>Temporada:</strong>

                2026/27

            </p>


            <p>

                <strong>Dorsal:</strong>

                ${jugador.dorsal}

            </p>


            <p>

                <strong>Posición:</strong>

                ${jugador.posicion}

            </p>

        </div>

    `;

}


// ===========================================
// BUSCAR JUGADOR
// ===========================================

function buscarJugador() {

    const texto =
        searchInput.value
            .trim()
            .toLowerCase();


    // =====================================
    // SI ESTÁ VACÍO
    // =====================================

    if (texto === "") {

        offset = 0;

        mostrarJugadores();

        return;

    }


    // =====================================
    // BUSCAR
    // =====================================

    const resultados =
        todosLosJugadores.filter(
            jugador => {

                return (

                    jugador.nombre
                        .toLowerCase()
                        .includes(texto)

                    ||

                    jugador.posicion
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        jugador.dorsal
                    ).includes(texto)

                );

            }
        );


    jugadoresContainer.innerHTML = "";


    // =====================================
    // NO ENCONTRADO
    // =====================================

    if (
        resultados.length === 0
    ) {

        counter.textContent =
            "0 jugadores";

        mostrarError(
            "Jugador no encontrado"
        );

        return;

    }


    // =====================================
    // MOSTRAR RESULTADOS
    // =====================================

    resultados.forEach(
        jugador => {

            crearCard(jugador);

        }
    );


    counter.textContent =
        `${resultados.length} resultado(s)`;


    previousBtn.disabled = true;

    nextBtn.disabled = true;

}


// ===========================================
// PAGINACIÓN
// ===========================================

function actualizarPaginacion() {

    previousBtn.disabled =
        offset === 0;


    nextBtn.disabled =
        offset + limite >=
        todosLosJugadores.length;

}


// ===========================================
// BOTÓN SIGUIENTE
// ===========================================

nextBtn.addEventListener(
    "click",
    () => {

        if (
            offset + limite <
            todosLosJugadores.length
        ) {

            offset += limite;

            mostrarJugadores();

        }

    }
);


// ===========================================
// BOTÓN ANTERIOR
// ===========================================

previousBtn.addEventListener(
    "click",
    () => {

        if (offset > 0) {

            offset -= limite;

            mostrarJugadores();

        }

    }
);


// ===========================================
// BUSCADOR
// ===========================================

searchButton.addEventListener(
    "click",
    buscarJugador
);


searchInput.addEventListener(
    "keypress",
    event => {

        if (event.key === "Enter") {

            buscarJugador();

        }

    }
);


// ===========================================
// CLASE DE POSICIÓN
// ===========================================

function obtenerClasePosicion(
    posicion
) {

    const texto =
        posicion
            .toLowerCase();


    if (
        texto.includes("portero")
    ) {

        return "portero";

    }


    if (
        texto.includes("defensa")
    ) {

        return "defensa";

    }


    if (
        texto.includes("centrocampista")
    ) {

        return "centrocampista";

    }


    if (
        texto.includes("delantero")
    ) {

        return "delantero";

    }


    return "";

}


// ===========================================
// INICIO
// ===========================================

cargarJugadores();