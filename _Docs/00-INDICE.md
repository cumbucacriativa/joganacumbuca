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

Fase inicial. Estrutura de pastas, documentação e dados de exemplo criados. Ainda não existe
UI funcional nem repositório publicado no GitHub — aguardando respostas do cliente sobre
mecânica do jogo e design (ver "Decisões pendentes" em [02-ESCOPO.md](02-ESCOPO.md)) antes de
implementar a versão navegável.

Não há doc de segurança/credenciais (`0X-SEGURANCA-E-CREDENCIAIS.md`) porque o projeto não usa
nenhuma credencial — site estático público, sem backend, sem API keys. Se isso mudar
(ex: entrar um backend ou uma API de terceiros), criar o doc seguindo o padrão dos outros
projetos em `_Dev/`.
