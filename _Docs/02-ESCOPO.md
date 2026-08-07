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

## Decisões pendentes (aguardando resposta do cliente)

1. **SVGs dos ícones** — não são extraíveis de PNG. Pedir pro cliente exportar do XD (clique
   direito no elemento > "Copiar como SVG"/"Exportar"): ícone de máscaras+shuffle (marca),
   ícone de dado, ícones da legenda da lista (aquecimento, mediador, participantes, música).
   Sem isso, recrio como SVG novo, próximo visualmente.
2. **Hex/fonte exatos** — sem acesso ao "Modo de especificações" do XD nesta sessão (mesma
   limitação de screenshot). Cliente pode tentar abrir esse modo no link e mandar print, ou
   confirmar se as aproximações em `05-DESIGN-VISUAL.md` servem.
3. **Botão "+ OPÇÕES"** (tela 3, cartão do jogo sorteado) — o que ele faz? Mais tags/detalhes
   do jogo, filtros, ou outra coisa?
4. **Colunas mediador/aquecimento/música** — pelos prints, aparecem como selos informativos
   (legenda + ícones na lista), sem controle de filtro visível. Confirma que é só informativo
   por enquanto, ou quer filtro ativo também?
5. **Carrossel de cartas no rodapé** — no protótipo é decorativo (ícone genérico de máscaras
   repetido). Mantém decorativo na implementação (mais simples, e é o que o design mostra), ou
   deve mostrar jogos reais e ser clicável?
6. **Sorteio de jogo** — pode repetir o mesmo jogo duas vezes seguidas, ou não repete até
   passar por toda a lista da categoria?
7. **PWA / instalável** — vale adicionar manifest + funcionamento offline (ícone na tela
   inicial do celular, funciona sem internet numa festa com wifi ruim)?
8. **Quem edita os CSVs depois de prontos** — só o Kewin (via git/planilha) ou alguém sem
   perfil técnico vai mexer? Se for o segundo caso, talvez valha uma telinha admin simples em
   vez de editar CSV cru.
9. **Publicação no GitHub** — sessão atual não tem GitHub CLI (`gh`) nem conector GitHub
   autenticado disponível, então não consegui criar o repositório sozinho. Ver
   `04-REGISTRO-BUGS.md` para as opções propostas.

Assim que essas respostas chegarem, este documento e `01-ARQUITETURA-GERAL.md` devem ser
atualizados antes de começar a implementação da versão navegável.
