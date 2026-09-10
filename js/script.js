const sidebar = document.querySelector('.sidebar');
const openBtn = document.querySelector('.settings-toggle-btn');
const closeBtn = document.querySelector('.close-sidebar-btn');

const jsonFileInput = document.getElementById('jsonFile');
const downloadBtn = document.getElementById('downloadBtn');
const fileStatus = document.querySelector('.status-text');

const itemForm = document.querySelector('.item-form');
const itemInput = itemForm.querySelector('input');
const saveBtn = itemForm.querySelector('button');

const itemsList = document.querySelector('.items-list');
const randomBtn = document.querySelector('.btn-generate');
const resultContainer = document.querySelector('.result-container');
const winnerText = document.querySelector('.winner-text');

let jsonData = [];
let editIndex = -1;

openBtn.addEventListener('click', () => sidebar.classList.add('active'));
closeBtn.addEventListener('click', () => sidebar.classList.remove('active'));

jsonFileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const parsed = JSON.parse(evt.target.result);
            
            if (Array.isArray(parsed)) {
                jsonData = parsed.map(item => String(item).trim()).filter(item => item !== "");
                updateUI();
            } else {
                alert("Error: El archivo JSON debe ser una lista simple entre corchetes. Ejemplo: ['Elemento 1', 'Elemento 2']");
            }
        } catch (error) {
            alert("Error: El archivo no es un JSON válido. Revisa los corchetes o las comillas.");
        }
    };
    reader.readAsText(file);
    jsonFileInput.value = "";
});

downloadBtn.addEventListener('click', function() {
    if (jsonData.length === 0) return;
    
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = "RandWii.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

saveBtn.addEventListener('click', function() {
    const value = itemInput.value.trim();
    if (!value) return;

    if (editIndex === -1) {
        jsonData.push(value);
    } else {
        jsonData[editIndex] = value;
        editIndex = -1;
        saveBtn.textContent = "Añadir";
    }

    itemInput.value = "";
    updateUI();
});

itemInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') saveBtn.click();
});

function updateUI() {
    itemsList.innerHTML = "";

    jsonData.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item}</span>
            <div class="list-actions">
                <button class="btn-edit" onclick="prepareEdit(${index})">✏️</button>
                <button class="btn-delete" onclick="deleteItem(${index})">🗑️</button>
            </div>
        `;
        itemsList.appendChild(li);
    });

    if (jsonData.length > 0) {
        fileStatus.textContent = `📋 ${jsonData.length} elementos cargados actualmente`;
        fileStatus.style.color = "#10b981";
        downloadBtn.disabled = false;
        randomBtn.disabled = false;
    } else {
        fileStatus.textContent = "Lista vacía. Sube un archivo o añade elementos.";
        fileStatus.style.color = "#ef4444";
        downloadBtn.disabled = true;
        randomBtn.disabled = true;
        winnerText.textContent = "";
    }
}

window.prepareEdit = function(index) {
    itemInput.value = jsonData[index];
    editIndex = index;
    saveBtn.textContent = "Guardar";
    itemInput.focus();
};

window.deleteItem = function(index) {
    jsonData.splice(index, 1);
    
    if (editIndex === index) {
        itemInput.value = "";
        saveBtn.textContent = "Añadir";
        editIndex = -1;
    }
    
    updateUI();
};

randomBtn.addEventListener('click', function() {
    if (jsonData.length === 0) return;

    randomBtn.disabled = true;
    winnerText.textContent = "🎲 Eligiendo al azar...";
    winnerText.style.color = "#64748b";

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * jsonData.length);
        const winner = jsonData[randomIndex];
        
        winnerText.textContent = winner;
        winnerText.style.color = "#3b82f6";
        
        randomBtn.disabled = false;
    }, 300);
});

updateUI();
