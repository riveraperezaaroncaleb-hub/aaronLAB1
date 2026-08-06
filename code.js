/* commit 28: iniciar script de la calculadora */
const currentLine = document.getElementById('currentLine');
const historyLine = document.getElementById('historyLine');
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');

let expression = '';
let lastResult = null;
const history = [];

// commit 29: actualizar la pantalla con texto actual
function updateDisplay() {
    currentLine.textContent = expression || '0';
    historyLine.textContent = lastResult !== null ? Último: ${lastResult} : '';
}

// commit 30: agregar número o punto decimal
function appendNumber(number) {
    if (number === '.' && expression.slice(-1) === '.') return;
    if (number === '.' && !expression) {
        expression = '0.';
    } else if (number === '0' && expression === '0') {
        return;
    } else if (expression === '0' && number !== '.') {
        expression = number;
    } else {
        expression += number;
    }
    updateDisplay();
}

// commit 31: agregar operador con validación
function appendOperator(operator) {
    if (!expression && operator !== '-') return;
    if (/[+\-*/^%]$/.test(expression)) {
        expression = expression.slice(0, -1) + operator;
    } else {
        expression += operator;
    }
    updateDisplay();
}

// commit 32: limpiar toda la entrada
function clearAll() {
    expression = '';
    updateDisplay();
}


// commit 33: borrar el último carácter
function clearEntry() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

// commit 34: calcular con validaciones
function calculateResult() {
    if (!expression || /[+\-*/^%.]$/.test(expression)) return;
    let formula = expression.replace(/÷/g, '/').replace(/×/g, '').replace(/\^/g, '*');
    try {
        const result = Function("use strict"; return (${formula}))();
        if (result === Infinity || result === -Infinity || Number.isNaN(result)) {
            currentLine.textContent = 'Error';
            return;
        }
        lastResult = result;
        addHistory(expression, result);
        expression = String(result);
        updateDisplay();
    } catch {
        currentLine.textContent = 'Error';
    }
}

// commit 35: agregar entrada a historial
function addHistory(input, output) {
    history.unshift({ input, output });
    if (history.length > 10) history.pop();
    renderHistory();
}

// commit 36: mostrar historial en el panel
function renderHistory() {
    historyList.innerHTML = '';
    if (history.length === 0) {
        historyList.innerHTML = '<li style="opacity:.7;">No hay historial aún</li>';
        return;
    }
    history.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = <span>${item.input}</span><strong>${item.output}</strong>;
        historyList.appendChild(li);
    });
}

// commit 37: alternar la visibilidad del historial
function toggleHistory() {
    const isOpen = historyPanel.classList.toggle('open');
    historyPanel.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen) renderHistory();
}

// commit 38: limpiar historial completamente
function clearHistory() {
    history.length = 0;
    renderHistory();
}

// commit 39: manejar botones dinámicos
function handleButtonClick(event) {
    const target = event.target;
    if (!target.matches('.btn')) return;
    if (target.dataset.number) {
        appendNumber(target.dataset.number);
    } else if (target.dataset.operator) {
        appendOperator(target.dataset.operator);
    } else if (target.dataset.action) {
        handleAction(target.dataset.action);
    }
}

document.body.addEventListener('click', handleButtonClick);

// commit 40: manejar acciones de botones
function handleAction(action) {
    if (action === 'clear-all') clearAll();
    if (action === 'clear-entry') clearEntry();
    if (action === 'equals') calculateResult();
    if (action === 'history-toggle') toggleHistory();
    if (action === 'clear-history') clearHistory();
    if (action === 'percent') appendOperator('%');
    if (action === 'power') appendOperator('^');
    if (action === 'sqrt') {
        if (!expression) return;
        const value = Number(expression);
        if (value < 0) {
            currentLine.textContent = 'Error';
            return;
        }
        const result = Math.sqrt(value);
        addHistory(√(${expression}), result);
        expression = String(result);
        updateDisplay();
    }
}
hola
// commit 41: soporte para teclado físico
window.addEventListener('keydown', (event) => {
    const { key } = event;
    if (/^[0-9]$/.test(key)) appendNumber(key);
    if (key === '.') appendNumber(key);
    if (['+', '-', '*', '/'].includes(key)) appendOperator(key);
    if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
    }
    if (key === 'Backspace') clearEntry();
    if (key === 'Escape') clearAll();
    if (key === '%') appendOperator('%');
    if (key === '^') appendOperator('^');
});

// commit 42: mantener la interfaz sincronizada
updateDisplay();