# Registro de Bugs e Limitações

Nenhum bug de código registrado ainda (projeto em fase de scaffold, sem UI funcional).

## Limitações de ferramenta conhecidas

### Screenshot do link Adobe XD não renderiza nesta sessão

**Sintoma:** o navegador embutido usado pelo Claude Code abre
`xd.adobe.com/view/4478a107-78cd-4bbb-b235-7b34649b947d-112b` normalmente (título da aba,
texto da página, botões de navegação entre telas todos acessíveis), mas a ferramenta de
screenshot retorna erro ("Browser pane is not displayed") — o canvas do XD é renderizado via
WebGL/canvas, então sem screenshot não dá pra ler visualmente cor/tipografia/espaçamento.

**Workaround:** pedir ao cliente prints de cada uma das 5 telas do protótipo, ou exportar o
XD como PDF (`Arquivo > Exportar > PDF` dentro do app desktop, se ainda tiver acesso — o XD
está no fim da vida útil, então vale confirmar se o app desktop ainda abre o arquivo local).

### ~~Sem GitHub CLI (`gh`) nem conector GitHub autenticado nesta sessão~~ — resolvido em 2026-08-07

`gh` não estava instalado e o conector MCP do GitHub precisava de autorização interativa.
Resolvido de outra forma: cliente mandou um Personal Access Token da conta GitHub da Cumbuca
Criativa (guardado em `_docs/github-cumbuca-criativa.md`), usado para chamar a API REST do
GitHub direto via `curl` — criou o repo (depois descartado, porque o cliente já tinha criado
`cumbucacriativa/joganacumbuca` manualmente), fez `git push` pra esse repo (token passado só
na URL do push, nunca gravado em `.git/config`) e ativou o GitHub Pages via
`POST /repos/{owner}/{repo}/pages`. Site no ar em
https://cumbucacriativa.github.io/joganacumbuca/.

Pra próximos projetos que precisem do mesmo: usar esse mesmo token (se for outro repo da
Cumbuca Criativa) ou repetir uma das opções abaixo, que continuam válidas:
1. Cliente cria um repositório vazio em github.com e manda a URL — `git push` local funciona
   via Git Credential Manager, já configurado no Windows (`credential.helper=manager`).
2. Cliente autoriza o conector GitHub (`claude mcp` / `/mcp` numa sessão interativa).
3. Instalar o GitHub CLI (`winget install GitHub.cli` ou `scoop install gh`) e rodar
   `gh auth login` uma vez.

### Ferramenta de screenshot do navegador embutido, instável

**Sintoma:** a mesma falha que travou no link do XD (`04-REGISTRO-BUGS.md`, primeira entrada)
reapareceu ao testar o site publicado (`cumbucacriativa.github.io/joganacumbuca`) — screenshot
retorna tela em branco (só o fundo creme) mesmo com a página carregada e renderizada
corretamente (confirmado via `getComputedStyle`, `getBoundingClientRect` e `img.naturalWidth`
no DOM real, tudo certo). No mesmo teste em `localhost` durante o desenvolvimento, o
screenshot funcionou normalmente. Parece ser uma instabilidade pontual da ferramenta de
captura desta sessão, não um bug da página. Se acontecer de novo, validar via
`javascript_tool` (computed styles/rects) em vez de insistir no screenshot.

*(Mesma classe de observação do BUG-001 registrado em outros projetos da pasta `_Dev/`: o
projeto vive dentro do Google Drive, que às vezes trava builds locais por sincronização
contínua. Como este projeto não tem build step, o risco é baixo — só relevante se algum dia
entrar um bundler/npm aqui.)*

### ~~Conector n8n MCP desta sessão apontava pra VPS errada~~ — resolvido em 2026-08-07

Cliente pediu um workflow novo em `vps-lava` (n8n da própria agência Lava, onde vive o
`[KEWIN] Quinta Livre`), pra rodar em paralelo com ele. O primeiro conector n8n MCP disponível
nesta sessão estava plugado na `vps-adn` (ADN Construtora) por engano. O cliente conectou o
conector certo (`vps-lava`) na sequência e o workflow foi criado normalmente — ver
`n8n/vps-lava/clientes/lava-agencia/README.md` e `changelog.md`.

### Workflow n8n de cadastro/exclusão criado, mas ainda inativo

**Sintoma:** o workflow `[KEWIN] Joga na Cumbuca - Cadastro de Jogos` (ID `fGqJEeLlgj2MhpJx`)
foi criado com sucesso via MCP, incluindo os 4 nós GitHub necessários. Mas a ferramenta MCP não
consegue **criar credenciais** (só referenciá-las por `newCredential(...)`, que gera um
placeholder) — então os nós GitHub ficaram sem credencial de verdade atribuída, e o workflow
não foi ativado (evitar deixar uma automação quebrada "no ar").

**Bloqueia:** os botões "+" (cadastrar) e lixeira (excluir) no app abrem/chamam os endpoints
certos, mas a gravação no GitHub falha até isso ser resolvido.

**Como resolver** (2 passos manuais no n8n, ~2 minutos):
1. No n8n (`vps-lava`), abrir o workflow e ir em Credentials > New > **GitHub API**. Colar o
   token de `_docs/github-cumbuca-criativa.md` (na raiz do `_Dev`). Nomear a credencial
   `GitHub - Cumbuca Criativa` (mesmo nome que os nós já esperam).
2. Selecionar essa credencial nos 4 nós GitHub do fluxo ("Buscar jogos.csv Atual", "Salvar
   jogos.csv no GitHub", "Buscar jogos.csv para Excluir", "Salvar Exclusao no GitHub"), e
   ativar o workflow (toggle no canto superior direito do editor).

Depois disso, testar uma vez cada fluxo (cadastrar um jogo de teste, depois excluir ele) antes
de considerar resolvido.

## Pendências (roadmap curto)

- Ativar o workflow n8n (credencial + toggle) — ver acima. Bloqueia cadastro/exclusão de jogo
  funcionarem de ponta a ponta.
- Colunas mediador/aquecimento/música como filtro ativo (hoje só informativo) — aguardando
  confirmação em `02-ESCOPO.md`.
- PWA/instalável — aguardando confirmação em `02-ESCOPO.md`.
