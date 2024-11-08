let puntuacion = 0;
let nivelActual = 1;
let subnivelActual = 1;
let puntosPorPregunta = 100;
let intentos = 0;
let vistaActual = "3D";


// Función para obtener una ruta aleatoria de un modelo 3D o 2D de un grupo funcional// Función para obtener una ruta de un modelo 3D o 2D de un grupo funcional en singular
function obtenerModeloAleatorio(grupoFuncional, tipo, numeroAleatorio = null) {
    const cantidadModelos = 5; // Número de modelos disponibles (ajusta según el grupo funcional)
    
    // Si no se proporciona un número, se genera uno aleatorio
    const numero = numeroAleatorio !== null ? numeroAleatorio : Math.floor(Math.random() * cantidadModelos) + 1;
    
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
    j2sPath:"/../../js/JSmol/j2s", // Ruta a la carpeta `j2s` dentro de `JSmol`
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
function mostrarPregunta(nivelId, subnivelId) {
    cargarPreguntas().then(niveles => {
        if (!niveles) {
            console.error("No se pudieron cargar los niveles");
            return;
        }

        const nivel = niveles.find(n => n.id === nivelId);
        const subnivel = nivel ? nivel.subniveles.find(s => s.id === subnivelId) : null;

        if (!nivel || !subnivel) return;

        console.log(`Mostrando pregunta del nivel ${nivelId}, subnivel ${subnivelId}`);
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

        const modelo3D = obtenerModeloAleatorio(subnivel.nombre, "3D");
        const modelo2D = obtenerModeloAleatorio(subnivel.nombre, "2D");

        cargarModeloJSmol(modelo3D);
        document.getElementById("molecule-viewer-2D").src = modelo2D;

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
