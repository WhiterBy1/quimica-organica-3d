const particleBackground = document.querySelector('.particle-background');

function createParticle() {
    const particle = document.createElement('span');
    const size = Math.random() * 5 + 2; // Tamaño de partícula entre 2 y 7px
    const posX = Math.random() * window.innerWidth;
    const delay = Math.random() * 5; // Retraso de animación
    const duration = Math.random() * 5 + 3; // Duración de animación entre 3 y 8s

    particle.classList.add('particle');
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}px`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;

    particleBackground.appendChild(particle);

    // Eliminar la partícula después de la animación para limpiar el DOM
    setTimeout(() => {
        particle.remove();
    }, (duration + delay) * 1000);
}

// Crear partículas cada 300 ms
setInterval(createParticle, 300);
