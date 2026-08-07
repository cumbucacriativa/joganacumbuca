# Escopo

## O que é

App mobile-first de apoio a jogos de improviso teatral. Alguém abre o link no celular (numa
festa, ensaio ou encontro de grupo de improviso), escolhe uma categoria de jogo (ou sorteia
um), e opcionalmente sorteia um personagem e/ou uma localização pra dar tema à cena.

## Funcionalidades da v1

- **Tela inicial** com acesso às categorias de jogo.
- **Lista de jogos por categoria**, derivada automaticamente do CSV (nenhuma categoria nova
  precisa de alteração de código, só de planilha).
- **Sorteio de jogo** — aleatório, dentro de uma categoria ou entre todos.
- **Ícone de "dado"**, acessível a qualquer momento na tela, pra sortear um personagem e/ou
  uma localização aleatórios a partir de `aleatoriedades.csv`.
- Indicadores por jogo: precisa de **mediador** (sim/não), é **aquecimento** (sim/não), usa
  **música** (sim/não).
- Navegação fluida entre telas (sem parecer troca de página/link) com animação de carta
  girando na transição, e um carrossel de cartas animado (infinito, lento, pra esquerda) como
  elemento decorativo — visual de app profissional, não de protótipo.
- Mobile-first, publicado no GitHub Pages.

## Fora de escopo por enquanto

- Cadastro de jogos pelo próprio app (edição de CSV é manual, fora do app).
- Contas de usuário / login / histórico por pessoa.
- Backend, banco de dados real ou API — tudo estático + CSV.

## Decisões já tomadas

- Fonte de dados: CSV (dois arquivos — jogos e aleatoriedades), sem categoria fixa pré-definida.
- Hospedagem: GitHub Pages, sem custo, sem servidor.
- Stack: HTML/CSS/JS puro (ver justificativa em `01-ARQUITETURA-GERAL.md`).

## Resolvido em 2026-08-06

1. **Design visual do XD** — cliente mandou prints das 5 telas do protótipo. Leitura completa
   de layout/fluxo/cores/tipografia (aproximada) em [`05-DESIGN-VISUAL.md`](05-DESIGN-VISUAL.md).
   Ainda faltam SVGs originais dos ícones e confirmação de hex/fonte exatos — cliente se
   ofereceu a exportar do XD sob pedido (ver itens 1 e 2 abaixo).
2. **Mecânica do "dado" de aleatoriedades** — confirmado pelos prints (tela 5, overlay
   "Sortear de novo"): são **dois sorteios independentes**, "Local aleatório" e "Personagem
   Aleatório", cada um acionável separadamente.

## Resolvido em 2026-08-07

3. **SVGs e specs exatos** — cliente exportou os SVGs reais de cada tela (`_Docs/SVGs/`) e
   mandou prints do "Modo de especificações" do XD com hex e fonte exatos. Ver
   `05-DESIGN-VISUAL.md` (seção "Confirmado").
4. **Versão navegável construída** — as 4 telas principais (início, categoria, jogo sorteado,
   lista de jogos) e o overlay de sorteio de personagem/local estão implementados e testados
   localmente, batendo visualmente com os prints do XD. Ver `03-CHANGELOG.md` v0.2.0.
5. **Publicação no GitHub Pages** — repositório `cumbucacriativa/joganacumbuca` (conta GitHub
   da Cumbuca Criativa) recebeu o push e o GitHub Pages foi ativado. Site no ar em
   https://cumbucacriativa.github.io/joganacumbuca/. Ver `04-REGISTRO-BUGS.md`.
6. **Ícones/ornamentos redesenhados à mão substituídos pelos SVGs reais** — cliente apontou que
   ficaram errados; refeito usando os arquivos exportados do XD como fundo das cartas. Ver
   `03-CHANGELOG.md` v0.3.0.
7. **Ícone de música** — cliente exportou; implementado na legenda da lista, na lista de jogos
   e como tag "Precisa de música" no cartão do jogo. Ver v0.4.0.
8. **Botão "+ OPÇÕES"** — confirmado pelo cliente: leva de volta pra lista de jogos (filtrada
   pela categoria do jogo atual).

## Decisões pendentes (aguardando resposta do cliente)

1. **Colunas mediador/aquecimento/música** — implementadas como selos informativos (cartão do
   jogo + legenda da lista), sem filtro ativo. Confirma que é só informativo por enquanto, ou
   quer filtro ativo também?
2. **Sorteio de jogo** — implementado permitindo repetir o mesmo jogo duas vezes seguidas
   (mais simples). Muda pra "não repete até esgotar a lista da categoria" se preferir.
3. **PWA / instalável** — ainda não implementado. Vale adicionar manifest + funcionamento
   offline (ícone na tela inicial do celular, funciona sem internet numa festa com wifi ruim)?
4. **Quem edita os CSVs depois de prontos** — só o Kewin (via git/planilha) ou alguém sem
   perfil técnico vai mexer? Se for o segundo caso, talvez valha uma telinha admin simples em
   vez de editar CSV cru. Enquanto isso, passo a passo pra edição manual está no `README.md`.
5. **Categoria e descrição dos 4 jogos de exemplo sem confirmação** (Musical, Congela, Medusa,
   Círculo da Conexão) — só "Jogo do Troca" teve categoria e descrição confirmadas pelo design.
   Os outros usam "Trios" como placeholder estrutural e descrição em aberto — ver nota em
   `01-ARQUITETURA-GERAL.md`. Isso é só para os 5 jogos de exemplo; a planilha real do cliente
   vai substituir tudo.

## Fora do escopo original, mas pedido e implementado

- **Easter egg no carrossel do rodapé**: clicar numa cartinha sorteia um jogo de todas as
  categorias com uma animação de "voo até o centro + giro". Sem função prática — só engajamento
  lúdico. Ver `03-CHANGELOG.md` v0.4.0.

Assim que as pendências acima forem respondidas, este documento deve ser atualizado.
