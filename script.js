const display = document.querySelector('.display');
const numberButton = document.querySelectorAll('[data-number]');
const operatorButton = document.querySelectorAll('[data-operator]');
const acButton = document.querySelector('[data-ac]');
const delButton = document.querySelector('[data-del]');
const equalButton = document.querySelector('[data-equal]');

let formula = '';

numberButton.forEach((button) => {
  button.addEventListener('click', () => {
    formula += button.innerHTML;
    displayFormula();
  });
});

operatorButton.forEach((button) => {
  button.addEventListener('click', () => {
    const lastChar = formula.slice(-1);

    if ('+-*/'.includes(lastChar)) {
      return;
    }

    if (button.innerHTML === '×') {
      formula += '*';
    } else if (button.innerHTML === '÷') {
      formula += '/';
    } else {
      formula += button.innerHTML;
    }

    displayFormula();
  });
});

equalButton.addEventListener('click', () => {
  try {
    const sanitizedFormula = formula.replace(/[^0-9+\-*/.]/g, ''); 
    const answer = new Function(`return ${sanitizedFormula}`)(); 

    if (!isFinite(answer)) {
      throw new Error('Error');
    }

    displayAnswer(answer);
    formula = String(answer);
  } catch {
    displayAnswer('Error');
    formula = '';
  }
});

acButton.addEventListener('click', () => {
  formula = '';
  displayFormula();
});

delButton.addEventListener('click', () => {
  formula = formula.slice(0, -1);
  displayFormula();
});

function displayFormula() {
  display.innerHTML = formula.replace(/\*/g, '×').replace(/\//g, '÷') || '0';
}

function displayAnswer(answer) {
  display.innerHTML = answer;
}