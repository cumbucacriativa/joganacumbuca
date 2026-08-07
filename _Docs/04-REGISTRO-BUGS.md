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

### Conector n8n MCP desta sessão aponta pra VPS errada

**Sintoma:** cliente pediu um workflow novo em `vps-lava` (n8n da própria agência Lava, onde
vive o `[KEWIN] Quinta Livre`, ID `sl61e9Qfcq6XdB99` — ver `n8n/vps-lava/clientes/lava-agencia/
README.md`), pra rodar em paralelo com ele. O conector n8n MCP disponível nesta sessão
(`search_workflows` sem filtro) retornou workflows da **ADN Construtora**
(`[ADN] Transferência e Backup de Leads`, `Normalizador de Dados`, etc.) — ou seja, está
plugado na `vps-adn`, não na `vps-lava`.

**Bloqueia:** criar o workflow de formulário pra cadastro de jogos (ver `02-ESCOPO.md`,
pendência 3) e o botão "+" no app que linkaria pra ele (pendência 4).

**Como resolver:** o cliente precisa autorizar/conectar o MCP do n8n certo
(`vps-lava` — endpoint e token em `n8n/vps-lava/mcp-config.md`) numa sessão que tenha acesso a
configurar conectores MCP. Depois disso, seguir as regras de `n8n/CLAUDE.md` (exportar backup
antes de mudança relevante, registrar em `n8n/vps-lava/clientes/lava-agencia/changelog.md`).

## Pendências (roadmap curto)

- Workflow n8n de cadastro de jogos + botão "+" no app — bloqueado, ver acima.
- Colunas mediador/aquecimento/música como filtro ativo (hoje só informativo) — aguardando
  confirmação em `02-ESCOPO.md`.
- PWA/instalável — aguardando confirmação em `02-ESCOPO.md`.
