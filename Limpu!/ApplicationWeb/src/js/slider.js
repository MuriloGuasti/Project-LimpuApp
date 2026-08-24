/**
 * Limpu! — Interactive Age Slider Component
 */

import { store } from './state.js';

export class AgeSlider {
  constructor({
    rangeInputId = 'ageRangeInput',
    fillTrackId = 'sliderFillTrack',
    numberDisplayId = 'ageNumberDisplay',
    badgeDisplayId = 'ageBadgeDisplay',
    btnMinusId = 'btnAgeMinus',
    btnPlusId = 'btnAgePlus',
    min = 14,
    max = 99,
    initialValue = 24
  } = {}) {
    this.rangeInput = document.getElementById(rangeInputId);
    this.fillTrack = document.getElementById(fillTrackId);
    this.numberDisplay = document.getElementById(numberDisplayId);
    this.badgeDisplay = document.getElementById(badgeDisplayId);
    this.btnMinus = document.getElementById(btnMinusId);
    this.btnPlus = document.getElementById(btnPlusId);

    this.min = min;
    this.max = max;
    this.value = initialValue;

    this.init();
  }

  init() {
    if (!this.rangeInput) return;

    // Load existing age from store if present
    const savedAge = store.getState().age;
    if (savedAge && savedAge >= this.min && savedAge <= this.max) {
      this.value = savedAge;
    }

    this.rangeInput.min = this.min;
    this.rangeInput.max = this.max;
    this.rangeInput.value = this.value;

    this.bindEvents();
    this.updateUI(this.value, false);
  }

  bindEvents() {
    // Range input drag and change
    this.rangeInput.addEventListener('input', (e) => {
      this.setValue(parseInt(e.target.value, 10), true);
    });

    // Step minus button
    if (this.btnMinus) {
      this.btnMinus.addEventListener('click', () => {
        this.setValue(this.value - 1, true);
      });
    }

    // Step plus button
    if (this.btnPlus) {
      this.btnPlus.addEventListener('click', () => {
        this.setValue(this.value + 1, true);
      });
    }

    // Keyboard Arrow Keys navigation
    this.rangeInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        this.setValue(this.value + 1, true);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        this.setValue(this.value - 1, true);
      }
    });
  }

  setValue(val, animate = false) {
    const clamped = Math.max(this.min, Math.min(this.max, val));
    if (this.value === clamped && !animate) return;

    this.value = clamped;
    this.rangeInput.value = clamped;

    store.setState({ age: clamped });
    this.updateUI(clamped, animate);
  }

  getValue() {
    return this.value;
  }

  getAgeBadgeText(age) {
    if (age < 18) return '🌟 Primeiros Passos & Organização';
    if (age <= 25) return '⚡ Autonomia & Energia';
    if (age <= 35) return '🏡 Equilíbrio & Casa em Dia';
    if (age <= 50) return '🎯 Mestrado da Produtividade';
    return '👑 Sabedoria & Harmonia Total';
  }

  updateUI(val, animate) {
    // Update numerical display
    if (this.numberDisplay) {
      this.numberDisplay.textContent = val;

      if (animate) {
        this.numberDisplay.classList.remove('pulse');
        // Force reflow
        void this.numberDisplay.offsetWidth;
        this.numberDisplay.classList.add('pulse');
      }
    }

    // Update badge text
    if (this.badgeDisplay) {
      this.badgeDisplay.textContent = this.getAgeBadgeText(val);
    }

    // Update fill track width percentage and dynamic green track progress
    const percentage = ((val - this.min) / (this.max - this.min)) * 100;
    if (this.fillTrack) {
      this.fillTrack.style.width = `${percentage}%`;
    }
    if (this.rangeInput) {
      this.rangeInput.style.setProperty('--slider-percent', `${percentage}%`);
      this.rangeInput.style.background = `linear-gradient(to right, var(--color-brand-green) 0%, var(--color-brand-green) ${percentage}%, var(--color-bg-subtle) ${percentage}%, var(--color-bg-subtle) 100%)`;
    }

    // Update button states
    if (this.btnMinus) {
      this.btnMinus.disabled = val <= this.min;
    }
    if (this.btnPlus) {
      this.btnPlus.disabled = val >= this.max;
    }
  }
}
