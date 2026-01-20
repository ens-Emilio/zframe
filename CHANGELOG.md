# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-01-20

### Adicionado
- **Kanban Board** com drag-and-drop entre colunas usando `@dnd-kit`
- **CRUD de tarefas** completo (criar, editar, deletar)
- **Prioridades** (P1, P2, P3, P4) com badges coloridos
- **Tags** personalizadas com visual de chips
- **Due dates** com indicador de vencimento
- **Busca full-text** em tempo real
- **Filtros** por tag e prioridade (FilterPanel)
- **Atalhos de teclado**:
  - `N` - Nova tarefa
  - `/` - Foco na busca
  - `Ctrl+S` - Salvar arquivo
  - `Ctrl+O` - Abrir arquivo
  - `Esc` - Fechar modal
- **File System Access API** para Chrome/Edge (leitura/escrita direta)
- **Fallback** download/upload para Firefox e Safari
- **Modo read-only** com banner visual
- **PWA** (Progressive Web App) com service worker offline
- **Glassmorphism UI** dark theme premium
- **Página About** com explicações de conceitos e arquitetura
- **Tabler Icons** em toda a interface
- **Adapters** para JSON e Markdown (GFM task lists)
- **Responsividade** mobile

### Tecnologias
- React 18
- TypeScript 5
- Vite 5
- @dnd-kit (drag-and-drop)
- @tabler/icons-react
- vite-plugin-pwa
- Bun (package manager)

### Arquitetura
- **Core Domain**: Tipos e lógica de negócio
- **Adapters**: Parse/serialize JSON e Markdown
- **Hooks**: `useBoard`, `useFileSystem`
- **Components**: UI com Glassmorphism

### Formatos Suportados
- `tasks.json` - Formato canônico estruturado
- `TASKS.md` - Markdown com GitHub Flavored Markdown task lists

---

## [Unreleased]

### Planejado
- Testes automatizados (unit + integration)
- Filtro por status/coluna
- Exportação para outros formatos
- Temas customizáveis
- Sincronização com Git
- Modo colaborativo (opcional)

---

[1.0.0]: https://github.com/seu-usuario/zframe/releases/tag/v1.0.0
