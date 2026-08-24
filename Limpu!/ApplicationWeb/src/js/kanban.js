/* ========================================================================
   Limpu! — Interactive Mini Kanban Board, Focus Timer & Daily Progress
   - Supports Drag & Drop, Touch, Click to Cycle Status
   - Pop-up Confirmation: "Iniciar tarefa {nome}?" on moving to FAZENDO
   - Real-time Focus Mode Stopwatch / Timer (00:00 -> 00:01 -> ...)
   - "Terminei!" Action -> moves to FEITO with Confetti, Chime & Streak Sync
   - "Cancelar" Action -> safely reverts task to PARA FAZER
   ======================================================================== */

import confetti from 'canvas-confetti';
import { store } from './state.js';

export class KanbanManager {
  constructor() {
    this.listTodo = document.getElementById('listTodo');
    this.listDoing = document.getElementById('listDoing');
    this.listDone = document.getElementById('listDone');

    this.countTodo = document.getElementById('countTodo');
    this.countDoing = document.getElementById('countDoing');
    this.countDone = document.getElementById('countDone');

    this.heroProgressNumber = document.getElementById('heroProgressNumber');
    this.heroProgressFill = document.getElementById('heroProgressFill');
    this.heroProgressMsg = document.getElementById('heroProgressMsg');
    this.heroProgressTasksCount = document.getElementById('heroProgressTasksCount');

    this.feedbackToast = document.getElementById('appFeedbackToast');
    this.toastIcon = document.getElementById('toastIcon');
    this.toastText = document.getElementById('toastText');
    this.toastTimeout = null;

    // Start Task Confirmation Modal
    this.taskStartModal = document.getElementById('taskStartModal');
    this.startModalCategory = document.getElementById('startModalCategory');
    this.startModalTaskName = document.getElementById('startModalTaskName');
    this.startModalPoints = document.getElementById('startModalPoints');
    this.btnStartModalCancel = document.getElementById('btnStartModalCancel');
    this.btnStartModalConfirm = document.getElementById('btnStartModalConfirm');

    // Reopen Task Confirmation Modal (FEITO -> PARA FAZER)
    this.taskReopenModal = document.getElementById('taskReopenModal');
    this.reopenModalCategory = document.getElementById('reopenModalCategory');
    this.reopenModalTaskName = document.getElementById('reopenModalTaskName');
    this.btnReopenModalCancel = document.getElementById('btnReopenModalCancel');
    this.btnReopenModalConfirm = document.getElementById('btnReopenModalConfirm');
    this.pendingReopenCard = null;

    // Single Task In Progress Modal (Foco Único)
    this.taskSingleFocusModal = document.getElementById('taskSingleFocusModal');
    this.singleFocusTaskName = document.getElementById('singleFocusTaskName');
    this.btnSingleFocusOk = document.getElementById('btnSingleFocusOk');

    // Active Inline Timer & Focus HUD (Embaixo do Kanban FAZENDO)
    this.inlineTimerHud = document.getElementById('kanbanInlineTimerHud');
    this.inlineTimerCategory = document.getElementById('inlineTimerCategory');
    this.inlineTimerDigits = document.getElementById('inlineTimerDigits');
    this.btnInlineTimerFinish = document.getElementById('btnInlineTimerFinish');
    this.btnInlineTimerCancel = document.getElementById('btnInlineTimerCancel');

    this.pendingStartCard = null;
    this.activeTimer = null; // { card, taskId, taskName, points, elapsedSeconds, intervalId }

    this.tasksManager = null;
    this.historyManager = null;
    this.rankingManager = null;
    this.friendsManager = null;
    this.audioCtx = null;
    this.init();
  }

  setTasksManager(manager) {
    this.tasksManager = manager;
    if (this.tasksManager) {
      this.loadDailyTasksIntoBoard(this.tasksManager.getDailyTasks());
    }
  }

  setHistoryManager(manager) {
    this.historyManager = manager;
  }

  setRankingManager(manager) {
    this.rankingManager = manager;
  }

  setFriendsManager(manager) {
    this.friendsManager = manager;
  }

  init() {
    this.setupAudioUnlock();
    this.updateUserAvatars();
    this.bindBoardDropEvents();
    this.bindModalEvents();
    this.updateCountsAndProgress();
  }

  setupAudioUnlock() {
    const unlockAudio = () => {
      this.getAudioContext();
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('touchend', unlockAudio);
      window.removeEventListener('click', unlockAudio);
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

  playSuccessChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      // Audio playback blocked or not supported
    }
  }

  showToast(icon, message, duration = 2400) {
    if (this.feedbackToast && this.toastText) {
      if (this.toastIcon) {
        this.toastIcon.textContent = icon;
      }
      this.toastText.textContent = message;
      this.feedbackToast.classList.add('show');

      if (this.toastTimeout) clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        this.feedbackToast.classList.remove('show');
      }, duration);
    }
  }

  updateUserAvatars() {
    const user = store.getState();
    const initial = user && user.name ? user.name.trim().charAt(0).toUpperCase() : 'U';

    const avatarAndre = document.querySelector('.avatar-andre');
    if (avatarAndre) {
      avatarAndre.textContent = initial;
      avatarAndre.title = user && user.name ? user.name : 'Você';
    }

    const appUserAvatar = document.getElementById('appUserAvatar');
    if (appUserAvatar) {
      appUserAvatar.textContent = initial;
      appUserAvatar.title = user && user.name ? user.name : 'Você';
    }

    const appUserNameDisplay = document.getElementById('appUserNameDisplay');
    if (appUserNameDisplay && user && user.name) {
      appUserNameDisplay.textContent = user.name;
    }

    const settingsAvatars = document.querySelectorAll('[data-user-avatar="true"]');
    settingsAvatars.forEach((el) => {
      el.textContent = initial;
    });
  }

  bindModalEvents() {
    // Start Confirmation Modal
    if (this.btnStartModalCancel) {
      this.btnStartModalCancel.addEventListener('click', () => this.closeStartModal());
    }

    if (this.btnStartModalConfirm) {
      this.btnStartModalConfirm.addEventListener('click', () => {
        const card = this.pendingStartCard;
        this.closeStartModal();
        if (card) {
          this.startTaskTimer(card);
        }
      });
    }

    if (this.taskStartModal) {
      this.taskStartModal.addEventListener('click', (e) => {
        if (e.target === this.taskStartModal) {
          this.closeStartModal();
        }
      });
    }

    // Reopen Confirmation Modal (FEITO -> PARA FAZER)
    if (this.btnReopenModalCancel) {
      this.btnReopenModalCancel.addEventListener('click', () => this.closeReopenModal());
    }

    if (this.btnReopenModalConfirm) {
      this.btnReopenModalConfirm.addEventListener('click', () => {
        const card = this.pendingReopenCard;
        this.closeReopenModal();
        if (card) {
          this.confirmReopenTask(card);
        }
      });
    }

    if (this.taskReopenModal) {
      this.taskReopenModal.addEventListener('click', (e) => {
        if (e.target === this.taskReopenModal) {
          this.closeReopenModal();
        }
      });
    }

    // Single Task In Progress Modal (Foco Único)
    if (this.btnSingleFocusOk) {
      this.btnSingleFocusOk.addEventListener('click', () => this.closeSingleFocusModal());
    }

    if (this.taskSingleFocusModal) {
      this.taskSingleFocusModal.addEventListener('click', (e) => {
        if (e.target === this.taskSingleFocusModal) {
          this.closeSingleFocusModal();
        }
      });
    }

    // Active Inline Timer Actions (Embaixo do Kanban FAZENDO)
    if (this.btnInlineTimerFinish) {
      this.btnInlineTimerFinish.addEventListener('click', () => this.finishActiveTaskTimer());
    }

    if (this.btnInlineTimerCancel) {
      this.btnInlineTimerCancel.addEventListener('click', () => this.cancelActiveTaskTimer());
    }
  }

  hasActiveTaskInProgress() {
    const doingCount = this.listDoing ? this.listDoing.querySelectorAll('.task-card-mini, .kanban-card-mini').length : 0;
    return doingCount > 0 || this.activeTimer !== null;
  }

  getActiveTaskName() {
    if (this.activeTimer && this.activeTimer.taskName) {
      return this.activeTimer.taskName;
    }
    if (this.listDoing) {
      const firstCard = this.listDoing.querySelector('.task-card-mini, .kanban-card-mini');
      if (firstCard && firstCard.dataset.taskName) {
        return firstCard.dataset.taskName;
      }
    }
    return 'em andamento';
  }

  openSingleFocusModal(currentActiveName) {
    if (!this.taskSingleFocusModal) return;
    const name = currentActiveName || this.getActiveTaskName();
    if (this.singleFocusTaskName) {
      this.singleFocusTaskName.textContent = name;
    }
    this.taskSingleFocusModal.classList.add('is-active');
    this.taskSingleFocusModal.setAttribute('aria-hidden', 'false');
  }

  closeSingleFocusModal() {
    if (!this.taskSingleFocusModal) return;
    this.taskSingleFocusModal.classList.remove('is-active');
    this.taskSingleFocusModal.setAttribute('aria-hidden', 'true');
  }

  openStartModal(card) {
    if (!this.taskStartModal || !card) return;

    // Se já existe uma tarefa em andamento no FAZENDO, não permite abrir outra concorrente!
    const isAlreadyDoingThisCard = this.activeTimer && this.activeTimer.card === card;
    if (this.hasActiveTaskInProgress() && !isAlreadyDoingThisCard) {
      this.openSingleFocusModal(this.getActiveTaskName());
      return;
    }

    this.pendingStartCard = card;

    const taskName = card.dataset.taskName || 'Tarefa';
    const points = card.dataset.points || '10';
    const categoryName = card.dataset.categoryName || 'Geral';
    const categoryIcon = card.dataset.categoryIcon || '🍽️';

    if (this.startModalTaskName) this.startModalTaskName.textContent = taskName;
    if (this.startModalPoints) this.startModalPoints.textContent = `+${points} pts`;
    if (this.startModalCategory) this.startModalCategory.textContent = `${categoryIcon} ${categoryName}`;

    this.taskStartModal.classList.add('is-active');
    this.taskStartModal.setAttribute('aria-hidden', 'false');
  }

  closeStartModal() {
    if (!this.taskStartModal) return;
    this.taskStartModal.classList.remove('is-active');
    this.taskStartModal.setAttribute('aria-hidden', 'true');
    this.pendingStartCard = null;
  }

  openReopenModal(card) {
    if (!this.taskReopenModal || !card) return;
    this.pendingReopenCard = card;

    const taskName = card.dataset.taskName || 'Tarefa';
    const categoryName = card.dataset.categoryName || 'Geral';
    const categoryIcon = card.dataset.categoryIcon || '🍽️';

    if (this.reopenModalTaskName) this.reopenModalTaskName.textContent = taskName;
    if (this.reopenModalCategory) this.reopenModalCategory.textContent = `${categoryIcon} ${categoryName}`;

    this.taskReopenModal.classList.add('is-active');
    this.taskReopenModal.setAttribute('aria-hidden', 'false');
  }

  closeReopenModal() {
    if (!this.taskReopenModal) return;
    this.taskReopenModal.classList.remove('is-active');
    this.taskReopenModal.setAttribute('aria-hidden', 'true');
    this.pendingReopenCard = null;
  }

  confirmReopenTask(card) {
    if (!card) return;
    const taskId = card.dataset.taskId;
    const taskName = card.dataset.taskName || 'Tarefa';
    const points = card.dataset.points || '10';

    card.classList.remove('is-done');
    this.removeCardTimerBadge(card);

    if (this.listTodo) {
      this.listTodo.appendChild(card);
    }

    if (this.tasksManager && taskId) {
      this.tasksManager.updateDailyTaskStatus(taskId, 'todo');
    }

    if (this.historyManager && taskId) {
      this.historyManager.removeTaskCompletion(taskId);
    }

    if (this.rankingManager) {
      this.rankingManager.updateUserRanking();
    }
    if (this.friendsManager) {
      this.friendsManager.updateUserDisplays();
      this.friendsManager.renderLeaderboard();
    }

    this.showToast('↩️', `Tarefa ${taskName} reaberta em Para Fazer (-${points} pts)`, 2600);
    this.updateCountsAndProgress();
  }

  openInlineTimer(categoryIcon, categoryName, points, taskName) {
    if (!this.inlineTimerHud) return;
    if (this.inlineTimerCategory) this.inlineTimerCategory.textContent = `${categoryIcon} ${categoryName}`;
    if (this.inlineTimerDigits) this.inlineTimerDigits.textContent = '00:00';
    this.inlineTimerHud.classList.add('is-active');
  }

  closeInlineTimer() {
    if (!this.inlineTimerHud) return;
    this.inlineTimerHud.classList.remove('is-active');
  }

  formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const mm = String(mins).padStart(2, '0');
    const ss = String(secs).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  startTaskTimer(card) {
    if (!card) return;

    // Clear previous timer if another task was ticking
    if (this.activeTimer && this.activeTimer.intervalId) {
      clearInterval(this.activeTimer.intervalId);
    }

    const taskId = card.dataset.taskId;
    const taskName = card.dataset.taskName || 'Tarefa';
    const points = card.dataset.points || '10';
    const categoryName = card.dataset.categoryName || 'Geral';
    const categoryIcon = card.dataset.categoryIcon || '🍽️';

    // 1. Move card to Doing
    card.classList.remove('is-done');
    if (this.listDoing) {
      this.listDoing.appendChild(card);
    }

    if (this.tasksManager && taskId) {
      this.tasksManager.updateDailyTaskStatus(taskId, 'doing');
    }

    // 2. Set up active timer tracking
    this.activeTimer = {
      card,
      taskId,
      taskName,
      points,
      elapsedSeconds: 0,
      intervalId: null
    };

    // 3. Open Inline Timer HUD below Fazendo
    this.openInlineTimer(categoryIcon, categoryName, points, taskName);

    // 4. Update Card Timer Badge
    this.updateCardTimerBadge(card, '00:00');

    // 5. Start Interval
    this.activeTimer.intervalId = setInterval(() => {
      if (!this.activeTimer) return;
      this.activeTimer.elapsedSeconds += 1;
      const formatted = this.formatTime(this.activeTimer.elapsedSeconds);

      if (this.inlineTimerDigits) {
        this.inlineTimerDigits.textContent = formatted;
      }
      this.updateCardTimerBadge(card, formatted);
    }, 1000);

    this.updateCountsAndProgress();
  }

  updateCardTimerBadge(card, timeFormatted) {
    let badge = card.querySelector('.card-live-timer-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'card-live-timer-badge';
      const metaRow = card.querySelector('.task-meta') || card.querySelector('.task-details') || card;
      metaRow.appendChild(badge);
    }
    badge.innerHTML = `<span class="live-dot-mini"></span> ⏱️ ${timeFormatted}`;
  }

  removeCardTimerBadge(card) {
    if (!card) return;
    const badge = card.querySelector('.card-live-timer-badge');
    if (badge) {
      badge.remove();
    }
  }

  finishActiveTaskTimer() {
    if (!this.activeTimer) {
      this.closeInlineTimer();
      return;
    }

    const { card, taskId, taskName, points, elapsedSeconds, intervalId } = this.activeTimer;
    if (intervalId) clearInterval(intervalId);

    const timeSpent = this.formatTime(elapsedSeconds);
    this.removeCardTimerBadge(card);

    // Move to done
    card.classList.add('is-done');
    card.classList.add('just-completed');
    if (this.listDone) {
      this.listDone.appendChild(card);
    }

    if (this.tasksManager && taskId) {
      this.tasksManager.updateDailyTaskStatus(taskId, 'done');
    }

    // Sync with History & Streaks
    if (this.historyManager) {
      const fullTask = this.tasksManager
        ? this.tasksManager.getDailyTasks().find((t) => t.id === taskId)
        : null;
      const formattedDuration = `${timeSpent} min`;
      this.historyManager.recordTaskCompletion({
        ...(fullTask || {}),
        id: taskId,
        name: taskName,
        points: points,
        timeSpent: formattedDuration,
        durationSeconds: elapsedSeconds,
        category: fullTask ? fullTask.category : 'general',
        categoryName: fullTask ? fullTask.categoryName : 'Geral',
        categoryIcon: fullTask ? fullTask.categoryIcon : '✨',
        icon: fullTask ? fullTask.icon : '✨',
        pastelClass: fullTask ? fullTask.pastelClass : 'icon-kitchen'
      });
    }

    if (this.rankingManager) {
      this.rankingManager.updateUserRanking();
    }
    if (this.friendsManager) {
      this.friendsManager.updateUserDisplays();
      this.friendsManager.renderLeaderboard();
    }

    this.playSuccessChime();
    try {
      confetti({
        particleCount: 48,
        spread: 75,
        origin: { y: 0.55, x: 0.5 },
        colors: ['#2F80ED', '#10B981', '#FBBF24', '#F59E0B', '#E3F2FD']
      });
    } catch (e) {}

    this.showToast('🎉', `Sensacional! ${taskName} concluída em ${timeSpent} (+${points} pts)!`, 3400);

    this.activeTimer = null;
    this.closeInlineTimer();
    this.updateCountsAndProgress();
  }

  cancelActiveTaskTimer() {
    if (!this.activeTimer) {
      this.closeInlineTimer();
      return;
    }

    const { card, taskId, taskName, intervalId } = this.activeTimer;
    if (intervalId) clearInterval(intervalId);

    this.removeCardTimerBadge(card);
    card.classList.remove('is-done');

    // Return to Todo
    if (this.listTodo) {
      this.listTodo.appendChild(card);
    }

    if (this.tasksManager && taskId) {
      this.tasksManager.updateDailyTaskStatus(taskId, 'todo');
    }

    this.showToast('↩️', `Tarefa ${taskName} cancelada e retornada para Para Fazer`, 2400);

    this.activeTimer = null;
    this.closeInlineTimer();
    this.updateCountsAndProgress();
  }

  loadDailyTasksIntoBoard(dailyTasks) {
    if (this.listTodo) this.listTodo.innerHTML = '';
    if (this.listDoing) this.listDoing.innerHTML = '';
    if (this.listDone) this.listDone.innerHTML = '';

    if (!dailyTasks || dailyTasks.length === 0) {
      this.renderEmptyBoardHint();
      this.updateCountsAndProgress();
      return;
    }

    dailyTasks.forEach((task) => {
      const card = this.createTaskCardElement(task);
      if (task.status === 'done') {
        card.classList.add('is-done');
        if (this.listDone) this.listDone.appendChild(card);
      } else if (task.status === 'doing') {
        if (this.listDoing) this.listDoing.appendChild(card);
      } else {
        if (this.listTodo) this.listTodo.appendChild(card);
      }
    });

    this.updateCountsAndProgress();
  }

  renderEmptyBoardHint() {
    const hint = document.createElement('div');
    hint.className = 'kanban-empty-hint';
    hint.innerHTML = `
      <span class="empty-hint-icon">📋</span>
      <p class="empty-hint-text">Nenhuma tarefa escolhida para hoje.<br>Vá na aba <strong>Tarefas</strong> para selecionar até 3 atividades!</p>
    `;
    if (this.listTodo) {
      this.listTodo.appendChild(hint);
    }
  }

  createTaskCardElement(task) {
    const card = document.createElement('div');
    card.className = 'task-card-mini';
    card.id = `card_${task.id}`;
    card.draggable = true;
    card.dataset.taskId = task.id;
    card.dataset.taskName = task.name;
    card.dataset.points = task.points;
    card.dataset.category = task.category || 'general';
    card.dataset.categoryName = task.categoryName || 'Geral';
    card.dataset.categoryIcon = task.categoryIcon || '🍽️';
    card.dataset.icon = task.icon || '🫧';

    const user = store.getState();
    const initial = user && user.name ? user.name.trim().charAt(0).toUpperCase() : 'U';

    card.innerHTML = `
      <div class="task-left">
        <div class="task-icon-circle ${task.pastelClass || 'icon-kitchen'}" aria-hidden="true">
          ${task.icon || '✨'}
        </div>
        <div class="task-details">
          <span class="task-name">${task.name}</span>
          <div class="task-meta">
            <span class="tag-category">${task.categoryIcon || ''} ${task.categoryName || ''}</span>
            <span>•</span>
            <span class="tag-points">+${task.points} pts</span>
          </div>
        </div>
      </div>
      <div class="task-right">
        <div class="task-assignee avatar-andre" title="Você">${initial}</div>
        <span class="task-check-icon" aria-label="Concluída">✓</span>
      </div>
    `;

    this.bindCardDragAndClick(card);
    return card;
  }

  bindCardDragAndClick(card) {
    // Drag Start
    card.addEventListener('dragstart', (e) => {
      card.classList.add('is-dragging');
      e.dataTransfer.setData('text/plain', card.id);
      e.dataTransfer.effectAllowed = 'move';
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('is-dragging');
      document.querySelectorAll('.kanban-col-mini').forEach((c) => c.classList.remove('drop-active'));
    });

    // Touch Support
    let touchStartX = 0;
    let touchStartY = 0;

    card.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    card.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
        this.handleCardClick(card);
      }
    });

    // Desktop Click
    card.addEventListener('click', (e) => {
      if (!card.classList.contains('is-dragging')) {
        this.handleCardClick(card);
      }
    });
  }

  handleCardClick(card) {
    const currentList = card.parentElement ? card.parentElement.id : '';

    if (currentList === 'listTodo') {
      // Prompt to start task!
      this.openStartModal(card);
    } else if (currentList === 'listDoing') {
      // If clicked card is doing, ensure inline timer is open
      if (this.activeTimer && this.activeTimer.card === card) {
        this.openInlineTimer(card.dataset.categoryIcon, card.dataset.categoryName, card.dataset.points, card.dataset.taskName);
      } else {
        this.startTaskTimer(card);
      }
    } else if (currentList === 'listDone') {
      // Prompt to reopen task to todo!
      this.openReopenModal(card);
    }
  }

  bindBoardDropEvents() {
    const cols = document.querySelectorAll('.kanban-col-mini');
    cols.forEach((col) => {
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        col.classList.add('drop-active');
      });

      col.addEventListener('dragleave', () => {
        col.classList.remove('drop-active');
      });

      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('drop-active');
        const cardId = e.dataTransfer.getData('text/plain');
        const card = document.getElementById(cardId);
        const targetStatus = col.dataset.status;

        if (card && targetStatus) {
          const sourceList = card.parentElement ? card.parentElement.id : '';

          if (sourceList === 'listTodo') {
            // Regra 1: Arrastar de PARA FAZER para FAZENDO ou para FEITO -> sempre abre pop-up para iniciar e ligar timer!
            if (targetStatus === 'doing' || targetStatus === 'done') {
              this.openStartModal(card);
            }
          } else if (sourceList === 'listDoing') {
            if (targetStatus === 'done') {
              this.finishActiveTaskTimer();
            } else if (targetStatus === 'todo') {
              this.cancelActiveTaskTimer();
            }
          } else if (sourceList === 'listDone') {
            // Regra 2: Arrastar de FEITO para PARA FAZER -> abre pop-up de confirmação de reabertura!
            if (targetStatus === 'todo') {
              this.openReopenModal(card);
            } else if (targetStatus === 'doing') {
              this.openStartModal(card);
            }
          }
        }
      });
    });
  }

  moveTaskToStatus(card, status) {
    const taskId = card.dataset.taskId;
    const taskName = card.dataset.taskName || 'Tarefa';
    const points = card.dataset.points || '10';

    if (status === 'todo') {
      const wasDone = card.classList.contains('is-done');
      card.classList.remove('is-done');
      this.removeCardTimerBadge(card);

      if (this.listTodo) this.listTodo.appendChild(card);

      if (this.tasksManager && taskId) {
        this.tasksManager.updateDailyTaskStatus(taskId, 'todo');
      }

      if (wasDone) {
        if (this.historyManager && taskId) {
          this.historyManager.removeTaskCompletion(taskId);
        }
        this.showToast('↩️', `Tarefa reaberta: ${taskName} (-${points} pts)`, 2400);
      }
    } else if (status === 'doing') {
      this.openStartModal(card);
      return;
    } else if (status === 'done') {
      const wasDone = card.classList.contains('is-done');
      card.classList.add('is-done');
      card.classList.add('just-completed');
      this.removeCardTimerBadge(card);

      if (this.listDone) this.listDone.appendChild(card);

      if (this.tasksManager && taskId) {
        this.tasksManager.updateDailyTaskStatus(taskId, 'done');
      }

      if (!wasDone) {
        if (this.historyManager) {
          const fullTask = this.tasksManager
            ? this.tasksManager.getDailyTasks().find((t) => t.id === taskId)
            : null;
          this.historyManager.recordTaskCompletion({
            ...(fullTask || {}),
            id: taskId,
            name: taskName,
            points: points,
            timeSpent: '05:00 min',
            durationSeconds: 300,
            category: fullTask ? fullTask.category : 'general',
            categoryName: fullTask ? fullTask.categoryName : 'Geral',
            categoryIcon: fullTask ? fullTask.categoryIcon : '✨',
            icon: fullTask ? fullTask.icon : '✨',
            pastelClass: fullTask ? fullTask.pastelClass : 'icon-kitchen'
          });
        }

        this.playSuccessChime();
        try {
          confetti({
            particleCount: 40,
            spread: 65,
            origin: { y: 0.65, x: 0.5 },
            colors: ['#2F80ED', '#60A5FA', '#10B981', '#F59E0B', '#E3F2FD']
          });
        } catch (e) {}

        this.showToast('🎉', `Boa! ${taskName} concluída (+${points} pts)`, 3000);
      }
    }

    this.updateCountsAndProgress();
  }

  updateCountsAndProgress() {
    const todoCards = this.listTodo ? this.listTodo.querySelectorAll('.task-card-mini, .kanban-card-mini').length : 0;
    const doingCards = this.listDoing ? this.listDoing.querySelectorAll('.task-card-mini, .kanban-card-mini').length : 0;
    const doneCards = this.listDone ? this.listDone.querySelectorAll('.task-card-mini, .kanban-card-mini').length : 0;

    if (this.countTodo) this.countTodo.textContent = todoCards;
    if (this.countDoing) this.countDoing.textContent = doingCards;
    if (this.countDone) this.countDone.textContent = doneCards;

    const totalAddedToday = todoCards + doingCards + doneCards;

    let percentage = 0;
    if (totalAddedToday > 0) {
      percentage = Math.round((doneCards / totalAddedToday) * 100);
    }

    if (this.heroProgressNumber) {
      this.heroProgressNumber.textContent = `${percentage}%`;
    }
    if (this.heroProgressFill) {
      this.heroProgressFill.style.width = `${percentage}%`;
    }

    if (this.heroProgressTasksCount) {
      this.heroProgressTasksCount.textContent = `${doneCards}/${totalAddedToday} tarefas`;
    }

    if (this.heroProgressMsg) {
      if (totalAddedToday === 0) {
        this.heroProgressMsg.textContent = 'Adicione até 3 tarefas do dia na aba Tarefas!';
      } else if (doneCards === 0) {
        this.heroProgressMsg.textContent = `${totalAddedToday} tarefas prontas para hoje. Mãos à obra!`;
      } else if (doneCards === totalAddedToday) {
        this.heroProgressMsg.textContent = 'Incrível! Você concluiu todas as tarefas de hoje!';
      } else {
        this.heroProgressMsg.textContent = `Ótimo ritmo! ${doneCards} de ${totalAddedToday} tarefas concluídas.`;
      }
    }
  }

  reset() {
    if (this.activeTimer && this.activeTimer.intervalId) {
      clearInterval(this.activeTimer.intervalId);
    }
    this.activeTimer = null;
    this.pendingStartCard = null;
    this.pendingReopenCard = null;
    this.closeStartModal();
    this.closeReopenModal();
    this.closeSingleFocusModal();
    this.closeInlineTimer();

    this.loadDailyTasksIntoBoard([]);
    this.updateCountsAndProgress();
  }
}
