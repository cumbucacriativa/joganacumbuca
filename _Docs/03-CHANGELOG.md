# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [0.8.0] — 2026-08-07

### Adicionado
- **Cadastro e exclusão de jogo via n8n**, protegidos por senha de administrador
  (`!admin123`):
  - Badge **"+"** (canto superior esquerdo, todas as telas) — pede a senha uma vez por sessão
    (`sessionStorage`), depois abre o formulário n8n de cadastro numa nova aba.
  - Ícone de **lixeira** (canto inferior direito da carta do jogo sorteado) — pede a senha (uma
    vez por sessão), mostra confirmação Sim/Não, e chama um webhook n8n que faz a exclusão.
  - **Exclusão é lógica, não física**: nova coluna `visivel` (sim/não) em `data/jogos.csv`.
    Excluir marca `visivel=não` — a linha nunca é apagada do arquivo (fica no histórico do
    Git), só filtrada na carga do app.
  - Senha conferida nos dois lados: no app (conveniência, evita clique acidental) e no n8n
    (a trava de verdade — o form de cadastro e o webhook de exclusão só gravam no GitHub se a
    senha bater do lado do servidor).
  - Workflow n8n `[KEWIN] Joga na Cumbuca - Cadastro de Jogos` (`vps-lava`, ID
    `fGqJEeLlgj2MhpJx`) — dois gatilhos (Form Trigger de cadastro + Webhook de exclusão), cada
    um com seu próprio par Get/Edit File do GitHub. Detalhe completo em
    `01-ARQUITETURA-GERAL.md`.

### Pendente
- Workflow n8n criado mas **não ativado** — falta criar a credencial do GitHub manualmente no
  n8n (a ferramenta usada pra montar o fluxo não cria credenciais, só referencia) e ligar o
  toggle. Até lá, cadastro/exclusão abrem a UI certa mas a gravação falha. Passo a passo em
  `04-REGISTRO-BUGS.md`.

## [0.7.0] — 2026-08-07

### Adicionado
- **`id` por jogo** em `data/jogos.csv` (1 a 85, sequencial). Aparece no canto superior
  esquerdo da carta do jogo sorteado (`#42`). Busca agora também acha jogo pelo número do id.
- **Sorteio sem repetição ("sacola")**: jogo (por categoria), personagem, local, filme/livro e
  adjetivo não repetem mais a mesma opção antes de passar por todas as outras — pedido do
  cliente porque o `Math.random()` puro às vezes caía no mesmo jogo/personagem várias vezes
  seguidas. Detalhe do mecanismo em `01-ARQUITETURA-GERAL.md`.
- **`Filme / Livro` e `Adjetivo / Característica`**: duas colunas novas em
  `data/aleatoriedades.csv` (que também cresceu pra 500 linhas), cada uma com seu próprio
  botão no overlay do dado — virou uma grade 2x2 (era 1x2).

### Documentado
- Regra nova no `CLAUDE.md`: sempre `git fetch` e comparar local com `origin/main` antes de
  editar `jogos.csv`/`aleatoriedades.csv`, já que o cliente edita esses arquivos direto (às
  vezes por fora desta sessão).

### Bloqueado
- Formulário n8n pra cadastrar jogo direto no GitHub (pedido do cliente) e o botão "+" no app
  que abriria esse formulário — o conector n8n MCP desta sessão está ligado na VPS errada
  (ADN Construtora, não a `vps-lava` da própria Lava). Ver `04-REGISTRO-BUGS.md`.

## [0.6.1] — 2026-08-07

### Removido
- **8 jogos quase-clones removidos de `data/jogos.csv`** (93 → 85 jogos). O banco tinha sido
  gerado com ajuda do Gemini e várias entradas repetiam a mesma premissa com nome/tema
  diferente. Removidos, cada um por ser clone de um jogo mantido:
  - `Novas Opções` e `Diretor da Plateia` — mesma mecânica de "Jogo do Troca" (um sinal manda
    refazer a última fala/ação na hora), só trocando quem dá o sinal.
  - `Gêneros Literários` — mesma mecânica de "Estilos de Cinema" (trocar o estilo da cena no
    meio, a pedido do mediador), só trocando cinema por literatura.
  - `Tribunal do Juri` — subconjunto de "Tribunal do Improviso" (mesma ideia de julgamento
    absurdo com veredito, com menos papéis definidos).
  - `Festa dos Tipos` — mesma mecânica de "Escolinha" (adivinhar a característica secreta dos
    outros por meio de conversa), só trocando escola por festa.
  - `Papéis Sorteados` — mesma mecânica de "Frase Surpresa" (uma frase escrita antecipadamente
    é integrada à cena em algum momento).
  - `Consultório Estranho` — o banco tinha 5 jogos no formato "autoridade absurda explica algo
    com total convicção" (Especialistas, Consultório Estranho, Manual de Instruções, Guia de
    Viagem Inusitado, Entrevista com o Futuro); esse era o mais redundante do grupo.
  - `Perguntas com Respiração` — além de ser cópia de "Uma Palavra de Cada Vez" (uma palavra
    por vez construindo a história), o título nem batia com a própria descrição no CSV — bug
    de geração, não só duplicata.

## [0.6.0] — 2026-08-07

### Adicionado
- **Busca por texto**: ícone de lupa no canto superior direito (todas as telas), abre um
  painel que desce do topo com um campo de busca. Filtra por nome do jogo, categoria ou
  qualquer trecho da descrição/regra, sem acento (buscar "musica" acha "Música"). Clicar num
  resultado abre a carta do jogo direto. Só um painel fica aberto por vez — abrir a busca
  fecha o dado, e vice-versa.
- `assets/img/lupa.svg` — ícone novo, não vem do design do XD (funcionalidade não existia no
  protótipo original). Criado do zero seguindo o mesmo estilo visual do ícone de dado (contorno
  simples, cor accent). Ver nota em `05-DESIGN-VISUAL.md`.

## [0.5.0] — 2026-08-07

### Adicionado
- **93 jogos de improviso teatral reais** cadastrados em `data/jogos.csv` (pesquisados em bibliotecas internacionais e nacionais de teatro e improviso), organizados nas 4 categorias centrais (`Duplas`, `Trios`, `Grupos`, `Todos`).
- **Expansão massiva do banco de aleatoriedades** (`data/aleatoriedades.csv`) com **500 linhas completas** distribuídas em 4 colunas independentes: **Personagem** (nomes puros sem adjetivos acoplados), **Localizacao**, **Filme / Livro** e **Adjetivo / Característica**.

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

## [0.4.0] — 2026-08-07

### Adicionado
- **Ícone de música** (`icone musica.svg`, exportado pelo cliente) — agora aparece na legenda
  da lista ("Precisa de Música"), na própria lista de jogos, e como tag "Precisa de música" no
  cartão do jogo sorteado.
- **Easter egg no rodapé**: clicar numa cartinha do carrossel faz ela "voar" até o centro da
  tela, girar e abrir um jogo aleatório de **todas** as categorias — sem função prática, só
  para dar vontade de clicar. As cartas do rodapé têm um pequeno balanço/pulo espaçado (uma a
  cada poucos segundos, defasado entre elas) convidando o toque. Fallback embutido: se a
  animação não disparar o evento de término (ex: aba em segundo plano), um timer garante que a
  tela troca do mesmo jeito.
- **README** reescrito com passo a passo prático: como adicionar um jogo no CSV, como testar
  localmente, como publicar (`git add`/`commit`/`push`) e quanto tempo o GitHub Pages leva
  pra atualizar.

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
