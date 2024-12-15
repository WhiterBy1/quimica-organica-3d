const IUPAC_GROUPS = [
    { group: 'CH3-CH2-OH', ending: '-ol', name: 'Alcohol' },
    { group: 'CH3-C=O', ending: '-al', name: 'Aldehído' },
    { group: 'CH3-C(=O)-OH', ending: '-oico', name: 'Ácido carboxílico' },
    { group: 'CH3-C(=O)-O-CH3', ending: '-oato', name: 'Éster' },
    { group: 'CH3-NH2', ending: '-amina', name: 'Amina' },
    { group: 'CH3-C≡N', ending: '-nitrilo', name: 'Nitrilo' },
    { group: 'CH2=CH2', ending: '-eno', name: 'Alqueno' },
    { group: 'CH≡CH', ending: '-ino', name: 'Alquino' },
    { group: 'CH3-C(=O)-CH3', ending: '-ona', name: 'Cetona' },
    { group: 'CH3-O-CH3', ending: '-éter', name: 'Éter' }
];

let score = 0;
let level = 1;
let lives = 3;
let gameInterval;
let molecules = [];
let activeOptions = [];
let selectedEnding = null;
let gameSpeed = 7000; // Cambiado a 7000ms
let isGameActive = false;

function getRandomGroups(count) {
    const shuffled = [...IUPAC_GROUPS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function updateOptions() {
    // Obtener grupos actualmente en pantalla
    const fallingGroups = molecules.map(m => m.ending);

    // Asegurarse de que las opciones incluyan los grupos que están cayendo
    let newOptions = [...new Set([...fallingGroups])];

    // Añadir grupos aleatorios hasta tener 4 opciones
    while (newOptions.length < 4) {
        const randomGroup = IUPAC_GROUPS[Math.floor(Math.random() * IUPAC_GROUPS.length)];
        if (!newOptions.includes(randomGroup.ending)) {
            newOptions.push(randomGroup.ending);
        }
    }

    // Mezclar las opciones
    newOptions = newOptions.sort(() => 0.5 - Math.random());

    // Actualizar los botones
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    newOptions.forEach(ending => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = ending;
        if (ending === selectedEnding) {
            button.classList.add('selected');
        }
        button.onclick = () => selectEnding(ending);
        optionsContainer.appendChild(button);
    });

    activeOptions = newOptions;
}

function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    resetGame();
    isGameActive = true;
    updateOptions();
    spawnMolecule();
    updateDisplay();
}

function resetGame() {
    score = 0;
    level = 1;
    lives = 3;
    gameSpeed = 7000; // Actualizado a 7000ms
    molecules = [];
    selectedEnding = null;
    clearInterval(gameInterval);
    document.getElementById('gameArea').innerHTML = '';
    updateDisplay();
}

function selectEnding(ending) {
    selectedEnding = selectedEnding === ending ? null : ending;
    document.querySelectorAll('.option-button').forEach(button => {
        button.classList.remove('selected');
        if (button.textContent === ending && selectedEnding === ending) {
            button.classList.add('selected');
        }
    });
}

function spawnMolecule() {
    if (!isGameActive) return;

    // Limitar el número de moléculas en pantalla
    if (molecules.length >= 4) return;

    const gameArea = document.getElementById('gameArea');
    const availableWidth = gameArea.clientWidth - 100;

    // Elegir un grupo que coincida con una de las opciones activas o actualizar opciones
    let randomGroup;
    do {
        randomGroup = IUPAC_GROUPS[Math.floor(Math.random() * IUPAC_GROUPS.length)];
    } while (molecules.some(m => m.group === randomGroup.group));

    const molecule = document.createElement('div');
    molecule.className = 'molecule falling';
    molecule.innerHTML = `${randomGroup.group}<br>${randomGroup.name}`;
    molecule.style.left = Math.random() * availableWidth + 'px';
    molecule.style.animationDuration = `${gameSpeed}ms`;
    molecule.dataset.ending = randomGroup.ending;
    molecule.onclick = () => checkMolecule(molecule, randomGroup);

    gameArea.appendChild(molecule);
    molecules.push({
        element: molecule,
        group: randomGroup.group,
        ending: randomGroup.ending
    });

    updateOptions();

    molecule.addEventListener('animationend', () => {
        if (gameArea.contains(molecule)) {
            gameArea.removeChild(molecule);
            molecules = molecules.filter(m => m.element !== molecule);
            loseLife();
            updateOptions();
        }
    });

    // Aumentar el intervalo entre spawns y añadir más variación
    setTimeout(spawnMolecule, Math.random() * 2000 + 2000);
}

function checkMolecule(moleculeElement, group) {
    if (selectedEnding === group.ending) {
        createExplosion(moleculeElement);
        moleculeElement.remove();
        molecules = molecules.filter(m => m.element !== moleculeElement);
        addPoints(10);
        updateOptions();
    } else if (selectedEnding !== null) {
        shake(moleculeElement);
        loseLife();
    }
}

function createExplosion(element) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.left = element.style.left;
    explosion.style.top = element.style.top;
    explosion.innerHTML = '🎯';
    document.getElementById('gameArea').appendChild(explosion);
    setTimeout(() => explosion.remove(), 500);
}

function shake(element) {
    element.style.animation = 'none';
    element.offsetHeight;
    element.style.animation = null;
}

function addPoints(points) {
    score += points;
    if (score % 100 === 0) {
        levelUp();
    }
    updateDisplay();
}

function levelUp() {
    level++;
    gameSpeed = Math.max(3000, gameSpeed - 300); // Reducción más gradual y límite mínimo aumentado
    molecules.forEach(molecule => {
        molecule.element.style.animationDuration = `${gameSpeed}ms`;
    });
}

function loseLife() {
    lives--;
    updateDisplay();
    if (lives <= 0) {
        endGame();
    }
}

function endGame() {
    isGameActive = false;
    clearInterval(gameInterval);
    document.getElementById('endScreen').style.display = 'flex';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalLevel').textContent = level;
}

function restartGame() {
    document.getElementById('endScreen').style.display = 'none';
    startGame();
}

function updateDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lives').textContent = lives;
}

window.addEventListener('resize', () => {
    const gameArea = document.getElementById('gameArea');
    const availableWidth = gameArea.clientWidth - 100;
    molecules.forEach(molecule => {
        const currentLeft = parseInt(molecule.element.style.left);
        if (currentLeft > availableWidth) {
            molecule.element.style.left = availableWidth + 'px';
        }
    });
});