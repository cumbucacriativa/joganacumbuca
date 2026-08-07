# Design Visual

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
