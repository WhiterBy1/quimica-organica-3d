let puntuacion = 0;
let nivelActual = 1;
let subnivelActual = 1;
let puntosPorPregunta = 100;
let subnivelesMezclados = [];
let intentos = 0;
let vistaActual = "3D";

const leyendaColores = {
    Alcohol: [
        { color: "red", nombre: "Oxígeno (O)" },
        { color: "gray", nombre: "Carbono (C)" },
        { color: "white", nombre: "Hidrógeno (H)" }
    ],
    Aldehido: [
        { color: "red", nombre: "Oxígeno (O)" },
        { color: "gray", nombre: "Carbono (C)" },
        { color: "white", nombre: "Hidrógeno (H)" }
    ],
    Cetona: [
        { color: "red", nombre: "Oxígeno (O)" },
        { color: "gray", nombre: "Carbono (C)" },
        { color: "white", nombre: "Hidrógeno (H)" }
    ],
    AcidoCarboxilico: [
        { color: "red", nombre: "Oxígeno (O)" },
        { color: "gray", nombre: "Carbono (C)" },
        { color: "white", nombre: "Hidrógeno (H)" },
    ],
    Amida: [
        { color: "red", nombre: "Oxígeno (O)" },
        { color: "gray", nombre: "Carbono (C)" },
        { color: "white", nombre: "Hidrógeno (H)" },
        { color: "blue", nombre: "Nitrógeno (N)" }
    ],
    Arilos: [
        { color: "gray", nombre: "Carbono (C)" },
        { color: "white", nombre: "Hidrógeno (H)" },
        { color: "yellow", nombre: "Azufre (S)" }, // En compuestos como tiofenos
        { color: "blue", nombre: "Nitrógeno (N)" }, // En anillos aromáticos con N
        { color: "green", nombre: "Cloro (Cl)" } // Sustituyentes en el anillo
    ],
    Eter: [
        { color: "gray", nombre: "Carbono (C)" },
        { color: "white", nombre: "Hidrógeno (H)" },
        { color: "red", nombre: "Oxígeno (O)" }
    ],
    Halogenuro: [
        { color: "green", nombre: "Cloro (Cl)" },
        { color: "orange", nombre: "Bromo (Br)" },
        { color: "purple", nombre: "Yodo (I)" },
        { color: "lightblue", nombre: "Flúor (F)" },
        { color: "gray", nombre: "Carbono (C)" },
        { color: "white", nombre: "Hidrógeno (H)" }
    ]
};



// Función para mezclar un array usando Fisher-Yates
function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Función para obtener una ruta aleatoria de un modelo 3D o 2D de un grupo funcional// Función para obtener una ruta de un modelo 3D o 2D de un grupo funcional en singular
function obtenerModeloAleatorio(grupoFuncional, tipo, numeroAleatorio = null) {
    // Si no se proporciona un número, se genera uno aleatorio
    const numero = numeroAleatorio
    // Selecciona el formato de archivo en función del tipo
    const extension = tipo === "3D" ? "mol2" : "png";
    // Retorna la ruta al archivo en `modelos3D`
    return `../../../assets/modelos3D/${grupoFuncional.toLowerCase()}${numero}.${extension}`;
}


// Configuración inicial de JSmol
const jsmolInfo = {
    width: 300,
    height: 300,
    use: "HTML5",
    j2sPath: "/../../js/JSmol/j2s", // Ruta a la carpeta `j2s` dentro de `JSmol`
    script: "",
    debug: false
};

// Bandera para verificar si JSmol ya fue inicializado
let isInitialized = false;

// Inicializar JSmol solo si no ha sido inicializado antes
function inicializarJSmol() {
    if (!isInitialized) {
        console.log("Inicializando JSmol...");
        window.jmolApplet = Jmol.getApplet("jmolApplet", jsmolInfo);
        document.getElementById("molecule-viewer").innerHTML = Jmol.getAppletHtml(jmolApplet);
        isInitialized = true; // Marcar como inicializado
    } else {
        console.log("JSmol ya está inicializado. No es necesario volver a inicializar.");
    }
}


// Función para cargar y mostrar el modelo 3D usando JSmol
function cargarModeloJSmol(urlModelo) {
    console.log("Intentando cargar el modelo molecular desde la URL:", urlModelo);
    inicializarJSmol(); // Asegura que JSmol esté inicializado

    // Cargar el modelo en el applet JSmol
    Jmol.script(jmolApplet, `load ${urlModelo}`);
}

// Función para mostrar la imagen 2D en un elemento <img>
function cargarImagen2D(urlImagen) {
    const viewer2D = document.getElementById("molecule-viewer-2D");
    viewer2D.src = urlImagen;
    viewer2D.alt = "Vista 2D de la molécula";
}
function alternarVista() {
    const flipCardInner = document.querySelector(".flip-card-inner");
    const toggleButton = document.getElementById("toggle-view-button");

    // Alternar la clase para girar la tarjeta
    flipCardInner.classList.toggle("flipped");

    // Cambiar el texto del botón según la vista
    if (vistaActual === "3D") {
        toggleButton.textContent = "Cambiar a 3D";
        vistaActual = "2D";
    } else {
        toggleButton.textContent = "Cambiar a 2D";
        vistaActual = "3D";
    }
}

// Cargar preguntas desde el archivo JSON
async function cargarPreguntas() {
    try {
        const response = await fetch("../../../data/preguntas.json");
        if (!response.ok) {
            throw new Error(`Error al cargar preguntas.json: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Preguntas cargadas exitosamente:", data);
        return data.niveles;
    } catch (error) {
        console.error("Error al cargar las preguntas:", error);
    }
}

// Función para ajustar las imágenes 2D y 3D a los modelos específicos
// Función para mostrar una pregunta del subnivel actual
function mostrarPregunta(nivelId) {
    cargarPreguntas().then(niveles => {
        if (!niveles) {
            console.error("No se pudieron cargar los niveles");
            return;
        }

        const nivel = niveles.find(n => n.id === nivelId);
        if (!nivel) return;

        // Inicializar los subniveles aleatoriamente si es la primera vez
        if (subnivelesMezclados.length === 0) {
            inicializarSubniveles(nivel);
        }

        // Obtener el subnivel actual
        const subnivel = subnivelesMezclados[indiceSubnivel];
        console.log(`Mostrando subnivel aleatorio: ${subnivel.nombre}`);

        const pregunta = document.getElementById("pregunta");
        const opcionesContainer = document.getElementById("opciones");
        const feedbackElement = document.getElementById("feedback");
        const btnSiguiente = document.getElementById("btnSiguiente");

        pregunta.textContent = subnivel.pregunta;
        opcionesContainer.innerHTML = "";
        feedbackElement.innerHTML = "";
        btnSiguiente.disabled = true;
        intentos = 0;
        puntosPorPregunta = 100;

        const cantidadModelos = 5;
        const value = Math.floor(Math.random() * cantidadModelos) + 1;
        const modelo3D = obtenerModeloAleatorio(subnivel.nombre, "3D", value);
        const modelo2D = obtenerModeloAleatorio(subnivel.nombre, "2D", value);

        cargarModeloJSmol(modelo3D);
        document.getElementById("molecule-viewer-2D").src = modelo2D;

        actualizarLeyenda(subnivel.nombre);


        subnivel.opciones.forEach(opcion => {
            const button = document.createElement("button");
            button.className = "btn btn-secondary option";
            button.textContent = opcion.texto;
            button.onclick = () => verificarRespuesta(opcion, subnivel.respuestaCorrecta, subnivel.explicacion);
            opcionesContainer.appendChild(button);
        });
    });
}
// Verificar respuesta
function verificarRespuesta(opcionSeleccionada, respuestaCorrecta, explicacion) {
    const feedbackElement = document.getElementById("feedback");
    const puntuacionElement = document.getElementById("puntuacion");
    const btnSiguiente = document.getElementById("btnSiguiente");
    const botones = document.querySelectorAll(".option");

    if (opcionSeleccionada.texto === respuestaCorrecta) {
        feedbackElement.innerHTML = `<span style='color: green;'>¡Correcto!</span> ${opcionSeleccionada.explicacion}`;
        puntuacion += puntosPorPregunta;
        puntuacionElement.textContent = puntuacion;

        botones.forEach(boton => boton.disabled = true);
        btnSiguiente.disabled = false;

    } else {
        intentos += 1;
        if (intentos >= 4) {
            puntosPorPregunta = 0;
            feedbackElement.innerHTML = `<span style='color: red;'>Incorrecto</span>. ${opcionSeleccionada.explicacion} <br> No hay más puntos para esta pregunta.`;
        } else {
            puntosPorPregunta -= 25;
            feedbackElement.innerHTML = `<span style='color: red;'>Incorrecto</span>. ${opcionSeleccionada.explicacion} <br> Inténtalo de nuevo. Puntos restantes: ${puntosPorPregunta}`;
        }
    }
}

function reiniciarJuego() {
    nivelActual = 1;
    subnivelesMezclados = [];
    indiceSubnivel = 0;
    puntuacion = 0;
    document.getElementById("puntuacion").textContent = puntuacion;

    // Mostrar la primera pregunta del juego
    mostrarPregunta(nivelActual);
}


// Avanzar a la siguiente pregunta
function siguientePregunta() {
    indiceSubnivel += 1;

    if (indiceSubnivel >= subnivelesMezclados.length) {
        alert(`¡Juego terminado! Tu puntuación final es: ${puntuacion}`);
        // Reiniciar el juego
        reiniciarJuego();
    } else {
        mostrarPregunta(nivelActual);
    }
}

// Inicializar los subniveles de forma aleatoria
function inicializarSubniveles(nivel) {
    subnivelesMezclados = mezclarArray(nivel.subniveles);
    indiceSubnivel = 0;
}
function actualizarLeyenda(grupoFuncional) {
    const leyendaContainer = document.getElementById("color-legend");
    leyendaContainer.innerHTML = `<h3>Identificación de Átomos</h3><ul style="color: white;"></ul>`;

    const leyenda = leyendaColores[grupoFuncional];
    if (leyenda) {
        leyenda.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `<span class="legend-color" style="background-color: ${item.color};"></span>${item.nombre}`;
            leyendaContainer.querySelector("ul").appendChild(li);
        });
    }
}


// Inicializar con el primer nivel y subnivel
document.addEventListener("DOMContentLoaded", () => {
    console.log("Iniciando la aplicación, cargando la primera pregunta...");
    mostrarPregunta(nivelActual, subnivelActual);
});
