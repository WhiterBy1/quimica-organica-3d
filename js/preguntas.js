let puntuacion = 0;
let nivelActual = 1;
let subnivelActual = 1;
let puntosPorPregunta = 100;
let intentos = 0;

// Cargar preguntas desde el archivo JSON
async function cargarPreguntas() {
    try {
        const response = await fetch("../../../data/preguntas.json");
        const data = await response.json();
        return data.niveles;
    } catch (error) {
        console.error("Error al cargar las preguntas:", error);
    }
}

// Mostrar la pregunta y las opciones para un nivel y subnivel específico
function mostrarPregunta(nivelId, subnivelId) {
    cargarPreguntas().then(niveles => {
        const nivel = niveles.find(n => n.id === nivelId);
        const subnivel = nivel.subniveles.find(s => s.id === subnivelId);
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

        subnivel.opciones.forEach((opcion) => {
            const button = document.createElement("button");
            button.className = "btn btn-secondary option";
            button.textContent = opcion.texto;
            button.onclick = () => verificarRespuesta(opcion, subnivel.respuestaCorrecta, subnivel.opciones);
            opcionesContainer.appendChild(button);
        });
    });
}

// Verificar respuesta
function verificarRespuesta(opcionSeleccionada, respuestaCorrecta, opciones) {
    const feedbackElement = document.getElementById("feedback");
    const puntuacionElement = document.getElementById("puntuacion");
    const btnSiguiente = document.getElementById("btnSiguiente");
    const botones = document.querySelectorAll(".option");

    if (opcionSeleccionada.texto === respuestaCorrecta) {
        feedbackElement.innerHTML = `<span style='color: green;'>¡Correcto!</span> ${opcionSeleccionada.explicacion}`;
        puntuacion += puntosPorPregunta;
        puntuacionElement.textContent = puntuacion;
        
        // Desactiva todos los botones y habilita el botón de siguiente
        botones.forEach(boton => boton.disabled = true);
        btnSiguiente.disabled = false;

    } else {
        intentos += 1;
        if (intentos >= 4) {
            puntosPorPregunta = 0;
            feedbackElement.innerHTML = `<span style='color: red;'>Incorrecto</span>. ${opcionSeleccionada.explicacion} <br> No hay más puntos para esta pregunta.`;
        } else {
            puntosPorPregunta -= 25; // Disminuye los puntos en cada intento
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
    mostrarPregunta(nivelActual, subnivelActual);
});
