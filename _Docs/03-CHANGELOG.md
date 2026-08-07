# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [0.1.0] — 2026-08-06

### Adicionado
- Estrutura inicial do projeto: `_Docs/` (índice, arquitetura, escopo, changelog, registro de
  bugs), `CLAUDE.md`, `AGENTS.md`, `README.md`.
- `data/jogos.csv` e `data/aleatoriedades.csv` com linhas de exemplo (placeholder — cliente vai
  substituir/completar com o banco real de jogos, personagens e localizações).
- `index.html` placeholder ("em construção"), mobile-first, usando a paleta da logo
  (`assets/logo.svg`), como primeira versão publicável no GitHub Pages.
- Análise do link do Adobe XD (`4478a107-78cd-4bbb-b235-7b34649b947d-112b`) — 5 telas
  identificadas; leitura visual detalhada pendente (ver `02-ESCOPO.md`).

### Pendente
- Criação do repositório no GitHub e ativação do GitHub Pages (falta acesso — ver
  `04-REGISTRO-BUGS.md`).
- Implementação da UI real (categorias, lista de jogos, sorteio, dado de aleatoriedades,
  animações de carta/carrossel) — aguardando respostas em `02-ESCOPO.md`.

## [0.2.0] — 2026-08-07

### Adicionado
- Versão navegável completa: 4 telas (início, categoria, jogo sorteado, lista de jogos) +
  overlay de sorteio de personagem/local, com transição de tela em "giro de carta" e carrossel
  de cartas decorativo infinito no rodapé.
- `assets/css/style.css` e `assets/js/app.js` — CSS/JS puro, sem framework/build, conforme
  `01-ARQUITETURA-GERAL.md`. Categorias derivadas dinamicamente de `data/jogos.csv`.
- Cores, tipografia (Libre Franklin + Roboto) e componentes (cartão "ticket", botões, chips de
  tag) implementados a partir dos specs exatos e SVGs reais que o cliente exportou do XD — ver
  `05-DESIGN-VISUAL.md`.
- `data/jogos.csv` reescrito com os jogos reais do design (Jogo do Troca, Musical, Congela,
  Medusa, Círculo da Conexão) no lugar dos nomes inventados da v0.1.0.
- `assets/icons/` — ícones do app; a maioria copiada direto dos SVGs exportados, ícone de
  marca e de música recriados à mão (não exportados/combinados no arquivo original).
- `scratch/dev-server.js` — servidor estático mínimo em Node (sem dependências) pra testar
  localmente sem os bugs do `npx` com espaço no caminho da pasta no Windows.
- Testado localmente: navegação entre as 4 telas, sorteio de jogo, sorteio independente de
  personagem/local, filtro de categoria na lista — todos funcionando e batendo visualmente com
  os prints do XD.

### Pendente
- "+ OPÇÕES" (tela do jogo) é um placeholder sem função ainda.
- Categoria/descrição de 4 dos 5 jogos de exemplo é placeholder (ver `02-ESCOPO.md`).
- PWA/offline, filtro ativo por mediador/aquecimento/música, e publicação no GitHub Pages —
  ver `02-ESCOPO.md`.
