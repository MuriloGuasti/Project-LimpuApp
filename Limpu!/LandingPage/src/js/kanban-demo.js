/* ==========================================================================
   Limpu! — Interactive Kanban Drag & Drop Demo
   ========================================================================== */

import confetti from 'canvas-confetti';

export function initKanbanDemo() {
  const draggables = document.querySelectorAll('.task-card-mini');
  const dropZones = document.querySelectorAll('.kanban-col-mini');
  const progressFill = document.getElementById('heroProgressFill');
  const progressNumber = document.getElementById('heroProgressNumber');
  const progressMsg = document.getElementById('heroProgressMsg');
  const feedbackToast = document.getElementById('appFeedbackToast');
  const toastIcon = document.getElementById('toastIcon');
  const toastText = document.getElementById('toastText');
  const andreScore = document.getElementById('phoneAndreScore') || document.getElementById('phoneMuriloScore');

  let currentPoints = 76;
  let andrePts = 320;
  let toastTimeout = null;

  // Shared audio context with mobile unlocking
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Pre-unlock audio context on first touch/click
  const unlockAudio = () => {
    getAudioContext();
    window.removeEventListener('touchstart', unlockAudio);
    window.removeEventListener('touchend', unlockAudio);
    window.removeEventListener('click', unlockAudio);
  };
  window.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
  window.addEventListener('touchend', unlockAudio, { passive: true, once: true });
  window.addEventListener('click', unlockAudio, { passive: true, once: true });

  // Sound synthesis / audio feedback (gentle pleasant chime)
  function playSuccessTone() {
    try {
      const ctx = getAudioContext();
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
      // Audio might be blocked by browser policy until gesture, safe to ignore
    }
  }

  // Update Progress UI helper
  function updateProgressUI() {
    if (progressFill) {
      progressFill.style.width = `${currentPoints}%`;
    }
    if (progressNumber) {
      progressNumber.textContent = `${currentPoints}%`;
    }
    if (progressMsg) {
      if (currentPoints >= 100) {
        progressMsg.innerHTML = '🏆 Semana 100% Concluída!';
      } else if (currentPoints >= 85) {
        progressMsg.innerHTML = 'Sensacional! Quase lá! 🔥';
      } else if (currentPoints >= 50) {
        progressMsg.innerHTML = 'Ótimo trabalho! 👏';
      } else {
        progressMsg.innerHTML = 'Vamos lá, rumo ao equilíbrio! 💪';
      }
    }
  }

  // Handle task marked as FEITO (increases progress)
  function handleTaskCompleted(card) {
    card.classList.add('is-done');
    card.classList.add('just-completed');
    
    const taskName = card.dataset.taskName || 'Tarefa';
    const points = parseInt(card.dataset.points || '10', 10);
    const assignee = card.dataset.assignee || 'André';

    playSuccessTone();

    // Trigger Confetti in brand palette (Action Blue, Sky Blue, Success Green, Warm Yellow, Support Blue)
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.65, x: 0.7 },
        colors: ['#2F80ED', '#60A5FA', '#10B981', '#F59E0B', '#E3F2FD']
      });
    } catch (e) {}

    // Increase progress & points
    currentPoints = Math.min(100, currentPoints + 12);
    if (assignee === 'André' || assignee === 'Murilo' || !assignee) {
      andrePts += points;
      if (andreScore) andreScore.textContent = `${andrePts} pts`;
    }

    updateProgressUI();

    // Show Toast
    showToast('🎉', `Boa! ${taskName} concluída +${points} pts`, 3000);

    setTimeout(() => {
      card.classList.remove('just-completed');
    }, 1000);
  }

  // Handle task removed from FEITO (decreases progress)
  function handleTaskUncompleted(card) {
    card.classList.remove('is-done');
    
    const taskName = card.dataset.taskName || 'Tarefa';
    const points = parseInt(card.dataset.points || '10', 10);
    const assignee = card.dataset.assignee || 'André';

    // Decrease progress & points
    currentPoints = Math.max(0, currentPoints - 12);
    if (assignee === 'André' || assignee === 'Murilo' || !assignee) {
      andrePts = Math.max(0, andrePts - points);
      if (andreScore) andreScore.textContent = `${andrePts} pts`;
    }

    updateProgressUI();

    // Show Toast
    showToast('↩️', `Tarefa reaberta: ${taskName} -${points} pts`, 2400);
  }

  // Helper for "Em andamento" toast feedback
  function showDoingToast(taskName) {
    showToast('⏳', `Em andamento: ${taskName}`, 2200);
  }

  // Shared Toast Helper
  function showToast(icon, message, duration = 2400) {
    if (feedbackToast && toastText) {
      if (toastIcon) {
        toastIcon.textContent = icon;
      }
      toastText.textContent = message;
      feedbackToast.classList.add('show');
      
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        feedbackToast.classList.remove('show');
      }, duration);
    }
  }

  // HTML5 Drag & Drop Setup
  draggables.forEach(card => {
    card.setAttribute('draggable', 'true');

    card.addEventListener('dragstart', (e) => {
      card.classList.add('is-dragging');
      e.dataTransfer.setData('text/plain', card.id || '');
      e.dataTransfer.effectAllowed = 'move';
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('is-dragging');
      dropZones.forEach(zone => zone.classList.remove('drop-active'));
    });
  });

  dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      zone.classList.add('drop-active');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drop-active');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drop-active');
      
      const draggingCard = document.querySelector('.task-card-mini.is-dragging');
      if (!draggingCard) return;

      const targetList = zone.querySelector('.task-list-mini');
      if (!targetList) return;

      const isDoneColumn = zone.classList.contains('col-done');
      const isDoingColumn = zone.classList.contains('col-doing');
      const wasDone = draggingCard.classList.contains('is-done');

      targetList.appendChild(draggingCard);

      const taskName = draggingCard.dataset.taskName || 'Tarefa';

      if (isDoneColumn && !wasDone) {
        handleTaskCompleted(draggingCard);
      } else if (!isDoneColumn && wasDone) {
        handleTaskUncompleted(draggingCard);
        if (isDoingColumn) {
          setTimeout(() => showDoingToast(taskName), 300);
        }
      } else if (isDoingColumn && !wasDone) {
        showDoingToast(taskName);
      }

      updateColCounts();
    });
  });

  // Task advancement handler (PARA FAZER -> FAZENDO -> FEITO -> PARA FAZER)
  function advanceTask(card) {
    const listTodo = document.getElementById('listTodo');
    const listDoing = document.getElementById('listDoing');
    const listDone = document.getElementById('listDone');

    if (!card) return;

    const taskName = card.dataset.taskName || 'Tarefa';

    if (card.parentElement === listTodo) {
      if (listDoing) {
        listDoing.appendChild(card);
        card.classList.remove('is-done');
        showDoingToast(taskName);
        updateColCounts();
      }
    } else if (card.parentElement === listDoing) {
      if (listDone && !card.classList.contains('is-done')) {
        listDone.appendChild(card);
        handleTaskCompleted(card);
        updateColCounts();
      }
    } else if (card.parentElement === listDone) {
      // If user taps in FEITO, it cycles back to PARA FAZER and reduces progress
      if (listTodo) {
        listTodo.appendChild(card);
        handleTaskUncompleted(card);
        updateColCounts();
      }
    }
  }

  // Touch & Click Support for Mobile and Tablet
  draggables.forEach(card => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    card.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = Date.now();
    }, { passive: true });

    card.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0];
      const deltaX = Math.abs(touch.clientX - touchStartX);
      const deltaY = Math.abs(touch.clientY - touchStartY);
      const timeDiff = Date.now() - touchStartTime;

      // Detect deliberate tap on mobile/tablet
      if (deltaX < 15 && deltaY < 15 && timeDiff < 400) {
        advanceTask(card);
      }
    }, { passive: true });

    // Click handler for tablets and responsive preview
    card.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        advanceTask(card);
      }
    });
  });

  function updateColCounts() {
    const listTodo = document.getElementById('listTodo');
    const listDoing = document.getElementById('listDoing');
    const listDone = document.getElementById('listDone');
    const countTodo = document.getElementById('countTodo');
    const countDoing = document.getElementById('countDoing');
    const countDone = document.getElementById('countDone');

    if (listTodo && countTodo) countTodo.textContent = listTodo.children.length;
    if (listDoing && countDoing) countDoing.textContent = listDoing.children.length;
    if (listDone && countDone) countDone.textContent = listDone.children.length;

    // Toggle empty column state (thinning when empty)
    dropZones.forEach(zone => {
      const list = zone.querySelector('.task-list-mini');
      if (list && list.children.length === 0) {
        zone.classList.add('is-empty');
      } else {
        zone.classList.remove('is-empty');
      }
    });
  }

  // Initial update
  updateColCounts();

  // Quick reset button or add task button
  const resetBtn = document.getElementById('btnResetDemo');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const listTodo = document.getElementById('listTodo');
      const listDoing = document.getElementById('listDoing');
      const listDone = document.getElementById('listDone');
      
      const task1 = document.getElementById('task1');
      const task2 = document.getElementById('task2');
      const task3 = document.getElementById('task3');

      if (task1 && listTodo) {
        task1.classList.remove('is-done');
        listTodo.appendChild(task1);
      }
      if (task2 && listDoing) {
        task2.classList.remove('is-done');
        listDoing.appendChild(task2);
      }
      if (task3 && listDone) {
        task3.classList.add('is-done');
        listDone.appendChild(task3);
      }

      currentPoints = 76;
      if (progressFill) progressFill.style.width = '76%';
      if (progressNumber) progressNumber.textContent = '76%';
      if (progressMsg) progressMsg.innerHTML = 'Ótimo trabalho! 👏';
      
      updateColCounts();
    });
  }
}
