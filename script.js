/* script de la calculadora corregido */
const currentLine = document.getElementById('currentLine');
const historyLine = document.getElementById('historyLine');
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');

let expression = '';
let lastResult = null;
const history = [];

function updateDisplay() {
    currentLine.textContent = expression || '0';
    historyLine.textContent = lastResult !== null ? `Último: ${lastResult}` : '';
}

function appendNumber(number) {
    if (number === '.' && expression.slice(-1) === '.') return;
    if (number === '.' && expression === '') {
        expression = '0.';
    } else if (expression === '0' && number !== '.') {
        expression = number;
    } else {
        expression += number;
    }
    updateDisplay();
}

function appendOperator(operator) {
    if (!expression && operator !== '-') return;
    if (/[+\-*/^]$/.test(expression)) {
        expression = expression.slice(0, -1) + operator;
    } else {
        expression += operator;
    }
    updateDisplay();
}

function clearAll() {
    expression = '';
    lastResult = null;
    updateDisplay();
}

function clearEntry() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function applyPercent() {
    if (!expression || /[+\-*/^.]$/.test(expression)) return;
    const match = expression.match(/(\d+(?:\.\d+)?)$/);
    if (!match) return;
    const value = parseFloat(match[0]);
    const percentValue = String(value / 100);
    expression = expression.slice(0, -match[0].length) + percentValue;
    updateDisplay();
}

function calculateResult() {
    if (!expression || /[+\-*/^.]$/.test(expression)) return;
    const formula = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');

    try {
        const result = Function(`"use strict"; return (${formula})`)();
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

function addHistory(input, output) {
    history.unshift({ input, output });
    if (history.length > 10) history.pop();
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    if (history.length === 0) {
        historyList.innerHTML = '<li style="opacity:.7;">No hay historial aún</li>';
        return;
    }
    history.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.input}</span><strong>${item.output}</strong>`;
        historyList.appendChild(li);
    });
}

function toggleHistory() {
    const isOpen = historyPanel.classList.toggle('open');
    historyPanel.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen) renderHistory();
}

function clearHistory() {
    history.length = 0;
    renderHistory();
}

function handleButtonClick(event) {
    const target = event.target.closest('.btn');
    if (!target) return;
    if (target.dataset.number) {
        appendNumber(target.dataset.number);
    } else if (target.dataset.operator) {
        appendOperator(target.dataset.operator);
    } else if (target.dataset.action) {
        handleAction(target.dataset.action);
    }
}

document.body.addEventListener('click', handleButtonClick);

function handleAction(action) {
    if (action === 'clear-all') clearAll();
    if (action === 'clear-entry') clearEntry();
    if (action === 'equals') calculateResult();
    if (action === 'history-toggle') toggleHistory();
    if (action === 'clear-history') clearHistory();
    if (action === 'percent') applyPercent();
    if (action === 'sqrt') {
        if (!expression || /[+\-*/^]$/.test(expression)) return;
        const value = Number(expression);
        if (value < 0 || Number.isNaN(value)) {
            currentLine.textContent = 'Error';
            return;
        }
        const result = Math.sqrt(value);
        addHistory(`√(${expression})`, result);
        expression = String(result);
        updateDisplay();
    }
}

window.addEventListener('keydown', (event) => {
    const { key } = event;
    if (/^[0-9]$/.test(key)) appendNumber(key);
    if (key === '.') appendNumber(key);
    if (['+', '-', '*', '/'].includes(key)) appendOperator(key);
    if (key === '^') appendOperator('^');
    if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
    }
    if (key === 'Backspace') clearEntry();
    if (key === 'Escape') clearAll();
    if (key === '%') applyPercent();
});

updateDisplay();
