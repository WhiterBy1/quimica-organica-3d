const PREFIJOS = {
    1: 'met',
    2: 'et',
    3: 'prop',
    4: 'but',
    5: 'pent',
    6: 'hex',
    7: 'hept',
    8: 'oct',
    9: 'non',
    10: 'dec'
};

const SUFIJOS = {
    numerico: ['.', '.', '.'],
    carbono: ['ano', 'eno', 'ino']
};

const NIVELES = {
    facil: {
        tiempo: 10,
        numeros: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        puntosPorAcierto: 10,
        tipoPrefijo: 'numerico'
    },
    medio: {
        tiempo: 8,
        numeros: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        puntosPorAcierto: 20,
        tipoPrefijo: 'mixto'
    },
    dificil: {
        tiempo: 10,
        numeros: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        puntosPorAcierto: 30,
        tipoPrefijo: 'carbono'
    }
};

class PrefijoQuimico {
    constructor() {
        this.nivel = 'facil';
        this.numeroActual = null;
        this.tiempo = NIVELES[this.nivel].tiempo;
        this.puntos = 0;
        this.vidas = 3;
        this.mejorPuntaje = localStorage.getItem('mejorPuntaje') || 0;
        this.sufijoActual = 'ano'; 
        this.juegoActivo = false;
        this.temporizador = null;
        this.intervaloBarra = null;
        this.sufijoActual = null;
        this.inicializarEventos();
        this.actualizarMejorPuntaje();
    }

    inicializarEventos() {
        document.getElementById('startButton').addEventListener('click', () => this.iniciarJuego());

        document.querySelectorAll('.difficulty-button').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-button').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.nivel = e.target.dataset.difficulty;
                this.tiempo = NIVELES[this.nivel].tiempo;
                document.getElementById('timeDisplay').textContent = this.tiempo;
            });
        });
    }

    generarNumeroAleatorio() {
        const numerosNivel = NIVELES[this.nivel].numeros;
        return numerosNivel[Math.floor(Math.random() * numerosNivel.length)];
    }

    determinarTipoPrefijo() {
        const nivelActual = NIVELES[this.nivel];
        if (nivelActual.tipoPrefijo === 'numerico') {
            return 'numerico';
        } else if (nivelActual.tipoPrefijo === 'carbono') {
            return 'carbono';
        } else {
            // Para el nivel mixto, alternar aleatoriamente
            return Math.random() < 0.5 ? 'numerico' : 'carbono';
        }
    }

    generarPrefijosAleatorios(numeroCorrect) {
        this.tipoActual = this.determinarTipoPrefijo();
        const prefijosDiccionario = this.tipoActual === 'numerico' ? PREFIJOS : CADENAS_CARBONO;
        const prefijosCopia = { ...prefijosDiccionario };
        delete prefijosCopia[numeroCorrect];
        const prefijosArray = Object.values(prefijosCopia);
        const prefijosSeleccionados = [];

        prefijosSeleccionados.push(prefijosDiccionario[numeroCorrect]);

        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * prefijosArray.length);
            prefijosSeleccionados.push(prefijosArray[randomIndex]);
            prefijosArray.splice(randomIndex, 1);
        }

        return prefijosSeleccionados.sort(() => Math.random() - 0.5);
    }

    actualizarUI() {
        document.getElementById('timeDisplay').textContent = this.tiempo;
        document.getElementById('scoreDisplay').textContent = this.puntos;
        document.getElementById('livesDisplay').textContent = this.vidas;
        document.getElementById('numberDisplay').textContent = this.numeroActual;

        // Usar el sufijo constante para esta ronda
        const tipoTexto = this.tipoActual === 'numerico' ? '' : this.sufijoActual;
        document.getElementById('numberDisplay').setAttribute('data-tipo', tipoTexto);
        document.getElementById('progressBar').style.width = `${(this.tiempo / NIVELES[this.nivel].tiempo) * 100}%`;
    }



    crearBotonesOpciones(prefijos) {
        const optionsGrid = document.getElementById('optionsGrid');
        optionsGrid.innerHTML = '';

        // Reiniciar animación para evitar conflictos
        optionsGrid.style.animation = 'none';

        prefijos.forEach(prefijo => {
            const button = document.createElement('button');
            button.className = 'option-button';

            // Usar el sufijo constante de la ronda
            const sufijo = this.tipoActual === 'numerico' ? '-' : this.sufijoActual;
            button.textContent = `${prefijo}${sufijo}`;
            button.addEventListener('click', () => this.verificarRespuesta(prefijo));
            optionsGrid.appendChild(button);
        });

        // Restaurar animación después de un pequeño retraso
        setTimeout(() => {
            optionsGrid.style.animation = '';
        }, 50);
    }




    verificarRespuesta(prefijoSeleccionado) {
        const prefijosDiccionario = this.tipoActual === 'numerico' ? PREFIJOS : CADENAS_CARBONO;
        const esCorrecta = prefijoSeleccionado === prefijosDiccionario[this.numeroActual];
        const sufijos = ['ano', 'eno', 'ino']; // Lista de sufijos posibles

        // Buscar el botón correspondiente ignorando el sufijo
        const botonSeleccionado = [...document.getElementsByClassName('option-button')]
            .find(button => {
                const buttonText = button.textContent;
                // Verificar si el texto del botón comienza con el prefijo seleccionado
                return sufijos.some(sufijo => buttonText === `${prefijoSeleccionado}${sufijo}`);
            });

        // Verificar si el botón existe antes de usarlo
        if (!botonSeleccionado) {
            console.warn('Botón no encontrado o ya eliminado del DOM.');
            return;
        }

        if (esCorrecta) {
            botonSeleccionado.classList.add('correct');
            this.puntos += NIVELES[this.nivel].puntosPorAcierto;
            setTimeout(() => this.siguienteRonda(), 500);
        } else {
            botonSeleccionado.classList.add('incorrect');
            this.vidas--;
            document.getElementById('gameArea').classList.add('shake');
            setTimeout(() => document.getElementById('gameArea').classList.remove('shake'), 500);

            if (this.vidas <= 0) {
                this.finalizarJuego();
            }
        }

        this.actualizarUI();
    }


    siguienteRonda() {
        this.numeroActual = this.generarNumeroAleatorio();
        const prefijos = this.generarPrefijosAleatorios(this.numeroActual);

        // Seleccionar un sufijo aleatorio solo al inicio de la ronda
        const sufijos = ['ano', 'eno', 'ino'];
        this.sufijoActual = this.tipoActual === 'numerico' ? '-' : sufijos[Math.floor(Math.random() * sufijos.length)];

        this.crearBotonesOpciones(prefijos);
        this.tiempo = NIVELES[this.nivel].tiempo;
        this.actualizarUI();

        // Reiniciar animación del número
        document.getElementById('numberDisplay').style.animation = 'none';
        setTimeout(() => {
            document.getElementById('numberDisplay').style.animation = 'numberPop 0.5s ease';
        }, 10);
    }


    finalizarJuego() {
        clearInterval(this.temporizador);
        this.juegoActivo = false;
        this.actualizarMejorPuntaje();
        document.getElementById('gameArea').style.display = 'none';
        document.getElementById('gameMenu').style.display = 'flex';
    }

    actualizarMejorPuntaje() {
        if (this.puntos > this.mejorPuntaje) {
            this.mejorPuntaje = this.puntos;
            localStorage.setItem('mejorPuntaje', this.mejorPuntaje);
        }
        document.getElementById('bestScoreValue').textContent = this.mejorPuntaje;
        document.getElementById('bestScore').style.display = '';
    }

    iniciarJuego() {
        this.juegoActivo = true;
        this.puntos = 0;
        this.vidas = 3;
        this.tiempo = NIVELES[this.nivel].tiempo;

        document.getElementById('gameMenu').style.display = 'none';
        document.getElementById('gameArea').style.display = 'block';

        this.actualizarEstadisticas();
        this.siguienteNumero();
        this.iniciarTemporizador();
    }

    iniciarTemporizador() {
        if (this.temporizador) clearInterval(this.temporizador);
        if (this.intervaloBarra) clearInterval(this.intervaloBarra);

        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = '100%';

        this.temporizador = setInterval(() => {
            this.tiempo--;
            document.getElementById('timeDisplay').textContent = this.tiempo;

            if (this.tiempo <= 0) {
                this.verificarRespuesta('timeout');
            }
        }, 1000);

        const intervaloActualizacion = 50;
        const decrementoProgreso = (100 / (NIVELES[this.nivel].tiempo * 1000)) * intervaloActualizacion;

        this.intervaloBarra = setInterval(() => {
            const anchoActual = parseFloat(progressBar.style.width) || 100;
            const nuevoAncho = Math.max(0, anchoActual - decrementoProgreso);
            progressBar.style.width = nuevoAncho + '%';
        }, intervaloActualizacion);
    }

    siguienteNumero() {
        const numerosNivel = NIVELES[this.nivel].numeros;
        this.numeroActual = numerosNivel[Math.floor(Math.random() * numerosNivel.length)];

        const displayElement = document.getElementById('numberDisplay');
        const tipoSufijo = NIVELES[this.nivel].tipoPrefijo === 'carbono' ? 'carbono' : 'numerico';
        this.sufijoActual = SUFIJOS[tipoSufijo][Math.floor(Math.random() * SUFIJOS[tipoSufijo].length)];

        // Mostrar el número junto con el sufijo
        displayElement.textContent = `${this.numeroActual}${this.sufijoActual}`;
        displayElement.style.animation = 'numberPop 0.5s ease-out';

        if (NIVELES[this.nivel].tipoPrefijo === 'carbono') {
            displayElement.dataset.tipo = 'C';
        } else {
            delete displayElement.dataset.tipo;
        }

        this.generarOpciones();
        this.tiempo = NIVELES[this.nivel].tiempo;
        this.actualizarEstadisticas();
        this.iniciarTemporizador();
    }

    generarOpciones() {
        const optionsGrid = document.getElementById('optionsGrid');
        optionsGrid.innerHTML = '';

        let opciones = [PREFIJOS[this.numeroActual]];
        let prefijosDisponibles = Object.values(PREFIJOS).filter(p => p !== PREFIJOS[this.numeroActual]);

        // Para el nivel medio, incluir opciones con y sin terminaciones
        if (this.nivel === 'medio') {
            const opcionesMedio = new Set();
            opcionesMedio.add(PREFIJOS[this.numeroActual]); // Agregar el prefijo correcto

            // Agregar algunas opciones con sufijo
            while (opcionesMedio.size < 4) {
                const randomPrefijo = prefijosDisponibles[Math.floor(Math.random() * prefijosDisponibles.length)];
                opcionesMedio.add(randomPrefijo);
            }

            opciones = [...opcionesMedio];
        } else {
            // Para otros niveles, mantener el comportamiento original
            for (let i = 0; i < 3; i++) {
                const randomIndex = Math.floor(Math.random() * prefijosDisponibles.length);
                opciones.push(prefijosDisponibles[randomIndex]);
                prefijosDisponibles.splice(randomIndex, 1);
            }
        }

        opciones = opciones.sort(() => Math.random() - 0.5);

        opciones.forEach(opcion => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = opcion;
            button.addEventListener('click', () => this.verificarRespuesta(opcion));
            optionsGrid.appendChild(button);
        });
    }

    verificarRespuesta(respuesta) {
        if (!this.juegoActivo) return;

        const esCorrecta = respuesta === PREFIJOS[this.numeroActual];
        const buttons = document.querySelectorAll('.option-button');

        buttons.forEach(button => {
            const prefijoBoton = button.textContent;
            if (prefijoBoton === PREFIJOS[this.numeroActual]) {
                button.classList.add('correct');
            } else if (prefijoBoton === respuesta) {
                button.classList.add('incorrect');
            }
            button.disabled = true;
        });

        clearInterval(this.temporizador);
        clearInterval(this.intervaloBarra);

        if (respuesta === 'timeout' || !esCorrecta) {
            this.vidas--;
            if (this.vidas <= 0) {
                this.terminarJuego();
                return;
            }
        } else {
            this.puntos += NIVELES[this.nivel].puntosPorAcierto;
        }

        this.actualizarEstadisticas();

        setTimeout(() => {
            if (this.juegoActivo) {
                this.siguienteNumero();
            }
        }, 1000);
    }

    actualizarEstadisticas() {
        document.getElementById('scoreDisplay').textContent = this.puntos;
        document.getElementById('livesDisplay').textContent = this.vidas;
        document.getElementById('timeDisplay').textContent = this.tiempo;
    }

    terminarJuego() {
        this.juegoActivo = false;
        clearInterval(this.temporizador);
        clearInterval(this.intervaloBarra);

        this.actualizarMejorPuntaje();

        setTimeout(() => {
            alert(`¡Juego terminado! Puntuación final: ${this.puntos}`);
            document.getElementById('gameArea').style.display = 'none';
            document.getElementById('gameMenu').style.display = 'block';
        }, 1000);
    }
}

// Iniciar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const game = new PrefijoQuimico();
});