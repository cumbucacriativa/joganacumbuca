# Arquitetura Geral

## Stack

- **HTML/CSS/JS puro**, sem framework e sem bundler. Sem `package.json`, sem `npm install`,
  sem build step.
- **Hospedagem: GitHub Pages**, servindo direto da raiz do branch principal (sem pasta
  `/docs`, sem Actions de build).
- **Dados: CSV estático** em `data/`, buscado via `fetch()` no client e parseado em JS puro
  (sem lib externa, pra não depender de CDN/instalação — CSVs pequenos e sem campos com vírgula
  ou quebra de linha não justificam o peso de uma lib como PapaParse).

Por quê essa escolha (e não Next.js/React como os outros projetos da pasta): é um app pequeno,
sem autenticação, sem persistência server-side, pensado pra ser aberto rápido no celular numa
festa — GitHub Pages estático resolve sem custo, sem servidor, sem manutenção de infra. Se o
projeto crescer (ex: usuário conseguir cadastrar jogo pelo próprio celular, precisar de banco
real), essa decisão é revisitada.

## Estrutura de pastas

```
Joga na Cumbuca/
├── index.html              ← entrada única do app (SPA — telas trocam via JS, sem reload)
├── assets/
│   └── logo.svg             ← logo oficial (mesma arte de _Docs/SVGs/Logo.svg)
├── data/
│   ├── jogos.csv             ← banco de jogos de improviso
│   └── aleatoriedades.csv    ← personagens e localizações pro sorteio
└── _Docs/
    ├── 00-INDICE.md
    ├── 01-ARQUITETURA-GERAL.md   ← este arquivo
    ├── 02-ESCOPO.md
    ├── 03-CHANGELOG.md
    ├── 04-REGISTRO-BUGS.md
    └── SVGs/Logo.svg             ← arte original entregue pelo cliente
```

Conforme o app crescer, `index.html` provavelmente vai ganhar irmãos `style.css` e `app.js`
(hoje ainda não existem — só o placeholder inicial, ver `03-CHANGELOG.md`).

## Modelo de dados

### `data/jogos.csv`

| Coluna | Tipo | Descrição |
|---|---|---|
| `jogo` | texto | Nome do jogo de improviso |
| `categoria` | texto | Categoria do jogo. **Não existe lista fixa de categorias** — o app lê os valores únicos dessa coluna e monta a lista de categorias dinamicamente. Categoria nova na planilha = categoria nova no app, sem precisar mexer em código. |
| `participantes` | texto | Ex: `2+` — exibido como está na lista, e expandido para "2 ou +" no cartão do jogo sorteado |
| `mediador` | `sim`/`não` | Se o jogo precisa de alguém mediando/narrando |
| `aquecimento` | `sim`/`não` | Se é um jogo de aquecimento |
| `musica` | `sim`/`não` | Se o jogo usa/precisa de música |
| `descricao` | texto (entre aspas se tiver vírgula) | Regras do jogo, mostradas no cartão sorteado |

Os 5 jogos de exemplo (Jogo do Troca, Musical, Congela, Medusa, Círculo da Conexão) são os
mesmos nomes/tags/descrição que aparecem nos prints do XD — não foram inventados. A categoria
`Trios` em todos eles é um **placeholder estrutural**: só "Jogo do Troca" teve a categoria
confirmada pela interação do protótipo (SORTEAR em "Trios" leva a ele); os outros 4 não têm
categoria confirmada pelo design, e a descrição deles também não foi fornecida — ficou como
aviso ("Descrição desse jogo ainda não cadastrada.") até o cliente completar a planilha real.

### `data/aleatoriedades.csv`

| Coluna | Tipo | Descrição |
|---|---|---|
| `Personagem` | texto | Lista de personagens pro sorteio aleatório |
| `Localizacao` | texto | Lista de localizações pro sorteio aleatório |

Duas colunas independentes — não são pares linha-a-linha, cada uma é sorteada separadamente
dentro da própria lista. (Ver pergunta em aberto sobre o mecanismo do "dado" em
`02-ESCOPO.md`.)

## Decisões técnicas em aberto

Ver "Decisões pendentes" em [`02-ESCOPO.md`](02-ESCOPO.md) — várias definições de arquitetura
(ex: se vira PWA instalável/offline, biblioteca de parsing de CSV, forma exata das transições
entre telas) dependem de resposta do cliente antes de virar código definitivo.
