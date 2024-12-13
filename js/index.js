    // Animaciones con GSAP
    document.addEventListener('DOMContentLoaded', () => {
        const cards = document.querySelectorAll('.topic-card');

        // Animación de entrada de las tarjetas
        gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
        });

        // Evento para mostrar/ocultar subtemas con animación
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const subtopicList = card.querySelector('.subtopic-list');
                const isActive = subtopicList.classList.contains('active');

                // Cerrar todas las listas primero
                document.querySelectorAll('.subtopic-list').forEach(list => {
                    if (list !== subtopicList) {
                        list.classList.remove('active');
                        gsap.to(list, {
                            height: 0,
                            opacity: 0,
                            duration: 0.3,
                            ease: "power2.inOut"
                        });
                    }
                });

                // Alternar la lista actual
                if (!isActive) {
                    subtopicList.classList.add('active');
                    gsap.fromTo(subtopicList,
                        {
                            height: 0,
                            opacity: 0
                        },
                        {
                            height: "auto",
                            opacity: 1,
                            duration: 0.5,
                            ease: "power2.inOut"
                        }
                    );

                    // Animar los elementos de la lista
                    gsap.fromTo(subtopicList.children,
                        {
                            x: -20,
                            opacity: 0
                        },
                        {
                            x: 0,
                            opacity: 1,
                            duration: 0.4,
                            stagger: 0.1,
                            ease: "power2.out"
                        }
                    );
                } else {
                    subtopicList.classList.remove('active');
                    gsap.to(subtopicList, {
                        height: 0,
                        opacity: 0,
                        duration: 0.3,
                        ease: "power2.inOut"
                    });
                }
            });

            // Efecto hover en las tarjetas
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    });