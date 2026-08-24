/* ==========================================================================
   Limpu! — Interactive Household Fairness Simulator
   ========================================================================== */

export function initSimulator() {
  const taskRows = document.querySelectorAll('.sim-task-row');
  const barP1 = document.getElementById('simBarP1');
  const barP2 = document.getElementById('simBarP2');
  const ptsP1 = document.getElementById('simPtsP1');
  const ptsP2 = document.getElementById('simPtsP2');
  const pctP1 = document.getElementById('simPctP1');
  const pctP2 = document.getElementById('simPctP2');
  const statusBadge = document.getElementById('simStatusBadge');
  const verdictText = document.getElementById('simVerdictText');

  if (!taskRows.length || !barP1 || !barP2) return;

  function calculateFairness() {
    let totalP1 = 0;
    let totalP2 = 0;

    taskRows.forEach(row => {
      const points = parseInt(row.dataset.points || '10', 10);
      const activeBtn = row.querySelector('.sim-assign-btn.active-p1, .sim-assign-btn.active-p2');
      
      if (activeBtn) {
        if (activeBtn.classList.contains('active-p1')) {
          totalP1 += points;
        } else if (activeBtn.classList.contains('active-p2')) {
          totalP2 += points;
        }
      }
    });

    const grandTotal = totalP1 + totalP2;
    const pct1 = grandTotal > 0 ? Math.round((totalP1 / grandTotal) * 100) : 50;
    const pct2 = grandTotal > 0 ? (100 - pct1) : 50;

    // Update UI elements
    if (barP1) barP1.style.width = `${pct1}%`;
    if (barP2) barP2.style.width = `${pct2}%`;

    if (ptsP1) ptsP1.textContent = `${totalP1} pts`;
    if (ptsP2) ptsP2.textContent = `${totalP2} pts`;

    if (pctP1) pctP1.textContent = `${pct1}%`;
    if (pctP2) pctP2.textContent = `${pct2}%`;

    // Verdict calculation
    const diff = Math.abs(pct1 - pct2);

    if (diff <= 10) {
      if (statusBadge) {
        statusBadge.textContent = '⚖️ Divisão Justa & Saudável';
        statusBadge.style.backgroundColor = 'var(--color-brand-blue)';
      }
      if (verdictText) {
        verdictText.innerHTML = `<strong>Sensacional!</strong> As tarefas estão distribuídas com equilíbrio ideal de esforço (<strong>${pct1}%</strong> vs <strong>${pct2}%</strong>). Ninguém fica sobrecarregado e a casa flui com leveza.`;
      }
    } else if (diff <= 25) {
      if (statusBadge) {
        statusBadge.textContent = '👍 Equilíbrio Razoável';
        statusBadge.style.backgroundColor = 'var(--color-doing)';
      }
      if (verdictText) {
        verdictText.innerHTML = `<strong>Bom andamento!</strong> Há uma leve diferença de carga (<strong>${pct1}%</strong> vs <strong>${pct2}%</strong>), mas ainda é sustentável se alternarem tarefas na próxima semana.`;
      }
    } else {
      if (statusBadge) {
        statusBadge.textContent = '⚠️ Alerta de Sobrecarga';
        statusBadge.style.backgroundColor = 'var(--color-todo)';
      }
      const overburdened = pct1 > pct2 ? 'André' : 'Juliana';
      if (verdictText) {
        verdictText.innerHTML = `<strong>Atenção ao desgaste!</strong> ${overburdened} está assumindo a maior parte do esforço pesado da casa. Com o Limpu!, vocês conseguem redistribuir 1 ou 2 tarefas com 1 clique!`;
      }
    }
  }

  // Attach button click listeners
  taskRows.forEach(row => {
    const btnP1 = row.querySelector('.btn-p1');
    const btnP2 = row.querySelector('.btn-p2');

    if (btnP1 && btnP2) {
      btnP1.addEventListener('click', () => {
        btnP1.classList.toggle('active-p1');
        btnP2.classList.remove('active-p2');
        calculateFairness();
      });

      btnP2.addEventListener('click', () => {
        btnP2.classList.toggle('active-p2');
        btnP1.classList.remove('active-p1');
        calculateFairness();
      });
    }
  });

  // Initial calculation
  calculateFairness();
}
