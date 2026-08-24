/**
 * Limpu! — Friends & Household Effort Comparison Manager (Aba Amigos & Leaderboard)
 */

import { store } from './state.js';
import confetti from 'canvas-confetti';

export class FriendsManager {
  constructor(historyManager) {
    this.historyManager = historyManager;
    this.selectedFriend = null;
    this.previousUserRank = 4;
    this.audioCtx = null;

    // Friends database (Calibrated: André 120, Juliana 95, Marcos 80)
    this.friends = {
      andre: {
        id: 'andre',
        name: 'André',
        points: 120,
        streak: 5,
        isTodayMet: true,
        color: '#2F80ED',
        colorName: 'Azul',
        avatar: 'A',
        avatarClass: 'avatar-andre',
        cheer: 'Limpou a cozinha e organizou a sala 💪'
      },
      juliana: {
        id: 'juliana',
        name: 'Juliana',
        points: 95,
        streak: 4,
        isTodayMet: true,
        color: '#EF4444',
        colorName: 'Coral',
        avatar: 'J',
        avatarClass: 'avatar-juliana',
        cheer: 'Lavou roupas e cuidou das plantas 🌿'
      },
      marcos: {
        id: 'marcos',
        name: 'Marcos',
        points: 80,
        streak: 3,
        isTodayMet: true,
        color: '#8B5CF6',
        colorName: 'Roxo',
        avatar: 'M',
        avatarClass: 'avatar-marcos',
        cheer: 'Foco em banheiros e aspirador ✨'
      }
    };

    // User elements in Friends Tab
    this.friendsUserAvatar = document.getElementById('friendsUserAvatar');
    this.friendsUserName = document.getElementById('friendsUserName');
    this.friendsUserScore = document.getElementById('friendsUserScore');
    this.friendsUserStreak = document.getElementById('friendsUserStreak');
    this.friendsUserDesc = document.getElementById('friendsUserDesc');
    this.friendsCountPill = document.getElementById('friendsCountPill');
    this.friendsListCards = document.getElementById('friendsListCards');

    // Friend Action Menu Modal Elements
    this.friendActionModal = document.getElementById('friendActionModal');
    this.btnFriendActionModalClose = document.getElementById('btnFriendActionModalClose');
    this.friendActionAvatar = document.getElementById('friendActionAvatar');
    this.friendActionName = document.getElementById('friendActionName');
    this.friendActionStreak = document.getElementById('friendActionStreak');
    this.friendActionPoints = document.getElementById('friendActionPoints');
    this.btnOptionCompareFriend = document.getElementById('btnOptionCompareFriend');
    this.btnOptionCheerFriend = document.getElementById('btnOptionCheerFriend');
    this.btnOptionRemoveFriend = document.getElementById('btnOptionRemoveFriend');

    // Remove Confirmation Modal Elements
    this.removeFriendConfirmModal = document.getElementById('removeFriendConfirmModal');
    this.removeConfirmTitle = document.getElementById('removeConfirmTitle');
    this.removeConfirmDesc = document.getElementById('removeConfirmDesc');
    this.btnCancelRemoveFriend = document.getElementById('btnCancelRemoveFriend');
    this.btnConfirmRemoveFriend = document.getElementById('btnConfirmRemoveFriend');

    // Comparison Modal Elements
    this.friendCompareModal = document.getElementById('friendCompareModal');
    this.btnCompareModalClose = document.getElementById('btnCompareModalClose');
    this.btnCompareModalOk = document.getElementById('btnCompareModalOk');

    // Compare Elements inside Modal
    this.simStatusBadge = document.getElementById('compareStatusBadge');
    this.simBarP1 = document.getElementById('compareBarP1');
    this.simBarP2 = document.getElementById('compareBarP2');
    this.compareLegendP1 = document.getElementById('compareLegendP1');
    this.compareLegendP2 = document.getElementById('compareLegendP2');
    this.compareNameP1 = document.getElementById('compareNameP1');
    this.comparePtsP1 = document.getElementById('comparePtsP1');
    this.comparePctP1 = document.getElementById('comparePctP1');
    this.compareNameP2 = document.getElementById('compareNameP2');
    this.comparePtsP2 = document.getElementById('comparePtsP2');
    this.comparePctP2 = document.getElementById('comparePctP2');
    this.compareVerdictText = document.getElementById('compareVerdictText');

    // Floating overlays
    this.floatingClapsOverlay = document.getElementById('floatingClapsOverlay');
    this.appToastContainer = document.getElementById('appToastContainer');

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateUserDisplays();
    this.renderLeaderboard();

    store.subscribe(() => {
      this.updateUserDisplays();
      this.renderLeaderboard();
    });
  }

  bindEvents() {
    // Close Action Modal
    if (this.btnFriendActionModalClose) {
      this.btnFriendActionModalClose.addEventListener('click', () => this.closeActionModal());
    }
    if (this.friendActionModal) {
      this.friendActionModal.addEventListener('click', (e) => {
        if (e.target === this.friendActionModal) this.closeActionModal();
      });
    }

    // Option 1: Compare
    if (this.btnOptionCompareFriend) {
      this.btnOptionCompareFriend.addEventListener('click', () => {
        const friend = this.selectedFriend;
        this.closeActionModal();
        if (friend) {
          this.openCompareModal(friend);
        }
      });
    }

    // Option 2: Cheer / Parabenizar
    if (this.btnOptionCheerFriend) {
      this.btnOptionCheerFriend.addEventListener('click', () => {
        const friend = this.selectedFriend;
        this.closeActionModal();
        if (friend) {
          this.sendCheerToFriend(friend);
        }
      });
    }

    // Option 3: Remove Friend
    if (this.btnOptionRemoveFriend) {
      this.btnOptionRemoveFriend.addEventListener('click', () => {
        const friend = this.selectedFriend;
        this.closeActionModal();
        if (friend) {
          this.openRemoveConfirmModal(friend);
        }
      });
    }

    // Remove Confirmation
    if (this.btnCancelRemoveFriend) {
      this.btnCancelRemoveFriend.addEventListener('click', () => this.closeRemoveConfirmModal());
    }
    if (this.btnConfirmRemoveFriend) {
      this.btnConfirmRemoveFriend.addEventListener('click', () => this.confirmRemoveFriend());
    }
    if (this.removeFriendConfirmModal) {
      this.removeFriendConfirmModal.addEventListener('click', (e) => {
        if (e.target === this.removeFriendConfirmModal) this.closeRemoveConfirmModal();
      });
    }

    // Close Compare Modal
    if (this.btnCompareModalClose) {
      this.btnCompareModalClose.addEventListener('click', () => this.closeCompareModal());
    }
    if (this.btnCompareModalOk) {
      this.btnCompareModalOk.addEventListener('click', () => this.closeCompareModal());
    }
    if (this.friendCompareModal) {
      this.friendCompareModal.addEventListener('click', (e) => {
        if (e.target === this.friendCompareModal) this.closeCompareModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeActionModal();
        this.closeRemoveConfirmModal();
        this.closeCompareModal();
      }
    });
  }

  getUserScore() {
    const todayPoints = this.historyManager ? this.historyManager.getTodayPoints() : 0;
    const userBaseScore = 70; // 70 pts acumulados no mês conforme histórico
    return userBaseScore + todayPoints;
  }

  getUserStreakInfo() {
    if (this.historyManager && typeof this.historyManager.calculateStreak === 'function') {
      return this.historyManager.calculateStreak();
    }
    return { streakCount: 3, isTodayMet: false, todayPoints: 0 };
  }

  updateUserDisplays() {
    const state = store.getState();
    const name = state.name || 'Você';
    const initial = name.charAt(0).toUpperCase();
    const totalUserScore = this.getUserScore();
    const { streakCount, isTodayMet, todayPoints } = this.getUserStreakInfo();

    if (this.friendsUserName) {
      this.friendsUserName.textContent = name;
    }
    if (this.friendsUserAvatar) {
      this.friendsUserAvatar.textContent = initial;
    }
    if (this.friendsUserScore) {
      this.friendsUserScore.textContent = totalUserScore;
    }

    // Real streak alignment (3 dias pendente / 4 dias aceso)
    if (this.friendsUserStreak) {
      if (isTodayMet) {
        this.friendsUserStreak.innerHTML = `✨ ${streakCount} ${streakCount === 1 ? 'dia' : 'dias'}`;
        this.friendsUserStreak.className = 'friends-streak-pill streak-ignited';
      } else {
        this.friendsUserStreak.innerHTML = `🫧 ${streakCount} ${streakCount === 1 ? 'dia' : 'dias'}`;
        this.friendsUserStreak.className = 'friends-streak-pill streak-pending';
      }
    }

    if (this.friendsUserDesc) {
      if (isTodayMet) {
        this.friendsUserDesc.textContent = '✨ Bolha Dourada acesa hoje! Excelente trabalho!';
      } else {
        const remaining = Math.max(0, 20 - todayPoints);
        this.friendsUserDesc.textContent = `Falta apenas ${remaining} pts para acender a bolha hoje!`;
      }
    }
  }

  renderLeaderboard(skipConfetti = false) {
    if (!this.friendsListCards) return;

    const state = store.getState();
    const userName = state.name || 'Você';
    const userInitial = userName.charAt(0).toUpperCase();
    const userScore = this.getUserScore();
    const { streakCount, isTodayMet, todayPoints } = this.getUserStreakInfo();

    const userParticipant = {
      id: 'user_self',
      isUser: true,
      name: userName,
      points: userScore,
      streak: streakCount,
      isTodayMet,
      color: '#2F80ED',
      colorName: 'Azul',
      avatar: userInitial,
      avatarClass: 'avatar-user',
      cheer: isTodayMet ? '✨ Bolha Dourada acesa hoje!' : `Falta ${Math.max(0, 20 - todayPoints)} pts para acender`
    };

    const friendList = Object.values(this.friends);
    const participants = [...friendList, userParticipant];
    participants.sort((a, b) => b.points - a.points);

    // Update friend count pill
    if (this.friendsCountPill) {
      const count = friendList.length;
      this.friendsCountPill.textContent = `${count} ${count === 1 ? 'amigo' : 'amigos'}`;
    }

    // Find current user rank (skip climb animation/confetti if removing a friend)
    const currentUserRank = participants.findIndex((p) => p.isUser) + 1;
    const didUserClimb = !skipConfetti && currentUserRank < this.previousUserRank;
    this.previousUserRank = currentUserRank;

    this.friendsListCards.innerHTML = '';

    participants.forEach((item, index) => {
      const rank = index + 1;
      let rankBadgeHtml = '';
      let rankClass = `rank-${rank}`;

      if (rank === 1) {
        rankBadgeHtml = `<div class="friend-rank-badge rank-gold"><span>1º</span><span class="rank-crown-mini">👑</span></div>`;
      } else if (rank === 2) {
        rankBadgeHtml = `<div class="friend-rank-badge rank-silver"><span>2º</span><span class="rank-crown-mini">🥈</span></div>`;
      } else if (rank === 3) {
        rankBadgeHtml = `<div class="friend-rank-badge rank-bronze"><span>3º</span><span class="rank-crown-mini">🥉</span></div>`;
      } else {
        rankBadgeHtml = `<div class="friend-rank-badge rank-soft"><span>${rank}º</span></div>`;
      }

      const card = document.createElement('div');
      const isUser = item.isUser;
      card.className = `friend-card ${rankClass} ${isUser ? 'is-user' : ''} ${isUser && didUserClimb ? 'rank-climb-up' : ''}`;
      card.setAttribute('data-participant-id', item.id);

      const streakBadgeHtml = item.isTodayMet
        ? `<span class="friend-streak-tag tag-ignited">✨ ${item.streak} ${item.streak === 1 ? 'dia' : 'dias'}</span>`
        : `<span class="friend-streak-tag tag-pending">🫧 ${item.streak} ${item.streak === 1 ? 'dia' : 'dias'}</span>`;

      const userTagHtml = isUser ? `<span class="badge-you-pill">Você</span>` : '';

      card.innerHTML = `
        ${rankBadgeHtml}
        <div class="friend-avatar ${item.avatarClass}" style="${isUser ? 'background: linear-gradient(135deg, #2F80ED, #1555B0);' : ''}">${item.avatar}</div>
        <div class="friend-info">
          <div class="friend-name-row">
            <h4 class="friend-name">${item.name}</h4>
            ${userTagHtml}
            ${streakBadgeHtml}
          </div>
          <span class="friend-cheer-text">${item.cheer}</span>
        </div>
        <div class="friend-action-col">
          <div class="friend-score">
            <span class="f-score-number">${item.points}</span>
            <span class="f-score-unit">pts</span>
          </div>
          <span class="friend-card-hint">${isUser ? 'Meu Perfil' : 'Toque p/ opções'}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        if (isUser) {
          this.showToast(`Você está em ${rank}º lugar com ${item.points} pontos! 🚀`);
        } else {
          this.openActionModal(item);
        }
      });

      this.friendsListCards.appendChild(card);
    });

    if (didUserClimb) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6, x: 0.5 },
          colors: ['#2F80ED', '#FBBF24', '#10B981']
        });
      } catch (e) {}
    }
  }

  openActionModal(friend) {
    this.selectedFriend = friend;

    if (this.friendActionAvatar) {
      this.friendActionAvatar.textContent = friend.avatar;
      this.friendActionAvatar.className = `friend-action-avatar ${friend.avatarClass}`;
    }
    if (this.friendActionName) {
      this.friendActionName.textContent = friend.name;
    }
    if (this.friendActionStreak) {
      this.friendActionStreak.textContent = `🫧 ${friend.streak} dias em sequência`;
    }
    if (this.friendActionPoints) {
      this.friendActionPoints.textContent = `${friend.points} pts`;
    }

    if (this.friendActionModal) {
      this.friendActionModal.classList.add('is-active', 'active');
      this.friendActionModal.setAttribute('aria-hidden', 'false');
    }
  }

  closeActionModal() {
    if (this.friendActionModal) {
      this.friendActionModal.classList.remove('is-active', 'active');
      this.friendActionModal.setAttribute('aria-hidden', 'true');
    }
  }

  openRemoveConfirmModal(friend) {
    this.selectedFriend = friend;
    if (this.removeConfirmTitle) {
      this.removeConfirmTitle.textContent = `Remover ${friend.name}?`;
    }
    if (this.removeConfirmDesc) {
      this.removeConfirmDesc.textContent = `Você tem certeza que deseja remover ${friend.name} da sua lista de amigos? A divisão de esforço conjunta não será mais exibida.`;
    }
    if (this.removeFriendConfirmModal) {
      this.removeFriendConfirmModal.classList.add('is-active', 'active');
      this.removeFriendConfirmModal.setAttribute('aria-hidden', 'false');
    }
  }

  closeRemoveConfirmModal() {
    if (this.removeFriendConfirmModal) {
      this.removeFriendConfirmModal.classList.remove('is-active', 'active');
      this.removeFriendConfirmModal.setAttribute('aria-hidden', 'true');
    }
  }

  confirmRemoveFriend() {
    const friend = this.selectedFriend;
    if (!friend) return;

    this.closeRemoveConfirmModal();

    // Find card and animate removal
    const cardEl = this.friendsListCards.querySelector(`[data-participant-id="${friend.id}"]`);
    if (cardEl) {
      cardEl.classList.add('is-removing');
    }

    setTimeout(() => {
      delete this.friends[friend.id];
      this.renderLeaderboard(true);
      this.showToast(`${friend.name} foi removido(a) da lista de amigos.`);
    }, 380);
  }

  sendCheerToFriend(friend) {
    this.playApplauseSound();
    this.triggerFloatingClaps();
    this.showToast(`👏 Parabéns e aplausos enviados para ${friend.name}! 🎉`);
  }

  playApplauseSound() {
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
      const clapsCount = 14;

      for (let i = 0; i < clapsCount; i++) {
        const clapTime = now + (i * 0.075) + (Math.random() * 0.035);

        // Noise buffer for snap clap
        const bufferSize = ctx.sampleRate * 0.045;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (ctx.sampleRate * 0.012));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1100 + Math.random() * 500, clapTime);
        filter.Q.setValueAtTime(3.0, clapTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.22 + Math.random() * 0.1, clapTime);
        gain.gain.exponentialRampToValueAtTime(0.001, clapTime + 0.05);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(clapTime);
        noise.stop(clapTime + 0.06);
      }
    } catch (e) {
      console.warn('Erro ao tocar aplauso:', e);
    }
  }

  triggerFloatingClaps() {
    if (!this.floatingClapsOverlay) return;

    this.floatingClapsOverlay.innerHTML = '';
    this.floatingClapsOverlay.classList.add('is-active');

    const icons = ['👏', '👏', '✨', '🎉', '👏', '🌟', '🙌', '👏'];
    const count = 16;

    for (let i = 0; i < count; i++) {
      const clap = document.createElement('span');
      clap.className = 'floating-clap-item';
      clap.textContent = icons[Math.floor(Math.random() * icons.length)];
      clap.style.left = `${15 + Math.random() * 70}%`;
      clap.style.bottom = `${5 + Math.random() * 15}%`;
      clap.style.animationDelay = `${i * 0.08}s`;
      clap.style.fontSize = `${1.4 + Math.random() * 1.2}rem`;
      this.floatingClapsOverlay.appendChild(clap);
    }

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7, x: 0.5 },
        colors: ['#2F80ED', '#FBBF24', '#EF4444', '#10B981']
      });
    } catch (e) {}

    setTimeout(() => {
      this.floatingClapsOverlay.classList.remove('is-active');
      this.floatingClapsOverlay.innerHTML = '';
    }, 2400);
  }

  showToast(message) {
    if (!this.appToastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'app-toast-item';
    toast.textContent = message;

    this.appToastContainer.appendChild(toast);

    // Trigger reflow & show
    void toast.offsetWidth;
    toast.classList.add('is-visible');

    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  openCompareModal(friend) {
    this.updateUserDisplays();

    const state = store.getState();
    const userName = state.name || 'Você';
    const userScore = this.getUserScore();
    const friendScore = friend.points;

    const total = Math.max(1, userScore + friendScore);
    const userPct = Math.round((userScore / total) * 100);
    const friendPct = 100 - userPct;

    // Update Status Badge
    if (this.simStatusBadge) {
      const diff = Math.abs(userPct - friendPct);
      if (diff <= 12) {
        this.simStatusBadge.textContent = '⚖️ Divisão Justa & Saudável';
        this.simStatusBadge.className = 'sim-fairness-status status-balanced';
      } else if (diff <= 25) {
        this.simStatusBadge.textContent = '✨ Bom Equilíbrio';
        this.simStatusBadge.className = 'sim-fairness-status status-good';
      } else {
        this.simStatusBadge.textContent = '⚡ Em Movimento';
        this.simStatusBadge.className = 'sim-fairness-status status-action';
      }
    }

    // Update Bars
    if (this.simBarP1) {
      this.simBarP1.style.width = `${userPct}%`;
    }
    if (this.simBarP2) {
      this.simBarP2.style.width = `${friendPct}%`;
      this.simBarP2.style.backgroundColor = friend.color;
    }

    // Update Legends
    if (this.compareLegendP1) {
      this.compareLegendP1.textContent = `${userName} (Azul)`;
    }
    if (this.compareLegendP2) {
      this.compareLegendP2.textContent = `${friend.name} (${friend.colorName})`;
    }

    // Update User Box
    if (this.compareNameP1) this.compareNameP1.textContent = userName;
    if (this.comparePtsP1) this.comparePtsP1.textContent = `${userScore} pts`;
    if (this.comparePctP1) this.comparePctP1.textContent = `${userPct}%`;

    // Update Friend Box
    if (this.compareNameP2) this.compareNameP2.textContent = friend.name;
    if (this.comparePtsP2) this.comparePtsP2.textContent = `${friendScore} pts`;
    if (this.comparePctP2) this.comparePctP2.textContent = `${friendPct}%`;

    // Update Verdict Text
    if (this.compareVerdictText) {
      const diff = Math.abs(userPct - friendPct);
      if (diff <= 12) {
        this.compareVerdictText.innerHTML = `<strong>Sensacional!</strong> As tarefas estão distribuídas com equilíbrio ideal de esforço (<strong>${userPct}%</strong> vs <strong>${friendPct}%</strong>). Ninguém fica sobrecarregado e a casa flui com leveza.`;
      } else if (userPct > friendPct) {
        this.compareVerdictText.innerHTML = `<strong>Excelente empenho!</strong> Você está contribuindo com <strong>${userPct}%</strong> do esforço conjunto esta semana. A colaboração com ${friend.name} mantém o lar brilhando!`;
      } else {
        this.compareVerdictText.innerHTML = `<strong>Ótimo trabalho em equipe!</strong> ${friend.name} está com <strong>${friendPct}%</strong> e você com <strong>${userPct}%</strong>. Completando mais algumas tarefas hoje, vocês atingem o equilíbrio perfeito!`;
      }
    }

    // Show Modal
    if (this.friendCompareModal) {
      this.friendCompareModal.classList.add('is-active', 'active');
      this.friendCompareModal.setAttribute('aria-hidden', 'false');
    }
  }

  closeCompareModal() {
    if (this.friendCompareModal) {
      this.friendCompareModal.classList.remove('is-active', 'active');
      this.friendCompareModal.setAttribute('aria-hidden', 'true');
    }
  }
}
