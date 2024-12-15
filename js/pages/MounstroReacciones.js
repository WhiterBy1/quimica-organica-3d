const monsterElement = document.getElementById("monster");

const elements = [
    { symbol: "H", name: "Hidrógeno" },
    { symbol: "O", name: "Oxígeno" },
    { symbol: "C", name: "Carbono" },
    { symbol: "N", name: "Nitrógeno" },
    { symbol: "Cl", name: "Cloro" },
    { symbol: "Br", name: "Bromo" },
    { symbol: "I", name: "Yodo" },
    { symbol: "Na", name: "Sodio" },
    { symbol: "K", name: "Potasio" },
    { symbol: "Ag", name: "Plata" },
    { symbol: "Cu", name: "Cobre" },
    { symbol: "S", name: "Azufre" },
    { symbol: "Mn", name: "Manganeso" },
    { symbol: "Fe", name: "Hierro" },
    { symbol: "Ba", name: "Bario" }
];

const targetReagents = [
    {
        formula: ["H", "Cl"],
        name: "Ácido Clorhídrico (HCl)",
        description: "Prueba de pH ácido, reacciona con metales como zinc y magnesio, liberando gas hidrógeno."
    },
    {
        formula: ["Ag", "N", "H", "H", "N", "H", "H", "H", "H"],
        name: "Reactivo de Tollens (Ag(NH₃)₂⁺)",
        description: "Prueba cualitativa para aldehídos, forma un espejo de plata en presencia de aldehídos."
    },
    {
        formula: ["Cu", "S", "O", "O", "O", "O"],
        name: "Reactivo de Benedict (CuSO₄)",
        description: "Detecta azúcares reductores como la glucosa, cambiando de azul a rojo ladrillo."
    },
    {
        formula: ["H", "N", "O", "O", "O"],
        name: "Ácido Nítrico (HNO₃)",
        description: "Oxida metales y reacciona con compuestos orgánicos, produciendo gases tóxicos."
    },
    {
        formula: ["C", "H", "I", "I", "I"],
        name: "Yodoformo (CHI₃)",
        description: "Prueba para grupos metilcetona, formando un precipitado amarillo característico."
    },
    {
        formula: ["Br", "Br"],
        name: "Bromo (Br₂)",
        description: "Se usa para detectar dobles enlaces en alquenos, desapareciendo el color marrón del bromo."
    },
    {
        formula: ["I", "I"],
        name: "Yodo Molecular (I₂)",
        description: "Detecta almidones al formar un complejo azul oscuro característico."
    },
    {
        formula: ["Fe", "Cl", "Cl", "Cl"],
        name: "Cloruro Férrico (FeCl₃)",
        description: "Prueba cualitativa para fenoles, desarrollando un color violeta en presencia de fenoles."
    },
    {
        formula: ["Na", "O", "H"],
        name: "Hidróxido de Sodio (NaOH)",
        description: "Base fuerte que reacciona con ácidos carboxílicos, formando sales solubles."
    },
    {
        formula: ["K", "Mn", "O", "O", "O", "O"],
        name: "Permanganato de Potasio (KMnO₄)",
        description: "Oxidante fuerte que cambia de violeta a incoloro al reaccionar con alquenos o alcoholes."
    },
    {
        formula: ["Ba", "Cl", "Cl"],
        name: "Cloruro de Bario (BaCl₂)",
        description: "Prueba cualitativa para sulfatos, formando un precipitado blanco de sulfato de bario (BaSO₄)."
    },
    {
        formula: ["H", "C", "O", "O", "H"],
        name: "Ácido Fórmico (HCOOH)",
        description: "Reactivo cualitativo para aldehídos, puede reducir el reactivo de Tollens formando un espejo de plata."
    },
    {
        formula: ["C", "H", "C", "l", "3"],
        name: "Cloroformo (CHCl₃)",
        description: "Solvente orgánico utilizado en pruebas de solubilidad para compuestos polares y no polares."
    }
];

let currentMolecule = [];
let score = 0;
let currentTargetIndex = 0;

const moleculeContainer = document.getElementById("current-molecule");
const targetNameElement = document.getElementById("target-name");
const scoreElement = document.getElementById("score");
const messageElement = document.getElementById("message");
const explanationElement = document.getElementById("explanation");

function addElement(symbol) {
    currentMolecule.push(symbol);
    updateMoleculeDisplay();
}

function updateMoleculeDisplay() {
    moleculeContainer.textContent = currentMolecule.join(" - ");
}

function clearMolecule() {
    currentMolecule = [];
    updateMoleculeDisplay();
}

function checkMolecule() {
    const target = targetReagents[currentTargetIndex];
    const sortedCurrent = [...currentMolecule].map(e => e.trim()).sort();
    const sortedTarget = [...target.formula].map(e => e.trim()).sort();

    const isCorrect = sortedCurrent.length === sortedTarget.length &&
        sortedCurrent.every((val, index) => val === sortedTarget[index]);

    if (isCorrect) {
        score++;
        scoreElement.textContent = score;
        const feedbackMessage = document.getElementById("feedback-message");
        feedbackMessage.innerHTML = `
                    <h2>¡Correcto!</h2>
                    <p>¡El monstruo está feliz y bien alimentado!</p>
                    <h3>${target.name}</h3>
                    <p>${target.description}</p>
                    <button id="next-btn" class="next-btn">Siguiente Desafío</button>
                `;
        feedbackMessage.style.display = "block";
        monsterElement.classList.add("happy");
        document.getElementById("next-btn").onclick = nextTarget;
    } else {
        messageElement.textContent = "¡Incorrecto! Intenta de nuevo.";
        monsterElement.classList.add("sad");
        setTimeout(() => {
            monsterElement.classList.remove("sad");
        }, 2000);
    }
}

function nextTarget() {
    clearMolecule();
    monsterElement.classList.remove("happy");
    currentTargetIndex = (currentTargetIndex + 1) % targetReagents.length;
    targetNameElement.textContent = targetReagents[currentTargetIndex].name;
    document.getElementById("feedback-message").style.display = "none";
    messageElement.textContent = "¡Alimenta al monstruo con el reactivo correcto!";
}

elements.forEach(element => {
    const button = document.createElement("button");
    button.textContent = `${element.symbol} - ${element.name}`;
    button.className = "element-btn";
    button.onclick = () => addElement(element.symbol);
    document.getElementById("elements-grid").appendChild(button);
});

document.getElementById("clear-btn").onclick = clearMolecule;
document.getElementById("check-btn").onclick = checkMolecule;
targetNameElement.textContent = targetReagents[currentTargetIndex].name;