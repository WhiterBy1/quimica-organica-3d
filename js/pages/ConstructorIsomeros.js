
class Atom {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.bonds = [];
        this.bondCount = 0;
        this.element = this.createElement();
    }

    createElement() {
        const atom = document.createElement('div');
        atom.className = 'atom';
        atom.setAttribute('data-type', this.type);
        atom.style.left = `${this.x}px`;
        atom.style.top = `${this.y}px`;
        atom.textContent = this.type;
        return atom;
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }
}

class Bond {
    constructor(atom1, atom2, bondType = 1, gameInstance) {
        this.atom1 = atom1;
        this.atom2 = atom2;
        this.bondType = bondType;
        this.element = null;
        this.game = gameInstance;
        this.createElement();
    }

    createElement() {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('stroke', 'rgba(255, 255, 255, 0.5)');
        this.element = line;
        this.updateStroke();
        this.updatePosition();
    }

    updatePosition() {
        this.element.setAttribute('x1', this.atom1.x);
        this.element.setAttribute('y1', this.atom1.y);
        this.element.setAttribute('x2', this.atom2.x);
        this.element.setAttribute('y2', this.atom2.y);
    }

    updateStroke() {
        switch (this.bondType) {
            case 1:
                this.element.setAttribute('stroke-width', '2');
                break;
            case 2:
                this.element.setAttribute('stroke-width', '4');
                break;
            case 3:
                this.element.setAttribute('stroke-width', '6');
                break;
        }
    }

    incrementBond() {
        if (this.bondType < 3) {
            const newBondType = this.bondType + 1;
            if (this.atom1.bondCount + 1 > (this.atom1.type === 'C' ? 4 : this.atom1.type === 'O' ? 2 : 1) ||
                this.atom2.bondCount + 1 > (this.atom2.type === 'C' ? 4 : this.atom2.type === 'O' ? 2 : 1)) {
                alert('No se puede incrementar el enlace, supera el máximo de enlaces permitidos.');
                return;
            }

            this.bondType = newBondType;
            this.atom1.bondCount += 1;
            this.atom2.bondCount += 1;
            this.updateStroke();
        } else {
            this.game.removeBond(this.atom1, this.atom2);
        }
    }


    remove() {
        this.element.remove();
        this.atom1.bonds = this.atom1.bonds.filter(bond => bond !== this);
        this.atom2.bonds = this.atom2.bonds.filter(bond => bond !== this);
        this.atom1.bondCount -= this.bondType;
        this.atom2.bondCount -= this.bondType;
    }
}

class IsomerGame {
    constructor() {
        this.atoms = [];
        this.bonds = [];
        this.selectedAtom = null;
        this.connectMode = false;
        this.firstAtomForBond = null;
        this.limits = { C: 5, O: 2, H: 12 };
        this.counters = { C: 0, O: 0, H: 0 };
        this.isDragging = false;
        this.uniqueIsomers = []; // Lista de isómeros registrados
        this.carbonConnections = {}; // Almacenará las conexiones de cada carbono
        this.uniqueIsomers = []; // Lista de isómeros registrados

        this.initializeDOM();
        this.addEventListeners();
        this.setupWorkspaceSize();
        this.selectRandomCombination();
    }

    // Combinaciones predefinidas
    combinations = [
        { C: 2, H: 6, O: 1 },  // Etanol o Dimetil éter
        { C: 3, H: 8, O: 0 },  // Propano
        { C: 2, H: 4, O: 2 },  // Ácido acético o Éter dimetílico
        { C: 4, H: 10, O: 0 }, // Butano
        { C: 3, H: 6, O: 1 }   // Propanona (Acetona)
    ];

    // Seleccionar una combinación al azar
    // Seleccionar una combinación al azar
    selectRandomCombination() {
        // Reiniciar la lista de isómeros registrados para la nueva combinación
        this.uniqueIsomers = [];
        const randomIndex = Math.floor(Math.random() * this.combinations.length);
        this.currentCombination = this.combinations[randomIndex];

        this.updateCombinationDisplay();
        console.log("Combinación actual:", this.currentCombination);
    }

    // Registrar una conexión entre dos carbonos
    connectCarbons(id1, id2) {
        if (!this.carbonConnections[id1]) this.carbonConnections[id1] = [];
        if (!this.carbonConnections[id2]) this.carbonConnections[id2] = [];

        this.carbonConnections[id1].push(id2);
        this.carbonConnections[id2].push(id1);

        console.log(`Conexión registrada: C${id1} <-> C${id2}`);

        // Debug para mostrar el estado de conexiones
        console.log("Estado actual de conexiones:", this.carbonConnections);
    }


    // Identificar la cadena principal y las ramificaciones
    analyzeStructure() {
        const mainChain = [];
        const branches = [];
        const visited = new Set();

        // Función para identificar el tipo de carbono
        const getCarbonType = (carbonId) => {
            const connections = this.carbonConnections[carbonId];
            if (connections.length === 1) return 'inicio/final';
            if (connections.length === 2) return 'lineal';
            if (connections.length >= 3) return 'ramificación';
            return 'desconocido';
        };

        // Explorar los carbonos para identificar la cadena principal y ramificaciones
        Object.keys(this.carbonConnections).forEach(id => {
            const carbonType = getCarbonType(id);
            if (carbonType === 'inicio/final' && !visited.has(id)) {
                const chain = [];
                let currentId = parseInt(id);

                while (currentId !== undefined && !visited.has(currentId)) {
                    visited.add(currentId);
                    chain.push(currentId);

                    const nextCarbons = this.carbonConnections[currentId].filter(c => !visited.has(c));
                    if (nextCarbons.length === 1) {
                        currentId = nextCarbons[0];
                    } else {
                        branches.push(nextCarbons);
                        break;
                    }
                }

                if (chain.length > mainChain.length) {
                    mainChain.length = 0;
                    mainChain.push(...chain);
                }
            }
        });

        console.log("Cadena principal identificada:", mainChain);
        console.log("Ramificaciones identificadas:", branches);
        return { mainChain, branches };
    }


    updateButtonState(type, limit) {
        const counterIds = {
            'C': 'carbon-counter',
            'O': 'oxygen-counter',
            'H': 'hydrogen-counter'
        };

        const buttonIds = {
            'C': 'add-carbon',
            'O': 'add-oxygen',
            'H': 'add-hydrogen'
        };

        const counterElement = document.getElementById(counterIds[type]);
        const button = document.getElementById(buttonIds[type]);

        if (limit === 0) {
            // Deshabilitar el botón y cambiar el estilo si el límite es 0
            counterElement.style.color = '#666'; // Gris
            button.disabled = true;
            button.style.backgroundColor = '#666';
        } else {
            // Habilitar el botón si el límite es mayor a 0
            counterElement.style.color = '#FFF'; // Blanco
            button.disabled = false;
            button.style.backgroundColor = 'var(--primary)';
        }
    }


    // Actualizar la interfaz con la combinación actual
    updateCombinationDisplay() {
        const { C, H, O } = this.currentCombination;

        // Actualizar los contadores visuales
        document.getElementById('carbon-counter').textContent = `0/${C}`;
        document.getElementById('oxygen-counter').textContent = `0/${O}`;
        document.getElementById('hydrogen-counter').textContent = `0/${H}`;

        // Actualizar el botón y contador para cada tipo de átomo
        this.updateButtonState('C', C);
        this.updateButtonState('O', O);
        this.updateButtonState('H', H);

        // **Actualizar la información de la combinación actual**
        const combinationInfo = document.getElementById('combination-info');
        if (combinationInfo) {
            combinationInfo.textContent = `C: ${C}, H: ${H}, O: ${O}`;
        }
    }



    initializeDOM() {
        this.workspace = document.querySelector('.workspace');
        this.bondsLayer = document.getElementById('bonds-layer');
        this.atomsLayer = document.getElementById('atoms-layer');
    }

    setupWorkspaceSize() {
        const updateSize = () => {
            const rect = this.workspace.getBoundingClientRect();
            this.bondsLayer.setAttribute('width', rect.width);
            this.bondsLayer.setAttribute('height', rect.height);
        };
        updateSize();
        window.addEventListener('resize', updateSize);
    }

    addEventListeners() {
        // Manejar los botones de modo (Mover, Conectar y Eliminar Enlace)
        document.querySelectorAll('.mode-button').forEach(button => {
            button.addEventListener('click', () => {
                const mode = button.dataset.mode;

                // Actualizar los modos según el botón seleccionado
                this.connectMode = mode === 'connect';
                this.deleteMode = mode === 'delete';

                // Desactivar el modo de eliminación cuando se selecciona otro botón
                if (mode !== 'delete') {
                    this.deleteMode = false;
                }

                // Actualizar el estado visual de los botones
                document.querySelectorAll('.mode-button').forEach(btn =>
                    btn.classList.toggle('active', btn.dataset.mode === mode)
                );
            });
        });

        // Manejar los botones para añadir átomos
        document.getElementById('add-carbon').addEventListener('click', () => this.addAtom('C'));
        document.getElementById('add-oxygen').addEventListener('click', () => this.addAtom('O'));
        document.getElementById('add-hydrogen').addEventListener('click', () => this.addAtom('H'));
        document.getElementById('validate').addEventListener('click', () => this.validateMolecule());
        document.getElementById('clear').addEventListener('click', () => this.clearWorkspace());

        // Prevenir el comportamiento por defecto en dispositivos táctiles
        this.workspace.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
        this.workspace.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    }


    addAtom(type) {
        if (!this.currentCombination || this.counters[type] >= this.currentCombination[type]) return;

        const rect = this.workspace.getBoundingClientRect();
        const atom = new Atom(type, rect.width / 2, rect.height / 2);

        this.atoms.push(atom);
        this.atomsLayer.appendChild(atom.element);
        this.updateCounter(type, 1);

        // Añadir eventos para arrastrar el átomo
        atom.element.addEventListener('mousedown', (e) => this.handleAtomStart(e, atom));
        atom.element.addEventListener('touchstart', (e) => this.handleAtomStart(e, atom), { passive: false });
    }


    removeBond(atom1, atom2) {
        const bondIndex = this.bonds.findIndex(bond =>
            (bond.atom1 === atom1 && bond.atom2 === atom2) ||
            (bond.atom1 === atom2 && bond.atom2 === atom1)
        );

        if (bondIndex !== -1) {
            const bond = this.bonds[bondIndex];
            const bondType = bond.bondType;

            // Eliminar el enlace del DOM
            bond.remove();
            this.bonds.splice(bondIndex, 1);

            // Actualizar el contador de enlaces de los átomos
            atom1.bondCount -= bondType;
            atom2.bondCount -= bondType;
        }
    }


    handleAtomStart(e, atom) {
        e.preventDefault();

        if (this.deleteMode) {
            if (!this.firstAtomForBond) {
                this.firstAtomForBond = atom;
                atom.element.classList.add('selected');
            } else {
                if (this.firstAtomForBond !== atom) {
                    const bond = this.findBond(this.firstAtomForBond, atom);
                    if (bond) {
                        this.removeBond(this.firstAtomForBond, atom);
                        this.showStatusMessage('Enlace eliminado exitosamente.');
                    } else {
                        this.showStatusMessage('No hay enlace entre los átomos seleccionados.');
                    }
                }

                // Restablecer la selección
                this.firstAtomForBond.element.classList.remove('selected');
                this.firstAtomForBond = null;
            }
        } else if (this.connectMode) {
            this.handleBondCreation(atom);
        } else {
            this.selectedAtom = atom;
            this.isDragging = true;

            const pos = this.getEventPosition(e);
            this.offsetX = pos.x - atom.x;
            this.offsetY = pos.y - atom.y;

            document.addEventListener('mousemove', this.handleMove);
            document.addEventListener('mouseup', this.handleEnd);
            document.addEventListener('touchmove', this.handleMove, { passive: false });
            document.addEventListener('touchend', this.handleEnd);
        }
    }


    handleMove = (e) => {
        if (!this.isDragging || !this.selectedAtom) return;
        e.preventDefault();

        const pos = this.getEventPosition(e);
        const rect = this.workspace.getBoundingClientRect();

        let x = pos.x - this.offsetX;
        let y = pos.y - this.offsetY;

        // Constrain to workspace boundaries
        x = Math.max(0, Math.min(rect.width, x));
        y = Math.max(0, Math.min(rect.height, y));
        this.selectedAtom.updatePosition(x, y);
        this.updateBonds();
    }

    handleEnd = (e) => {
        this.isDragging = false;
        this.selectedAtom = null;
        document.removeEventListener('mousemove', this.handleMove);
        document.removeEventListener('mouseup', this.handleEnd);
        document.removeEventListener('touchmove', this.handleMove);
        document.removeEventListener('touchend', this.handleEnd);
    }
    deleteBond() {
        if (!this.firstAtomForBond) {
            alert('Selecciona dos átomos para eliminar el enlace.');
            return;
        }

        const secondAtom = this.selectedAtom;
        if (this.firstAtomForBond === secondAtom) {
            alert('No puedes eliminar un enlace con el mismo átomo.');
            return;
        }

        const bond = this.findBond(this.firstAtomForBond, secondAtom);

        if (bond) {
            this.removeBond(this.firstAtomForBond, secondAtom);
            alert('Enlace eliminado exitosamente.');
        } else {
            alert('No hay enlace entre los átomos seleccionados.');
        }

        // Restablecer la selección de átomos
        this.firstAtomForBond.element.classList.remove('selected');
        this.firstAtomForBond = null;
        this.selectedAtom = null;
    }

    getEventPosition(e) {
        const rect = this.workspace.getBoundingClientRect();
        if (e.touches) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }


    handleBondCreation(atom) {
        if (!this.firstAtomForBond) {
            this.firstAtomForBond = atom;
            atom.element.classList.add('selected');
        } else {
            if (this.firstAtomForBond !== atom) {
                const existingBond = this.findBond(this.firstAtomForBond, atom);

                if (existingBond) {
                    // Incrementar el tipo de enlace o eliminar si es triple
                    existingBond.incrementBond();
                } else {
                    // Crear un nuevo enlace simple
                    this.createBond(this.firstAtomForBond, atom);

                    // Registrar la conexión si ambos átomos son de carbono
                    const id1 = this.atoms.indexOf(this.firstAtomForBond);
                    const id2 = this.atoms.indexOf(atom);

                    if (this.firstAtomForBond.type === 'C' && atom.type === 'C') {
                        this.connectCarbons(id1, id2);
                    }
                }
            }

            // Desmarcar el átomo seleccionado
            this.firstAtomForBond.element.classList.remove('selected');
            this.firstAtomForBond = null;
        }
    }



    bondExists(atom1, atom2) {
        return this.bonds.some(bond =>
            (bond.atom1 === atom1 && bond.atom2 === atom2) ||
            (bond.atom1 === atom2 && bond.atom2 === atom1)
        );
    }

    findBond(atom1, atom2) {
        return this.bonds.find(bond =>
            (bond.atom1 === atom1 && bond.atom2 === atom2) ||
            (bond.atom1 === atom2 && bond.atom2 === atom1)
        );
    }


    createBond(atom1, atom2, bondType = 1) {
        if (!this.canCreateBond(atom1, bondType) || !this.canCreateBond(atom2, bondType)) {
            alert('Este enlace supera el máximo de enlaces permitidos para uno de los átomos.');
            return;
        }

        const bond = new Bond(atom1, atom2, bondType);
        this.bonds.push(bond);
        this.bondsLayer.appendChild(bond.element);

        // Actualizar el contador de enlaces de los átomos
        atom1.bonds.push(bond);
        atom2.bonds.push(bond);
        atom1.bondCount += bondType;
        atom2.bondCount += bondType;
    }






    canCreateBond(atom, bondType = 1) {
        const maxBonds = atom.type === 'C' ? 4 : atom.type === 'O' ? 2 : 1;
        const totalBonds = atom.bondCount + bondType;

        // Verificar si el total de enlaces excede el máximo permitido
        return totalBonds <= maxBonds;
    }




    updateBonds() {
        this.bonds.forEach(bond => bond.updatePosition());
    }

    updateCounter(type, change) {
        this.counters[type] += change;

        // Mapear el tipo de átomo al ID correcto del contador
        const counterIds = {
            'C': 'carbon-counter',
            'O': 'oxygen-counter',
            'H': 'hydrogen-counter'
        };

        const counterId = counterIds[type];
        const limit = this.currentCombination[type] || 0; // Obtenemos el límite de la combinación actual

        // Actualizar el texto del contador
        document.getElementById(counterId).textContent = `${this.counters[type]}/${limit}`;

        // Cambiar el estilo si el límite es 0
        const counterElement = document.getElementById(counterId);
        const buttonIds = {
            'C': 'add-carbon',
            'O': 'add-oxygen',
            'H': 'add-hydrogen'
        };

        console.log(limit)

        const button = document.getElementById(buttonIds[type]);
        if (limit === 0) {
            counterElement.style.color = '#666'; // Gris
            button.disabled = true;
            button.style.backgroundColor = '#666';
        } else {
            counterElement.style.color = '#FFF'; // Blanco
            button.disabled = this.counters[type] >= limit;
            button.style.backgroundColor = button.disabled ? '#666' : 'var(--primary)';
        }
    }

    buildStructureRepresentation() {
        const representation = [];
        const visited = new Set();

        const traverse = (atom, path) => {
            visited.add(atom);

            const connections = atom.bonds.map(bond => {
                const neighbor = bond.atom1 === atom ? bond.atom2 : bond.atom1;
                const bondType = bond.bondType === 1 ? '-' : bond.bondType === 2 ? '=' : '#';
                return `${bondType}${neighbor.type}`;
            }).sort().join('');

            path.push(`${atom.type}(${connections})`);

            atom.bonds.forEach(bond => {
                const neighbor = bond.atom1 === atom ? bond.atom2 : bond.atom1;
                if (!visited.has(neighbor)) {
                    traverse(neighbor, path);
                }
            });
        };

        this.atoms.forEach(atom => {
            if (!visited.has(atom)) {
                const path = [];
                traverse(atom, path);
                representation.push(path.sort().join('|'));
            }
        });

        const structureString = representation.sort().join('||');
        console.log("🔍 Representación simplificada:", structureString);
        return structureString;
    }



    validateMolecule() {
        // Verificar que se usaron todos los átomos disponibles
        const allAtomsUsed = Object.entries(this.counters).every(
            ([type, count]) => count === this.currentCombination[type]
        );

        if (!allAtomsUsed) {
            console.log("🚫 No se usaron todos los átomos disponibles.");
            alert('Debes usar todos los átomos disponibles para esta combinación.');
            return;
        }
        console.log("✅ Todos los átomos han sido utilizados.");

        // Verificar que todos los átomos tienen el número correcto de enlaces
        const invalidAtoms = this.atoms.filter(atom => !this.hasValidBonds(atom));
        if (invalidAtoms.length > 0) {
            console.log("🚫 Átomos con enlaces incorrectos:", invalidAtoms);
            alert('Algunos átomos no tienen el número correcto de enlaces.');
            return;
        }
        console.log("✅ Todos los átomos tienen el número correcto de enlaces.");

        // Construir una representación simplificada de la estructura
        const structure = this.buildStructureRepresentation();

        // Verificar si el isómero ya ha sido registrado
        if (this.isIsomerRegistered()) {
            alert("Este isómero ya ha sido registrado. Intenta crear otro diferente.");
            return;
        }

        // Registrar el nuevo isómero
        this.registerIsomer();
        alert("¡Felicidades! Has creado un isómero válido.");
    }



    registerIsomer(structure) {
        this.uniqueIsomers.push(structure);
        console.log("Nuevo isómero registrado:", structure);
        alert("¡Felicidades! Has creado un isómero válido.");
    }


    // Verificar si el isómero ya ha sido registrado
    isIsomerRegistered() {
        const { mainChain, branches } = this.analyzeStructure();

        const mainLength = mainChain.length;
        const branchSizes = branches.map(branch => branch.length).sort((a, b) => b - a);
        const bondCounts = this.atoms.map(atom => {
            return atom.bonds.reduce((count, bond) => count + bond.bondType, 0);
        }).sort();

        const representation = { mainLength, branchSizes, bondCounts };

        console.log("🔍 Cadena principal identificada:", mainChain);
        console.log("🔍 Ramificaciones identificadas:", branches);
        console.log("📊 Representación simplificada:", representation);

        const isRegistered = this.uniqueIsomers.some(isomer =>
            isomer.mainLength === mainLength &&
            JSON.stringify(isomer.branchSizes) === JSON.stringify(branchSizes) &&
            JSON.stringify(isomer.bondCounts) === JSON.stringify(bondCounts)
        );

        if (isRegistered) {
            console.log("🚫 Isómero ya registrado:", representation);
            return true;
        }

        // Registrar nuevo isómero
        this.uniqueIsomers.push(representation);
        console.log("✅ Nuevo isómero registrado:", representation);
        return false;
    }






    hasValidBonds(atom) {
        let totalBondCount = 0;

        // Contar todos los enlaces, incluyendo dobles y triples
        atom.bonds.forEach(bond => {
            totalBondCount += bond.bondType;
        });

        // Verificar el máximo de enlaces según el tipo de átomo
        switch (atom.type) {
            case 'C': return totalBondCount === 4; // Carbono puede tener hasta 4 enlaces
            case 'O': return totalBondCount === 2; // Oxígeno puede tener hasta 2 enlaces
            case 'H': return totalBondCount === 1; // Hidrógeno puede tener 1 enlace
            default: return false;
        }
    }


    clearWorkspace() {
        // Limpiar el DOM de átomos y enlaces
        while (this.atomsLayer.firstChild) {
            this.atomsLayer.removeChild(this.atomsLayer.firstChild);
        }
        while (this.bondsLayer.firstChild) {
            this.bondsLayer.removeChild(this.bondsLayer.firstChild);
        }

        // Reiniciar las listas de átomos, enlaces y conexiones
        this.atoms = [];
        this.bonds = [];
        this.carbonConnections = {}; // Limpiar todas las conexiones de carbono
        this.selectedAtom = null;
        this.firstAtomForBond = null;

        // Reiniciar los contadores de cada tipo de átomo
        Object.keys(this.counters).forEach(type => {
            this.counters[type] = 0;
            this.updateCounter(type, 0);
        });

        console.log("Espacio de trabajo limpiado. Todas las conexiones y átomos han sido eliminados.");
    }



    getIsomerString() {
        const atomStrings = this.atoms.map(atom => {
            const bondCounts = atom.bonds.map(bond => bond.bondType).sort().join('');
            return `${atom.type}${bondCounts}`;
        });
        return atomStrings.sort().join('-');
    }




}

// Inicializar el juego cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    new IsomerGame();
});