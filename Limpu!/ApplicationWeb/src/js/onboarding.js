/**
 * Limpu! — Onboarding Flow Orchestrator with Apple-style Transitions
 */

import { store } from './state.js';

export class OnboardingFlow {
  constructor({ ageSlider, kanban, tasksManager, navigation, history, ranking, friends }) {
    this.ageSlider = ageSlider;
    this.kanban = kanban;
    this.tasksManager = tasksManager;
    this.navigation = navigation;
    this.history = history;
    this.ranking = ranking;
    this.friends = friends;

    // DOM Elements - Containers & Headers
    this.onboardingContainer = document.getElementById('onboardingContainer');
    this.onboardingHeader = document.getElementById('onboardingHeader');
    this.mainAppView = document.getElementById('mainAppView');

    // Views
    this.appInitialLoadingView = document.getElementById('appInitialLoadingView');
    this.appLoadingLabel = document.getElementById('appLoadingLabel');
    this.step1View = document.getElementById('step1NameView');
    this.transitionNameAgeView = document.getElementById('transitionNameAgeView');
    this.step2View = document.getElementById('step2AgeView');
    this.transitionAgeGoalView = document.getElementById('transitionAgeGoalView');
    this.step3View = document.getElementById('step3GoalView');
    this.transitionAgeAppView = document.getElementById('transitionAgeAppView');
    this.preparingBox = document.getElementById('preparingBox');

    // Progress Indicators (3 Steps)
    this.pillStep1 = document.getElementById('pillStep1');
    this.pillStep2 = document.getElementById('pillStep2');
    this.pillStep3 = document.getElementById('pillStep3');

    // Step 1 Controls
    this.nameInput = document.getElementById('userNameInput');
    this.nameClearBtn = document.getElementById('nameClearBtn');
    this.btnStep1Next = document.getElementById('btnStep1Next');

    // Transition 1 Displays
    this.trans1GreetingName = document.getElementById('trans1GreetingName');

    // Step 2 Controls
    this.step2GreetingName = document.getElementById('step2GreetingName');
    this.btnStep2Back = document.getElementById('btnStep2Back');
    this.btnStep2Next = document.getElementById('btnStep2Next');

    // Transition 2 Displays
    this.trans2GreetingName = document.getElementById('trans2GreetingName');

    // Step 3 Controls (Objetivo Principal)
    this.goalOptionCards = document.querySelectorAll('.goal-option-card');
    this.btnStep3Back = document.getElementById('btnStep3Back');
    this.btnStep3Next = document.getElementById('btnStep3Next');

    // Final Transition Controls
    this.btnStartOrganizing = document.getElementById('btnStartOrganizing');

    // Main App Greeting & Elements
    this.appUserNameDisplay = document.getElementById('appUserNameDisplay');
    this.appUserHouseTagline = document.getElementById('appUserHouseTagline');
    this.appUserAvatar = document.getElementById('appUserAvatar');
    this.btnResetDemo = document.getElementById('btnResetDemo');

    // Web Audio Context for Onboarding Affirmation Chime
    this.audioCtx = null;

    this.init();
  }

  init() {
    this.setupAudioContextUnlock();
    this.bindEvents();
    this.checkInitialState();
    this.handleInitialLoading();
  }

  setupAudioContextUnlock() {
    const unlockAudio = () => {
      this.getAudioContext();
    };
    window.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
    window.addEventListener('touchend', unlockAudio, { passive: true, once: true });
    window.addEventListener('click', unlockAudio, { passive: true, once: true });
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Sound Effect: Satisfying, distinct pop-affirmation chime for Step approval
   */
  playStepAffirmationSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Note 1: Crisp round attack pop (E5 -> G5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.05);

      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.09);

      // Note 2: Bright uplifting affirmation tone (C6 -> D6)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1046.50, now + 0.04);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.14);

      gain2.gain.setValueAtTime(0.14, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.04);
      osc2.stop(now + 0.22);
    } catch (e) {
      // Audio autoplay restrictions or unsupported browser
    }
  }

  /**
   * Sound Effect: Lush, magical welcoming harp-arpeggio chime when entering the home screen for the first time
   */
  playWelcomeHomeSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Fmaj9 welcoming harmonic sparkle: F4, A4, C5, E5, G5, C6
      const arpeggio = [
        { freq: 349.23, time: 0, dur: 0.55, type: 'sine', gain: 0.10 },     // F4
        { freq: 440.00, time: 0.05, dur: 0.60, type: 'sine', gain: 0.11 },  // A4
        { freq: 523.25, time: 0.10, dur: 0.65, type: 'sine', gain: 0.12 },  // C5
        { freq: 659.25, time: 0.16, dur: 0.70, type: 'sine', gain: 0.13 },  // E5
        { freq: 783.99, time: 0.22, dur: 0.75, type: 'triangle', gain: 0.14 }, // G5
        { freq: 1046.50, time: 0.30, dur: 0.85, type: 'sine', gain: 0.16 }  // C6 (Warm resonant high sparkle)
      ];

      arpeggio.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = note.type;
        osc.frequency.setValueAtTime(note.freq, now + note.time);

        gain.gain.setValueAtTime(note.gain, now + note.time);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + note.time);
        osc.stop(now + note.time + note.dur);
      });
    } catch (e) {
      // Audio autoplay restrictions or unsupported browser
    }
  }

  bindEvents() {
    // --- Step 1 Events ---
    if (this.nameInput) {
      this.nameInput.addEventListener('input', () => this.handleNameInput());
      this.nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !this.btnStep1Next.disabled) {
          e.preventDefault();
          this.goToStep2();
        }
      });
    }

    if (this.nameClearBtn) {
      this.nameClearBtn.addEventListener('click', () => {
        this.nameInput.value = '';
        this.nameInput.focus();
        this.handleNameInput();
      });
    }

    if (this.btnStep1Next) {
      this.btnStep1Next.addEventListener('click', () => this.goToStep2());
    }

    // --- Step 2 Events ---
    if (this.btnStep2Back) {
      this.btnStep2Back.addEventListener('click', () => this.goToStep1());
    }

    if (this.btnStep2Next) {
      this.btnStep2Next.addEventListener('click', () => this.goToStep3());
    }

    // --- Step 3 Events (Objetivo Principal) ---
    if (this.goalOptionCards && this.goalOptionCards.length > 0) {
      this.goalOptionCards.forEach((card) => {
        card.addEventListener('click', () => this.handleGoalSelection(card));
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleGoalSelection(card);
          }
        });
      });
    }

    if (this.btnStep3Back) {
      this.btnStep3Back.addEventListener('click', () => this.goToStep2FromStep3());
    }

    if (this.btnStep3Next) {
      this.btnStep3Next.addEventListener('click', () => this.completeOnboarding());
    }

    // --- Final Transition Ready Button ---
    if (this.btnStartOrganizing) {
      this.btnStartOrganizing.addEventListener('click', () => {
        this.finishTransitionToDashboard();
      });
    }

    // --- Reset Demo / Replay Flow ---
    if (this.btnResetDemo) {
      this.btnResetDemo.addEventListener('click', () => this.resetFlow());
    }
  }

  checkInitialState() {
    const urlParams = new URLSearchParams(window.location.search);
    const forceNew = urlParams.get('start') === '1' || urlParams.get('new') === '1' || urlParams.get('reset') === '1' || urlParams.get('source') === 'landing';

    if (forceNew) {
      store.reset();
      this.nameInput.value = '';
      this.btnStep1Next.disabled = true;
      this.showStep1(false);
      // Remove o parâmetro da URL sem recarregar a página
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      return;
    }

    const state = store.getState();

    if (state.onboardingCompleted && state.name) {
      this.showMainApp(false);
    } else {
      if (state.name) {
        this.nameInput.value = state.name;
        this.handleNameInput();
      }
      this.showStep1(false);
    }
  }

  handleInitialLoading() {
    if (!this.appInitialLoadingView) return;

    if (this.appLoadingLabel) {
      this.appLoadingLabel.textContent = 'Carregando...';
    }

    // Display visual loader for 2 seconds
    setTimeout(() => {
      // Dissolve the loading overlay smoothly over 1.3s (same as other transitions)
      this.appInitialLoadingView.classList.add('fade-out');

      setTimeout(() => {
        this.appInitialLoadingView.style.display = 'none';
        this.appInitialLoadingView.classList.remove('active', 'fade-out');

        // Focus name input if still on step 1
        const state = store.getState();
        if (!state.onboardingCompleted && this.nameInput && document.activeElement !== this.nameInput) {
          this.nameInput.focus();
        }
      }, 1300);
    }, 2000);
  }

  handleNameInput() {
    const rawVal = this.nameInput.value;
    const trimmed = rawVal.trim();
    const isValid = trimmed.length >= 2;

    // Toggle clear button
    if (rawVal.length > 0) {
      this.nameClearBtn.classList.add('is-visible');
    } else {
      this.nameClearBtn.classList.remove('is-visible');
    }

    // Enable/disable button
    this.btnStep1Next.disabled = !isValid;
  }

  hideAllViews() {
    [
      this.step1View,
      this.transitionNameAgeView,
      this.step2View,
      this.transitionAgeGoalView,
      this.step3View,
      this.transitionAgeAppView,
      this.mainAppView
    ].forEach((view) => {
      if (view) {
        view.style.display = 'none';
        view.classList.remove('active', 'fade-out', 'slide-in-right', 'slide-in-left', 'slide-out-left', 'slide-out-right');
      }
    });
  }

  goToStep1() {
    this.step2View.classList.add('slide-out-right');

    setTimeout(() => {
      this.hideAllViews();
      this.step1View.style.display = 'flex';
      this.step1View.classList.add('active', 'slide-in-left');

      // Update header & pills
      this.onboardingHeader.classList.remove('is-hidden');
      this.pillStep1.classList.add('active');
      this.pillStep1.classList.remove('completed');
      this.pillStep2.classList.remove('active', 'completed');
      if (this.pillStep3) this.pillStep3.classList.remove('active', 'completed');

      store.setState({ currentStep: 'name' });
      this.nameInput.focus();
    }, 180);
  }

  goToStep2() {
    const name = this.nameInput.value.trim();
    if (name.length < 2) return;

    this.playStepAffirmationSound();

    store.setState({ name, currentStep: 'transition-name-age' });

    // Update names on displays
    if (this.trans1GreetingName) {
      this.trans1GreetingName.textContent = name;
    }
    if (this.step2GreetingName) {
      this.step2GreetingName.textContent = name;
    }
    if (this.trans2GreetingName) {
      this.trans2GreetingName.textContent = name;
    }

    // 1. Hide Step 1 with slide out
    this.step1View.classList.add('slide-out-left');

    setTimeout(() => {
      this.hideAllViews();

      // 2. Show Transition 1 Screen ("Olá {name}, Seja bem vindo ao Limpu!")
      this.onboardingHeader.classList.add('is-hidden');
      this.transitionNameAgeView.style.display = 'flex';
      this.transitionNameAgeView.classList.remove('fade-out');
      this.transitionNameAgeView.classList.add('active');

      // 3. Keep transition on screen for 2s then fade out smoothly
      setTimeout(() => {
        // Mount Step 2 directly underneath so it emerges smoothly during the fade-out
        this.onboardingContainer.style.display = 'flex';
        this.onboardingHeader.classList.remove('is-hidden');
        this.step2View.style.display = 'flex';
        this.step2View.classList.add('active');

        // Update pills
        this.pillStep1.classList.remove('active');
        this.pillStep1.classList.add('completed');
        this.pillStep2.classList.add('active');
        this.pillStep2.classList.remove('completed');
        if (this.pillStep3) this.pillStep3.classList.remove('active', 'completed');

        if (this.ageSlider) {
          this.ageSlider.updateUI(this.ageSlider.getValue(), true);
        }

        // Dissolve Transition 1 over 1.3s
        this.transitionNameAgeView.classList.add('fade-out');

        setTimeout(() => {
          this.transitionNameAgeView.style.display = 'none';
          this.transitionNameAgeView.classList.remove('active', 'fade-out');
          store.setState({ currentStep: 'age' });
        }, 1300);
      }, 2000);
    }, 180);
  }

  goToStep2FromStep3() {
    if (this.step3View) {
      this.step3View.classList.add('slide-out-right');
    }

    setTimeout(() => {
      this.hideAllViews();
      this.step2View.style.display = 'flex';
      this.step2View.classList.add('active', 'slide-in-left');

      // Update header & pills
      this.onboardingHeader.classList.remove('is-hidden');
      this.pillStep1.classList.remove('active');
      this.pillStep1.classList.add('completed');
      this.pillStep2.classList.add('active');
      this.pillStep2.classList.remove('completed');
      if (this.pillStep3) this.pillStep3.classList.remove('active', 'completed');

      store.setState({ currentStep: 'age' });
    }, 180);
  }

  goToStep3() {
    const age = this.ageSlider ? this.ageSlider.getValue() : 24;
    const name = (this.nameInput ? this.nameInput.value.trim() : '') || store.getState().name || 'Usuário';

    this.playStepAffirmationSound();

    store.setState({ age, currentStep: 'transition-age-goal' });

    if (this.trans2GreetingName) {
      this.trans2GreetingName.textContent = name;
    }

    // 1. Hide Step 2 with slide out
    this.step2View.classList.add('slide-out-left');

    setTimeout(() => {
      this.hideAllViews();

      // 2. Show Transition 2 Screen ("Legal, {Nome}! Idade salva.")
      this.onboardingHeader.classList.add('is-hidden');
      if (this.transitionAgeGoalView) {
        this.transitionAgeGoalView.style.display = 'flex';
        this.transitionAgeGoalView.classList.remove('fade-out');
        this.transitionAgeGoalView.classList.add('active');
      }

      // 3. Keep transition on screen for 2s then fade out smoothly
      setTimeout(() => {
        // Mount Step 3 directly underneath so it emerges smoothly during the fade-out
        this.onboardingContainer.style.display = 'flex';
        this.onboardingHeader.classList.remove('is-hidden');
        if (this.step3View) {
          this.step3View.style.display = 'flex';
          this.step3View.classList.add('active');
        }

        // Update pills: Step 1 completed, Step 2 completed, Step 3 active
        this.pillStep1.classList.remove('active');
        this.pillStep1.classList.add('completed');
        this.pillStep2.classList.remove('active');
        this.pillStep2.classList.add('completed');
        if (this.pillStep3) {
          this.pillStep3.classList.add('active');
          this.pillStep3.classList.remove('completed');
        }

        // Dissolve Transition 2 over 1.3s
        if (this.transitionAgeGoalView) {
          this.transitionAgeGoalView.classList.add('fade-out');
        }

        setTimeout(() => {
          if (this.transitionAgeGoalView) {
            this.transitionAgeGoalView.style.display = 'none';
            this.transitionAgeGoalView.classList.remove('active', 'fade-out');
          }
          store.setState({ currentStep: 'goal' });
        }, 1300);
      }, 2000);
    }, 180);
  }

  handleGoalSelection(card) {
    if (!card) return;

    // Remove selection from all cards
    if (this.goalOptionCards) {
      this.goalOptionCards.forEach((c) => {
        c.classList.remove('is-selected');
        c.setAttribute('aria-checked', 'false');
      });
    }

    // Select clicked card
    card.classList.add('is-selected');
    card.setAttribute('aria-checked', 'true');

    const goal = card.getAttribute('data-goal') || '';
    const goalTitle = card.getAttribute('data-title') || '';

    store.setState({ goal, goalTitle });

    // Enable Avançar button
    if (this.btnStep3Next) {
      this.btnStep3Next.disabled = false;
    }
  }

  completeOnboarding() {
    this.playStepAffirmationSound();

    store.setState({ currentStep: 'transition-age-app' });

    // 1. Hide all onboarding views & ensure main app remains hidden during transition
    this.hideAllViews();
    this.onboardingContainer.style.display = 'none';
    this.mainAppView.style.display = 'none';

    // 2. Setup Transition final overlay in Loading Phase (solid pure white overlay)
    if (this.preparingBox) {
      this.preparingBox.classList.remove('is-ready');
    }
    this.transitionAgeAppView.style.display = 'flex';
    this.transitionAgeAppView.classList.remove('fade-out');
    this.transitionAgeAppView.classList.add('active');

    // 3. Wait exactly 3 seconds with loading spinner
    setTimeout(() => {
      // 4. Switch to Phase 2: "Tudo pronto!" with button "Começar a organizar!"
      if (this.preparingBox) {
        this.preparingBox.classList.add('is-ready');
      }
    }, 3000);
  }

  finishTransitionToDashboard() {
    // Toca som mágico e acolhedor de boas-vindas à tela inicial
    this.playWelcomeHomeSound();

    // 1. Prepare main app data and display it behind the transition right as fade-out starts
    const state = store.getState();
    const name = state.name || 'Usuário';
    if (this.appUserNameDisplay) {
      this.appUserNameDisplay.textContent = name;
    }
    if (this.appUserHouseTagline) {
      this.appUserHouseTagline.textContent = `Casa de ${name}`;
    }
    if (this.appUserAvatar) {
      this.appUserAvatar.textContent = name.charAt(0).toUpperCase();
      this.appUserAvatar.title = name;
    }

    if (this.kanban) {
      this.kanban.updateUserAvatars();
    }
    if (this.ranking) {
      this.ranking.updateUserRanking();
    }
    if (this.friends) {
      this.friends.updateUserDisplays();
    }

    this.mainAppView.style.display = 'flex';
    this.mainAppView.classList.add('active');

    // 2. Dissolve the white transition overlay smoothly over 1.3s
    this.transitionAgeAppView.classList.add('fade-out');

    setTimeout(() => {
      this.transitionAgeAppView.style.display = 'none';
      this.transitionAgeAppView.classList.remove('active', 'fade-out');

      store.setState({
        onboardingCompleted: true,
        currentStep: 'dashboard'
      });
    }, 1300);
  }

  showStep1(animate = true) {
    this.hideAllViews();
    this.onboardingContainer.style.display = 'flex';
    this.onboardingHeader.classList.remove('is-hidden');

    this.step1View.style.display = 'flex';
    this.step1View.classList.add('active');
    if (animate) {
      this.step1View.classList.add('slide-in-left');
    }

    this.pillStep1.classList.add('active');
    this.pillStep1.classList.remove('completed');
    this.pillStep2.classList.remove('active', 'completed');
    if (this.pillStep3) {
      this.pillStep3.classList.remove('active', 'completed');
    }

    setTimeout(() => {
      const isInitialLoading = this.appInitialLoadingView && this.appInitialLoadingView.classList.contains('active') && !this.appInitialLoadingView.classList.contains('fade-out');
      if (!isInitialLoading && this.nameInput) {
        this.nameInput.focus();
      }
    }, 100);
  }

  showMainApp(animate = false) {
    this.hideAllViews();
    const state = store.getState();
    const name = state.name || 'Usuário';

    if (this.appUserNameDisplay) {
      this.appUserNameDisplay.textContent = name;
    }

    if (this.appUserHouseTagline) {
      this.appUserHouseTagline.textContent = `Casa de ${name}`;
    }

    if (this.appUserAvatar) {
      this.appUserAvatar.textContent = name.charAt(0).toUpperCase();
      this.appUserAvatar.title = name;
    }

    if (this.kanban) {
      this.kanban.updateUserAvatars();
    }

    this.onboardingContainer.style.display = 'none';
    this.mainAppView.style.display = 'flex';
    this.mainAppView.classList.add('active');
  }

  resetFlow() {
    // 1. Show the full-screen loading transition immediately with "Reiniciando app..."
    if (this.appLoadingLabel) {
      this.appLoadingLabel.textContent = 'Reiniciando app...';
    }

    if (this.appInitialLoadingView) {
      this.appInitialLoadingView.style.display = 'flex';
      this.appInitialLoadingView.classList.remove('fade-out');
      this.appInitialLoadingView.classList.add('active');
    }

    // 2. Reset internal data and prepare Step 1 underneath
    store.reset();
    if (this.nameInput) {
      this.nameInput.value = '';
      this.handleNameInput();
    }
    if (this.btnStep1Next) {
      this.btnStep1Next.disabled = true;
    }
    if (this.ageSlider) {
      this.ageSlider.setValue(24);
    }
    if (this.goalOptionCards) {
      this.goalOptionCards.forEach((c) => {
        c.classList.remove('is-selected');
        c.setAttribute('aria-checked', 'false');
      });
    }
    if (this.btnStep3Next) {
      this.btnStep3Next.disabled = true;
    }
    if (this.kanban) {
      this.kanban.reset();
    }
    if (this.tasksManager) {
      this.tasksManager.reset();
    }
    if (this.history) {
      this.history.reset();
    }
    try {
      sessionStorage.removeItem('limpu_history_records');
      sessionStorage.removeItem('limpu_daily_tasks_data');
    } catch (e) {}
    if (this.navigation) {
      this.navigation.switchTab('#inicio', false);
    }
    this.showStep1(false);

    // 3. Keep loading transition on screen for 2.2 seconds (2200ms)
    setTimeout(() => {
      // 4. Smoothly dissolve loading overlay over 1.3s
      if (this.appInitialLoadingView) {
        this.appInitialLoadingView.classList.add('fade-out');
      }

      setTimeout(() => {
        if (this.appInitialLoadingView) {
          this.appInitialLoadingView.style.display = 'none';
          this.appInitialLoadingView.classList.remove('active', 'fade-out');
        }

        if (this.nameInput) {
          this.nameInput.focus();
        }
      }, 1300);
    }, 2200);
  }
}
