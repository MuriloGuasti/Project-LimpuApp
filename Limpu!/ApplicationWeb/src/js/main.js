import { AgeSlider } from './slider.js';
import { OnboardingFlow } from './onboarding.js';
import { KanbanManager } from './kanban.js';
import { TasksManager } from './tasks.js';
import { NavigationManager } from './navigation.js';
import { HistoryManager } from './history.js';
import { RankingManager } from './ranking.js';
import { FriendsManager } from './friends.js';
import { ProfileDrawerManager } from './profileDrawer.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Interactive Age Slider
  const ageSlider = new AgeSlider({
    rangeInputId: 'ageRangeInput',
    fillTrackId: 'sliderFillTrack',
    numberDisplayId: 'ageNumberDisplay',
    badgeDisplayId: 'ageBadgeDisplay',
    btnMinusId: 'btnAgeMinus',
    btnPlusId: 'btnAgePlus',
    min: 14,
    max: 99,
    initialValue: 24
  });

  // 2. Initialize Interactive Kanban Board
  const kanban = new KanbanManager();

  // 3. Initialize History & Activity Calendar Manager
  const history = new HistoryManager();
  kanban.setHistoryManager(history);

  // 4. Initialize Tasks Catalog Manager (3 tasks/day limit, modal popup, category filters)
  const tasksManager = new TasksManager(kanban);
  kanban.setTasksManager(tasksManager);

  // 5. Initialize Navigation / Tab Switching (Início, Tarefas, Histórico, Amigos, Placar)
  const navigation = new NavigationManager();

  // 6. Initialize Placar de Líderes Manager
  const ranking = new RankingManager(history);

  // 7. Initialize Friends & Effort Comparison Manager
  const friends = new FriendsManager(history);

  ranking.setFriendsManager(friends);
  kanban.setRankingManager(ranking);
  kanban.setFriendsManager(friends);

  navigation.onTabChange((tabHash) => {
    if (tabHash === '#ranking') {
      ranking.updateUserRanking();
    } else if (tabHash === '#amigos') {
      friends.updateUserDisplays();
      friends.renderLeaderboard();
    }
  });

  // 8. Initialize Onboarding Flow
  const onboarding = new OnboardingFlow({ ageSlider, kanban, tasksManager, navigation, history, ranking, friends });

  // 9. Initialize Profile Drawer (Top Right) with Configurações
  const profileDrawer = new ProfileDrawerManager({
    onResetApp: () => onboarding.resetFlow()
  });
});

