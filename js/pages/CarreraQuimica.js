const molecules = [
    {
        structure: `CH3-CH2-CH3`,
        name: "propano",
        difficulty: 1,
        hint: "Alcano de 3 carbonos"
    },
    {
        structure: `CH3-CH2-OH`,
        name: "etanol",
        difficulty: 1,
        hint: "Alcohol de 2 carbonos"
    },
    {
        structure: `CH3-COOH`,
        name: "acido etanoico",
        difficulty: 1,
        hint: "Ácido carboxílico de 2 carbonos"
    },
    {
        structure: `CH3-CH2-CHO`,
        name: "propanal",
        difficulty: 1,
        hint: "Aldehído de 3 carbonos"
    },
    {
        structure: `CH3-CO-CH3`,
        name: "propanona",
        difficulty: 1,
        hint: "Cetona de 3 carbonos"
    },
    {
        structure: `CH3-CH2-CH2-CH2-OH`,
        name: "butanol",
        difficulty: 1,
        hint: "Alcohol de 4 carbonos"
    },
    {
        structure: `CH3-CH=CH2`,
        name: "propeno",
        difficulty: 1,
        hint: "Alqueno de 3 carbonos"
    },
    {
        structure: `CH3-CH2-NH2`,
        name: "etilamina",
        difficulty: 1,
        hint: "Amina de 2 carbonos"
    },
    {
        structure: `CH3-O-CH3`,
        name: "dimetileter",
        difficulty: 1,
        hint: "Éter con 2 grupos metilo"
    }
];

let currentMolecule;
let score = 0;
let streak = 0;
let attempts = 0;
let correct = 0;
let gameActive = true;
let level = 1;
let hintUsed = false;
let computerSpeed = 2;

const playerMolecule = document.getElementById('playerMolecule');
const computerMolecule = document.getElementById('computerMolecule');
const userInput = document.getElementById('userInput');
const structureDisplay = document.getElementById('structureDisplay');
const scoreDisplay = document.getElementById('scoreValue');
const streakDisplay = document.getElementById('streakValue');
const accuracyDisplay = document.getElementById('accuracyValue');
const progressFill = document.getElementById('progressFill');
const feedback = document.getElementById('feedback');

const tutorialModal = document.getElementById('tutorialModal');
const tutorialButton = document.getElementById('tutorialButton');
const closeBtn = document.querySelector('.close-btn');

// Función para mostrar el tutorial siempre al cargar la página
function showTutorial() {
    tutorialModal.style.display = "block";
    tutorialModal.classList.add('visible');
}

// Función para ocultar el tutorial y luego iniciar el juego
function hideTutorial() {
    tutorialModal.classList.remove('visible');
    setTimeout(() => {
        tutorialModal.style.display = "none";
        startGame(); // Iniciar el juego después de cerrar el tutorial
    }, 300);
}

// Mostrar el tutorial al cargar la página
window.addEventListener('load', showTutorial);

// Manejo del botón de cierre del tutorial
closeBtn.addEventListener('click', hideTutorial);

// Cerrar el tutorial si el usuario hace clic fuera del modal
window.addEventListener('click', (event) => {
    if (event.target === tutorialModal) {
        hideTutorial();
    }
});

// Función para iniciar el juego
function startGame() {
    selectNewMolecule();
    gameActive = true;
}

// Función para seleccionar una nueva molécula
function selectNewMolecule() {
    const availableMolecules = molecules.filter(m => m.difficulty <= level);
    currentMolecule = availableMolecules[Math.floor(Math.random() * availableMolecules.length)];
    structureDisplay.textContent = currentMolecule.structure;
    hintUsed = false;
    resetPositions();
    moveComputer();

    // Resetear el botón de pista
    hintButton.style.opacity = '1';
    hintButton.style.cursor = 'pointer';
}



const hintButton = document.getElementById('hintButton');
hintButton.addEventListener('click', () => {
    if (!hintUsed && gameActive) {
        hintUsed = true;
        feedback.textContent = 'Pista: ' + currentMolecule.hint;
        feedback.style.color = '#f1c40f';
        hintButton.style.opacity = '0.5';
        hintButton.style.cursor = 'not-allowed';
    }
});

// Gestión de primera visita
function isFirstVisit() {
    const visited = localStorage.getItem('chemistryraceVisited');
    return !visited || visited === 'false';
}



function showTutorial() {
    tutorialModal.style.display = "block";
    // Forzar un reflow para que la animación funcione
    tutorialModal.offsetHeight;
    tutorialModal.classList.add('visible');
}

function hideTutorial() {
    tutorialModal.classList.remove('visible');
    setTimeout(() => {
        tutorialModal.style.display = "none";
    }, 300); // Mismo tiempo que la transición CSS
}
function createParticles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = (x + (Math.random() - 0.5) * 40) + 'px';
        particle.style.top = (y + (Math.random() - 0.5) * 40) + 'px';
        particle.style.width = (4 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = color;
        particle.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.getElementById('raceTrack').appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

function showBonus(x, y, text, color = '#4CAF50') {
    const bonus = document.createElement('div');
    bonus.className = 'bonus-text';
    bonus.style.left = x + 'px';
    bonus.style.top = y + 'px';
    bonus.style.color = color;
    bonus.textContent = text;
    document.getElementById('raceTrack').appendChild(bonus);
    setTimeout(() => bonus.remove(), 1000);
}

function resetPositions() {
    playerMolecule.style.left = '0px';
    computerMolecule.style.left = '0px';
}


function updateStats(points) {
    score += points;
    streak = points > 0 ? streak + 1 : 0;
    attempts++;
    correct += points > 0 ? 1 : 0;
    scoreDisplay.textContent = score;
    streakDisplay.textContent = streak;
    accuracyDisplay.textContent = Math.round((correct / attempts) * 100) + '%';
    progressFill.style.width = ((score % 100) / 100 * 100) + '%';

    // Nivel del juego aumenta cada 100 puntos
    if (score > 0 && score % 100 === 0) {
        level = Math.min(5, Math.floor(score / 100) + 1);
        document.getElementById('levelIndicator').textContent = `Nivel ${level}`;
        computerSpeed += 1; // Incrementa la velocidad del competidor
    }
}

function moveComputer() {
    if (!gameActive) return;
    const currentLeft = parseInt(computerMolecule.style.left || 0);
    if (currentLeft < 760) {
        computerMolecule.style.left = (currentLeft + computerSpeed) + 'px';
        setTimeout(moveComputer, 50);
    } else {
        endRound(false);
    }
}

function checkAnswer(input) {
    return input.toLowerCase().trim() === currentMolecule.name;
}

function endRound(playerWon) {
    gameActive = false;
    attempts++;

    if (playerWon) {
        correct++;
        streak++;
        const points = 10 + (streak * 2) + (level * 5) - (hintUsed ? 5 : 0);
        createParticles(parseInt(playerMolecule.style.left), 300, '#4CAF50');
        showBonus(parseInt(playerMolecule.style.left), 250, `+${points}`);
        updateStats(points);
        feedback.textContent = '¡Correcto! ' + (hintUsed ? '(con pista)' : '');
        feedback.style.color = '#4CAF50';
    } else {
        streak = 0;
        updateStats(-5);
        feedback.textContent = `Incorrecto. La respuesta era: ${currentMolecule.name}`;
        feedback.style.color = '#FF5722';
    }

    userInput.value = '';
    setTimeout(() => {
        gameActive = true;
        selectNewMolecule();
    }, 2000);
}

userInput.addEventListener('input', (e) => {
    if (!gameActive) return;
    const input = e.target.value;
    const currentLeft = parseInt(playerMolecule.style.left || 0);

    if (checkAnswer(input)) {
        playerMolecule.style.left = '760px';
        endRound(true);
    } else if (input.length > 0) {
        const progress = Math.min(input.length * 40, 760);
        playerMolecule.style.left = progress + 'px';
    }
});

// Gestionar la opción de "No volver a mostrar"
const dontShowAgainCheckbox = document.getElementById('dontShowAgain');

dontShowAgainCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
        localStorage.setItem('chemistryraceVisited', 'permanent');
    } else {
        localStorage.setItem('chemistryraceVisited', 'true');
    }
});

// Mostrar tutorial en primera visita
if (isFirstVisit()) {
    showTutorial();
}

// Iniciar el juego
selectNewMolecule();

// Tutorial Modal

tutorialButton.addEventListener('click', showTutorial);
closeBtn.addEventListener('click', hideTutorial);

window.addEventListener('click', (event) => {
    if (event.target === tutorialModal) {
        hideTutorial();
    }
});
