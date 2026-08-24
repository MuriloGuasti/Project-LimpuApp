/* ========================================================================
   Limpu! — Tasks Catalog & Daily Limit Management
   Includes 21 categorized tasks, 3/day limit, timezone midnight reset,
   Categories Bottom Drawer, in-app confirmation popup modal,
   and animated card addition.
   ======================================================================== */

import { store } from './state.js';

export const MAX_DAILY_TASKS = 3;
const DAILY_STORAGE_KEY = 'limpu_daily_tasks_data';

export const CATEGORIES_INFO = {
  all: { name: 'Todas as categorias', icon: '✨', count: 21 },
  kitchen: { name: 'Cozinha', icon: '🍽️', count: 5 },
  cleaning: { name: 'Limpeza Geral e Quartos', icon: '🧹', count: 5 },
  bathroom: { name: 'Banheiro', icon: '🚽', count: 4 },
  laundry: { name: 'Lavanderia', icon: '👕', count: 3 },
  extras: { name: 'Cuidados Extras', icon: '🪴', count: 4 }
};

export const TASKS_DATA = [
  // 🍽️ Cozinha
  {
    id: 'kitchen_trash',
    name: 'Tirar o lixo da cozinha',
    points: 10,
    effort: 'Rápido e simples',
    category: 'kitchen',
    categoryName: 'Cozinha',
    categoryIcon: '🍽️',
    icon: '🗑️',
    pastelClass: 'icon-kitchen'
  },
  {
    id: 'kitchen_dishes_dry',
    name: 'Guardar a louça seca',
    points: 15,
    effort: 'Exige pouco esforço',
    category: 'kitchen',
    categoryName: 'Cozinha',
    categoryIcon: '🍽️',
    icon: '🍽️',
    pastelClass: 'icon-kitchen'
  },
  {
    id: 'kitchen_counter',
    name: 'Limpar a mesa e bancadas',
    points: 15,
    effort: 'Manutenção rápida',
    category: 'kitchen',
    categoryName: 'Cozinha',
    categoryIcon: '🍽️',
    icon: '🧽',
    pastelClass: 'icon-kitchen'
  },
  {
    id: 'kitchen_stove',
    name: 'Limpar o fogão',
    points: 20,
    effort: 'Exige produto de limpeza e um pouco mais de atenção',
    category: 'kitchen',
    categoryName: 'Cozinha',
    categoryIcon: '🍽️',
    icon: '🍳',
    pastelClass: 'icon-kitchen'
  },
  {
    id: 'kitchen_wash_dishes',
    name: 'Lavar a louça',
    points: 30,
    effort: 'A tarefa mais evitada, toma tempo e esforço',
    category: 'kitchen',
    categoryName: 'Cozinha',
    categoryIcon: '🍽️',
    icon: '🫧',
    pastelClass: 'icon-kitchen'
  },

  // 🧹 Limpeza Geral e Quartos
  {
    id: 'clean_bed',
    name: 'Arrumar a cama',
    points: 10,
    effort: 'Hábito diário de 2 minutos',
    category: 'cleaning',
    categoryName: 'Limpeza Geral e Quartos',
    categoryIcon: '🧹',
    icon: '🛏️',
    pastelClass: 'icon-cleaning'
  },
  {
    id: 'clean_dust',
    name: 'Tirar o pó dos móveis',
    points: 20,
    effort: 'Exige atenção aos detalhes',
    category: 'cleaning',
    categoryName: 'Limpeza Geral e Quartos',
    categoryIcon: '🧹',
    icon: '🛋️',
    pastelClass: 'icon-cleaning'
  },
  {
    id: 'clean_living_room',
    name: 'Organizar a bagunça da sala',
    points: 20,
    effort: 'Recolher itens espalhados',
    category: 'cleaning',
    categoryName: 'Limpeza Geral e Quartos',
    categoryIcon: '🧹',
    icon: '📦',
    pastelClass: 'icon-cleaning'
  },
  {
    id: 'clean_sweep_vacuum',
    name: 'Varrer / Aspirar o chão',
    points: 30,
    effort: 'Cansaço físico moderado',
    category: 'cleaning',
    categoryName: 'Limpeza Geral e Quartos',
    categoryIcon: '🧹',
    icon: '🧹',
    pastelClass: 'icon-cleaning'
  },
  {
    id: 'clean_mop',
    name: 'Passar pano na casa',
    points: 40,
    effort: 'Ação pesada, exige balde, rodo e esforço físico',
    category: 'cleaning',
    categoryName: 'Limpeza Geral e Quartos',
    categoryIcon: '🧹',
    icon: '🪣',
    pastelClass: 'icon-cleaning'
  },

  // 🚽 Banheiro
  {
    id: 'bath_towels',
    name: 'Trocar as toalhas de rosto e banho',
    points: 10,
    effort: 'Ação de 1 minuto',
    category: 'bathroom',
    categoryName: 'Banheiro',
    categoryIcon: '🚽',
    icon: '🧖',
    pastelClass: 'icon-bathroom'
  },
  {
    id: 'bath_supplies',
    name: 'Repor papel higiênico e sabonete',
    points: 10,
    effort: 'Ação de 1 minuto',
    category: 'bathroom',
    categoryName: 'Banheiro',
    categoryIcon: '🚽',
    icon: '🧻',
    pastelClass: 'icon-bathroom'
  },
  {
    id: 'bath_trash',
    name: 'Tirar o lixo do banheiro',
    points: 10,
    effort: 'Rápido',
    category: 'bathroom',
    categoryName: 'Banheiro',
    categoryIcon: '🚽',
    icon: '🗑️',
    pastelClass: 'icon-bathroom'
  },
  {
    id: 'bath_deep_clean',
    name: 'Limpar o banheiro (lavagem completa)',
    points: 40,
    effort: 'A tarefa mais pesada da casa, lavar box, vaso e piso',
    category: 'bathroom',
    categoryName: 'Banheiro',
    categoryIcon: '🚽',
    icon: '🚽',
    pastelClass: 'icon-bathroom'
  },

  // 👕 Lavanderia
  {
    id: 'laundry_machine',
    name: 'Colocar roupas na máquina',
    points: 15,
    effort: 'Apenas separar e ligar',
    category: 'laundry',
    categoryName: 'Lavanderia',
    categoryIcon: '👕',
    icon: '🧺',
    pastelClass: 'icon-laundry'
  },
  {
    id: 'laundry_hang',
    name: 'Estender as roupas',
    points: 20,
    effort: 'Trabalho manual, tempo moderado',
    category: 'laundry',
    categoryName: 'Lavanderia',
    categoryIcon: '👕',
    icon: '👕',
    pastelClass: 'icon-laundry'
  },
  {
    id: 'laundry_fold',
    name: 'Recolher e dobrar as roupas secas',
    points: 30,
    effort: 'Exige paciência e consome bastante tempo',
    category: 'laundry',
    categoryName: 'Lavanderia',
    categoryIcon: '👕',
    icon: '👖',
    pastelClass: 'icon-laundry'
  },

  // 🪴 Cuidados Extras
  {
    id: 'extra_feed_pet',
    name: 'Alimentar o pet',
    points: 10,
    effort: 'Rápido',
    category: 'extras',
    categoryName: 'Cuidados Extras',
    categoryIcon: '🪴',
    icon: '🐶',
    pastelClass: 'icon-extras'
  },
  {
    id: 'extra_recycling',
    name: 'Colocar o lixo reciclável para fora',
    points: 15,
    effort: 'Precisa levar até a rua',
    category: 'extras',
    categoryName: 'Cuidados Extras',
    categoryIcon: '🪴',
    icon: '♻️',
    pastelClass: 'icon-extras'
  },
  {
    id: 'extra_water_plants',
    name: 'Regar as plantas',
    points: 15,
    effort: 'Passeio rápido pela casa com o regador',
    category: 'extras',
    categoryName: 'Cuidados Extras',
    categoryIcon: '🪴',
    icon: '🪴',
    pastelClass: 'icon-extras'
  },
  {
    id: 'extra_walk_pet',
    name: 'Passear com o pet',
    points: 30,
    effort: 'Toma de 20 a 30 minutos fora de casa',
    category: 'extras',
    categoryName: 'Cuidados Extras',
    categoryIcon: '🪴',
    icon: '🐕',
    pastelClass: 'icon-extras'
  }
];

export class TasksManager {
  constructor(kanbanManager) {
    this.kanbanManager = kanbanManager;
    this.dailyTasks = [];
    this.selectedTaskForModal = null;
    this.currentCategory = 'all';

    // DOM Elements - Lists & Indicators
    this.catalogContainer = document.getElementById('tasksCatalogList');
    this.slotsCountDisplay = document.getElementById('dailySlotsCount');
    this.slotsPillsContainer = document.getElementById('dailySlotsPills');

    // Category Drawer Elements
    this.btnCategoryDrawerOpen = document.getElementById('btnCategoryDrawerOpen');
    this.categoryDrawerOverlay = document.getElementById('categoryDrawerOverlay');
    this.categoryDrawerSheet = document.getElementById('categoryDrawerSheet');
    this.btnCategoryDrawerClose = document.getElementById('btnCategoryDrawerClose');
    this.categoryDrawerCurrentIcon = document.getElementById('categoryDrawerCurrentIcon');
    this.categoryDrawerCurrentName = document.getElementById('categoryDrawerCurrentName');
    this.categoryOptionItems = document.querySelectorAll('.category-option-item');

    // Modals
    this.confirmModal = document.getElementById('taskConfirmModal');
    this.confirmTaskName = document.getElementById('confirmModalTaskName');
    this.confirmTaskPoints = document.getElementById('confirmModalPoints');
    this.confirmTaskCategory = document.getElementById('confirmModalCategory');
    this.confirmModalRemaining = document.getElementById('confirmModalRemaining');
    this.btnConfirmVoltar = document.getElementById('btnConfirmModalCancel');
    this.btnConfirmSim = document.getElementById('btnConfirmModalConfirm');

    this.limitModal = document.getElementById('taskLimitModal');
    this.btnLimitEntendido = document.getElementById('btnLimitModalOk');

    this.init();
  }

  init() {
    this.loadDailyTasks();
    this.renderCatalog();
    this.updateDailySlotsUI();
    this.bindEvents();
  }

  /**
   * Helper: Get current local date string (YYYY-MM-DD)
   */
  getTodayDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Load stored daily tasks. Starts clean on refresh or session start.
   */
  loadDailyTasks() {
    try {
      localStorage.removeItem(DAILY_STORAGE_KEY);
    } catch (e) {}

    // Start fresh so refreshing (F5) or reopening tab forgets previously done tasks
    this.dailyTasks = [];
    this.saveDailyTasks();
  }

  /**
   * Save daily tasks payload to session
   */
  saveDailyTasks() {
    try {
      const payload = {
        date: this.getTodayDateString(),
        tasks: this.dailyTasks
      };
      const json = JSON.stringify(payload);
      sessionStorage.setItem(DAILY_STORAGE_KEY, json);
    } catch (e) {
      console.warn('Erro ao salvar tarefas diárias:', e);
    }
  }

  /**
   * Check if a task is already chosen today
   */
  isTaskAddedToday(taskId) {
    return this.dailyTasks.some((t) => t.id === taskId);
  }

  /**
   * Bind events for drawer, modals and options
   */
  bindEvents() {
    // 1. Category Drawer Open/Close Events
    if (this.btnCategoryDrawerOpen) {
      this.btnCategoryDrawerOpen.addEventListener('click', () => this.openCategoryDrawer());
    }

    if (this.btnCategoryDrawerClose) {
      this.btnCategoryDrawerClose.addEventListener('click', () => this.closeCategoryDrawer());
    }

    if (this.categoryDrawerOverlay) {
      this.categoryDrawerOverlay.addEventListener('click', (e) => {
        if (e.target === this.categoryDrawerOverlay) {
          this.closeCategoryDrawer();
        }
      });
    }

    // 2. Category Option Selection inside Drawer
    if (this.categoryOptionItems) {
      this.categoryOptionItems.forEach((btn) => {
        btn.addEventListener('click', () => {
          const catKey = btn.dataset.category || 'all';
          this.selectCategory(catKey);
        });
      });
    }

    // 3. Modal Confirmation Actions
    if (this.btnConfirmVoltar) {
      this.btnConfirmVoltar.addEventListener('click', () => this.closeConfirmModal());
    }

    if (this.btnConfirmSim) {
      this.btnConfirmSim.addEventListener('click', () => this.confirmAddTask());
    }

    if (this.confirmModal) {
      this.confirmModal.addEventListener('click', (e) => {
        if (e.target === this.confirmModal) {
          this.closeConfirmModal();
        }
      });
    }

    // 4. Limit Modal Actions
    if (this.btnLimitEntendido) {
      this.btnLimitEntendido.addEventListener('click', () => this.closeLimitModal());
    }

    if (this.limitModal) {
      this.limitModal.addEventListener('click', (e) => {
        if (e.target === this.limitModal) {
          this.closeLimitModal();
        }
      });
    }
  }

  /**
   * Open Category Selection Drawer
   */
  openCategoryDrawer() {
    if (this.categoryDrawerOverlay) {
      this.categoryDrawerOverlay.classList.add('is-active');
    }
  }

  /**
   * Close Category Selection Drawer
   */
  closeCategoryDrawer() {
    if (this.categoryDrawerOverlay) {
      this.categoryDrawerOverlay.classList.remove('is-active');
    }
  }

  /**
   * Select a category, update UI trigger, and filter catalog
   */
  selectCategory(categoryKey) {
    this.currentCategory = categoryKey;

    // Update active class on drawer items
    if (this.categoryOptionItems) {
      this.categoryOptionItems.forEach((btn) => {
        if (btn.dataset.category === categoryKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // Update Trigger Button display
    const catInfo = CATEGORIES_INFO[categoryKey] || CATEGORIES_INFO['all'];
    if (this.categoryDrawerCurrentIcon) {
      this.categoryDrawerCurrentIcon.textContent = catInfo.icon;
    }
    if (this.categoryDrawerCurrentName) {
      this.categoryDrawerCurrentName.textContent = catInfo.name;
    }

    // Filter catalog items
    this.filterCatalogByCategory(categoryKey);

    // Close Drawer smoothly
    this.closeCategoryDrawer();
  }

  /**
   * Filter catalog sections and cards by category
   */
  filterCatalogByCategory(category) {
    const sections = this.catalogContainer.querySelectorAll('.category-section');
    sections.forEach((sec) => {
      if (category === 'all' || sec.dataset.category === category) {
        sec.style.display = 'block';
      } else {
        sec.style.display = 'none';
      }
    });
  }

  /**
   * Update the 3-daily-slots indicator in Tarefas tab
   */
  updateDailySlotsUI() {
    const count = this.dailyTasks.length;
    if (this.slotsCountDisplay) {
      this.slotsCountDisplay.textContent = `${count}/${MAX_DAILY_TASKS}`;
    }

    if (this.slotsPillsContainer) {
      this.slotsPillsContainer.innerHTML = '';
      for (let i = 0; i < MAX_DAILY_TASKS; i++) {
        const pill = document.createElement('div');
        pill.className = `daily-slot-pill ${i < count ? 'is-filled' : ''}`;
        this.slotsPillsContainer.appendChild(pill);
      }
    }
  }

  /**
   * Render the full categorized catalog of tasks
   */
  renderCatalog() {
    if (!this.catalogContainer) return;

    this.catalogContainer.innerHTML = '';

    // Group tasks by category
    const categoriesMap = {
      kitchen: { title: 'Cozinha', icon: '🍽️', tasks: [] },
      cleaning: { title: 'Limpeza Geral e Quartos', icon: '🧹', tasks: [] },
      bathroom: { title: 'Banheiro', icon: '🚽', tasks: [] },
      laundry: { title: 'Lavanderia', icon: '👕', tasks: [] },
      extras: { title: 'Cuidados Extras', icon: '🪴', tasks: [] }
    };

    TASKS_DATA.forEach((task) => {
      if (categoriesMap[task.category]) {
        categoriesMap[task.category].tasks.push(task);
      }
    });

    Object.keys(categoriesMap).forEach((catKey) => {
      const cat = categoriesMap[catKey];
      const section = document.createElement('div');
      section.className = 'category-section';
      section.dataset.category = catKey;

      // Section Header
      const header = document.createElement('div');
      header.className = 'category-title-row';
      header.innerHTML = `
        <div class="category-title-left">
          <span class="category-icon">${cat.icon}</span>
          <h2 class="category-name">${cat.title}</h2>
        </div>
        <span class="category-count-badge">${cat.tasks.length} tarefas</span>
      `;
      section.appendChild(header);

      // Tasks List
      const list = document.createElement('div');
      list.className = 'category-tasks-list';

      cat.tasks.forEach((task) => {
        const isAdded = this.isTaskAddedToday(task.id);
        const card = document.createElement('article');
        card.className = `task-card-catalog ${isAdded ? 'is-added-today' : ''}`;
        card.id = `catalogTask_${task.id}`;
        card.dataset.taskId = task.id;
        card.dataset.category = task.category;

        card.innerHTML = `
          <div class="catalog-card-left">
            <div class="task-icon-circle ${task.pastelClass}" aria-hidden="true">
              ${task.icon}
            </div>
            <div class="catalog-card-details">
              <h3 class="catalog-task-name">${task.name}</h3>
              <p class="catalog-task-effort">${task.effort}</p>
            </div>
          </div>

          <div class="catalog-card-right">
            <span class="catalog-points-badge">+${task.points} pts</span>
            <button type="button" class="btn-add-task-action" data-task-id="${task.id}" title="Adicionar tarefa ao dia" aria-label="Adicionar ${task.name}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        `;

        const addBtn = card.querySelector('.btn-add-task-action');
        addBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleTaskAddClick(task, card);
        });

        list.appendChild(card);
      });

      section.appendChild(list);
      this.catalogContainer.appendChild(section);
    });

    this.filterCatalogByCategory(this.currentCategory);
  }

  /**
   * Click on "+" button: check daily limit or open confirmation modal
   */
  handleTaskAddClick(task, cardElement) {
    if (this.isTaskAddedToday(task.id)) {
      if (this.kanbanManager) {
        this.kanbanManager.showToast('ℹ️', 'Esta tarefa já foi adicionada ao seu dia!', 2200);
      }
      return;
    }

    if (this.dailyTasks.length >= MAX_DAILY_TASKS) {
      this.openLimitModal();
      return;
    }

    this.selectedTaskForModal = { task, cardElement };
    this.openConfirmModal(task);
  }

  /**
   * Open the In-App Confirmation Modal
   */
  openConfirmModal(task) {
    if (!this.confirmModal) return;

    if (this.confirmTaskName) {
      this.confirmTaskName.textContent = task.name;
    }
    if (this.confirmTaskPoints) {
      this.confirmTaskPoints.textContent = `+${task.points} pts`;
    }
    if (this.confirmTaskCategory) {
      this.confirmTaskCategory.textContent = `${task.categoryIcon} ${task.categoryName}`;
    }
    if (this.confirmModalRemaining) {
      const remaining = MAX_DAILY_TASKS - this.dailyTasks.length;
      this.confirmModalRemaining.textContent = `Você ainda pode escolher ${remaining} tarefa(s) para hoje.`;
    }

    this.confirmModal.classList.add('is-active');
  }

  /**
   * Close confirmation modal
   */
  closeConfirmModal() {
    if (this.confirmModal) {
      this.confirmModal.classList.remove('is-active');
    }
    this.selectedTaskForModal = null;
  }

  /**
   * Open Limit Reached Modal
   */
  openLimitModal() {
    if (this.limitModal) {
      this.limitModal.classList.add('is-active');
    }
  }

  /**
   * Close Limit Modal
   */
  closeLimitModal() {
    if (this.limitModal) {
      this.limitModal.classList.remove('is-active');
    }
  }

  /**
   * Confirmed "Sim!": Animate card disappearing from catalog, add to dailyTasks and Kanban
   */
  confirmAddTask() {
    if (!this.selectedTaskForModal) return;

    const { task, cardElement } = this.selectedTaskForModal;
    this.closeConfirmModal();

    // 1. Add to daily tasks state & storage
    const taskEntry = {
      ...task,
      status: 'todo',
      addedAt: Date.now()
    };
    this.dailyTasks.push(taskEntry);
    this.saveDailyTasks();
    this.updateDailySlotsUI();

    // 2. Animate card disappearing from Tarefas tab
    if (cardElement) {
      cardElement.classList.add('is-leaving');
      setTimeout(() => {
        cardElement.classList.add('is-added-today');
        cardElement.classList.remove('is-leaving');
      }, 350);
    }

    // 3. Sincronizar com o Kanban na Home
    if (this.kanbanManager) {
      this.kanbanManager.loadDailyTasksIntoBoard(this.dailyTasks);
      this.kanbanManager.showToast('🎉', `Tarefa adicionada: ${task.name}`, 2600);
    }
  }

  /**
   * Update status of a daily task (todo / doing / done) and persist
   */
  updateDailyTaskStatus(taskId, status) {
    const target = this.dailyTasks.find((t) => t.id === taskId);
    if (target) {
      target.status = status;
      this.saveDailyTasks();
    }
  }

  /**
   * Get all active daily tasks
   */
  getDailyTasks() {
    return this.dailyTasks;
  }

  /**
   * Reset daily tasks on app demo reset
   */
  reset() {
    this.dailyTasks = [];
    this.currentCategory = 'all';
    this.saveDailyTasks();
    this.renderCatalog();
    this.updateDailySlotsUI();

    const catInfo = CATEGORIES_INFO['all'];
    if (this.categoryDrawerCurrentIcon) {
      this.categoryDrawerCurrentIcon.textContent = catInfo.icon;
    }
    if (this.categoryDrawerCurrentName) {
      this.categoryDrawerCurrentName.textContent = catInfo.name;
    }
  }
}
