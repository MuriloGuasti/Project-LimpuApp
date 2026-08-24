/* ========================================================================
   Limpu! — Bottom Navigation & Tab Manager
   Switches between Início, Tarefas, Histórico, Amigos and Placar smoothly.
   ======================================================================== */

export class NavigationManager {
  constructor() {
    this.navItems = document.querySelectorAll('.app-bottom-nav .nav-item');
    this.tabViews = {
      '#inicio': document.getElementById('tabViewInicio'),
      '#tarefas': document.getElementById('tabViewTarefas'),
      '#historico': document.getElementById('tabViewHistorico'),
      '#amigos': document.getElementById('tabViewAmigos'),
      '#ranking': document.getElementById('tabViewRanking')
    };

    this.tabListeners = [];
    this.currentTab = '#inicio';
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleInitialHash();
  }

  onTabChange(callback) {
    if (typeof callback === 'function') {
      this.tabListeners.push(callback);
    }
  }

  bindEvents() {
    this.navItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetHref = item.getAttribute('href');
        if (targetHref) {
          const normalizedHref = targetHref === '#placar' ? '#ranking' : targetHref;
          if (this.tabViews[normalizedHref]) {
            this.switchTab(normalizedHref);
          }
        }
      });
    });

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash || '#inicio';
      const normalizedHash = hash === '#placar' ? '#ranking' : hash;
      if (this.tabViews[normalizedHash]) {
        this.switchTab(normalizedHash, false);
      }
    });
  }

  handleInitialHash() {
    const hash = window.location.hash || '#inicio';
    const normalizedHash = hash === '#placar' ? '#ranking' : hash;
    if (this.tabViews[normalizedHash]) {
      this.switchTab(normalizedHash, false);
    } else {
      this.switchTab('#inicio', false);
    }
  }

  switchTab(tabHash, updateHash = true) {
    const normalizedHash = tabHash === '#placar' ? '#ranking' : tabHash;
    this.currentTab = normalizedHash;

    // 1. Update active states on nav items
    this.navItems.forEach((item) => {
      const href = item.getAttribute('href');
      const normalizedItemHref = href === '#placar' ? '#ranking' : href;
      if (normalizedItemHref === normalizedHash) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 2. Switch tab view containers uniquely
    Object.keys(this.tabViews).forEach((key) => {
      const view = this.tabViews[key];
      if (view) {
        if (key === normalizedHash) {
          view.style.display = 'flex';
          view.classList.add('active');
        } else {
          view.style.display = 'none';
          view.classList.remove('active');
        }
      }
    });

    // 3. Scroll to top of app container
    const appContainer = document.getElementById('appContainer');
    if (appContainer) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (updateHash && window.location.hash !== normalizedHash) {
      window.history.replaceState(null, document.title, normalizedHash);
    }

    // 4. Notify listeners (e.g. refresh ranking / friends list)
    this.tabListeners.forEach((fn) => {
      try {
        fn(normalizedHash);
      } catch (e) {}
    });
  }

  getCurrentTab() {
    return this.currentTab;
  }
}
