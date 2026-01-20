# ZFrame - Minimalist Task Board

<div align="center">

![ZFrame Logo](https://via.placeholder.com/120x120/1a1a2e/8b5cf6?text=ZF)

**A minimalist, repo-based task board for developers**

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

</div>

---

## ✨ Features

- 📋 **Kanban Drag-and-Drop** - Mova tarefas entre colunas arrastando
- 📁 **File-Based** - Lê/escreve `tasks.json` ou `TASKS.md` locais
- 🌐 **Offline-First** - PWA funciona sem internet
- 🎨 **Glassmorphism UI** - Interface moderna com blur e transparência
- 🔐 **Privacy-First** - Sem servidor, sem login, sem telemetria
- ⌨️ **Atalhos de Teclado** - `N` nova task, `/` busca, `Ctrl+S` salvar
- 🏷️ **Tags & Prioridades** - Organize com tags customizadas e níveis P1-P4
- 🔍 **Busca & Filtros** - Busca full-text e filtros por tag/prioridade
- 📅 **Due Dates** - Acompanhe prazos com indicadores visuais

## 🚀 Quick Start

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/zframe.git
cd zframe

# Instalar dependências
bun install

# Rodar servidor de desenvolvimento
bun run dev

# Abra http://localhost:5173 no Chrome/Edge
```

## 📖 Documentação

- [Guia de Contribuição](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)
- [Licença MIT](./LICENSE)

## 📄 Formatos Suportados

### JSON (`tasks.json`)

Formato canônico estruturado:

```json
{
  "project": { 
    "name": "Meu Projeto", 
    "description": "Descrição opcional",
    "columns": ["Backlog", "Doing", "Done"] 
  },
  "tasks": [
    { 
      "id": "task_001", 
      "title": "Implementar feature", 
      "status": "Doing", 
      "priority": "P1", 
      "tags": ["feature", "backend"],
      "due": "2026-01-25",
      "estimate": "3h",
      "notes": "Detalhes da implementação..."
    }
  ]
}
```

### Markdown (`TASKS.md`)

GitHub Flavored Markdown com task lists:

```markdown
# Meu Projeto

> Descrição opcional do projeto

## Backlog
- [ ] Tarefa pendente #tag #outro-tag P2
- [ ] Outra tarefa P3

## Doing
- [ ] Tarefa em progresso #feature P1 📅 2026-01-25 ⏱️ 3h

## Done
- [x] Tarefa concluída #done
```

**Convenções:**
- `#tag` - Tags (qualquer palavra com #)
- `P1`, `P2`, `P3`, `P4` - Prioridades
- `📅 YYYY-MM-DD` - Due date
- `⏱️ Xh` - Estimativa
- Notas em parágrafos após a task

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `N` | Nova tarefa |
| `/` | Foco na busca |
| `Ctrl+S` | Salvar arquivo |
| `Ctrl+O` | Abrir arquivo |
| `Esc` | Fechar modal |
| `Ctrl+Enter` | Salvar tarefa (no modal) |

## 🏗️ Arquitetura

```
src/
├── core/          # Tipos e lógica de domínio (sem deps externas)
│   ├── types.ts   # Interfaces Task, Board, Column
│   └── board.ts   # CRUD, filtros, busca
├── adapters/      # I/O e parsing
│   ├── json-adapter.ts      # Parse/serialize JSON
│   ├── markdown-adapter.ts  # Parse/serialize Markdown
│   └── file-service.ts      # File System Access API
├── hooks/         # React hooks
│   ├── useBoard.ts          # Estado do Kanban
│   └── useFileSystem.ts     # Operações de arquivo
├── components/    # UI components
│   ├── TopBar.tsx
│   ├── Board.tsx
│   ├── Column.tsx
│   ├── Card.tsx
│   ├── TaskEditor.tsx
│   ├── FilterPanel.tsx
│   └── About.tsx
└── styles/        # CSS Glassmorphism
    ├── design-tokens.css
    ├── glassmorphism.css
    └── index.css
```

### Princípios Arquiteturais

- **Separation of Concerns**: Core domain isolado de I/O e UI
- **Dependency Rule**: Camadas internas não dependem de externas
- **Adapters Pattern**: Conversão entre formatos externos e domínio
- **Hooks Pattern**: Lógica reutilizável separada de UI

## 🌐 Compatibilidade

| Browser | File System Access API | Modo |
|---------|------------------------|------|
| Chrome 86+ | ✅ | Leitura/Escrita |
| Edge 86+ | ✅ | Leitura/Escrita |
| Opera 72+ | ✅ | Leitura/Escrita |
| Firefox | ❌ | Download/Upload |
| Safari | ❌ | Download/Upload |

**Nota**: Browsers sem File System Access API usam fallback de download/upload manual.

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript 5
- **Build**: Vite 5
- **Drag-and-Drop**: @dnd-kit
- **Icons**: @tabler/icons-react
- **PWA**: vite-plugin-pwa, Workbox
- **Package Manager**: Bun

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
bun run dev          # Inicia dev server

# Build
bun run build        # Build de produção
bun run preview      # Preview do build

# Qualidade
bun run lint         # ESLint
bun run type-check   # TypeScript check
bun test             # Testes (quando implementados)
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia o [Guia de Contribuição](./CONTRIBUTING.md) antes de enviar PRs.

### Passos Rápidos

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit: `git commit -m 'feat: adiciona minha feature'`
4. Push: `git push origin feature/minha-feature`
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

<div align="center">

**Feito com ❤️ usando React + TypeScript + Glassmorphism**

[⬆ Voltar ao topo](#zframe---minimalist-task-board)

</div>
