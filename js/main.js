// Carga de molécula 3D en teoría.html
function load3DMolecule() {
    const moleculeContainer = document.getElementById("molecule-3d");
    moleculeContainer.innerHTML = "<canvas id='moleculeCanvas'></canvas>";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('moleculeCanvas') });
    renderer.setSize(200, 200);
    moleculeContainer.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1, 32, 32); // Placeholder molecule
    const material = new THREE.MeshBasicMaterial({ color: 0x007bff });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const animate = function () {
        requestAnimationFrame(animate);
        sphere.rotation.y += 0.01;
        renderer.render(scene, camera);
    };
    animate();
}

// Lógica de preguntas en preguntas.html
let correctAnswer = "Alcohol"; // Respuesta correcta para este nivel

function checkAnswer(answer) {
    const feedbackElement = document.getElementById("feedback");

    if (answer === correctAnswer) {
        feedbackElement.innerHTML = "<span style='color: green;'>¡Correcto!</span> Los alcoholes tienen un grupo hidroxilo (-OH) unido a un carbono.";
    } else {
        feedbackElement.innerHTML = "<span style='color: red;'>Incorrecto</span>. Inténtalo de nuevo.";
    }
}
