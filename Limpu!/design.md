# 📘 Guia de Identidade Visual e Design System — **Limpu!** ✨

> **"Organizar é viver melhor juntos."**  
> Documento oficial de diretrizes de design, tokens CSS, paleta de cores 60-30-10, tipografia, componentes, micro-interações, fluxos e catálogo de features do ecossistema **Limpu!** (Aplicativo Web e Landing Page).

---

## 1. Identidade e Nome da Marca

- **Nome Oficial**: `Limpu!`
- **Destaque Visual do Wordmark**: O nome da marca é estilizado com a exclamação destacada em Azul de Ação: `Limpu<span class="brand-accent">!</span>` ou `Limpu<span style="color: #2F80ED;">!</span>`.
- **Tipografia do Wordmark**:
  - **Família**: `'Poppins', sans-serif`
  - **Peso**: `Medium (500)`
  - **Letter-spacing**: `-0.02em` a `-0.03em`
  - **Código CSS**:
    ```css
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    letter-spacing: -0.025em;
    ```

---

## 2. Sistema de Cores (A Regra 60-30-10)

O esquema cromático do **Limpu!** foi concebido para transmitir clareza, modernidade, leveza e foco, evitando fadiga visual e priorizando contraste funcional.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          PALETA 60 - 30 - 10                            │
├──────────────────────────┬──────────────────────────┬───────────────────┤
│    60% — A BASE          │    30% — O APOIO         │  10% — A AÇÃO     │
│    #F4F7F9 / #FFFFFF     │    #E3F2FD (Light Blue)  │  #2F80ED (Action) │
└──────────────────────────┴──────────────────────────┴───────────────────┘
     💡 RECOMPENSA: #10B981 (Success Green) | 🫧 STREAKS: #FBBF24 (Gold)
```

### 2.1. A Base (60% da Interface)
Cria um ambiente suave, com respiro visual e sensação tátil de cartões físicos.
- **Fundo do App / Superfície Primária (`#F4F7F9`)**: Tom cinza/azul claríssimo (gelo) que reduz o brilho excessivo da tela e destaca os cartões brancos.
- **Cartões de Tarefas e Superfícies Elevadas (`#FFFFFF`)**: Branco puro para maximizar o contraste de leitura de textos e badges.
- **Fundo Sutil / Alt (`#EDF2F7` / `#F1F5F9`)**: Utilizado em divisórias, inputs e containers secundários.

### 2.2. O Apoio (30% da Interface)
Tons que dão suporte visual, organizam seções e indicam áreas de interação suave.
- **Azul de Apoio / Light Blue (`#E3F2FD`)**: Utilizado em áreas de seleção, fundos de chips, fundos de avatares neutros, trilhas de sliders e colunas de status.
- **Variações de Suporte**:
  - `Hover`: `#D0E7FC`
  - `Borda de Apoio`: `#BBDEFB`
  - `Texto de Destaque Secundário`: `#1976D2`

### 2.3. A Ação Principal (10% da Interface)
Reservada estritamente para elementos clicáveis decisivos, direcionando o olhar do usuário.
- **Azul Primário / Action Blue (`#2F80ED`)**: Botões principais ("Avançar", "Pronto!", "Começar a organizar", "Salvar"), o `!` da logo, botões selecionados no simulador, thumb e preenchimento de sliders ativos, e títulos de destaque.
- **Variações de Ação**:
  - `Hover`: `#1B6CD4`
  - `Active`: `#1555B0`
  - `Dark`: `#12428A`
  - `Card Gradient Hero`: `linear-gradient(145deg, #2F80ED 0%, #1555B0 100%)`
  - `Glow / Focus Ring`: `rgba(47, 128, 237, 0.28)`

### 2.4. 💡 O Toque de Recompensa (Verde Sucesso)
- **Verde Sucesso / Success Green (`#10B981`)**:
  - **Uso Exclusivo**: Utilizado **apenas** no ícone de check `✓` quando uma tarefa é finalizada, na coluna de tarefas concluídas ("Feito"), no botão de término do cronômetro ("Terminei!"), no badge de confirmação de cadastro e no confetti de celebração.
  - `Hover`: `#059669`
  - `Fundo Leve`: `#ECFDF5`
  - `Badge / Texto Escuro`: `#047857`
  - `Borda`: `#A7F3D0`

### 2.5. ✨ Cores do Sistema de Sequências (Streaks com Bolha Dourada)
- **Estado Ativo (Meta batida >= 20 pts no dia)**:
  - **Amarelo Ouro Radiante (`#FBBF24` / `#F59E0B`)**: Contraste quente com brilho shimmer (`box-shadow: 0 0 20px rgba(251, 191, 36, 0.55)`).
  - Texto de contagem: `#B45309`.
  - Fundo do Card Ativo: `linear-gradient(135deg, #FFFDF0 0%, #FEF9C3 100%)`.
- **Estado Inativo (Ainda não bateu a meta hoje)**:
  - **Cinza Apagado (`#94A3B8` / `#CBD5E1` / `#64748B`)**: Transmite a sensação de algo vazio esperando para ser aceso, estimulando a ação sem tom de punição.

### 2.6. 🎨 Cores Pastéis das 5 Categorias Oficiais
Cada ambiente possui uma cor pastel acolhedora para ícones de tarefas:
- 🍽️ **Cozinha**: Fundo `#FEF2F2` • Borda `#FEE2E2`
- 🧹 **Limpeza Geral e Quartos**: Fundo `#E0F2FE` • Borda `#BAE6FD`
- 🚽 **Banheiro**: Fundo `#FFFBEB` • Borda `#FEF3C7`
- 👕 **Lavanderia**: Fundo `#EDE9FE` • Borda `#DDD6FE`
- 🪴 **Cuidados Extras**: Fundo `#ECFDF5` • Borda `#A7F3D0`

---

## 3. Tabela Completa de Tokens de Cores

| Token CSS | Hex / Valor | Descrição & Uso |
| :--- | :--- | :--- |
| `--color-bg-app` / `--color-bg` | `#F4F7F9` | Fundo principal da aplicação e páginas (Base 60%). |
| `--color-bg-card` / `--color-surface` | `#FFFFFF` | Branco puro para cartões de tarefa e superfícies físicas. |
| `--color-bg-subtle` | `#EDF2F7` | Fundo neutro sutil para inputs e containers secundários. |
| `--color-support-blue` | `#E3F2FD` | Azul claro de apoio (Suporte 30%). |
| `--color-support-blue-hover` | `#D0E7FC` | Hover em chips e botões secundários de apoio. |
| `--color-support-blue-border` | `#BBDEFB` | Borda de destaque suave em cartões de fórmula e cards. |
| `--color-brand-blue` | `#2F80ED` | Azul de Ação principal (Ação 10%). |
| `--color-brand-blue-hover` | `#1B6CD4` | Estado hover de botões primários. |
| `--color-brand-blue-active` | `#1555B0` | Estado pressionado/ativo de botões primários. |
| `--color-brand-blue-mint` | `#60A5FA` | Azul céu luminoso para destaques e barras de progresso. |
| `--color-brand-blue-glow` | `rgba(47, 128, 237, 0.28)` | Efeito de glow/brilho e anel de foco acessível. |
| `--color-done` | `#10B981` | Verde de recompensa e tarefas finalizadas. |
| `--color-done-bg` | `#ECFDF5` | Fundo suave de tarefa concluída. |
| `--color-done-border` | `#A7F3D0` | Borda verde pastel de tarefa concluída. |
| `--color-todo` | `#EF4444` | Vermelho suave para status "Para Fazer" e alertas. |
| `--color-todo-bg` | `#FEF2F2` | Fundo de badge "Para Fazer". |
| `--color-doing` | `#F59E0B` | Âmbar/Amarelo para status "Fazendo" / "Em andamento". |
| `--color-doing-bg` | `#FFFBEB` | Fundo de badge "Fazendo". |
| `--color-gold-streak` | `#FBBF24` | Amarelo ouro radiante para sequência ativa de dias. |
| `--color-gold-streak-dark` | `#B45309` | Texto escuro de alto contraste para sequências douradas. |
| `--color-text-primary` | `#0F172A` | Azul escuro/ardósia quase preto para textos principais (alto contraste). |
| `--color-text-secondary` | `#475569` | Texto secundário e legendas explicativas. |
| `--color-text-tertiary` | `#94A3B8` | Textos desabilitados, placeholders e datas passadas. |
| `--color-border` | `#E2E8F0` | Borda padrão refinada para inputs, cartões e divisões. |
| `--color-border-subtle` | `#F1F5F9` | Borda ultraleve para separadores internos. |

---

## 4. Sistema Tipográfico

O sistema tipográfico utiliza a harmonia entre **Poppins** (personalidade acolhedora, títulos e gamificação) e **Inter** (máxima legibilidade de dados e interface):

```html
<!-- Importação Oficial Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
```

### 4.1. Regras de Aplicação das Fontes

| Elemento | Família Tipográfica | Peso (Font-Weight) | Tokens CSS |
| :--- | :--- | :--- | :--- |
| **Marca / Wordmark (`Limpu!`)** | `'Poppins', sans-serif` | **Medium (500)** | `--font-brand: 'Poppins', sans-serif;`<br>`--font-brand-weight: 500;` |
| **Contador de Sequências (Streaks)** | `'Poppins', sans-serif` | **Black (900)** | `font-family: var(--font-brand); font-weight: 900; font-size: 2.3rem;` |
| **Display do Cronômetro Digital** | `'Poppins', sans-serif` | **Black (900)** | `font-family: var(--font-brand); font-weight: 900; font-size: 3.2rem;` |
| **Títulos (`h1`, `h2`, `h3`, `h4`, `h5`)** | `'Poppins', sans-serif` | **SemiBold (600) a ExtraBold (800)** | `--font-heading: 'Poppins', sans-serif;` |
| **Textos Corridos, Parágrafos** | `'Inter', sans-serif` | **Regular (400) ou Medium (500)** | `--font-family: 'Inter', sans-serif;` |
| **Botões, Labels, Inputs e Badges** | `'Inter', sans-serif` | **SemiBold (600) ou Bold (700)** | `--font-family: 'Inter', sans-serif;` |
| **Nomes de Tarefas e Pontuação** | `'Inter', sans-serif` | **SemiBold (600) / Bold (700)** | `--font-family: 'Inter', sans-serif;` |

### 4.2. Escala de Tamanhos de Fonte

| Token CSS | Tamanho (rem / px) | Aplicação Típica |
| :--- | :--- | :--- |
| `--font-size-xs` | `0.75rem` (12px) | Metadados, pontos (+10 pts), horas, tooltips |
| `--font-size-sm` | `0.875rem` (14px) | Badges de status, textos auxiliares, itens de FAQ |
| `--font-size-base` | `1rem` (16px) | Corpo de texto padrão, labels de inputs, botões |
| `--font-size-md` | `1.125rem` (18px) | Subtítulos de seções, textos de destaque no onboarding |
| `--font-size-lg` | `1.25rem` (20px) | Títulos de cartões e colunas |
| `--font-size-xl` | `1.5rem` (24px) | Títulos de onboarding e modais |
| `--font-size-2xl` | `1.875rem` (30px) | Títulos de seção da Landing Page (H2) |
| `--font-size-3xl` | `2.25rem` (36px) | Destaque numérico de porcentagem (76%) |
| `--font-size-hero` | `clamp(2.35rem, 4.2vw, 3.75rem)` | Título principal da Hero Section (H1) |

---

## 5. Escala de Espaçamento (Múltiplos de 4px)

| Token CSS | Valor | Aplicação Típica |
| :--- | :--- | :--- |
| `--space-1` | `4px` | Gaps microscópicos, ícones de texto |
| `--space-2` | `8px` | Padding de badges, gaps internos de cards |
| `--space-3` | `12px` | Padding interno de task cards e inputs compactos |
| `--space-4` | `16px` | Padding padrão de cartões, botões e gaps de listas |
| `--space-5` | `20px` | Margens laterais de containers e padding de heros |
| `--space-6` | `24px` | Espaçamento entre cartões e blocos de conteúdo |
| `--space-7` | `32px` | Margem inferior de cabeçalhos de tela e títulos |
| `--space-8` | `40px` | Gaps de grids em telas médias e desktop |
| `--space-9` | `48px` | Padding vertical de seções padrão |
| `--space-10` | `64px` | Padding de seções amplas e banners |
| `--space-11` | `80px` | Margens verticais da Hero Section |
| `--space-12` | `96px` | Espaçamento de fechamento da Landing Page |

---

## 6. Sistema de Bordas e Arredondamento (Border Radius)

O design adota cantos suaves e arredondados para conferir um aspecto tátil, amigável e acolhedor ao lar.

| Token CSS | Valor | Aplicação |
| :--- | :--- | :--- |
| `--radius-xs` | `6px` | Detalhes internos, checkboxes, cursores |
| `--radius-sm` | `8px` / `10px` | Ícones de categorias (cozinha, banheiro, lixo) |
| `--radius-md` | `12px` / `14px` | Cartões de tarefa mini, rows de simulador |
| `--radius-button` | `14px` | Botões retangulares arredondados |
| `--radius-input` | `14px` | Campos de texto (Input de Nome) |
| `--radius-card-task` | `16px` | Cartões principais de tarefas no Kanban |
| `--radius-card-lg` | `22px` | Cartões de progresso Hero, containers de seção |
| `--radius-card-xl` | `28px` | Banner final de CTA, caixa de simulador |
| `--radius-pill` | `9999px` | Botões Pill, Badges de contagem, Sliders, Tags |
| `--radius-circle` / `--radius-full` | `50%` | Avatares de moradores, botões circulares de ação |

---

## 7. Sombras, Elevações e Profundidade (Box Shadows)

| Token CSS | Valor | Efeito Visual |
| :--- | :--- | :--- |
| `--shadow-sm` | `0 1px 3px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.03)` | Leve relevo para cards neutros |
| `--shadow-card` | `0 2px 14px rgba(15, 23, 42, 0.06)` | Elevação suave dos cartões de tarefa físicos |
| `--shadow-card-hover` | `0 6px 20px rgba(15, 23, 42, 0.1)` | Feedback ao passar o cursor sobre cards |
| `--shadow-elevated` | `0 8px 24px rgba(47, 128, 237, 0.15)` | Destaque de elementos ativos ou cards em foco |
| `--shadow-button` | `0 4px 14px rgba(47, 128, 237, 0.32)` | Botão de Ação Primário com presença visual |
| `--shadow-button-hover` | `0 6px 20px rgba(47, 128, 237, 0.45)` | Brilho tátil ao pairar sobre a ação |
| `--shadow-floating` | `0 16px 36px rgba(15, 23, 42, 0.08)` | Caixas suspensas e modais |
| `--shadow-phone` | `0 25px 60px -15px rgba(47, 128, 237, 0.22)` | Moldura de smartphone no showcase |

---

## 8. Transições, Micro-Animações e Celebrações

### 8.1. Curvas de Transição (Easings)
- `--transition-fast`: `150ms cubic-bezier(0.4, 0, 0.2, 1)` (Hover de botões, links e chips)
- `--transition-normal` / `--transition-base`: `250ms cubic-bezier(0.4, 0, 0.2, 1)` (Expansão de sanfonas FAQ, transição de cores)
- `--transition-spring`: `400ms cubic-bezier(0.34, 1.56, 0.64, 1)` (Preenchimento de barras de progresso e badges elásticos)
- `--transition-smooth`: `450ms cubic-bezier(0.16, 1, 0.3, 1)` (Transição entre telas de onboarding)

### 8.2. Micro-Interações Chave

```css
/* 1. Pulso de Conclusão da Tarefa */
@keyframes taskPulseComplete {
  0% { transform: scale(1); }
  50% { transform: scale(1.04); }
  100% { transform: scale(1); }
}

/* 2. Brilho Shimmer da Bolha Dourada */
@keyframes goldGlowShimmer {
  0%, 100% {
    box-shadow: 0 0 16px rgba(251, 191, 36, 0.45);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 24px rgba(251, 191, 36, 0.75);
    transform: scale(1.04);
  }
}

/* 3. Salto de Ignição da Sequência */
@keyframes streakIgnite {
  0% { transform: scale(1); }
  35% { transform: scale(1.35) rotate(-10deg); }
  65% { transform: scale(0.92) rotate(6deg); }
  100% { transform: scale(1) rotate(0deg); }
}

/* 4. Contorno Pulsante do Dia de Hoje no Calendário */
@keyframes pulseWaitingToday {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(47, 128, 237, 0.45);
    border-color: var(--color-brand-blue);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(47, 128, 237, 0);
    border-color: #60A5FA;
  }
}
```

- **Confetti de Celebração**:
  - **Paleta de Partículas**: `['#2F80ED', '#60A5FA', '#10B981', '#F59E0B', '#E3F2FD']`
  - Disparado automaticamente ao finalizar uma tarefa ou acender a bolha de sequência.
- **Design Sonoro Nativo (Web Audio API — 4 Assinaturas Sonoras Distintas)**:
  1. 🔔 **Áudio de Afirmação de Passo no Onboarding (`playStepAffirmationSound`)**: Pop harmônico nítido, rápido e acolhedor (E5 `659Hz` ➔ G5 `783Hz` com brilho harmônico em C6 `1046Hz` ➔ D6 `1174Hz`) em `0.22s`, transmitindo confirmação instantânea ao tocar em *"Avançar"*.
  2. 🏠 **Áudio de Boas-Vindas à Tela Inicial (`playWelcomeHomeSound`)**: Arpejo orquestral relaxante e mágico em acorde Fmaj9 (F4 `349Hz`, A4 `440Hz`, C5 `523Hz`, E5 `659Hz`, G5 `783Hz`, C6 `1046Hz`) em `0.85s`, transmitindo a sensação revigorante de um lar limpo, acolhedor e organizado pela primeira vez.
  3. 🎉 **Áudio de Conclusão de Tarefa (`playSuccessChime`)**: Síntese suave de sino tonal (frequência de `587.33Hz (D5)` para `880Hz (A5)`) em `0.35s` com decaimento exponencial orgânico.
  4. 🫧 **Áudio Triunfante da Bolha Acesa (`playStreakIgnitionSound`)**: Acorde festivo ascendente de 4 notas (C5 `523Hz` ➔ E5 `659Hz` ➔ G5 `783Hz` ➔ C6 `1046Hz`) em `0.55s`, disparado ao bater a meta de 20 pontos no dia.

---

## 9. Componentes Principais

### 9.1. Botões (`.btn`)
- **Primário (`.btn-primary`)**:
  - `background-color: var(--color-brand-blue)` (`#2F80ED`)
  - `color: #FFFFFF`
  - `box-shadow: 0 4px 14px rgba(47, 128, 237, 0.35)`
  - `border-radius: var(--radius-button)` ou `var(--radius-pill)`
- **Secundário (`.btn-secondary`)**:
  - `background-color: #FFFFFF`
  - `color: var(--color-text-primary)`
  - `border: 1.5px solid var(--color-border)`
- **Pill (`.btn-pill`)**:
  - `border-radius: 9999px`
- **Sucesso / Finalizar (`.btn-success-finish`)**:
  - `background: linear-gradient(135deg, #10B981, #059669)`
  - `color: #FFFFFF`
  - `box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35)`

### 9.2. Cartão de Tarefa (`.task-card-mini`)
- `background-color: #FFFFFF` (Branco Puro)
- `border-radius: var(--radius-card-task)` (16px)
- `border: 1px solid var(--color-border)`
- `box-shadow: var(--shadow-card)`
- Ícone do ambiente em quadrado arredondado com fundo pastel temático (Cozinha `#FEF2F2`, Quartos `#E0F2FE`, Banheiro `#FFFBEB`, Lavanderia `#EDE9FE`, Extras `#ECFDF5`).
- Checkmark (`.task-check-icon`): Cor `#10B981`, peso 800.

### 9.3. Card Hero de Progresso da Semana (`.card-progress-hero`)
- `background: linear-gradient(145deg, #2F80ED 0%, #1555B0 100%)`
- `border-radius: var(--radius-card-lg)` (22px)
- `color: #FFFFFF`
- Barra de preenchimento (`.progress-fill`): `linear-gradient(90deg, #60A5FA, #93C5FD)` com glow azul.

### 9.4. Slider de Idade (`#ageRangeInput`)
- Trilha inativa: `var(--color-bg-subtle)` (`#EDF2F7`)
- Trilha ativa (progresso): `var(--color-brand-blue)` (`#2F80ED`)
- Thumb (Ponteiro): `28px x 28px`, circular branco com anel e sombra `#2F80ED`.

---

## 10. Arquitetura de Telas & Layout Confinado

O aplicativo adota a arquitetura **Single Viewport Confinada** para emular a experiência nativa de smartphone sem barras de rolagem externas indesejadas no navegador:

```
┌────────────────────────────────────────────────────────┐
│  APP HEADER (Fixo no Topo — z-index: 25)               │
│  Logo Limpu!  •  Avatar Clicável (Drawer)  •  Botão (+) │
├────────────────────────────────────────────────────────┤
│                                                        │
│  DASHBOARD CONTENT (Scrollbar Interna Própria)         │
│  • #inicio    (Kanban + Progresso + Modo Foco)         │
│  • #tarefas   (Slots Diários + Catálogo + Drawer)      │
│  • #historico (Streak Bolha + Calendário + Detalhes)   │
│  • #amigos    (Leaderboard Semanal + Comparador ⚖️)    │
│  • #ranking   (Placar de Líderes + Podium + Conquistas)│
│                                                        │
├────────────────────────────────────────────────────────┤
│  APP BOTTOM NAV (Fixa no Rodapé — z-index: 30)         │
│  [Início]   [Tarefas]   [Histórico]   [Amigos] [Placar]│
└────────────────────────────────────────────────────────┘
```

- **Bloqueio de Scroll Externo**: `html, body { height: 100%; overflow: hidden; }`
- **Container do App (`.app-container`)**: `max-width: 520px; height: 100vh; height: 100dvh; position: relative; overflow: hidden;`
- **Área de Conteúdo (`.dashboard-content`)**: `flex: 1; overflow-y: auto; scrollbar-width: thin; padding-bottom: calc(82px + var(--space-4));`
- **Barra Inferior (`.app-bottom-nav`)**: `position: absolute; bottom: 0; left: 0; width: 100%; height: 74px; backdrop-filter: blur(12px);`

---

## 11. Catálogo de Features & Regras de Negócio

### 11.0. Fluxo de Onboarding (3 Passos) & Transições Apple-Style
O fluxo de onboarding do **Limpu!** foi arquitetado com micro-transições elegantes e acolhedoras para personalizar o espaço do usuário:
- **Indicador de Progresso (3 Pills)**: `#pillStep1` (Nome), `#pillStep2` (Idade), `#pillStep3` (Objetivo).
- **Passo 1 — Nome**: Input com foco automático, botão de limpeza rápida (`✕`) e validação mínima de 2 caracteres.
- **Transição 1 (2s + 1.3s fade-out)**: *"Olá {Nome}, seja bem-vindo(a) ao Limpu!"* com spinner iOS circular suave.
- **Passo 2 — Idade**: Slider tátil interativo de 14 a 99 anos com feedback de badges de fase da vida (ex: *⚡ Autonomia & Energia*).
- **Transição 2 (2s + 1.3s fade-out)**: *"Legal, {Nome}! Idade salva."* com ícone `🎂` iluminado.
- **Passo 3 — Objetivo Principal (5 Opções)**:
  1. 🎮 *"Amo gamificação e listas para manter o foco"*
  2. 🏡 *"Moro sozinho(a) e preciso de motivação"*
  3. 👨‍👩‍👧‍👦 *"Engajar a família toda (e incentivar as crianças)"*
  4. 👥 *"Dividir a casa com amigos/república sem brigas"*
  5. 💑 *"Equilibrar as tarefas com meu parceiro(a)"*
  - Cards interativos (`.goal-option-card`) com ícone dedicado, feedback tátil no hover e rádio check circular azul com `✓` quando selecionado.
  - Habilita o botão *"Avançar"* dinamicamente ao escolher uma das alternativas.
  - Botão *"Voltar"* permite retornar ao Passo 2 (Idade) com animação suave de deslize.
- **Transição Final**: *"Estamos preparando seu espaço da melhor maneira"* (3s de preparação com spinner) ➔ *"Tudo pronto!"* com check verde pulsante e botão *"Começar a organizar!"*.

### 11.1. Aba Início: Mini Kanban & Progresso Diário
- **Hero Card de Progresso**:
  - Exibe porcentagem dinâmica (`0%` a `100%`) baseada na proporção `tarefas_feitas / total_adicionadas_no_dia`.
  - Barra de progresso animada com gradiente luminoso.
- **Colunas Kanban Compactas**:
  - `🔴 PARA FAZER` (`#listTodo`)
  - `🟡 FAZENDO` (`#listDoing`)
  - `🟢 FEITO` (`#listDone`)
- **Cartões de Tarefa (`.task-card-mini`)**:
  - Ícone pastel do ambiente.
  - Nome da tarefa + metadados de categoria e pontos (`+X pts`).
  - Avatar do morador responsável com a inicial do nome.
  - Check verde animado ao concluir (`✓`).
- **Regras de Movimentação & Interceptação no Kanban**:
  - **De `PARA FAZER` para `FEITO`**: É interceptado pelo pop-up *"Gostaria de iniciar a tarefa {nome}?"*. Ao tocar em *"Pronto!"*, a tarefa é direcionada para `FAZENDO` e inicia o cronômetro (garantindo foco e registro de tempo).
  - **De `FEITO` para `PARA FAZER`**: Dispara o pop-up de confirmação *"Gostaria de reabrir a tarefa {nome}?"*. Ao confirmar, a tarefa é reaberta, o check é removido e os pontos/histórico são estornados para refazer.
  - **De `FEITO` para `FAZENDO`**: Dispara o pop-up de início para iniciar novo ciclo de cronômetro.
  - **Bloqueio de Tarefa Concorrente (Foco Único)**: Se já houver uma tarefa na coluna `FAZENDO`, qualquer tentativa de iniciar ou arrastar uma segunda tarefa para `FAZENDO` ou `FEITO` é interceptada pelo pop-up empático *"Finalize sua tarefa em andamento primeiro!"* (`#taskSingleFocusModal`), garantindo que o usuário mantenha atenção plena em uma única atividade por vez.

### 11.2. Aba Tarefas: Catálogo por Ambientes & Limite Diário
- **Regra dos 3 Slots Diários**:
  - Cada usuário pode selecionar no máximo **3 tarefas por dia** para evitar sobrecarga.
  - O limite reseta automaticamente às **00:00 (meia-noite)** no timezone local.
- **Drawer de Categorias (Bottom Sheet)**:
  - Seletor elegante no topo que abre uma gaveta inferior suave com as 5 categorias + opção "Todas".
- **Pop-up de Confirmação**:
  - Ao clicar em `+` numa tarefa: pergunta *"Gostaria de adicionar a tarefa {nome}?"* com botões *"Voltar"* e *"Sim!"*.
  - Animação de saída suave do catálogo ao confirmar.
- **Tabela de Tarefas e Pontuação Balanceada**:
  - **🍽️ Cozinha**:
    - Tirar o lixo da cozinha: `10 pts` (Rápido e simples)
    - Guardar a louça seca: `15 pts` (Pouco esforço)
    - Limpar a mesa e bancadas: `15 pts` (Manutenção rápida)
    - Limpar o fogão: `20 pts` (Exige produto e atenção)
    - Lavar a louça: `30 pts` (Alto esforço, mais evitada)
  - **🧹 Limpeza Geral e Quartos**:
    - Arrumar a cama: `10 pts` (Hábito rápido de 2 min)
    - Tirar o pó dos móveis: `20 pts` (Atenção aos detalhes)
    - Organizar a bagunça da sala: `20 pts` (Recolher itens espalhados)
    - Varrer / Aspirar o chão: `30 pts` (Cansaço físico moderado)
    - Passar pano na casa: `40 pts` (Ação pesada com balde e rodo)
  - **🚽 Banheiro**:
    - Trocar as toalhas de rosto e banho: `10 pts` (Rápido)
    - Limpar o espelho e a pia: `15 pts` (Higienização básica)
    - Lavar o vaso sanitário: `25 pts` (Exige luvas e desinfetante)
    - Lavar o box e o chão do banheiro: `35 pts` (Faxina completa)
  - **👕 Lavanderia**:
    - Colocar roupas na máquina: `15 pts` (Separar e ligar)
    - Estender as roupas: `20 pts` (Trabalho manual)
    - Recolher e dobrar as roupas secas: `30 pts` (Exige paciência e tempo)
  - **🪴 Cuidados Extras**:
    - Alimentar o pet: `10 pts` (Rápido e rotineiro)
    - Colocar o lixo reciclável para fora: `15 pts` (Levar até a rua)
    - Regar as plantas: `15 pts` (Passeio com o regador)
    - Limpar a caixa de areia / tapete do pet: `25 pts` (Higiene essencial)

### 11.3. Modo Foco & Cronômetro em Tempo Real (Acoplado Embaixo do Kanban "FAZENDO")
- **Gatilho de Início**: Ao mover ou tocar numa tarefa em `PARA FAZER`, abre o modal de confirmação *"Gostaria de iniciar a tarefa {nome}?"*.
- **Inline Focus HUD Acoplado**: Ao clicar em *"Pronto!"*, o painel do cronômetro surge **embaixo da coluna "FAZENDO"** com animação suave de expansão e slide-down (`@keyframes inlineTimerSlideDown`), exibindo:
  - Header com tag pulsante `EM ANDAMENTO` e categoria da tarefa.
  - Relógio Digital gigante com segundos em tempo real (`00:00`, `00:01`...).
  - Subtítulo `TEMPO DECORRIDO`.
  - Botão de Destaque **"🎉 Terminei!"** em Verde Esmeralda (`#10B981` com hover glow).
  - Botão sutil **"Cancelar tarefa"** em cinza ardósia.
- **Conclusão com "Terminei!"**: Encerra a contagem, move o cartão para a coluna `FEITO`, recolhe suavemente o widget inline e dispara áudio de vitória, chuva de confetes e atualização de sequência (Streak).
- **Desistência com "Cancelar tarefa"**: Encerra a contagem, devolve o cartão para a coluna `PARA FAZER` e recolhe o widget inline sem penalidades.

### 11.4. Aba Histórico: Sequências (Streaks) & Calendário de Atividades
- **Bolha de Sabão Radiante (`🫧`)**:
  - Substitui o ícone convencional de fogo por uma bolha com reflexo e partículas de brilho flutuantes (`✨`).
  - Número de dias em **Poppins 900**.
  - **Ignição**: Ao bater a meta do dia (>= 20 pts), a bolha dá um salto elástico de escala (`scale(1.35)`), acende no Amarelo Ouro e solta confetes.
- **Pop-up de Comemoração da Bolha Acesa (`#streakCelebrationModal`)**:
  - Disparado automaticamente na tela inicial assim que o usuário acumula **20 pontos** no dia.
  - **Hero Animado**: A bolha central surge em **Cinza** e faz uma transição fluida para **Dourado Brilhante** (`@keyframes bubbleIgniteToGold`), ativando aura radiante e partículas ao redor.
  - **Mensagem Acolhedora**: *"Parabéns! Deixou sua bolha Brilhando!"* acompanhada de frase afirmativa sobre harmonia no lar e o botão de ação *"Isso aí!"*.
  - **Efeitos de Celebração**: Toca acorde festivo ascendente via Web Audio API e lança chuva de confetes dourados.
- **Escudo Protetor (Streak Freeze 🛡️)**:
  - Protege a sequência em caso de imprevistos para não estourar a bolha nem desmotivar o usuário.
- **Calendário Dinâmico com Timezone Local**:
  - Grid de 7 colunas sincronizado com o relógio do dispositivo.
  - **Dias Dourados (Bolha Acesa / Meta Batida >= 20 pts)**: Ficam preenchidos em degradê dourado luminoso (`#FEF3C7` a `#FDE68A`), com borda âmbar `#F59E0B`, número em negrito escuro `#92400E` e a mini bolha com animação de brilho radiante (`@keyframes miniBubbleGlow`).
  - **Dias com Atividade Parcial**: Recebem o mini ícone de bolha `🫧` e fundo azul claro `#E3F2FD`.
  - O dia atual pendente exibe **contorno pulsante luminoso** (`@keyframes pulseWaitingToday`).
  - Ao tocar em qualquer dia, exibe a lista completa de tarefas feitas, pontos ganhos e o **tempo exato dedicado a cada atividade** (`⏱️ MM:SS min` ou `⏱️ X min`) medido pelo cronômetro inline de foco.

### 11.5. Menu Drawer do Perfil (Canto Superior Direito)
- **Gatilho**: Ao clicar no avatar do usuário no topo da tela (`#appUserAvatar` / `#btnOpenProfileDrawer`).
- **Painel Lateral com Slide-In Suave**:
  - **Card do Perfil**: Avatar dinâmico, nome do usuário e tagline da casa.
  - **⚙️ Configurações**: Modal com regras diárias (3 tarefas/dia, reset às 00:00, meta de 20 pts da bolha), sons & feedback e sobre o app.
  - **🔄 Reiniciar App**: Ação rápida de demonstração.

### 11.6. Aba Amigos (#amigos) & Comparador de Divisão de Esforço
- **Card de Desempenho do Usuário no Topo**:
  - Exibe avatar personalizado em degradê azul padrão, nome, sequência da bolha alinhada em tempo real com o estado do dia (`✨ Dourada` se atingiu 20 pts ou `🫧 Pendente` se faltam pontos), frase motivacional e pontuação dinâmica.
- **Leaderboard Dinâmico (Você + Amigos)**:
  - Participantes: **André** (120 pts), **Juliana** (95 pts), **Marcos** (80 pts) e **Você** (70 pts base + tarefas de hoje em tempo real).
  - Ordenação automática por pontuação decrescente.
  - **Sequência Dinâmica**: 3 dias de sequência (`🫧 3 dias`) antes de acender hoje, evoluindo para 4 dias (`✨ 4 dias`) ao bater 20 pts hoje.
  - **Animação de Subida no Ranking (`rankClimbUp`)**: Quando o usuário ganha pontos e sobe de posição, o card ganha animação de elevação com brilho e confetes.
- **Menu de Ações do Amigo (Ao Tocar no Card)**:
  - **⚖️ Comparar Esforço**: Abre o Simulador Dark Modern (`#friendCompareModal`) com barra proporcional bicolor, cards com porcentagens e diagnóstico inteligente.
  - **👏 Parabenizar**: Toca efeito sonoro nativo de aplausos (Web Audio API synth) e dispara chuva de palmas e confetes flutuantes com notificação toast.
  - **🗑️ Remover Amigo**: Abre pop-up de confirmação segura; ao confirmar, o amigo é removido com animação suave de saída lateral (`is-removing`).

### 11.7. Aba Placar de Líderes (Ranking & Divisão Justa 52%/48%)
- **Hero Card do Placar**:
  - Filtros de período com pills interativos: `Esta Semana` (padrão), `Este Mês` e `Geral`.
- **Medidor de Equilíbrio da Casa (Divisão Justa ⚖️)**:
  - Barra de contribuição compartilhada dinâmica e status *"⚖️ Casa em Harmonia Excelente!"*.
- **Podium & Classificação dos Moradores**:
  - **1º Lugar 👑**: André (320 pts • *"Mandou bem demais! 💪"*).
  - **2º Lugar 🥈**: Juliana (280 pts • *"Ótimo trabalho! 👏 Quase lá!"*).
  - **3º Lugar 🥉**: Você / Usuário (com pontuação dinâmica em tempo real ao concluir tarefas hoje).
- **Conquistas da Semana Desbloqueadas**:
  - 🧼 *Mestre da Cozinha*, ✨ *Bolha Dourada*, ⚡ *Foco Máximo*.

---

## 12. Ciclo de Vida da Sessão & Reset Seguro

- **Comportamento Limpo ao Atualizar (F5) ou Reabrir Aba**:
  - Fechar a aba/navegador ou dar **F5 (Reload)** reinicia o estado das tarefas diárias e conclusões de hoje, permitindo novos ciclos de teste limpos.
  - Nenhum dado é retido indevidamente em `localStorage`, garantindo total privacidade e reset previsível.
- **Botão `+` no Canto Superior Direito (`#btnResetDemo`)**:
  - Aciona o reset total com tela de transição suave *"Reiniciando app..."* (duração calibrada de 2.2s + fade-out de 1.3s), limpando todos os modais, timers, kanban, catálogo e devolvendo ao Passo 1 do Onboarding.

---

## 13. As 6 Regras de Ouro do Design Limpu!

1. 🎯 **Mantenha a proporção 60-30-10**: Fundos suaves `#F4F7F9` com cartões brancos (60%), áreas de suporte em Azul Claro `#E3F2FD` (30%), e apenas botões e ações decisivas em Azul de Ação `#2F80ED` (10%).
2. 🫧 **Gamificação Humanizada**: Sequências com **Bolha de Sabão Radiante**, estados Ouro vs Cinza, e proteção contra frustrações com o Escudo (Streak Freeze).
3. ⏱️ **Foco com Propósito**: O cronômetro deve incentivar a presença e a celebração do tempo dedicado ao lar, sem pressão de contagem regressiva agressiva.
4. ✅ **Verde `#10B981` é exclusivo de recompensa**: Nunca utilize verde em botões de ação ou links comuns; use-o somente para comemorar finalização de tarefas ou estados de sucesso garantido.
5. 🔤 **Respeite o par Poppins & Inter**: Sempre use **Poppins** em títulos, marca, números de streak e cronômetro (com **Medium 500** no nome `Limpu!`) e **Inter** para tarefas, textos, botões e controles.
6. 🤝 **Comunicação Acolhedora**: Evite linguagem punitiva. O **Limpu!** foi feito para criar harmonia, colaboração e transparência sem cobranças estressantes.
