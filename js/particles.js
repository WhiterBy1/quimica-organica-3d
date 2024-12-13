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

// Configuración general de particles.js
particlesJS('particles-js',
    {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#4CAF50"
            },
            "shape": {
                "type": "circle"
            },
            "opacity": {
                "value": 0.5,
                "random": false
            },
            "size": {
                "value": 3,
                "random": true
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#4CAF50",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "repulse"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            }
        },
        "retina_detect": true
    });

