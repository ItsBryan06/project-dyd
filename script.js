const form = document.getElementById('characterForm');
const totalPointsSpan = document.getElementById('totalPoints');
const attributeInputs = form.querySelectorAll('input[type="number"]');
const submitButton = document.getElementById('submitButton');
const maxPoints = 20;
let editIndex = -1;

function updateTotalPoints() {
    let total = maxPoints;
    attributeInputs.forEach(input => {
        total -= parseInt(input.value);
    });
    totalPointsSpan.textContent = total;

    if (total < 0) {
        totalPointsSpan.style.color = 'red';
    } else {
        totalPointsSpan.style.color = 'black';
    }
}

attributeInputs.forEach(input => {
    input.addEventListener('change', updateTotalPoints);
});

function loadCharacterForEditing() {
    const urlParams = new URLSearchParams(window.location.search);
    const editParam = urlParams.get('edit');
    if (editParam !== null) {
        editIndex = parseInt(editParam);
        const characters = JSON.parse(localStorage.getItem('characters')) || [];
        if (characters[editIndex]) {
            const character = characters[editIndex];
            form.characterName.value = character.name;
            form.characterDescription.value = character.description;
            form.faction.value = character.faction;
            form.CON.value = character.attributes.CON;
            form.INT.value = character.attributes.INT;
            form.WIS.value = character.attributes.WIS;
            form.CHA.value = character.attributes.CHA;
            document.getElementById('INTG').textContent = character.attributes.INTG;
            document.getElementById('EMP').textContent = character.attributes.EMP;
            submitButton.innerHTML = '<i class="fas fa-save"></i> Actualizar Personaje';
            updateTotalPoints();
        }
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const remainingPoints = parseInt(totalPointsSpan.textContent);
    if (remainingPoints < 0) {
        alert('Has asignado demasiados puntos. Por favor, ajusta tus atributos.');
        return;
    }
    if (remainingPoints > 0) {
        alert('Tienes puntos sin asignar. Por favor, usa todos los puntos disponibles.');
        return;
    }

    const character = {
        name: form.characterName.value,
        description: form.characterDescription.value,
        faction: form.faction.value,
        attributes: {
            CON: form.CON.value,
            INT: form.INT.value,
            WIS: form.WIS.value,
            CHA: form.CHA.value,
            INTG: document.getElementById('INTG').textContent,
            EMP: document.getElementById('EMP').textContent
        }
    };

    let characters = JSON.parse(localStorage.getItem('characters')) || [];
    
    if (editIndex !== -1) {
        characters[editIndex] = character;
    } else {
        characters.push(character);
    }
    
    localStorage.setItem('characters', JSON.stringify(characters));
    window.location.href = 'character-list.html';
});

updateTotalPoints();
loadCharacterForEditing();