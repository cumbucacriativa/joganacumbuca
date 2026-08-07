# Joga na Cumbuca

App mobile-first de cartas aleatórias para jogos de improviso teatral. Escolha uma categoria,
sorteie um jogo, e use o dado no topo pra gerar um personagem e/ou uma localização aleatórios
a qualquer momento.

HTML/CSS/JS puro, sem framework e sem build — publicado direto no GitHub Pages.

## Rodar localmente

Qualquer servidor estático serve (o `fetch()` dos CSVs não funciona abrindo o `index.html`
direto do disco, `file://`). Tem um servidor mínimo pronto em `scratch/dev-server.js`
(sem dependências — evita bugs de `npx` com espaço no caminho da pasta no Windows):

```bash
node scratch/dev-server.js
# depois abra http://localhost:5173
```

## Estrutura

- [`index.html`](index.html) — entrada do app
- [`assets/`](assets/) — logo e outros assets visuais
- [`data/`](data/) — `jogos.csv` e `aleatoriedades.csv` (banco de dados do app)
- [`_Docs/`](_Docs/) — documentação do projeto (arquitetura, escopo, changelog, bugs) — ver
  [`_Docs/00-INDICE.md`](_Docs/00-INDICE.md)

## Editar o banco de jogos/aleatoriedades

Edite `data/jogos.csv` e `data/aleatoriedades.csv` direto (Excel, Google Sheets exportado como
CSV, ou editor de texto). Categorias de jogo são geradas automaticamente a partir da coluna
`categoria` — não precisa cadastrar categoria em nenhum outro lugar.
