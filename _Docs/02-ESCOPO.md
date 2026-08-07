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

## Decisões pendentes (aguardando resposta do cliente)

Perguntado em 2026-08-06, respostas ainda não recebidas:

1. **Design visual do XD** — o link do Adobe XD
   (`xd.adobe.com/view/4478a107-78cd-4bbb-b235-7b34649b947d-112b`) abriu, mas o navegador usado
   nessa sessão não conseguiu renderizar screenshot do canvas (limitação de ferramenta, não do
   link). Sabemos que o protótipo tem 5 telas ("1 - Tela Inicial" é a primeira). Pendente:
   cliente mandar prints de cada tela ou exportar o XD como PDF, ou confirmar se seguimos com
   um visual novo a partir da descrição em texto + paleta da logo (`#0fa` / preto / branco /
   cinza).
2. **Mecânica do "dado" de aleatoriedades** — um único toque sorteia personagem *e*
   localização juntos, ou são dois dados/botões separados (um só personagem, um só local)?
3. **Colunas mediador/aquecimento/música** — são só selos informativos no card do jogo, ou
   também funcionam como filtro (ex: "mostrar só jogos sem mediador")?
4. **Carrossel de cartas no rodapé** — é decorativo (cartas genéricas passando, não clicáveis)
   ou mostra jogos reais e é clicável pra abrir aquele jogo?
5. **Sorteio de jogo** — pode repetir o mesmo jogo duas vezes seguidas, ou não repete até
   passar por toda a lista da categoria?
6. **PWA / instalável** — vale adicionar manifest + funcionamento offline (ícone na tela
   inicial do celular, funciona sem internet numa festa com wifi ruim)?
7. **Quem edita os CSVs depois de prontos** — só o Kewin (via git/planilha) ou alguém sem
   perfil técnico vai mexer? Se for o segundo caso, talvez valha uma telinha admin simples em
   vez de editar CSV cru.
8. **Publicação no GitHub** — sessão atual não tem GitHub CLI (`gh`) nem conector GitHub
   autenticado disponível, então não consegui criar o repositório sozinho. Ver
   `04-REGISTRO-BUGS.md` para as opções propostas.

Assim que essas respostas chegarem, este documento e `01-ARQUITETURA-GERAL.md` devem ser
atualizados antes de começar a implementação da versão navegável.
