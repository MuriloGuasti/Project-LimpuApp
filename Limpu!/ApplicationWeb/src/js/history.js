/* ========================================================================
   Limpu! — History & Interactive Activity Calendar with Streak System
   - Radiant Soap Bubble Theme (🫧)
   - Robust Poppins Typography
   - Color Psychology: Gold (#FBBF24) Active vs Faded Grayscale Inactive
   - Mini Bubble Badges & Pulsing Outline on Calendar
   - Ignition Micro-interaction & Streak Freeze Safeguard (🛡️)
   ======================================================================== */

import confetti from 'canvas-confetti';

const HISTORY_STORAGE_KEY = 'limpu_history_records';
const STREAK_TARGET_POINTS = 20; // Daily point goal to ignite the streak

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export class HistoryManager {
  constructor() {
    this.viewDate = new Date();
    this.selectedDateKey = this.getTodayDateString();
    this.historyRecords = this.loadHistoryRecords();
    this.previousTodayPoints = this.getTodayPoints();

    // Streak Hero DOM Elements
    this.streakHeroCard = document.getElementById('streakHeroCard');
    this.streakBubbleIcon = document.getElementById('streakBubbleIcon');
    this.streakCountDisplay = document.getElementById('streakCountDisplay');
    this.streakStatusPill = document.getElementById('streakStatusPill');
    this.streakStatusText = document.getElementById('streakStatusText');
    this.streakPointsProgress = document.getElementById('streakPointsProgress');
    this.streakProgressFill = document.getElementById('streakProgressFill');
    this.btnStreakFreezeInfo = document.getElementById('btnStreakFreezeInfo');
    this.streakFreezeModal = document.getElementById('streakFreezeModal');
    this.btnStreakFreezeClose = document.getElementById('btnStreakFreezeClose');

    // Streak Ignition Celebration Modal (Bolha Acesa!)
    this.streakCelebrationModal = document.getElementById('streakCelebrationModal');
    this.streakCelebrationCard = document.getElementById('streakCelebrationCard');
    this.celebrationBubbleIcon = document.getElementById('celebrationBubbleIcon');
    this.celebrationStreakTag = document.getElementById('celebrationStreakTag');
    this.celebrationPointsText = document.getElementById('celebrationPointsText');
    this.btnStreakCelebrationClose = document.getElementById('btnStreakCelebrationClose');
    this.audioCtx = null;

    // Calendar DOM Elements
    this.monthLabel = document.getElementById('calendarMonthLabel');
    this.btnPrevMonth = document.getElementById('btnCalPrevMonth');
    this.btnNextMonth = document.getElementById('btnCalNextMonth');
    this.btnToday = document.getElementById('btnCalToday');
    this.daysGrid = document.getElementById('calendarDaysGrid');

    // Details Panel DOM Elements
    this.detailDateTitle = document.getElementById('historyDetailDate');
    this.detailTasksBadge = document.getElementById('historyDetailTasksCount');
    this.detailPointsBadge = document.getElementById('historyDetailPoints');
    this.detailList = document.getElementById('historyDetailTasksList');
    this.emptyDayState = document.getElementById('historyEmptyDay');
    this.monthSummaryBadge = document.getElementById('historyMonthSummaryBadge');

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateStreakDisplay(false);
    this.renderCalendar();
    this.renderSelectedDayDetails();
  }

  /**
   * Helper: Return 'YYYY-MM-DD' from Date object
   */
  formatDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  getTodayDateString() {
    return this.formatDateKey(new Date());
  }

  getTodayPoints() {
    const todayKey = this.getTodayDateString();
    const tasks = this.historyRecords[todayKey] || [];
    return tasks.reduce((sum, t) => sum + (Number(t.points) || 0), 0);
  }

  /**
   * Load history records. Starts fresh on reload (F5) or session start.
   */
  loadHistoryRecords() {
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      sessionStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (e) {}

    return this.createSampleHistory();
  }

  createSampleHistory() {
    const today = new Date();
    const records = {};
    const todayKey = this.formatDateKey(today);

    // Hoje inicia explicitamente zerado com 0 tarefas feitas
    records[todayKey] = [];

    // 1 day ago (yesterday) — 20 points (Streak active yesterday)
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = this.formatDateKey(yesterday);
    records[yesterdayKey] = [
      {
        id: 'kitchen_trash',
        name: 'Tirar o lixo da cozinha',
        points: 10,
        timeSpent: '04:15 min',
        durationSeconds: 255,
        category: 'kitchen',
        categoryName: 'Cozinha',
        categoryIcon: '🍽️',
        icon: '🗑️',
        pastelClass: 'icon-kitchen',
        completedAt: yesterday.getTime()
      },
      {
        id: 'clean_bed',
        name: 'Arrumar a cama',
        points: 10,
        timeSpent: '05:30 min',
        durationSeconds: 330,
        category: 'cleaning',
        categoryName: 'Limpeza Geral e Quartos',
        categoryIcon: '🧹',
        icon: '🛏️',
        pastelClass: 'icon-cleaning',
        completedAt: yesterday.getTime()
      }
    ];

    // 2 days ago — 20 points
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
    const twoDaysKey = this.formatDateKey(twoDaysAgo);
    records[twoDaysKey] = [
      {
        id: 'clean_dust',
        name: 'Tirar o pó dos móveis',
        points: 20,
        timeSpent: '12:45 min',
        durationSeconds: 765,
        category: 'cleaning',
        categoryName: 'Limpeza Geral e Quartos',
        categoryIcon: '🧹',
        icon: '🪶',
        pastelClass: 'icon-cleaning',
        completedAt: twoDaysAgo.getTime()
      }
    ];

    // 3 days ago — 30 points
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    const threeDaysKey = this.formatDateKey(threeDaysAgo);
    records[threeDaysKey] = [
      {
        id: 'kitchen_wash_dishes',
        name: 'Lavar a louça',
        points: 30,
        timeSpent: '18:20 min',
        durationSeconds: 1100,
        category: 'kitchen',
        categoryName: 'Cozinha',
        categoryIcon: '🍽️',
        icon: '🫧',
        pastelClass: 'icon-kitchen',
        completedAt: threeDaysAgo.getTime()
      }
    ];

    return records;
  }

  saveHistoryRecords(records = this.historyRecords) {
    try {
      const json = JSON.stringify(records);
      sessionStorage.setItem(HISTORY_STORAGE_KEY, json);
    } catch (e) {
      console.warn('Erro ao salvar histórico:', e);
    }
  }

  bindEvents() {
    if (this.btnPrevMonth) {
      this.btnPrevMonth.addEventListener('click', () => this.changeMonth(-1));
    }

    if (this.btnNextMonth) {
      this.btnNextMonth.addEventListener('click', () => this.changeMonth(1));
    }

    if (this.btnToday) {
      this.btnToday.addEventListener('click', () => this.goToToday());
    }

    // Streak Freeze Info Modal events
    if (this.btnStreakFreezeInfo) {
      this.btnStreakFreezeInfo.addEventListener('click', () => this.openStreakFreezeModal());
    }

    if (this.btnStreakFreezeClose) {
      this.btnStreakFreezeClose.addEventListener('click', () => this.closeStreakFreezeModal());
    }

    if (this.streakFreezeModal) {
      this.streakFreezeModal.addEventListener('click', (e) => {
        if (e.target === this.streakFreezeModal) {
          this.closeStreakFreezeModal();
        }
      });
    }

    // Streak Ignition Celebration Modal events (Bolha Acesa!)
    if (this.btnStreakCelebrationClose) {
      this.btnStreakCelebrationClose.addEventListener('click', () => this.closeStreakCelebrationModal());
    }

    if (this.streakCelebrationModal) {
      this.streakCelebrationModal.addEventListener('click', (e) => {
        if (e.target === this.streakCelebrationModal) {
          this.closeStreakCelebrationModal();
        }
      });
    }
  }

  openStreakFreezeModal() {
    if (!this.streakFreezeModal) return;
    this.streakFreezeModal.classList.add('is-active');
    this.streakFreezeModal.setAttribute('aria-hidden', 'false');
  }

  closeStreakFreezeModal() {
    if (!this.streakFreezeModal) return;
    this.streakFreezeModal.classList.remove('is-active');
    this.streakFreezeModal.setAttribute('aria-hidden', 'true');
  }

  openStreakCelebrationModal(streakCount, todayPoints) {
    if (!this.streakCelebrationModal) return;

    if (this.celebrationStreakTag) {
      this.celebrationStreakTag.textContent = `🫧 Sequência de ${streakCount} ${streakCount === 1 ? 'dia' : 'dias'}!`;
    }
    if (this.celebrationPointsText) {
      this.celebrationPointsText.textContent = `+${todayPoints} pontos conquistados hoje!`;
    }

    // Inicia no estado cinza apagado
    if (this.celebrationBubbleIcon) {
      this.celebrationBubbleIcon.classList.remove('is-ignited');
    }
    if (this.streakCelebrationCard) {
      this.streakCelebrationCard.classList.remove('is-active');
    }

    this.streakCelebrationModal.classList.add('is-active');
    this.streakCelebrationModal.setAttribute('aria-hidden', 'false');

    // Toca som harmônico de comemoração
    this.playStreakIgnitionSound();

    // Pequeno delay para iniciar a animação fluida: transição de Cinza para Ouro radiante!
    setTimeout(() => {
      if (this.celebrationBubbleIcon) {
        this.celebrationBubbleIcon.classList.add('is-ignited');
      }
      if (this.streakCelebrationCard) {
        this.streakCelebrationCard.classList.add('is-active');
      }
      this.triggerStreakIgnitionAnimation();
    }, 220);
  }

  closeStreakCelebrationModal() {
    if (!this.streakCelebrationModal) return;
    this.streakCelebrationModal.classList.remove('is-active');
    this.streakCelebrationModal.setAttribute('aria-hidden', 'true');
    if (this.celebrationBubbleIcon) {
      this.celebrationBubbleIcon.classList.remove('is-ignited');
    }
    if (this.streakCelebrationCard) {
      this.streakCelebrationCard.classList.remove('is-active');
    }
  }

  playStreakIgnitionSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const notes = [
        { freq: 523.25, time: 0, dur: 0.16 },    // C5
        { freq: 659.25, time: 0.11, dur: 0.18 },  // E5
        { freq: 783.99, time: 0.22, dur: 0.2 },   // G5
        { freq: 1046.50, time: 0.35, dur: 0.55 }  // C6 (Triumphant sparkle)
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, now + n.time);

        gain.gain.setValueAtTime(0.12, now + n.time);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur);
      });
    } catch (e) {}
  }

  changeMonth(delta) {
    this.viewDate.setMonth(this.viewDate.getMonth() + delta);
    this.renderCalendar();
  }

  goToToday() {
    this.viewDate = new Date();
    this.selectedDateKey = this.getTodayDateString();
    this.renderCalendar();
    this.renderSelectedDayDetails();
  }

  /**
   * Calculate consecutive streak days
   */
  calculateStreak() {
    const today = new Date();
    const todayKey = this.formatDateKey(today);
    const todayPoints = this.getTodayPoints();
    const isTodayMet = todayPoints >= STREAK_TARGET_POINTS;

    let streak = 0;

    // If today is completed, start streak at 1 and check backwards from yesterday
    // If today is not yet completed, start streak check from yesterday
    let checkDate = new Date(today);
    if (isTodayMet) {
      streak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Check consecutive prior days
    while (true) {
      const key = this.formatDateKey(checkDate);
      const tasks = this.historyRecords[key] || [];
      const pts = tasks.reduce((s, t) => s + (Number(t.points) || 0), 0);

      if (pts >= STREAK_TARGET_POINTS || tasks.length > 0) {
        streak += 1;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      streakCount: Math.max(1, streak),
      isTodayMet,
      todayPoints
    };
  }

  /**
   * Update the Streak Hero UI Card (Active Gold vs Inactive Gray)
   */
  updateStreakDisplay(animateIgnition = false) {
    const { streakCount, isTodayMet, todayPoints } = this.calculateStreak();

    if (this.streakCountDisplay) {
      this.streakCountDisplay.textContent = streakCount;
    }

    // Update Progress towards 20 pts
    const progressPercent = Math.min(100, Math.round((todayPoints / STREAK_TARGET_POINTS) * 100));
    if (this.streakProgressFill) {
      this.streakProgressFill.style.width = `${progressPercent}%`;
    }
    if (this.streakPointsProgress) {
      this.streakPointsProgress.textContent = `${todayPoints} / ${STREAK_TARGET_POINTS} pts`;
    }

    if (!this.streakHeroCard) return;

    if (isTodayMet) {
      // Estado Ativo: Ouro Radiante (#FBBF24)
      this.streakHeroCard.classList.remove('is-inactive');
      this.streakHeroCard.classList.add('is-active');

      if (this.streakStatusText) {
        this.streakStatusText.textContent = '✨ Bolha Acesa Hoje!';
      }

      if (animateIgnition) {
        this.triggerStreakIgnitionAnimation();
      }
    } else {
      // Estado Inativo: Cinza Apagado (#94A3B8)
      this.streakHeroCard.classList.remove('is-active');
      this.streakHeroCard.classList.add('is-inactive');

      const remainingPts = STREAK_TARGET_POINTS - todayPoints;
      if (this.streakStatusText) {
        this.streakStatusText.textContent = `⏳ Falta ${remainingPts} pts para acender`;
      }
    }
  }

  /**
   * Micro-interaction: Ignition Jump, Golden Shimmer and Confetti Celebration!
   */
  triggerStreakIgnitionAnimation() {
    if (this.streakBubbleIcon) {
      this.streakBubbleIcon.classList.remove('animate-ignite');
      // Trigger reflow
      void this.streakBubbleIcon.offsetWidth;
      this.streakBubbleIcon.classList.add('animate-ignite');
    }

    try {
      confetti({
        particleCount: 55,
        spread: 80,
        origin: { y: 0.35, x: 0.5 },
        colors: ['#FBBF24', '#F59E0B', '#FDE047', '#2F80ED', '#FFFFFF']
      });
    } catch (e) {}
  }

  /**
   * Render the Calendar Month Grid
   */
  renderCalendar() {
    if (!this.daysGrid || !this.monthLabel) return;

    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    // 1. Update Month & Year header
    this.monthLabel.textContent = `${MONTH_NAMES[month]} ${year}`;

    // 2. Clear previous days
    this.daysGrid.innerHTML = '';

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    const today = new Date();
    const todayKey = this.getTodayDateString();

    // 3. Render previous month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthTotalDays - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const dateKey = this.formatDateKey(prevDate);
      const cell = this.createDayCell(dayNum, dateKey, false, today, todayKey);
      this.daysGrid.appendChild(cell);
    }

    // 4. Render current month days
    for (let dayNum = 1; dayNum <= totalDaysInMonth; dayNum++) {
      const date = new Date(year, month, dayNum);
      const dateKey = this.formatDateKey(date);
      const cell = this.createDayCell(dayNum, dateKey, true, today, todayKey);
      this.daysGrid.appendChild(cell);
    }

    // 5. Render next month leading days to complete 35 or 42 grid cells
    const totalCells = firstDayIndex + totalDaysInMonth;
    const remainingCells = totalCells > 35 ? 42 - totalCells : 35 - totalCells;

    for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
      const nextDate = new Date(year, month + 1, dayNum);
      const dateKey = this.formatDateKey(nextDate);
      const cell = this.createDayCell(dayNum, dateKey, false, today, todayKey);
      this.daysGrid.appendChild(cell);
    }

    this.updateMonthSummary();
  }

  createDayCell(dayNum, dateKey, isCurrentMonth, todayObj, todayKey) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'calendar-day-cell';
    cell.dataset.dateKey = dateKey;

    const [y, m, d] = dateKey.split('-').map(Number);
    const cellDate = new Date(y, m - 1, d);

    if (!isCurrentMonth) {
      cell.classList.add('other-month');
    }

    const isToday = dateKey === todayKey;
    const isFuture = cellDate.getTime() > todayObj.getTime() && !isToday;

    if (isFuture) {
      cell.classList.add('is-future-day');
    }

    // Tasks and points for this date
    const tasksDone = this.historyRecords[dateKey] || [];
    const datePoints = tasksDone.reduce((sum, t) => sum + (Number(t.points) || 0), 0);
    const hasActivity = tasksDone.length > 0;
    const isStreakMet = datePoints >= STREAK_TARGET_POINTS; // Meta diária batida (Bolha acendeu!)

    if (isStreakMet) {
      cell.classList.add('is-streak-gold');
    } else if (hasActivity) {
      cell.classList.add('has-activity');
    }

    if (isToday) {
      cell.classList.add('is-today');
      if (datePoints < STREAK_TARGET_POINTS) {
        cell.classList.add('is-today-waiting'); // Pulsing outline waiting for action!
      } else {
        cell.classList.add('is-today-done');
      }
    }

    const isSelected = dateKey === this.selectedDateKey;
    if (isSelected) {
      cell.classList.add('is-selected');
    }

    let bubbleBadge = '';
    if (isStreakMet) {
      bubbleBadge = `<span class="day-bubble-badge is-gold" title="${tasksDone.length} tarefa(s) • ${datePoints} pts (Bolha Acesa! 🫧✨)">🫧</span>`;
    } else if (hasActivity) {
      bubbleBadge = `<span class="day-bubble-badge" title="${tasksDone.length} tarefa(s) • ${datePoints} pts">🫧</span>`;
    }

    cell.innerHTML = `
      <span class="day-number">${dayNum}</span>
      ${bubbleBadge}
    `;

    cell.addEventListener('click', () => {
      this.selectDate(dateKey);
    });

    return cell;
  }

  selectDate(dateKey) {
    this.selectedDateKey = dateKey;

    const allCells = this.daysGrid.querySelectorAll('.calendar-day-cell');
    allCells.forEach((c) => {
      if (c.dataset.dateKey === dateKey) {
        c.classList.add('is-selected');
      } else {
        c.classList.remove('is-selected');
      }
    });

    this.renderSelectedDayDetails();
  }

  /**
   * Render details of selected day in the history panel
   */
  renderSelectedDayDetails() {
    if (!this.detailDateTitle) return;

    const [y, m, d] = this.selectedDateKey.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const todayKey = this.getTodayDateString();
    const isToday = this.selectedDateKey === todayKey;

    const monthName = MONTH_NAMES[dateObj.getMonth()];
    if (isToday) {
      this.detailDateTitle.textContent = `Hoje, ${d} de ${monthName}`;
    } else {
      this.detailDateTitle.textContent = `${d} de ${monthName} de ${y}`;
    }

    const tasks = this.historyRecords[this.selectedDateKey] || [];
    const totalPoints = tasks.reduce((sum, t) => sum + (Number(t.points) || 0), 0);

    if (this.detailTasksBadge) {
      this.detailTasksBadge.textContent = `${tasks.length} ${tasks.length === 1 ? 'tarefa' : 'tarefas'}`;
    }
    if (this.detailPointsBadge) {
      this.detailPointsBadge.textContent = `+${totalPoints} pts`;
    }

    if (!this.detailList || !this.emptyDayState) return;

    this.detailList.innerHTML = '';

    if (tasks.length === 0) {
      this.detailList.style.display = 'none';
      this.emptyDayState.style.display = 'flex';
      return;
    }

    this.emptyDayState.style.display = 'none';
    this.detailList.style.display = 'flex';

    tasks.forEach((task) => {
      const item = document.createElement('div');
      item.className = 'history-task-card';

      const timeSpentHtml = task.timeSpent
        ? `<span class="history-task-time-spent" title="Tempo dedicado a esta tarefa"><span class="time-spent-clock-icon">⏱️</span> ${task.timeSpent}</span>`
        : '';

      item.innerHTML = `
        <div class="history-task-left">
          <div class="task-icon-circle ${task.pastelClass || 'icon-kitchen'}" aria-hidden="true">
            ${task.icon || '✨'}
          </div>
          <div class="history-task-info">
            <span class="history-task-name">${task.name}</span>
            <div class="history-task-meta-row">
              <span class="history-task-category">${task.categoryIcon || ''} ${task.categoryName || ''}</span>
              ${timeSpentHtml}
            </div>
          </div>
        </div>
        <div class="history-task-right">
          <span class="history-task-points">+${task.points} pts</span>
          <span class="history-task-check" aria-label="Concluída">✓</span>
        </div>
      `;

      this.detailList.appendChild(item);
    });
  }

  updateMonthSummary() {
    if (!this.monthSummaryBadge) return;

    const year = this.viewDate.getFullYear();
    const month = String(this.viewDate.getMonth() + 1).padStart(2, '0');
    const monthPrefix = `${year}-${month}`;

    let monthTasksCount = 0;
    let monthPointsCount = 0;

    Object.keys(this.historyRecords).forEach((key) => {
      if (key.startsWith(monthPrefix)) {
        const list = this.historyRecords[key] || [];
        monthTasksCount += list.length;
        monthPointsCount += list.reduce((s, t) => s + (Number(t.points) || 0), 0);
      }
    });

    this.monthSummaryBadge.innerHTML = `
      <span>📅 Total no mês: <strong>${monthTasksCount} tarefas</strong></span>
      <span>•</span>
      <span><strong>+${monthPointsCount} pts</strong></span>
    `;
  }

  /**
   * Called by KanbanManager when a task is moved to "done"
   */
  recordTaskCompletion(task) {
    const todayKey = this.getTodayDateString();
    if (!this.historyRecords[todayKey]) {
      this.historyRecords[todayKey] = [];
    }

    const exists = this.historyRecords[todayKey].some((t) => t.id === task.id);
    if (!exists) {
      const currentPtsBefore = this.getTodayPoints();

      this.historyRecords[todayKey].push({
        id: task.id,
        name: task.name,
        points: task.points,
        timeSpent: task.timeSpent || '05:00 min',
        durationSeconds: task.durationSeconds || 300,
        category: task.category,
        categoryName: task.categoryName,
        categoryIcon: task.categoryIcon,
        icon: task.icon,
        pastelClass: task.pastelClass,
        completedAt: Date.now()
      });

      this.saveHistoryRecords();

      const newPtsAfter = this.getTodayPoints();
      const crossedTarget = currentPtsBefore < STREAK_TARGET_POINTS && newPtsAfter >= STREAK_TARGET_POINTS;

      this.updateStreakDisplay(crossedTarget);
      this.renderCalendar();
      if (this.selectedDateKey === todayKey) {
        this.renderSelectedDayDetails();
      }

      // Dispara o Pop-up de Comemoração da Bolha Acesa na tela inicial
      if (crossedTarget) {
        const { streakCount } = this.calculateStreak();
        setTimeout(() => {
          this.openStreakCelebrationModal(streakCount, newPtsAfter);
        }, 450);
      }
    }
  }

  /**
   * Called by KanbanManager when a task is moved away from "done"
   */
  removeTaskCompletion(taskId) {
    const todayKey = this.getTodayDateString();
    if (this.historyRecords[todayKey]) {
      this.historyRecords[todayKey] = this.historyRecords[todayKey].filter((t) => t.id !== taskId);
      this.saveHistoryRecords();
      this.updateStreakDisplay(false);
      this.renderCalendar();
      if (this.selectedDateKey === todayKey) {
        this.renderSelectedDayDetails();
      }
    }
  }

  reset() {
    this.closeStreakCelebrationModal();
    this.closeStreakFreezeModal();
    try {
      sessionStorage.removeItem(HISTORY_STORAGE_KEY);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (e) {}
    this.historyRecords = this.createSampleHistory();
    this.viewDate = new Date();
    this.selectedDateKey = this.getTodayDateString();
    this.updateStreakDisplay(false);
    this.renderCalendar();
    this.renderSelectedDayDetails();
  }
}
