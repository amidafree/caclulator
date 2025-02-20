const display = document.querySelector('.display');
const numberButton = document.querySelectorAll('[data-number]');
const operatorButton = document.querySelectorAll('[data-operator]');
const acButton = document.querySelector('[data-ac]');
const delButton = document.querySelector('[data-del]');
const equalButton = document.querySelector('[data-equal]');

numberButton.forEach((button) => {
  button.addEventListener('click', () => {
    const number = button.innerHTML;
    display.innerHTML += number;
  });
});

operatorButton.forEach((button) => {
  button.addEventListener('click', () => {
    const operation = button.innerHTML;
  });
});

acButton.addEventListener('click', () => {
  display.innerHTML = 0;
});

delButton.addEventListener('click', () => {
  if(display.innerHTML.length > 1) {
    display.innerHTML = display.innerHTML.slice(0, -1);
  }
});