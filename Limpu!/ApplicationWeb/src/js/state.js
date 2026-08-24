/**
 * Limpu! — State Management & Session Storage
 * Resets automatically when closing the browser/tab or on manual reset (+).
 */

const STORAGE_KEY = 'limpu_user_session';
const LEGACY_STORAGE_KEY = 'casajusta_user_session';

const defaultState = {
  name: '',
  age: 24,
  goal: '',
  goalTitle: '',
  onboardingCompleted: false,
  currentStep: 'name' // 'name' | 'age' | 'goal' | 'dashboard'
};

class Store {
  constructor() {
    this.cleanLegacyStorage();
    this.state = this.loadState();
    this.listeners = new Set();
  }

  cleanLegacyStorage() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      localStorage.removeItem('limpu_daily_tasks_data');
      localStorage.removeItem('limpu_history_records');
    } catch (e) {}
  }

  loadState() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultState, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Erro ao carregar estado da sessão:', e);
    }
    return { ...defaultState };
  }

  saveState() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Erro ao salvar estado na sessão:', e);
    }
  }

  getState() {
    return { ...this.state };
  }

  getUserData() {
    return { ...this.state };
  }

  getUser() {
    return { ...this.state };
  }

  setState(partialState) {
    this.state = { ...this.state, ...partialState };
    this.saveState();
    this.notify(this.state);
  }

  reset() {
    this.state = { ...defaultState };
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.clear();
      this.cleanLegacyStorage();
    } catch (e) {}
    this.notify(this.state);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(state) {
    this.listeners.forEach((listener) => listener(state));
  }
}

export const store = new Store();
