/**
 * Limpu! — User Profile Drawer & Settings Manager
 * Handles Profile Drawer (Top Right), Configurações and Reset App.
 */

import { store } from './state.js';

export class ProfileDrawerManager {
  constructor({ onResetApp }) {
    this.onResetApp = onResetApp;

    // Header Trigger
    this.btnOpenProfileDrawer = document.getElementById('btnOpenProfileDrawer') || document.getElementById('appUserAvatar');
    
    // Drawer Elements
    this.drawerBackdrop = document.getElementById('drawerBackdrop');
    this.userProfileDrawer = document.getElementById('userProfileDrawer');
    this.btnCloseProfileDrawer = document.getElementById('btnCloseProfileDrawer');

    // Drawer User Displays
    this.drawerUserAvatar = document.getElementById('drawerUserAvatar');
    this.drawerUserName = document.getElementById('drawerUserName');
    this.drawerUserHouseTagline = document.getElementById('drawerUserHouseTagline');

    // Drawer Actions
    this.btnDrawerOpenSettings = document.getElementById('btnDrawerOpenSettings');
    this.btnDrawerResetApp = document.getElementById('btnDrawerResetApp');

    // Settings Modal
    this.settingsModal = document.getElementById('settingsModal');
    this.btnSettingsModalClose = document.getElementById('btnSettingsModalClose');
    this.btnSettingsModalOk = document.getElementById('btnSettingsModalOk');

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateUserDisplays();

    // Subscribe to state changes
    store.subscribe(() => {
      this.updateUserDisplays();
    });
  }

  bindEvents() {
    // Open Drawer (direct listeners + delegation for robust click handling)
    const handleAvatarClick = (e) => {
      if (e) e.stopPropagation();
      this.openDrawer();
    };

    if (this.btnOpenProfileDrawer) {
      this.btnOpenProfileDrawer.addEventListener('click', handleAvatarClick);
    }

    const directAvatar = document.getElementById('appUserAvatar');
    if (directAvatar && directAvatar !== this.btnOpenProfileDrawer) {
      directAvatar.addEventListener('click', handleAvatarClick);
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('#btnOpenProfileDrawer, #appUserAvatar, .app-avatar-btn')) {
        handleAvatarClick(e);
      }
    });

    // Close Drawer
    if (this.btnCloseProfileDrawer) {
      this.btnCloseProfileDrawer.addEventListener('click', () => this.closeDrawer());
    }

    if (this.drawerBackdrop) {
      this.drawerBackdrop.addEventListener('click', () => {
        this.closeDrawer();
        this.closeAllModals();
      });
    }

    // Drawer Items Actions
    if (this.btnDrawerOpenSettings) {
      this.btnDrawerOpenSettings.addEventListener('click', () => {
        this.closeDrawer();
        this.openSettingsModal();
      });
    }

    if (this.btnDrawerResetApp) {
      this.btnDrawerResetApp.addEventListener('click', () => {
        this.closeDrawer();
        if (typeof this.onResetApp === 'function') {
          this.onResetApp();
        }
      });
    }

    // Settings Modal
    if (this.btnSettingsModalClose) {
      this.btnSettingsModalClose.addEventListener('click', () => this.closeSettingsModal());
    }
    if (this.btnSettingsModalOk) {
      this.btnSettingsModalOk.addEventListener('click', () => this.closeSettingsModal());
    }

    // Keyboard ESC listener
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDrawer();
        this.closeAllModals();
      }
    });
  }

  updateUserDisplays() {
    const state = store.getState();
    const name = state.name || 'Usuário';
    const initial = name.charAt(0).toUpperCase();

    if (this.drawerUserName) {
      this.drawerUserName.textContent = name;
    }
    if (this.drawerUserAvatar) {
      this.drawerUserAvatar.textContent = initial;
    }
    if (this.drawerUserHouseTagline) {
      this.drawerUserHouseTagline.textContent = `Casa de ${name}`;
    }

    // Update inside settings modal if present
    const settingsNameDisplay = document.getElementById('settingsModalUserName');
    if (settingsNameDisplay) settingsNameDisplay.textContent = name;

    const settingsAvatarDisplay = document.getElementById('settingsModalUserAvatar');
    if (settingsAvatarDisplay) settingsAvatarDisplay.textContent = initial;
  }

  openDrawer() {
    this.updateUserDisplays();
    if (this.drawerBackdrop) {
      this.drawerBackdrop.classList.add('is-active');
    }
    if (this.userProfileDrawer) {
      this.userProfileDrawer.classList.add('is-open');
      this.userProfileDrawer.setAttribute('aria-hidden', 'false');
    }
  }

  closeDrawer() {
    if (this.drawerBackdrop) {
      this.drawerBackdrop.classList.remove('is-active');
    }
    if (this.userProfileDrawer) {
      this.userProfileDrawer.classList.remove('is-open');
      this.userProfileDrawer.setAttribute('aria-hidden', 'true');
    }
  }

  // --- Settings Modal ---
  openSettingsModal() {
    this.closeAllModals();
    if (this.settingsModal) {
      this.settingsModal.classList.add('is-active', 'active');
      this.settingsModal.setAttribute('aria-hidden', 'false');
    }
  }

  closeSettingsModal() {
    if (this.settingsModal) {
      this.settingsModal.classList.remove('is-active', 'active');
      this.settingsModal.setAttribute('aria-hidden', 'true');
    }
  }

  closeAllModals() {
    this.closeSettingsModal();
  }

  showToast(icon, message, duration = 3000) {
    const toast = document.getElementById('appFeedbackToast');
    const toastIcon = document.getElementById('toastIcon');
    const toastText = document.getElementById('toastText');

    if (!toast || !toastIcon || !toastText) return;

    toastIcon.textContent = icon;
    toastText.textContent = message;

    toast.classList.add('show');
    clearTimeout(this.toastTimeout);

    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }
}
