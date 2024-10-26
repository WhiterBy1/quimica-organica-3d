let puntuacion = 0;
let nivelActual = 1;
let subnivelActual = 1;
let puntosPorPregunta = 100;
let intentos = 0;

// Modelos en formato PDB usados
const modelos = {
    "Alcoholes": "../../../assets/modelos3D/alcohol.pdb",
    "Aldehídos": "../../../assets/modelos3D/aldehido.pdb",
    "Cetonas": "../../../assets/modelos3D/cetona.pdb"
};

// Configuración inicial de JSmol
const jsmolInfo = {
    width: 300,
    height: 300,
    use: "HTML5",
    j2sPath: "../../../js/JSmol/j2s", // Ruta a la carpeta `j2s` dentro de `JSmol`
    script: "",
    debug: false
};

// Inicializar JSmol
function inicializarJSmol() {
    if (!window.jmolApplet) {
        window.jmolApplet = Jmol.getApplet("jmolApplet", jsmolInfo);
        document.getElementById("molecule-viewer").innerHTML = Jmol.getAppletHtml(jmolApplet);
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

// Mostrar la pregunta y las opciones para un nivel y subnivel específico
function mostrarPregunta(nivelId, subnivelId) {
    cargarPreguntas().then(niveles => {
        if (!niveles) {
            console.error("No se pudieron cargar los niveles");
            return;
        }

        const nivel = niveles.find(n => n.id === nivelId);
        const subnivel = nivel ? nivel.subniveles.find(s => s.id === subnivelId) : null;

        if (!nivel || !subnivel) {
            console.error("Nivel o subnivel no encontrado");
            return;
        }

        console.log(`Mostrando pregunta del nivel ${nivelId}, subnivel ${subnivelId}`);
        const pregunta = document.getElementById("pregunta");
        const opcionesContainer = document.getElementById("opciones");
        const feedbackElement = document.getElementById("feedback");
        const btnSiguiente = document.getElementById("btnSiguiente");

        // Configuración inicial de la pregunta
        pregunta.textContent = subnivel.pregunta;
        opcionesContainer.innerHTML = "";
        feedbackElement.innerHTML = "";
        btnSiguiente.disabled = true;
        intentos = 0;
        puntosPorPregunta = 100;

        // Cargar el modelo 3D correspondiente al subnivel
        const urlModelo = modelos[subnivel.nombre];
        if (urlModelo) {
            console.log("Cargando modelo desde URL:", urlModelo);
            cargarModeloJSmol(urlModelo);
        } else {
            console.error(`Modelo no encontrado para el subnivel: ${subnivel.nombre}`);
        }

        // Crear los botones de opciones
        subnivel.opciones.forEach((opcion) => {
            const button = document.createElement("button");
            button.className = "btn btn-secondary option";
            button.textContent = opcion.texto;
            button.onclick = () => verificarRespuesta(opcion, subnivel.respuestaCorrecta, subnivel.explicacion);
            opcionesContainer.appendChild(button);
        });
    });
}

// Función para cargar y mostrar el modelo 3D usando JSmol
function cargarModeloJSmol(urlModelo) {
    console.log("Intentando cargar el modelo molecular desde la URL:", urlModelo);
    inicializarJSmol(); // Asegura que JSmol esté inicializado

    // Cargar el modelo en el applet JSmol
    Jmol.script(jmolApplet, `load ${urlModelo}`);
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

// Avanzar a la siguiente pregunta
function siguientePregunta() {
    subnivelActual += 1;

    cargarPreguntas().then(niveles => {
        const nivel = niveles.find(n => n.id === nivelActual);

        if (!nivel.subniveles.find(s => s.id === subnivelActual)) {
            nivelActual += 1;
            subnivelActual = 1;
        }

        const siguienteNivel = niveles.find(n => n.id === nivelActual);
        if (!siguienteNivel) {
            alert(`¡Juego terminado! Tu puntuación final es: ${puntuacion}`);
            nivelActual = 1;
            subnivelActual = 1;
            puntuacion = 0;
            document.getElementById("puntuacion").textContent = puntuacion;
        }

        mostrarPregunta(nivelActual, subnivelActual);
    });
}

// Inicializar con el primer nivel y subnivel
document.addEventListener("DOMContentLoaded", () => {
    console.log("Iniciando la aplicación, cargando la primera pregunta...");
    mostrarPregunta(nivelActual, subnivelActual);
});
