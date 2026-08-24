# Limpu! — Design System & Especificação Oficial do Produto

> **"Organizar é viver melhor juntos."**  
> Documento oficial de diretrizes de design, tokens CSS, paleta de cores 60-30-10, tipografia, componentes, sistema de gamificação e arquitetura do ecossistema **Limpu!** (Landing Page & Aplicativo Web).

---

## 1. Visão do Produto & Missão

**Limpu!** é um ecossistema gamificado de organização e divisão de tarefas domésticas feito para transformar uma rotina antes vista como chata, cansativa e solitária em uma experiência **divertida, leve, colaborativa e recompensadora**.

### Público-Alvo:
- 👫 **Casais**: Dividir tarefas com transparência, eliminando discussões e sobrecarga.
- 👨‍👩‍👧‍👦 **Famílias**: Engajar crianças e jovens com recompensas visuais e pontuação lúdica.
- 🏘️ **Repúblicas e Amigos**: Dividir a casa com clareza, mantendo a convivência harmoniosa e justa.
- 🧘 **Quem Mora Sozinho(a)**: Manter o foco, consistência diária e motivação com listas simples e gamificação acolhedora.

### Missão & Conceito de UX:
> *"Transformar o cuidado com o lar de uma obrigação estressante em uma jornada leve, bonita e divertida."*

O produto substitui cobranças por **reforço positivo**: micro-ações visíveis, streak da **Bolha de Sabão Radiante (`🫧`)**, cronômetro de foco sem pressão, confetes e sons satisfatórios de conquista.

---

## 2. Direção Visual & Princípios de Design

- **Estilo**: Mobile-first · Minimalista · Moderno · Acolhedor · Lúdico & Gamificado · Clean · Espaçoso · Cantos arredondados suaves (16px a 24px) · Micro-interações táteis e sonoras.
- **Identidade da Marca**: Wordmark `Limpu!` com a exclamação destacada em Azul de Ação: `Limpu<span class="brand-accent">!</span>` em fonte **Poppins (Medium 500)**.
- **Tom de Voz**: Empático, positivo, construtivo e motivador (nunca punitivo ou agressivo).

---

## 3. Sistema de Cores (A Regra 60-30-10)

O esquema cromático segue estritamente o equilíbrio visual **60-30-10**:

| Proporção | Papel | Cores | Uso no Produto |
|---|---|---|---|
| **60% — A Base** | Neutros de Fundo | `#F4F7F9` (Canvas) · `#FFFFFF` (Cards) | Fundo geral do app, superfícies dos cards, modais e containers |
| **30% — O Apoio** | Suporte Visual | `#E3F2FD` (Azul Claro) · `#F8FAFC` (Slate) | Slots de tarefas, badges inativos, fundos secundários e bordas sutis |
| **10% — A Ação** | Destaque Decisivo | `#2F80ED` (Azul de Ação) · `#1D4ED8` (Active) | Botões primários (CTAs), wordmark accent, interações principais e links |

### Cores de Status & Gamificação:
- **Verde Recompensa (`#10B981` / `#059669`)**: **Uso exclusivo de celebração** (tarefas concluídas, status "Feito", medalhas e confetes — nunca usado em botões de ação comuns).
- **Ouro da Bolha Acesa (`#FBBF24` / `#F59E0B` / `#FEF3C7`)**: Ativação da meta diária de 20 pts, streak dourado radiante e 1º lugar no pódio 👑.
- **Coral "Para Fazer" (`#EF4444` / `#FEE2E2`)**: Destaque sutil de itens pendentes no Kanban.
- **Âmbar "Fazendo" (`#F59E0B` / `#FEF3C7`)**: Foco em andamento com cronômetro inline.
- **Escudo Protetor (`#3B82F6` / 🛡️)**: Streak freeze contra imprevistos.

---

## 4. Tipografia Oficial

Combinação harmoniosa entre **Poppins** e **Inter**:

- **Poppins** (Títulos, Wordmark `Limpu!`, números de streak, métricas e cronômetro):
  - Wordmark: `Poppins 500 (Medium)` com letter-spacing `-0.025em`;
  - Títulos e KPIs: `Poppins 700 (Bold)` / `Poppins 800 (ExtraBold)`.
- **Inter** (Textos gerais, listas de tarefas, descrições, modais e botões):
  - `Inter 400 (Regular)`, `Inter 500 (Medium)`, `Inter 600 (SemiBold)`.

---

## 5. Arquitetura de Navegação & Telas

O aplicativo adota a estrutura **Single Viewport Confinada** com **5 abas na barra inferior**:

```
┌────────────────────────────────────────────────────────┐
│  APP HEADER (Fixo no Topo)                             │
│  Logo Limpu!  •  Avatar Clicável (Drawer)  •  Botão (+) │
├────────────────────────────────────────────────────────┤
│                                                        │
│  DASHBOARD CONTENT                                     │
│  • #inicio    (Kanban + Progresso + Modo Foco)         │
│  • #tarefas   (Slots Diários 3/3 + Catálogo + Drawer)  │
│  • #historico (Streak Bolha + Calendário Mensal)       │
│  • #amigos    (Leaderboard Semanal + Comparador ⚖️)    │
│  • #ranking   (Placar Geral da Casa + Conquistas)      │
│                                                        │
├────────────────────────────────────────────────────────┤
│  APP BOTTOM NAV (Fixa no Rodapé)                       │
│  [Início]   [Tarefas]   [Histórico]   [Amigos] [Placar]│
└────────────────────────────────────────────────────────┘
```

---

## 6. Funcionalidades & Módulos Principais

### 6.1. Início (`#inicio`): Kanban & Cronômetro de Foco
- **Card de Progresso do Dia**: Percentual dinâmico com barra arredondada;
- **Board Kanban (3 Colunas)**: *Para Fazer*, *Fazendo* e *Feito*;
- **Modo Foco Inline**: Cronômetro progressivo (`00:00 -> 00:01...`) embaixo da coluna Fazendo, incentivando presença sem contagem regressiva estressante;
- **Ação "Terminei!"**: Move a tarefa para Feito com som harmônico, confetes e soma de pontos.

### 6.2. Tarefas (`#tarefas`): Slots & Catálogo
- **Regra das 3 Tarefas/Dia**: Limite saudável para criar hábitos consistentes sem exaustão;
- **Catálogo com Drawer Lateral**: Categorias organizadas (Cozinha, Banheiro, Sala, Quartos, Lavanderia, Plantas e Pets).

### 6.3. Histórico (`#historico`): Sequência & Calendário
- **Meta da Bolha (20 pts/dia)**: Pop-up comemorativo de transição de cinza para ouro radiante;
- **Calendário Mensal Interativo**: Dias dourados para metas batidas e detalhamento do tempo gasto em cada tarefa (`⏱️ MM:SS min`);
- **Escudo Protetor (🛡️ Streak Freeze)**: Salvaguarda contra frustrações em dias atípicos.

### 6.4. Amigos (`#amigos`): Leaderboard & Comparador de Esforço
- **Card Superior (Você)**: Exibe avatar, nome, sequência real e pontuação do usuário;
- **Leaderboard com Você + Amigos**: Ordenação em tempo real e animação de subida (`rankClimbUp`);
- **Menu de Ações do Amigo**:
  - **⚖️ Comparar Esforço**: Simulador Dark Modern (`#0F172A`/`#1E293B`) com barra proporcional bicolor (Você vs Amigo) e diagnóstico de equilíbrio;
  - **👏 Parabenizar**: Som nativo de palmas (Web Audio API) + chuva de emojis flutuantes (`👏 ✨ 🎉`);
  - **🗑️ Remover Amigo**: Confirmação segura e saída com animação suave.

### 6.5. Placar (`#ranking`): Equilíbrio da Casa
- Medidor de harmonia (Divisão Justa 52%/48%) e conquistas semanais desbloqueadas.

### 6.6. Menu Drawer do Perfil (Canto Superior Direito)
- Painel lateral com Avatar, Nome, Tagline da Casa, Modal de Configurações Gerais e Botão de Reinício da Demonstração.

---

## 7. Tokens CSS do Ecossistema

```css
/* Paleta 60-30-10 */
--color-bg-base: #F4F7F9;
--color-surface-card: #FFFFFF;
--color-support-blue: #E3F2FD;
--color-brand-blue: #2F80ED;
--color-brand-blue-active: #1D4ED8;

/* Gamificação & Status */
--color-success-green: #10B981;
--color-gold-bubble: #FBBF24;
--color-gold-bg: #FEF3C7;
--color-todo-coral: #EF4444;
--color-doing-amber: #F59E0B;

/* Tipografia */
--font-heading: 'Poppins', sans-serif;
--font-body: 'Inter', system-ui, sans-serif;

/* Arredondamento */
--radius-card-lg: 22px;
--radius-card-task: 16px;
--radius-button: 14px;
--radius-pill: 9999px;

/* Sombras */
--shadow-card: 0 4px 14px rgba(15, 23, 42, 0.06);
--shadow-floating: 0 16px 36px rgba(15, 23, 42, 0.18);
```
