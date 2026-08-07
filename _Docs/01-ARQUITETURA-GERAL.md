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
| `id` | número, único | Identificador do jogo. Aparece no canto superior esquerdo da carta (`#42`). Ao adicionar um jogo novo, usar o próximo número disponível (maior `id` do arquivo + 1) — não reaproveitar id de jogo removido. |
| `jogo` | texto | Nome do jogo de improviso |
| `categoria` | texto | Categoria do jogo. **Não existe lista fixa de categorias** — o app lê os valores únicos dessa coluna e monta a lista de categorias dinamicamente. Categoria nova na planilha = categoria nova no app, sem precisar mexer em código. |
| `participantes` | texto | Ex: `2+` — exibido como está na lista, e expandido para "2 ou +" no cartão do jogo sorteado |
| `mediador` | `sim`/`não` | Se o jogo precisa de alguém mediando/narrando |
| `aquecimento` | `sim`/`não` | Se é um jogo de aquecimento |
| `musica` | `sim`/`não` | Se o jogo usa/precisa de música |
| `descricao` | texto (entre aspas se tiver vírgula) | Regras do jogo, mostradas no cartão sorteado |
| `visivel` | `sim`/`não` | Exclusão lógica. `não` = o jogo continua no arquivo (histórico preservado no Git) mas o app nunca carrega ele (filtrado já no `boot()`). Setado pra `não` pelo webhook de exclusão do formulário admin — nunca precisa mexer nisso manualmente. |

Banco atual: 85 jogos reais (o cliente gerou um lote maior com ajuda do Gemini e depois pediu
pra remover os que repetiam a mesma premissa — ver `03-CHANGELOG.md` v0.6.1).

### `data/aleatoriedades.csv`

| Coluna | Tipo | Descrição |
|---|---|---|
| `Personagem` | texto | Lista de personagens pro sorteio aleatório |
| `Localizacao` | texto | Lista de localizações pro sorteio aleatório |
| `Filme / Livro` | texto | Lista de filmes/livros pro sorteio aleatório |
| `Adjetivo / Característica` | texto | Lista de adjetivos/características pro sorteio aleatório |

Quatro colunas independentes — não são pares linha-a-linha, cada uma é sorteada separadamente
dentro da própria lista (não precisam nem ter a mesma quantidade de linhas preenchidas). O
overlay do dado (acionado a qualquer momento, em qualquer tela) tem um botão pra cada uma das
quatro.

### Sorteio sem repetição ("sacola")

Jogo (por categoria/filtro), personagem, local, filme/livro e adjetivo usam o mesmo mecanismo
em `assets/js/app.js` (`criarSacola`): embaralha a lista inteira e vai tirando um item por vez;
só reembaralha quando esgota todas as opções, e evita repetir de novo o último item tirado bem
na emenda entre uma rodada e a próxima. Existe uma sacola por categoria de jogo (chave = nome
da categoria ou "Todas as Categorias") e uma sacola só pra cada uma das quatro colunas de
`aleatoriedades.csv`.

## Administração: cadastrar e excluir jogo (n8n)

O app continua "sem backend" pra leitura (CSV estático), mas cadastro/exclusão de jogo passam
por um workflow n8n na `vps-lava` — **`[KEWIN] Joga na Cumbuca - Cadastro de Jogos`**
(ID `fGqJEeLlgj2MhpJx`, ver `n8n/vps-lava/clientes/lava-agencia/` na raiz do `_Dev`). Dois
gatilhos no mesmo workflow, os dois exigem a senha `!admin123` **conferida do lado do
servidor** antes de gravar qualquer coisa (a senha também é conferida no app, mas isso é só
conveniência — não é a trava de segurança de verdade):

- **Cadastrar** (badge "+", canto superior esquerdo): pede a senha no app (uma vez por sessão,
  guardada em `sessionStorage`), depois abre em nova aba o formulário n8n
  (`.../form/9b2cd1a6-...`), que tem seus próprios campos + senha. Ao enviar, o n8n busca o
  `jogos.csv` atual no GitHub, calcula o próximo `id`, monta a linha (com `visivel=sim`) e
  comita.
- **Excluir** (ícone de lixeira, canto inferior direito da carta do jogo): pede a senha (mesma
  trava de sessão), mostra confirmação Sim/Não, e no "Sim" chama o webhook do n8n via
  `fetch()` (`POST .../joga-na-cumbuca-excluir`, body `{ id, senha }`). O n8n confere a senha,
  muda `visivel` daquele `id` pra `não` no CSV e comita — a linha nunca é apagada de verdade
  (fica no histórico do Git). No app, o jogo some da lista local imediatamente (otimista, antes
  do redeploy do GitHub Pages terminar).

**Status:** workflow criado mas **inativo** — falta (1) criar a credencial `GitHub API` no n8n
com o token de `_docs/github-cumbuca-criativa.md` e atribuir aos 4 nós GitHub do fluxo, e
(2) ativar o workflow. Até isso acontecer, os botões "+"/lixeira abrem os fluxos certos mas a
gravação no GitHub falha. Ver `04-REGISTRO-BUGS.md`.

## Decisões técnicas em aberto

Ver "Decisões pendentes" em [`02-ESCOPO.md`](02-ESCOPO.md) — várias definições de arquitetura
(ex: se vira PWA instalável/offline, biblioteca de parsing de CSV, forma exata das transições
entre telas) dependem de resposta do cliente antes de virar código definitivo.
