let puntuacion = 0;
let nivelActual = 1;
let subnivelActual = 1;
let puntosPorPregunta = 100;
let intentos = 0;

// Modelos glb usados
const modelos = {
    "Alcoholes": "../../../assets/modelos3D/alcohol.glb",
    "Aldehídos": "../../../assets/modelos3D/aldehido.glb",
    "Cetonas": "../../../assets/modelos3D/cetona.glb"
};


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
            cargarModelo3D(urlModelo);
        } else {
            console.error(`Modelo no encontrado para el subnivel: ${subnivel.nombre}`);
        }

        // Crear los botones de opciones
        subnivel.opciones.forEach((opcion) => {
            const button = document.createElement("button");
            button.className = "btn btn-secondary option";
            button.textContent = opcion.texto;  // Usar `texto` para el contenido del botón
            button.onclick = () => verificarRespuesta(opcion, subnivel.respuestaCorrecta, subnivel.explicacion); // Pasar el objeto `opcion` completo
            opcionesContainer.appendChild(button);
        });
    });
}

// Función para cargar y mostrar el modelo 3D
function cargarModelo3D(urlModelo) {
    console.log("Intentando cargar el modelo 3D desde la URL:", urlModelo);
    
    if (!THREE) {
        console.error("THREE.js no está definido.");
        return;
    }
    if (!GLTFLoader) {
        console.error("GLTFLoader no está definido.");
        return;
    }

    const viewer = document.getElementById("molecule-viewer");
    viewer.innerHTML = ""; // Limpiar el contenedor antes de cargar un nuevo modelo

    // Configuración de la escena, cámara y renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, viewer.clientWidth / viewer.clientHeight, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
    viewer.appendChild(renderer.domElement);

    // Crear la luz para la escena
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    // Agregar controles orbitales para interacción sin prefijo THREE
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;  // Permitir zoom
    controls.enablePan = true;   // Permitir paneo
    controls.enableRotate = true; // Permitir rotación
    controls.update();

    // Cargar el modelo 3D usando GLTFLoader
    const loader = new THREE.GLTFLoader();
    loader.load(
        urlModelo,
        function (gltf) {
            scene.add(gltf.scene);
            animate();
        },
        undefined,
        function (error) {
            console.error("Error al cargar el modelo 3D:", error);
        }
    );

    // Animar la escena
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
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
    console.log("Iniciando la aplicación, cargando la primera pregunta...");
    mostrarPregunta(nivelActual, subnivelActual);
});
