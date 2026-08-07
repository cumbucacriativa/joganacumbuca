# Documentação Central — Joga na Cumbuca

> Guia de referência do projeto. Otimizado para contexto de modelos de IA.

> **⚡ Regras operacionais do dia a dia:** ver [`../CLAUDE.md`](../CLAUDE.md), carregado
> automaticamente toda sessão.

## Documentos

| # | Arquivo | Conteúdo |
|---|---------|----------|
| 1 | [01-ARQUITETURA-GERAL.md](01-ARQUITETURA-GERAL.md) | Stack, estrutura de pastas, modelo de dados dos CSVs |
| 2 | [02-ESCOPO.md](02-ESCOPO.md) | O que é o app, funcionalidades da v1, decisões tomadas e pendentes |
| 3 | [03-CHANGELOG.md](03-CHANGELOG.md) | Histórico de versões |
| 4 | [04-REGISTRO-BUGS.md](04-REGISTRO-BUGS.md) | Bugs/limitações conhecidas e workarounds |

## Estado real do projeto

Versão navegável no ar em **https://cumbucacriativa.github.io/joganacumbuca/** (4 telas +
overlay de sorteio), com cores/tipografia/componentes batendo com os specs exatos e SVGs que o
cliente exportou do XD — ver [05-DESIGN-VISUAL.md](05-DESIGN-VISUAL.md) e
[03-CHANGELOG.md](03-CHANGELOG.md). Tem algumas decisões de produto em aberto — ver "Decisões
pendentes" em [02-ESCOPO.md](02-ESCOPO.md).

Não há doc de segurança/credenciais (`0X-SEGURANCA-E-CREDENCIAIS.md`) porque o projeto não usa
nenhuma credencial — site estático público, sem backend, sem API keys. Se isso mudar
(ex: entrar um backend ou uma API de terceiros), criar o doc seguindo o padrão dos outros
projetos em `_Dev/`.
