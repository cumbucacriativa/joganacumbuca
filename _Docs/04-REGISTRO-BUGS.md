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

### Sem GitHub CLI (`gh`) nem conector GitHub autenticado nesta sessão

**Sintoma:** `gh` não está instalado (nem no Git Bash nem no PowerShell desta máquina), e o
conector MCP do GitHub (`engineering:github`) precisa de autorização que não pode ser feita
numa sessão não-interativa.

**Opções pra publicar o repositório:**
1. Cliente cria um repositório vazio em github.com (público, sem README) e manda a URL — daí
   o `git push` local funciona via Git Credential Manager, que já está configurado no Windows
   (`credential.helper=manager`), sem precisar digitar senha/token em lugar nenhum.
2. Cliente autoriza o conector GitHub (`claude mcp` / `/mcp` numa sessão interativa) — depois
   disso dá pra criar o repo, dar push e ativar o GitHub Pages via API, tudo automatizado.
3. Instalar o GitHub CLI (`winget install GitHub.cli` ou `scoop install gh`) e rodar
   `gh auth login` uma vez — depois disso os próximos projetos também ganham criação de repo
   automatizada.

*(Mesma classe de observação do BUG-001 registrado em outros projetos da pasta `_Dev/`: o
projeto vive dentro do Google Drive, que às vezes trava builds locais por sincronização
contínua. Como este projeto não tem build step, o risco é baixo — só relevante se algum dia
entrar um bundler/npm aqui.)*

## Pendências (roadmap curto)

- Publicar repositório + GitHub Pages (ver opções acima).
- Implementar UI real — aguardando respostas em `02-ESCOPO.md`.
