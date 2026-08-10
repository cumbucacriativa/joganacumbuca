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

### ~~Workflow n8n de cadastro/exclusão criado, mas ainda inativo~~ — resolvido (credencial GitHub configurada)

Workflow ativo, credencial `Github Cumbuca` (id `l5SuoiPmX7o8HqrS`) atribuída aos 4 nós GitHub.
Fluxo de cadastro (formulário) testado e funcionando em produção. Ver bug abaixo sobre o
webhook de exclusão especificamente.

### Webhook de exclusão de jogo não registra no n8n quando o workflow tem um node GitHub (self-hosted, `vps-lava`)

**Sintoma (2026-08-10):** clicar na lixeira no app não excluía o jogo. Investigado ponta a
ponta, incluindo depois que o cliente já tinha tentado reativar o workflow pela UI do n8n (que
nessa versão não tem mais toggle simples de ativo — só publish/versão) e reiniciado o container
no EasyPanel, sem resultado.

**Causa raiz confirmada por eliminação:** criei 3 workflows de diagnóstico temporários (já
arquivados) pra isolar a variável:
1. Webhook trigger sozinho + Respond → **funcionou** (200 OK).
2. Webhook trigger + node IF + Respond → **funcionou** (200 OK).
3. Webhook trigger + node **GitHub** (`n8n-nodes-base.github`, com credencial `Github Cumbuca`)
   + Respond → **não registrou** (404 "webhook not registered"), mesmo publicando várias vezes,
   com credencial anexada de formas diferentes (`newCredential()` na criação, `setNodeCredential`
   depois, node recriado do zero com `credentials` embutido no `addNode`).

Ou seja: **qualquer workflow que tenha um trigger `n8n-nodes-base.webhook` E um node
`n8n-nodes-base.github` no mesmo grafo tem o registro do webhook de produção quebrado nesta
instância do n8n** — não é sobre CORS, path, `webhookId`, `responseMode`, nem sobre ter dois
triggers no mesmo workflow (testado e descartado). O form trigger do cadastro funciona porque,
apesar de também ter nodes GitHub, o mecanismo de registro de formulário é diferente do de
webhook — não passa pelo mesmo caminho quebrado.

Isso bate com uma classe conhecida de bugs do n8n 2.x onde a ativação via API (ou até a própria
"Publish" da UI nova) não recarrega a tabela de rotas de webhook em produção — mas o detalhe
específico de travar só quando tem node GitHub no meio não é coberto pelos relatos públicos que
achei; pode ser algo nessa instância (ex: o node GitHub faz uma checagem de credencial
síncrona/de rede durante a ativação que trava o registro do webhook se falhar ou demorar).

**Não resolve:** desativar/reativar via API nem via UI, reiniciar o container, trocar `path`,
recriar o node do webhook do zero, trocar `responseMode`, separar num workflow próprio (fiz
isso — `[KEWIN] Joga na Cumbuca - Excluir Jogo`, id `qO9V0UitpSsFPTC2` — mesmo isolado, com só
o node GitHub, continua sem registrar).

**Client já atualizado:** `assets/js/app.js` aponta pra URL do workflow novo e isolado
(`.../webhook/9365f4bc-c47c-41f8-b567-5f5ae2f06215/joga-na-cumbuca-excluir`) — é a URL certa
assim que o registro colar.

**Caminho de solução mais provável:** trocar o node GitHub (`n8n-nodes-base.github`) por um
node **HTTP Request** genérico chamando a API REST do GitHub direto
(`GET/PUT https://api.github.com/repos/cumbucacriativa/joganacumbuca/contents/data/jogos.csv`)
com uma credencial **HTTP Header Auth** (`Authorization: Bearer <token>`) em vez da credencial
GitHub dedicada — isso contorna o que quer que o node GitHub esteja disparando na hora da
ativação. Não consegui fazer isso via MCP porque criar uma credencial nova exige colar o token
na UI do n8n (não tem ferramenta MCP pra isso, e não é algo que devo fazer por fora da UI).

**Como resolver (precisa de alguém com acesso à UI do n8n):**
1. No n8n (`vps-lava`), criar uma credencial **HTTP Header Auth** com header
   `Authorization: Bearer <token do _docs/github-cumbuca-criativa.md>`.
2. No workflow `[KEWIN] Joga na Cumbuca - Excluir Jogo` (`qO9V0UitpSsFPTC2`), trocar os 2 nodes
   GitHub ("Buscar jogos.csv para Excluir" e "Salvar Exclusao no GitHub") por nodes HTTP Request
   equivalentes usando essa credencial (fico à disposição pra montar os nodes via MCP assim que
   a credencial existir — só preciso do nome dela).
3. Publicar e testar com
   `curl -X POST '.../webhook/9365f4bc-c47c-41f8-b567-5f5ae2f06215/joga-na-cumbuca-excluir' -H 'Content-Type: application/json' -d '{"id":"999999999","senha":"!admin123"}'`
   — deve responder `{"ok":false,...}` (JSON), não mais 404/500. Depois testar excluindo um jogo
   de teste de verdade pelo app.

Alternativa mais simples, se não quiser mexer em credenciais agora: reportar o bug pro suporte/
comunidade do n8n (padrão bate com issues públicas tipo n8n-io/n8n#34038, #23549, #21614,
#23808 sobre webhook não registrar depois de ativação em v2.x) e aguardar correção, já que
reiniciar/reativar não resolve nesta instância.

## Pendências (roadmap curto)

- Resolver o registro do webhook de exclusão no n8n (trocar node GitHub por HTTP Request, ver
  acima) — bloqueia só a exclusão (o cadastro já funciona).
- Colunas mediador/aquecimento/música como filtro ativo (hoje só informativo) — aguardando
  confirmação em `02-ESCOPO.md`.
- PWA/instalável — aguardando confirmação em `02-ESCOPO.md`.
