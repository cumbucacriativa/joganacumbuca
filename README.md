# Joga na Cumbuca

**No ar:** https://cumbucacriativa.github.io/joganacumbuca/

App mobile-first de cartas aleatórias para jogos de improviso teatral. Escolha uma categoria,
sorteie um jogo, e use o dado no topo pra gerar um personagem e/ou uma localização aleatórios
a qualquer momento.

HTML/CSS/JS puro, sem framework e sem build — publicado direto no GitHub Pages.

## Como adicionar ou editar um jogo

Os jogos ficam em [`data/jogos.csv`](data/jogos.csv) — dá pra abrir e editar direto no Excel,
Google Sheets, ou num editor de texto qualquer. Cada linha é um jogo, com estas colunas:

| Coluna | O que é | Exemplos |
|---|---|---|
| `id` | Número único do jogo. Aparece no canto superior esquerdo da carta. **Use o próximo número livre** (maior `id` do arquivo + 1) — nunca reaproveite o id de um jogo removido. | `86` |
| `jogo` | Nome do jogo | `Jogo do Troca` |
| `categoria` | Categoria — **não precisa cadastrar em lugar nenhum**, o app lê os valores dessa coluna e monta a lista de categorias sozinho. Categoria nova aqui = categoria nova no app. | `Trios` |
| `participantes` | Quantidade mínima | `2+` |
| `mediador` | Se precisa de alguém mediando | `sim` ou `não` |
| `aquecimento` | Se é um jogo de aquecimento | `sim` ou `não` |
| `musica` | Se usa/precisa de música | `sim` ou `não` |
| `descricao` | As regras do jogo, em texto corrido. Se tiver vírgula dentro do texto, **coloque a descrição toda entre aspas** (veja a linha do "Jogo do Troca" no arquivo como exemplo) | `"Um participante atua como..."` |
| `visivel` | `sim` = aparece no app, `não` = escondido (exclusão lógica, feita pelo botão de lixeira no app — a linha nunca é apagada de verdade). Editando manualmente, sempre `sim` num jogo novo. | `sim` |

Pra **adicionar um jogo novo**: adiciona uma linha no final do CSV com essas 9 colunas
preenchidas (`sim`/`não` sempre em minúsculo, sem acento). Ou, mais fácil: usa o botão **"+"**
no app (pede uma senha de administrador) em vez de editar o CSV na mão.

**Excluir um jogo:** não apague a linha do CSV manualmente — use o ícone de lixeira na carta do
jogo dentro do app (também com senha). Isso marca a linha como `visivel=não` em vez de apagar,
mantendo o histórico.

**Tom da descrição:** objetivo e informal, do jeito que se fala no dia a dia. Pode caçoar um
pouco pra deixar leve. Sem travessão, sem emoji, sem palavra difícil — é pra ler rápido numa
festa, não pra impressionar ninguém.

Os personagens, localizações, filmes/livros e adjetivos do "dado" (ícone do topo) ficam em
[`data/aleatoriedades.csv`](data/aleatoriedades.csv) — quatro colunas (`Personagem`,
`Localizacao`, `Filme / Livro`, `Adjetivo / Característica`), independentes entre si (não
precisam ter a mesma quantidade de linhas preenchidas).

**Sorteio sem repetição:** jogo, personagem, local, filme/livro e adjetivo nunca repetem a
mesma opção duas vezes seguidas — o app sorteia toda a lista embaralhada antes de começar a
repetir, tipo um baralho.

## Como testar antes de publicar

Abrir o `index.html` direto do disco (clicando duas vezes) **não funciona** — o navegador
bloqueia o carregamento dos CSVs por segurança (erro de CORS com `file://`). Precisa de um
servidor local. Tem um pronto, sem precisar instalar nada além do
[Node.js](https://nodejs.org):

```bash
node scratch/dev-server.js
# depois abra http://localhost:5173 no navegador
```

## Como publicar as mudanças (subir pro ar)

Depois de editar os CSVs (ou qualquer outro arquivo) e testar localmente:

```bash
git add -A
git commit -m "descreva o que mudou, ex: adiciona jogo Espelho"
git push
```

O GitHub Pages atualiza sozinho **~1 minuto** depois do `git push`. Não precisa mexer em nada
no site do GitHub. Se for a primeira vez usando `git` nessa máquina, ele pode pedir login —
usar a conta do GitHub da Cumbuca Criativa.

## Estrutura

- [`index.html`](index.html) — entrada do app
- [`assets/`](assets/) — CSS, JS e os SVGs do design (copiados direto do que foi exportado do
  Adobe XD — nunca redesenhados à mão, ver `_Docs/05-DESIGN-VISUAL.md`)
- [`data/`](data/) — `jogos.csv` e `aleatoriedades.csv`, o banco de dados do app
- [`_Docs/`](_Docs/) — documentação do projeto (arquitetura, escopo, changelog, bugs) — ver
  [`_Docs/00-INDICE.md`](_Docs/00-INDICE.md)
