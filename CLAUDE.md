# Joga na Cumbuca — Guia para Claude

App mobile-first de cartas aleatórias para jogos de improviso teatral. HTML/CSS/JS puro
(sem framework, sem build), dados em CSV lidos direto pelo client, hospedado no GitHub Pages.

**No ar:** https://cumbucacriativa.github.io/joganacumbuca/
**Repo:** https://github.com/cumbucacriativa/joganacumbuca (conta GitHub da Cumbuca Criativa,
não da Lava — token em `_docs/github-cumbuca-criativa.md`)

Documentação detalhada em [`_Docs/00-INDICE.md`](_Docs/00-INDICE.md) — leia antes de mexer em
arquitetura, escopo ou dados.

## Regras do dia a dia

- **Sem backend, sem build step.** O site é HTML/CSS/JS estático servido direto pelo GitHub
  Pages a partir da raiz do repositório. Qualquer dependência nova tem que rodar 100% no
  navegador (sem npm install/build) — ver justificativa em
  [`_Docs/01-ARQUITETURA-GERAL.md`](_Docs/01-ARQUITETURA-GERAL.md).
- **Dados ficam em CSV** em [`data/`](data/) (`jogos.csv` e `aleatoriedades.csv`), lidos via
  fetch no client. Categorias de jogo são derivadas automaticamente dos valores únicos da
  coluna `categoria` — não existe lista de categorias separada para manter.
- **Mobile-first sempre.** É pra abrir no celular na hora do jogo — toda tela/decisão de UI
  parte do viewport mobile e escala pra cima, nunca o contrário.
- Mudanças de escopo, arquitetura ou decisões de produto devem atualizar o doc correspondente
  em `_Docs/` e uma entrada em [`_Docs/03-CHANGELOG.md`](_Docs/03-CHANGELOG.md).
- Projeto vive dentro do Google Drive (`G:\Meu Drive\CLIENTES\_Dev\Cumbuca\Joga na Cumbuca`) —
  mesma pasta que já causou problemas de build por sincronização em outros projetos (ver
  `_Docs/04-REGISTRO-BUGS.md`). Como aqui não há build step, o risco é baixo, mas vale lembrar
  se algum dia entrar um bundler/npm.
- Esse projeto vive dentro de `_Dev/Cumbuca/`, junto com a Home/linktree da Cumbuca Criativa
  (`../Home/`). Qualquer mudança de escopo relevante (nova feature, novo produto) deve
  considerar se precisa virar um link novo no linktree — ver a regra em `../CLAUDE.md`.
- **Tom de voz do conteúdo que vai pro app** (descrição de jogos no CSV, textos/copy da
  interface): objetivo, informal, do jeito que se fala no dia a dia. Pode ter piadinha leve
  pra descontrair. Nunca usar travessão (—) nem emoji. Evitar linguagem técnica — é pra quem
  tá numa festa ou ensaio, não pra desenvolvedor. Essa regra é sobre o conteúdo do produto, não
  sobre a documentação técnica em `_Docs/`.
- **Antes de editar `data/jogos.csv` ou `data/aleatoriedades.csv`, sempre checar sincronia com
  o GitHub primeiro:** `git fetch origin` e comparar `HEAD..origin/main` (GitHub à frente) e
  `origin/main..HEAD` (local à frente) antes de mexer. O cliente edita esses CSVs direto (às
  vezes por outra sessão de IA, às vezes manualmente), então presumir que o arquivo local é a
  versão mais recente é o jeito mais fácil de apagar trabalho dele sem querer. Se os dois
  lados tiverem mudanças divergentes, avisar o usuário antes de decidir como reconciliar —
  não sobrescrever silenciosamente.

## Índice de documentos

| Doc | Conteúdo |
|---|---|
| [`_Docs/01-ARQUITETURA-GERAL.md`](_Docs/01-ARQUITETURA-GERAL.md) | Stack, estrutura de pastas, modelo de dados dos CSVs |
| [`_Docs/02-ESCOPO.md`](_Docs/02-ESCOPO.md) | O que é o app, funcionalidades da v1, decisões tomadas e pendentes |
| [`_Docs/03-CHANGELOG.md`](_Docs/03-CHANGELOG.md) | Histórico de versões |
| [`_Docs/04-REGISTRO-BUGS.md`](_Docs/04-REGISTRO-BUGS.md) | Bugs conhecidos e pendências |
