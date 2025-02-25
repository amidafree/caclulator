// モジュールパターン適用
const Calculator = (() => {
  // プライベート定数
  const CONFIG = {
    OPERATOR_MAP: new Map([['×', '*'], ['÷', '/']]),
    ERROR_MESSAGE: 'Error',
    INITIAL_DISPLAY: '0',
    MAX_DECIMAL: 5,
    SAFE_CHARS: new Set('0123456789+-*/.'),
    OPERATOR_SET: new Set('+-*/'),
    DISPLAY_MAP: { '*': '×', '/': '÷' }
  };

  // DOM要素キャッシュ
  const elements = {
    display: document.querySelector('.display'),
    numberButtons: document.querySelectorAll('[data-number]'),
    operatorButtons: document.querySelectorAll('[data-operator]'),
    acButton: document.querySelector('[data-ac]'),
    delButton: document.querySelector('[data-del]'),
    equalButton: document.querySelector('[data-equal]')
  };

  // 状態管理
  let formula = '';
  let lastValidState = '';

  // ヘルパー関数
  const sanitizeInput = (value) => {
    return [...value].filter(c => CONFIG.SAFE_CHARS.has(c)).join('');
  };

  const formatDisplay = (value) => {
    const formatNumber = (numStr) => {
      return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // 数値部分と演算子部分を分離して処理
    const parts = value.split(/([+\-×÷])/g);
    const formatted = parts.map(part => {
      if (CONFIG.OPERATOR_SET.has(part) || part === '') return part;
      return formatNumber(part.replace(/,/g, ''));
    }).join('');

    return formatted.replace(/[*/]/g, m => CONFIG.DISPLAY_MAP[m]) || CONFIG.INITIAL_DISPLAY;
  };

  const formatResult = (number) => {
    return Number.isFinite(number) 
      ? new Intl.NumberFormat('en-US', {
          maximumFractionDigits: CONFIG.MAX_DECIMAL,
          useGrouping: true
        }).format(number)
      : CONFIG.ERROR_MESSAGE;
  };

  // コアロジック
  const evaluateExpression = (expr) => {
    try {
      const result = Function(`'use strict'; return (${expr})`)();
      return typeof result === 'number' ? result : NaN;
    } catch {
      return NaN;
    }
  };

  // 公開API
  return {
    initialize() {
      this.setupEventListeners();
      this.updateDisplay();
    },

    setupEventListeners() {
      elements.numberButtons.forEach(btn => 
        btn.addEventListener('click', (e) => this.handleInput(e.target.textContent)));

      elements.operatorButtons.forEach(btn => 
        btn.addEventListener('click', (e) => this.handleOperator(e.target.textContent)));

      elements.acButton.addEventListener('click', () => this.clear());
      elements.delButton.addEventListener('click', () => this.deleteLast());
      elements.equalButton.addEventListener('click', () => this.calculate());
    },

    handleInput(value) {
      formula += value;
      this.updateDisplay();
    },

    handleOperator(operator) {
      const lastChar = formula.slice(-1);
      if (formula && !CONFIG.OPERATOR_SET.has(lastChar)) {
        formula += CONFIG.OPERATOR_MAP.get(operator) || operator;
        this.updateDisplay();
      }
    },

    calculate() {
      lastValidState = formula;
      const cleanExpr = sanitizeInput(formula);
      
      if (!cleanExpr) {
        this.showError();
        return;
      }

      const result = evaluateExpression(cleanExpr);
      
      if (Number.isFinite(result)) {
        formula = String(result);
        this.updateDisplay(result);
      } else {
        this.showError();
      }
    },

    clear() {
      formula = '';
      this.updateDisplay();
    },

    deleteLast() {
      formula = formula.slice(0, -1);
      this.updateDisplay();
    },

    showError() {
      formula = '';
      elements.display.textContent = CONFIG.ERROR_MESSAGE;
      setTimeout(() => {
        formula = lastValidState;
        this.updateDisplay();
      }, 1000);
    },

    updateDisplay(result) {
      elements.display.textContent = result !== undefined 
        ? formatResult(result) 
        : formatDisplay(formula);
    }
  };
})();

// 初期化
Calculator.initialize();