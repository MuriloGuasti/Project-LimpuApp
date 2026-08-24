/**
 * Limpu! — World Leaderboard & Global Ranking Manager (Placar Mundial)
 */

import { store } from './state.js';

export class RankingManager {
  constructor(historyManager) {
    this.historyManager = historyManager;
    this.friendsManager = null;
    this.currentPeriod = 'week';
    this.previousUserRank = 12;
    this.audioCtx = null;
    this.selectedPlayer = null;

    // 15 Fictitious Players + 3 Friends (André, Juliana, Marcos)
    this.worldPlayers = [
      {
        id: 'camila_s',
        name: 'Camila S.',
        baseScore: 158,
        streak: 7,
        isTodayMet: true,
        location: 'São Paulo, SP',
        avatar: 'C',
        avatarClass: 'avatar-camila',
        color: '#10B981',
        cheer: 'Casa sempre brilhando e rotina leve ✨',
        isFriend: false,
        friendRequestSent: false
      },
      {
        id: 'mateus_l',
        name: 'Mateus Lima',
        baseScore: 145,
        streak: 6,
        isTodayMet: true,
        location: 'Curitiba, PR',
        avatar: 'M',
        avatarClass: 'avatar-mateus',
        color: '#8B5CF6',
        cheer: 'Aspirador e foco total no apê 🚀',
        isFriend: false,
        friendRequestSent: false
      },
      {
        id: 'larissa_r',
        name: 'Larissa Rocha',
        baseScore: 138,
        streak: 5,
        isTodayMet: true,
        location: 'Rio de Janeiro, RJ',
        avatar: 'L',
        avatarClass: 'avatar-larissa',
        color: '#EC4899',
        cheer: 'Cozinha impecável e louça zerada 💪',
        isFriend: false,
        friendRequestSent: false
      },
      {
        id: 'lucas_m',
        name: 'Lucas Miller',
        baseScore: 130,
        streak: 5,
        isTodayMet: true,
        location: 'Porto Alegre, RS',
        avatar: 'L',
        avatarClass: 'avatar-lucasm',
        color: '#06B6D4',
        cheer: 'Tudo nos trinques e plantas regadas 🌿',
        isFriend: false,
        friendRequestSent: false
      },
      {
        id: 'andre',
        name: 'André',
        baseScore: 120,
        streak: 5,
        isTodayMet: true,
        location: 'Seu Amigo 🏠',
        avatar: 'A',
        avatarClass: 'avatar-andre',
        color: '#2F80ED',
        cheer: 'Limpou a cozinha e organizou a sala 💪',
        isFriend: true,
        friendRequestSent: false
      },
      {
        id: 'felipe_r',
        name: 'Felipe Ramos',
        baseScore: 114,
        streak: 4,
        isTodayMet: true,
        location: 'Belo Horizonte, MG',
        avatar: 'F',
        avatarClass: 'avatar-felipe',
        color: '#F59E0B',
        cheer: 'Rotina de 15 minutos sem estresse ⏱️',
        isFriend: false,
        friendRequestSent: false
      },
      {
        id: 'beatriz_c',
        name: 'Beatriz C.',
        baseScore: 105,
        streak: 4,
        isTodayMet: true,
        location: 'Florianópolis, SC',
        avatar: 'B',
        avatarClass: 'avatar-beatriz',
        color: '#14B8A6',
        cheer: 'Plantas cuidadas e roupas dobradas 🌱',
        isFriend: false,
        friendRequestSent: false
      },
      {
        id: 'juliana',
        name: 'Juliana',
        baseScore: 95,
        streak: 4,
        isTodayMet: true,
        location: 'Sua Amiga 🏠',
        avatar: 'J',
        avatarClass: 'avatar-juliana',
        color: '#EF4444',
        cheer: 'Lavou roupas e cuidou das plantas 🌿',
        isFriend: true,
        friendRequestSent: false
      },
      {
        id: 'thiago_c',
        name: 'Thiago Costa',
        baseScore: 90,
        streak: 3,
        isTodayMet: true,
        location: 'Brasília, DF',
        avatar: 'T',
        avatarClass: 'avatar-thiago',
        color: '#6366F1',
        cheer: 'Divisão justa entre roommates 🏠',
        isFriend: false,
        friendRequestSent: false
      },
      {
        id: 'marcos',
        name: 'Marcos',
        baseScore: 80,
        streak: 3,
        isTodayMet: true,
        location: 'Seu Amigo 🏠',
        avatar: 'M',
        avatarClass: 'avatar-marcos',
        color: '#8B5CF6',
        cheer: 'Foco em banheiros e aspirador ✨',
        isFriend: true,
        friendRequestSent: false
      },
      {
        id: 'sofia_m',
        name: 'Sofia Martins',
        baseScore: 75,
        streak: 3,
        isTodayMet: true,
        location: 'Campinas, SP',
        avatar: 'S',
        avatarClass: 'avatar-sofia',
        color: '#F43F5E',
        cheer: 'Organização com calma e foco 🧘',
        isFriend: false,
        friendRequestSent: false
      },
      {
        id: 'gabriel_s',
        name: 'Gabriel Souza',
        baseScore: 65,
        streak: 2,
        isTodayMet: true,
        location: 'Salvador, BA',
        avatar: 'G',
        avatarClass: 'avatar-gabriel',
        color: '#F97316',
        cheer: 'Missão do dia cumprida com sucesso 🧹',
        isFriend: false,
        friendRequestSent: false
      },
      {
        id: 'mariana_d',
        name: 'Mariana Dias',
        baseScore: 55,
        streak: 2,
        isTodayMet: true,
        location: 'Recife, PE',
        avatar: 'M',
        avatarClass: 'avatar-mariana',
        color: '#A855F7',
        cheer: 'Limpando no ritmo da música 🎵',
        isFriend: false,
        friendRequestSent: false
      },
      {
        id: 'bruno_c',
        name: 'Bruno Castro',
        baseScore: 45,
        streak: 2,
        isTodayMet: true,
        location: 'Santos, SP',
        avatar: 'B',
        avatarClass: 'avatar-bruno',
        color: '#0284C7',
        cheer: 'Manutenção diária sem peso ✌️',
        isFriend: false,
        friendRequestSent: false
      },
      {
        id: 'fernanda_l',
        name: 'Fernanda Luz',
        baseScore: 35,
        streak: 1,
        isTodayMet: false,
        location: 'Fortaleza, CE',
        avatar: 'F',
        avatarClass: 'avatar-fernanda',
        color: '#EAB308',
        cheer: 'Começando a semana com foco ☀️',
        isFriend: false,
        friendRequestSent: false
      },
      {
        id: 'diego_a',
        name: 'Diego Alves',
        baseScore: 25,
        streak: 1,
        isTodayMet: false,
        location: 'Goiânia, GO',
        avatar: 'D',
        avatarClass: 'avatar-diego',
        color: '#0D9488',
        cheer: 'Uma tarefa por vez sem pressa 🎯',
        isFriend: false,
        friendRequestSent: false
      },
      {
        id: 'clara_n',
        name: 'Clara Nogueira',
        baseScore: 20,
        streak: 1,
        isTodayMet: false,
        location: 'Vitória, ES',
        avatar: 'C',
        avatarClass: 'avatar-clara',
        color: '#D946EF',
        cheer: 'Bolha Dourada garantida hoje 🫧',
        isFriend: false,
        friendRequestSent: false
      },
      {
        id: 'pedro_h',
        name: 'Pedro Henrique',
        baseScore: 15,
        streak: 1,
        isTodayMet: false,
        location: 'Manaus, AM',
        avatar: 'P',
        avatarClass: 'avatar-pedro',
        color: '#84CC16',
        cheer: 'Dando o primeiro passo no lar 👣',
        isFriend: false,
        friendRequestSent: false
      }
    ];

    // DOM Elements
    this.periodButtons = document.querySelectorAll('.ranking-period-pills .period-pill');
    this.rankingUserAvatar = document.getElementById('rankingUserAvatar');
    this.rankingUserName = document.getElementById('rankingUserName');
    this.rankingUserScoreVal = document.getElementById('rankingUserScoreVal');
    this.rankingUserGlobalRankBadge = document.getElementById('rankingUserGlobalRankBadge');
    this.rankingUserDesc = document.getElementById('rankingUserDesc');
    this.globalRankingCountPill = document.getElementById('globalRankingCountPill');
    this.globalRankingListCards = document.getElementById('globalRankingListCards');

    // Player Action Modal Elements
    this.playerActionModal = document.getElementById('playerActionModal');
    this.btnPlayerActionClose = document.getElementById('btnPlayerActionClose');
    this.modalPlayerAvatar = document.getElementById('modalPlayerAvatar');
    this.modalPlayerName = document.getElementById('modalPlayerName');
    this.modalPlayerRankBadge = document.getElementById('modalPlayerRankBadge');
    this.modalPlayerLocation = document.getElementById('modalPlayerLocation');
    this.modalPlayerScore = document.getElementById('modalPlayerScore');
    this.modalPlayerStreak = document.getElementById('modalPlayerStreak');
    this.modalPlayerCheer = document.getElementById('modalPlayerCheer');
    this.modalPlayerActionsContainer = document.getElementById('modalPlayerActionsContainer');
    this.btnSendFriendRequest = document.getElementById('btnSendFriendRequest');

    this.init();
  }

  setFriendsManager(manager) {
    this.friendsManager = manager;
  }

  init() {
    this.bindEvents();
    this.updateUserRanking();

    store.subscribe(() => {
      this.updateUserRanking();
    });
  }

  bindEvents() {
    // Period filter pills
    this.periodButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.periodButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentPeriod = btn.getAttribute('data-period') || 'week';
        this.renderGlobalLeaderboard();
      });
    });

    // Close Player Modal
    if (this.btnPlayerActionClose) {
      this.btnPlayerActionClose.addEventListener('click', () => this.closePlayerModal());
    }

    if (this.playerActionModal) {
      this.playerActionModal.addEventListener('click', (e) => {
        if (e.target === this.playerActionModal) {
          this.closePlayerModal();
        }
      });
    }

    // Send Friend Request Button
    if (this.btnSendFriendRequest) {
      this.btnSendFriendRequest.addEventListener('click', () => this.handleSendFriendRequest());
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.playerActionModal && this.playerActionModal.classList.contains('is-active')) {
        this.closePlayerModal();
      }
    });
  }

  getUserScore() {
    const todayPoints = this.historyManager ? this.historyManager.getTodayPoints() : 0;
    let baseScore = 70; // 70 pts acumulados no histórico mensal

    if (this.currentPeriod === 'month') {
      baseScore = 245;
      return Math.round(baseScore + todayPoints * 3.5);
    } else if (this.currentPeriod === 'all') {
      baseScore = 590;
      return Math.round(baseScore + todayPoints * 8.5);
    }

    return baseScore + todayPoints;
  }

  getUserStreakInfo() {
    if (this.historyManager && typeof this.historyManager.calculateStreak === 'function') {
      return this.historyManager.calculateStreak();
    }
    return { streakCount: 3, isTodayMet: false, todayPoints: 0 };
  }

  updateUserRanking() {
    this.renderGlobalLeaderboard();
  }

  renderGlobalLeaderboard() {
    if (!this.globalRankingListCards) return;

    const state = store.getState();
    const userName = state.name || 'Você';
    const userInitial = userName.charAt(0).toUpperCase();
    const userScore = this.getUserScore();
    const { streakCount, isTodayMet, todayPoints } = this.getUserStreakInfo();

    // Scale multiplier for players based on period
    let multiplier = 1;
    if (this.currentPeriod === 'month') multiplier = 3.5;
    if (this.currentPeriod === 'all') multiplier = 8.5;

    // Build participants array
    const userParticipant = {
      id: 'user_self',
      isUser: true,
      name: userName,
      points: userScore,
      streak: streakCount,
      isTodayMet,
      location: 'Sua Casa 🏠',
      color: '#2F80ED',
      avatar: userInitial,
      avatarClass: 'avatar-user',
      cheer: isTodayMet ? '✨ Bolha Dourada acesa hoje!' : `Falta ${Math.max(0, 20 - todayPoints)} pts para acender a bolha`,
      isFriend: false,
      friendRequestSent: false
    };

    const players = this.worldPlayers.map((p) => ({
      ...p,
      points: Math.round(p.baseScore * multiplier)
    }));

    const allParticipants = [...players, userParticipant];
    allParticipants.sort((a, b) => b.points - a.points);

    // Update count pill
    if (this.globalRankingCountPill) {
      this.globalRankingCountPill.textContent = `${allParticipants.length} lares`;
    }

    // Find current user rank
    const currentUserRank = allParticipants.findIndex((p) => p.isUser) + 1;
    const didUserClimb = currentUserRank < this.previousUserRank;
    this.previousUserRank = currentUserRank;

    // Update User Top Hero Card
    if (this.rankingUserName) this.rankingUserName.textContent = userName;
    if (this.rankingUserAvatar) this.rankingUserAvatar.textContent = userInitial;
    if (this.rankingUserScoreVal) this.rankingUserScoreVal.textContent = userScore;
    if (this.rankingUserGlobalRankBadge) {
      this.rankingUserGlobalRankBadge.textContent = `${currentUserRank}º Lugar Global 🌍`;
    }
    if (this.rankingUserDesc) {
      if (currentUserRank <= 3) {
        this.rankingUserDesc.textContent = '👑 Incrível! Você está no Pódio Mundial!';
      } else if (currentUserRank <= 10) {
        this.rankingUserDesc.textContent = '🚀 Sensacional! Você está no Top 10 Mundial!';
      } else {
        const diff = currentUserRank - 10;
        this.rankingUserDesc.textContent = `Faltam ${diff} posições para você alcançar o Top 10 Mundial!`;
      }
    }

    // Render Cards
    this.globalRankingListCards.innerHTML = '';

    allParticipants.forEach((item, index) => {
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
      card.setAttribute('data-player-id', item.id);

      const streakBadgeHtml = item.isTodayMet
        ? `<span class="friend-streak-tag tag-ignited">✨ ${item.streak} ${item.streak === 1 ? 'dia' : 'dias'}</span>`
        : `<span class="friend-streak-tag tag-pending">🫧 ${item.streak} ${item.streak === 1 ? 'dia' : 'dias'}</span>`;

      let badgeTagHtml = '';
      if (isUser) {
        badgeTagHtml = `<span class="badge-you-pill">Você</span>`;
      } else if (item.isFriend) {
        badgeTagHtml = `<span class="badge-friend-pill">Amigo</span>`;
      } else if (item.friendRequestSent) {
        badgeTagHtml = `<span class="badge-sent-pill">Solicitado</span>`;
      }

      const avatarStyle = isUser
        ? 'background: linear-gradient(135deg, #2F80ED, #1555B0);'
        : `background: linear-gradient(135deg, ${item.color || '#2F80ED'}, ${item.color || '#1555B0'}CC);`;

      card.innerHTML = `
        ${rankBadgeHtml}
        <div class="friend-avatar ${item.avatarClass || ''}" style="${avatarStyle}">${item.avatar}</div>
        <div class="friend-info">
          <div class="friend-name-row">
            <h4 class="friend-name">${item.name}</h4>
            ${badgeTagHtml}
            ${streakBadgeHtml}
          </div>
          <span class="friend-cheer-text">${item.location || item.cheer}</span>
        </div>
        <div class="friend-action-col">
          <div class="friend-score">
            <span class="f-score-number">${item.points}</span>
            <span class="f-score-unit">pts</span>
          </div>
          <span class="friend-card-hint">${isUser ? 'Meu Perfil' : item.isFriend ? 'Já é Amigo' : 'Ver Perfil'}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        if (isUser) {
          this.showToast(`⭐ Você está em ${rank}º lugar mundial com ${item.points} pontos! 🚀`);
        } else {
          this.openPlayerModal(item, rank);
        }
      });

      this.globalRankingListCards.appendChild(card);
    });

    if (didUserClimb) {
      this.playSuccessChime();
      try {
        confetti({
          particleCount: 45,
          spread: 65,
          origin: { y: 0.6, x: 0.5 },
          colors: ['#2F80ED', '#FBBF24', '#10B981']
        });
      } catch (e) {}
    }
  }

  openPlayerModal(player, rank) {
    this.selectedPlayer = player;
    if (!this.playerActionModal) return;

    if (this.modalPlayerAvatar) {
      this.modalPlayerAvatar.textContent = player.avatar;
      this.modalPlayerAvatar.style.background = `linear-gradient(135deg, ${player.color || '#2F80ED'}, ${player.color || '#1555B0'}CC)`;
    }

    if (this.modalPlayerName) {
      this.modalPlayerName.textContent = player.name;
    }

    if (this.modalPlayerRankBadge) {
      let crown = '';
      if (rank === 1) crown = ' 👑';
      else if (rank === 2) crown = ' 🥈';
      else if (rank === 3) crown = ' 🥉';
      this.modalPlayerRankBadge.textContent = `${rank}º Lugar Mundial${crown}`;
    }

    if (this.modalPlayerLocation) {
      this.modalPlayerLocation.textContent = `📍 ${player.location}`;
    }

    if (this.modalPlayerScore) {
      this.modalPlayerScore.textContent = `${player.points} pts`;
    }

    if (this.modalPlayerStreak) {
      this.modalPlayerStreak.textContent = `${player.isTodayMet ? '✨' : '🫧'} ${player.streak} dias`;
    }

    if (this.modalPlayerCheer) {
      this.modalPlayerCheer.textContent = `"${player.cheer}"`;
    }

    // Update Action Button
    if (this.modalPlayerActionsContainer) {
      if (player.isFriend) {
        this.modalPlayerActionsContainer.innerHTML = `
          <button type="button" class="btn btn-secondary btn-block btn-lg" disabled style="opacity: 0.9; cursor: default;">
            <span>✓ Já faz parte dos seus Amigos 🏠</span>
          </button>
        `;
      } else if (player.friendRequestSent) {
        this.modalPlayerActionsContainer.innerHTML = `
          <button type="button" class="btn btn-secondary btn-block btn-lg" disabled style="opacity: 0.9; cursor: default; background: #ECFDF5; color: #047857; border-color: #A7F3D0;">
            <span>✓ Solicitação de Amizade Enviada 📩</span>
          </button>
        `;
      } else {
        this.modalPlayerActionsContainer.innerHTML = `
          <button type="button" class="btn btn-primary btn-block btn-lg btn-add-friend-action" id="btnSendFriendRequest">
            <span>📩 Enviar Solicitação de Amizade</span>
          </button>
        `;
        const btn = this.modalPlayerActionsContainer.querySelector('#btnSendFriendRequest');
        if (btn) {
          btn.addEventListener('click', () => this.handleSendFriendRequest());
        }
      }
    }

    this.playerActionModal.classList.add('is-active', 'active');
    this.playerActionModal.setAttribute('aria-hidden', 'false');
  }

  closePlayerModal() {
    if (this.playerActionModal) {
      this.playerActionModal.classList.remove('is-active', 'active');
      this.playerActionModal.setAttribute('aria-hidden', 'true');
    }
  }

  handleSendFriendRequest() {
    const player = this.selectedPlayer;
    if (!player) return;

    player.friendRequestSent = true;
    this.playSuccessChime();

    try {
      confetti({
        particleCount: 32,
        spread: 55,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#2F80ED', '#10B981', '#FBBF24']
      });
    } catch (e) {}

    if (this.modalPlayerActionsContainer) {
      this.modalPlayerActionsContainer.innerHTML = `
        <button type="button" class="btn btn-secondary btn-block btn-lg" disabled style="opacity: 0.9; cursor: default; background: #ECFDF5; color: #047857; border-color: #A7F3D0;">
          <span>✓ Solicitação de Amizade Enviada 📩</span>
        </button>
      `;
    }

    this.renderGlobalLeaderboard();
    this.showToast(`📩 Solicitação de amizade enviada com sucesso para ${player.name}! 🎉`, 3200);

    setTimeout(() => {
      this.closePlayerModal();
    }, 1200);
  }

  playSuccessChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) this.audioCtx = new AudioCtx();
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  showToast(message, duration = 3000) {
    const container = document.getElementById('appToastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'app-toast-item';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('is-leaving');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}
