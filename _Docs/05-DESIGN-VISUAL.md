# Design Visual

## Confirmado (2026-08-07)

Cliente mandou prints do "Modo de especificações" do XD (cores/fontes exatas) e exportou os
SVGs reais de cada tela. Os valores abaixo são **oficiais**, não aproximação — substituem a
seção antiga logo abaixo, mantida só como histórico do processo.

**Paleta:**

| Uso | Hex |
|---|---|
| Fundo de página | `#FFF7E1` |
| Verde escuro (cartões, texto sobre fundo claro, botões escuros) | `#23302D` |
| Accent — verde neon (bordas, títulos de categoria, botões primários) | `#00FFAA` |
| Branco puro | `#FFFFFF` |
| Quase-branco (texto sobre botão/cartão escuro) | `#F9FFFC` |
| Divisor sobre cartão escuro | `#FFF7E1` |
| Divisor sobre cartão accent | `#707070` |

**Tipografia:** **Libre Franklin Bold** (títulos, nomes de categoria, texto de botão —
`letter-spacing: 0.06em`) + **Roboto** (descrição de jogo, legendas, nomes de jogo na lista).
Ambas gratuitas no Google Fonts, carregadas em `assets/css/style.css`.

**Assets — regra do projeto: nunca recriar ícone à mão.** Os SVGs exportados pelo cliente ficam
em `_Docs/SVGs/` (referência original, organizados por tela) e são **copiados sem alteração**
para `assets/img/`, que é o que o app usa. Uma primeira tentativa recriou máscaras/ícones à mão
e ficou visivelmente errada — foi descartada. Se faltar um ícone, pedir a exportação em vez de
desenhar.

| `assets/img/` | Origem em `_Docs/SVGs/` |
|---|---|
| `logo-completo.svg` | `1 - Tela Inicial/Logo completo.svg` |
| `carta-escura.svg` | `1 - Tela Inicial/Carta Verde Escura.svg` |
| `carta-branca.svg` | `2 - Tela de Categorias/carta branca.svg` |
| `carta-verde.svg` | `3 - Tela de Jogo/carta-verde.svg` |
| `carta-verde-plana.svg` | `4 - Lista de Jogos/Carta Verde sem ornamentos.svg` |
| `carta-rodape.svg` | `1 - Tela Inicial/carta-rodapé.svg` |
| `dado.svg` | `1.1 - Botão Aleatório/dado.svg` |
| `btn-shuffle.svg` | `3 - Tela de Jogo/botão sortear apenas ícone.svg` |
| `seta-cima.svg` / `seta-baixo.svg` | `2 - Tela de Categorias/seta pra cima\|baixo.svg` |
| `tag-aquecimento.svg` / `tag-mediador.svg` / `tag-participantes.svg` | `4 - Lista de Jogos/ícone *.svg` |

**Faltando:** ícone de música (aparece na linha "Musical" da tela de lista no protótipo, mas
não foi exportado). Enquanto não vier, a coluna `musica` do CSV não exibe ícone.

**Como as cartas são montadas:** cada carta usa o SVG exportado inteiro como `background-image`
(via `background-size: 100% 100%`), então ornamentos, borda dupla, pontinhos e o ícone de
máscaras já vêm posicionados exatamente como no XD — nada disso é redesenhado em CSS. O
conteúdo (títulos, tags, botões) fica num `.card-inner` sobreposto, com `padding-top: 25cqw`
para começar abaixo do ícone de máscaras que o SVG já desenha.

**Escala:** `.ticket-card` tem `container-type: inline-size` e **nenhum padding** (o padding
mora no `.card-inner`), de forma que `1cqw` = 1% da largura total da carta. Assim todas as
medidas do XD viram cqw direto na escala original de 362,5px: botão de 106px → `29.24cqw`,
título de 30px → `8.28cqw`, e por aí. Se voltar padding para `.ticket-card`, todas as medidas
encolhem junto (as unidades de container usam o *content box*) — foi um bug real durante a
implementação.

---

## Leitura visual original (histórico, pré-confirmação)

Extraído por leitura visual dos 5 prints do protótipo Adobe XD enviados pelo cliente em
2026-08-06 (`xd.adobe.com/view/4478a107-78cd-4bbb-b235-7b34649b947d-112b`). **Não** veio do
"Modo de especificações" do XD — essa tela também é canvas/WebGL e a ferramenta de screenshot
não conseguiu renderizá-la nesta sessão (ver `04-REGISTRO-BUGS.md`). Os valores abaixo são
aproximações confiáveis de layout/relação entre cores, não hex/fonte oficiais pixel-a-pixel.

## Paleta (aproximada)

| Uso | Cor aprox. | Observação |
|---|---|---|
| Fundo de página | `#F8EFDC` | creme quente |
| Verde escuro (cartão principal, texto sobre fundo claro) | `#16332C` | quase preto, com tom verde |
| Accent (bordas, "cumbuca", botões, ícones) | `#00FFAA` (`#0fa`) | mesmo valor exato já usado em `assets/logo.svg` — adotado como fonte da verdade |
| Branco | `#FFFFFF` | texto sobre fundo escuro |

## Tipografia (aproximada)

- **Títulos/wordmark/botões** ("joga na cumbuca", "TRIOS", "JOGO DO TROCA", "LISTA DE JOGOS",
  labels de botão): sans-serif arredondada, peso bold/black. Candidatas próximas (Google Fonts,
  grátis): **Baloo 2** ou **Fredoka**.
- **Corpo/descrição/legenda**: sans-serif limpa, peso regular/medium. Candidatas: **Poppins**
  ou **Nunito Sans**.
- Pendente confirmação do cliente se há uma fonte oficial (ex: Adobe Fonts/Typekit) — ver
  pergunta em `02-ESCOPO.md`.

## Componentes

- **Cartão "bilhete"**: retângulo arredondado com pequenos cortes chanfrados nos 4 cantos +
  dois pontos decorativos (canto superior-direito e inferior-esquerdo) + borda dupla (contorno
  externo + linha fina interna, estilo ingresso).
- **Ícone de marca**: duas máscaras de teatro (triste + feliz) com setas de shuffle entre elas
  — aparece no topo de todo cartão de conteúdo.
- **Badge de dado**: quadrado arredondado escuro, fixo no topo-centro, presente em todas as
  telas — abre o overlay de sorteio de personagem/local a qualquer momento.
- **Botão primário**: pílula, fundo accent (`#0fa`), texto escuro, bold, uppercase.
- **Botão escuro**: pílula ou círculo, fundo `#16332C`, texto/ícone claro.
- **Carrossel decorativo**: fileira de cartas escuras sobrepostas (mesmo ícone de máscaras),
  sangrando pela borda inferior da tela. Estático no protótipo; vira carrossel infinito lento
  pra esquerda na implementação (pedido do cliente).

## Fluxo de telas (protótipo tinha 5)

1. **Tela inicial** — logo + botão `INICIAR`.
2. **Seletor de categoria** — setas ↑/↓ trocam a categoria exibida (ex: "TRIOS"); botões
   `SORTEAR` (1 jogo aleatório da categoria) e `LISTA`.
3. **Cartão do jogo sorteado** — título, tags (nº participantes, mediador, e presumivelmente
   aquecimento/música quando aplicável), descrição, ícone de re-sorteio (shuffle escuro) e
   botão `+ OPÇÕES` (função exata pendente — ver `02-ESCOPO.md`).
4. **Lista de jogos** — dropdown "Todas as Categorias", legenda dos ícones (aquecimento,
   mediador, nº participantes), lista rolável com tags por jogo, botão `ALEATÓRIO` (sorteia da
   lista/filtro atual) e botão de fechar.
5. **Overlay "Sortear de novo"** — acionado pelo badge de dado em qualquer tela. Dois links
   **independentes**: "Local aleatório" e "Personagem Aleatório" — cada um sorteia por conta
   (não é um sorteio combinado único). Isso resolve a pergunta em aberto sobre a mecânica do
   dado.

Nota: a paginação "X de 5" / setas visíveis embaixo dos prints é da interface de preview do
próprio Adobe XD, não faz parte do design do app — não deve ser replicada.

## Ícones (máscaras, dado, shuffle, mediador/aquecimento/música/participantes)

Não temos os SVGs originais (não são extraíveis de PNG). Vou recriar como SVGs novos, próximos
visualmente ao que aparece nos prints — a menos que o cliente consiga exportar os originais do
XD (clique direito no elemento > "Copiar como SVG" ou "Exportar").
