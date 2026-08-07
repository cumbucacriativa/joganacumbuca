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
- PWA/offline e filtro ativo por mediador/aquecimento/música — ver `02-ESCOPO.md`.

## [0.3.0] — 2026-08-07

Refação do visual depois do cliente apontar que "todos os SVGs estão bugados".

### Corrigido
- **Ícones desenhados à mão substituídos pelos SVGs reais.** A v0.2.0 recriava máscaras,
  ornamentos da carta e ícones à mão em CSS/SVG — ficou visivelmente errado. Agora cada carta
  usa o SVG exportado inteiro como `background-image` e todos os ícones são cópia byte-a-byte
  de `_Docs/SVGs/`. Ver tabela de origem em `05-DESIGN-VISUAL.md`.
- **Logo da tela inicial**: usava `Logo.svg` (versão antiga, branco/cinza, sem as máscaras) em
  vez de `1 - Tela Inicial/Logo completo.svg`.
- **Escala de todas as medidas**: `.ticket-card` tinha padding, e unidades de container (`cqw`)
  usam o *content box* — logo tudo renderizava menor que o design. Padding movido para um
  `.card-inner` sobreposto; agora botões/títulos batem com o XD na casa do décimo de pixel.
- **Seta gigante na tela de lista**: o `<img>` da seta não casava com a regra CSS de tamanho e
  caía no tamanho padrão de SVG sem `width`. Virou `background-image` do próprio `<select>`.
- **Animação de carta girando**: não rodava (a `perspective` estava num ancestral errado e a
  troca de classe não dava reflow). Reescrita como duas animações sequenciais — a carta atual
  gira para sair, a nova gira para entrar.
- **Navegação descartada em toque rápido**: o guard `flipping` ignorava cliques durante o giro.
  Trocado por cancelamento de timers — um toque novo redireciona em vez de sumir.
- **Botão "+ OPÇÕES"** agora leva de volta para a lista de jogos (era placeholder sem função).
- **Tela de categorias** agora inclui "Todas as Categorias", igual ao filtro da tela de lista.
- **Badge do dado**: ganhou animação de rolagem ao toque e um balanço sutil em repouso; o
  overlay deixou de ocupar a tela inteira e agora tem a largura da carta, como no protótipo.

### Pendente
- Ícone de música não foi exportado do XD — linha "Musical" fica sem ícone até vir o arquivo.

## [0.2.1] — 2026-08-07

### Adicionado
- Publicado no GitHub Pages: https://cumbucacriativa.github.io/joganacumbuca/. Repositório
  `cumbucacriativa/joganacumbuca` (conta GitHub da Cumbuca Criativa, separada da Lava).
- Credencial (PAT do GitHub da Cumbuca Criativa) salva em
  `_docs/github-cumbuca-criativa.md`, seguindo o padrão do projeto.
