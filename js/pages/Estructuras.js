const gruposFuncionales = [
    { id: 1, nombre: 'Alcohol', estructura: 'R-OH' },
    { id: 2, nombre: 'Aldehído', estructura: 'R-CHO' },
    { id: 3, nombre: 'Cetona', estructura: 'R-CO-R' },
    { id: 4, nombre: 'Ácido Carboxílico', estructura: 'R-COOH' },
    { id: 5, nombre: 'Éster', estructura: 'R-COO-R' },
    { id: 6, nombre: 'Amina', estructura: 'R-NH2' },
    { id: 7, nombre: 'Eter', estructura: 'R-O-R' }
];

let puntuacion = 0;
let seleccionado = null;

function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function crearElemento(tipo, texto, id) {
    const elemento = document.createElement('div');
    elemento.textContent = texto;
    elemento.className = tipo;
    elemento.setAttribute('tabindex', '0');
    elemento.id = `${tipo}-${id}`;
    elemento.draggable = true;
    elemento.addEventListener('click', manejarSeleccion);
    elemento.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            manejarSeleccion(e);
        }
    });
    elemento.addEventListener('dragstart', iniciarArrastre);
    elemento.addEventListener('dragend', finalizarArrastre);
    elemento.style.minHeight = '50px';
    elemento.style.margin = '0.5rem 0';
    return elemento;
}

function inicializarJuego() {
    const moleculasContainer = document.getElementById('moleculas-container');
    const gruposContainer = document.getElementById('grupos-container');

    moleculasContainer.innerHTML = '';
    gruposContainer.innerHTML = '';
    puntuacion = 0;
    seleccionado = null;
    actualizarPuntuacion();

    const gruposMezclados = mezclarArray([...gruposFuncionales]);
    const estructurasMezcladas = mezclarArray([...gruposFuncionales]);

    // Creamos y añadimos los elementos inmediatamente visibles
    gruposMezclados.forEach((grupo, index) => {
        const grupoFuncional = crearElemento('grupo', grupo.nombre, grupo.id);
        // Aseguramos que el elemento sea visible desde el inicio
        grupoFuncional.style.opacity = '1';
        grupoFuncional.style.visibility = 'visible';
        gruposContainer.appendChild(grupoFuncional);
        grupoFuncional.addEventListener('dragover', permitirSoltar);
        grupoFuncional.addEventListener('drop', soltarElemento);

        // Modificamos la animación para que no afecte la visibilidad
        gsap.from(grupoFuncional, {
            y: 50,
            duration: 0.5,
            delay: index * 0.1,
            ease: "power3.out",
            onStart: () => {
                grupoFuncional.style.opacity = '1';
                grupoFuncional.style.visibility = 'visible';
            }
        });
    });
    estructurasMezcladas.forEach((grupo, index) => {
        const molecula = crearElemento('molecula', grupo.estructura, grupo.id);
        moleculasContainer.appendChild(molecula);

        // Animate entrada with GSAP
        gsap.from(molecula, {
            y: 50,
            opacity: 0,
            duration: 0.5,
            delay: index * 0.1,
            ease: "power3.out"
        });
    });
}

function verificarEmparejamiento(molecula, grupo) {
    if (molecula.id.split('-')[1] === grupo.id.split('-')[1]) {
        molecula.classList.add('correct');
        grupo.classList.add('correct');
        molecula.style.pointerEvents = 'none';
        grupo.style.pointerEvents = 'none';
        molecula.setAttribute('draggable', 'false');
        grupo.setAttribute('draggable', 'false');
        puntuacion++;
        actualizarPuntuacion();

        // Animate correct match
        gsap.to([molecula, grupo], {
            scale: 1.05,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "power2.out"
        });
    } else {
        molecula.classList.add('incorrect');
        grupo.classList.add('incorrect');

        // Animate incorrect match
        gsap.to([molecula, grupo], {
            x: 10,
            duration: 0.1,
            yoyo: true,
            repeat: 3,
            ease: "power2.out",
            onComplete: () => {
                molecula.classList.remove('incorrect', 'selected');
                grupo.classList.remove('incorrect');
            }
        });
    }
    seleccionado = null;
}

function manejarSeleccion(e) {
    const elemento = e.currentTarget;

    if (elemento.classList.contains('molecula')) {
        if (seleccionado && seleccionado.classList.contains('molecula')) {
            seleccionado.classList.remove('selected');
        }
        seleccionado = elemento;

        // Animate selection
        gsap.to(elemento, {
            scale: 1.05,
            duration: 0.2,
            ease: "power2.out"
        });

        elemento.classList.add('selected');
    } else if (elemento.classList.contains('grupo')) {
        if (seleccionado && seleccionado.classList.contains('molecula')) {
            verificarEmparejamiento(seleccionado, elemento);
        }
    }
}

function iniciarArrastre(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.classList.add('dragging');

    // Animate drag start
    gsap.to(e.target, {
        scale: 1.05,
        opacity: 0.8,
        duration: 0.2,
        ease: "power2.out"
    });
}

function finalizarArrastre(e) {
    e.target.classList.remove('dragging');

    // Animate drag end
    gsap.to(e.target, {
        scale: 1,
        opacity: 1,
        duration: 0.2,
        ease: "power2.out"
    });
}

function permitirSoltar(e) {
    e.preventDefault();
    // Add subtle highlight effect
    gsap.to(e.target, {
        scale: 1.02,
        duration: 0.2,
        ease: "power2.out"
    });
}

function soltarElemento(e) {
    e.preventDefault();
    const idMolecula = e.dataTransfer.getData('text');
    const molecula = document.getElementById(idMolecula);

    // Reset highlight effect
    gsap.to(e.target, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
    });

    verificarEmparejamiento(molecula, e.target);
}

function actualizarPuntuacion() {
    const puntuacionElement = document.getElementById('puntuacion');
    const progressBar = document.getElementById('progress');
    const progreso = (puntuacion / gruposFuncionales.length) * 100;

    // Animate score update
    gsap.to(puntuacionElement, {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
    });

    // Animate progress bar
    gsap.to(progressBar, {
        width: `${progreso}%`,
        duration: 0.5,
        ease: "power2.out"
    });

    puntuacionElement.textContent = `Puntuación: ${puntuacion} / ${gruposFuncionales.length}`;

    if (puntuacion === gruposFuncionales.length) {
        setTimeout(() => {
            // Animate victory message
            const container = document.querySelector('.container');
            const victoryOverlay = document.createElement('div');
            victoryOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            `;

            const victoryMessage = document.createElement('div');
            victoryMessage.style.cssText = `
                background: rgba(76, 175, 80, 0.2);
                padding: 2rem;
                border-radius: 20px;
                text-align: center;
                backdrop-filter: blur(10px);
                border: 1px solid var(--primary);
            `;
            victoryMessage.innerHTML = '<h2>¡Felicitaciones!</h2><p>Ha completado con éxito el ejercicio de Química Orgánica.</p>';

            victoryOverlay.appendChild(victoryMessage);
            document.body.appendChild(victoryOverlay);

            gsap.from(victoryMessage, {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                ease: "back.out"
            });

            victoryOverlay.addEventListener('click', () => {
                gsap.to(victoryOverlay, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => victoryOverlay.remove()
                });
            });
        }, 500);
    }
}

// Event listener for restart button
document.getElementById('reiniciar').addEventListener('click', () => {
    gsap.to('.container', {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            inicializarJuego();
            gsap.to('.container', {
                opacity: 1,
                duration: 0.3
            });
        }
    });
});

// Initialize game when page loads
window.addEventListener('load', () => {
    gsap.from('.header', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    inicializarJuego();
});