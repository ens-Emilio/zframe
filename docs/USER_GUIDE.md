# Guia de Uso do ZFrame

Este guia irá ajudá-lo a começar a usar o ZFrame para gerenciar suas tarefas.

## Índice

1. [Primeiros Passos](#primeiros-passos)
2. [Criando Tarefas](#criando-tarefas)
3. [Organizando com Drag-and-Drop](#organizando-com-drag-and-drop)
4. [Usando Tags e Prioridades](#usando-tags-e-prioridades)
5. [Buscando e Filtrando](#buscando-e-filtrando)
6. [Salvando e Carregando](#salvando-e-carregando)
7. [Atalhos de Teclado](#atalhos-de-teclado)
8. [Dicas e Truques](#dicas-e-truques)

---

## Primeiros Passos

### Abrindo o ZFrame

1. Acesse http://localhost:5173 (em desenvolvimento)
2. Você verá um board vazio com 3 colunas padrão: Backlog, Doing, Done

### Criando seu Primeiro Projeto

Você pode começar de duas formas:

**Opção 1: Criar do Zero**
1. Clique em "Nova Tarefa" ou pressione `N`
2. Preencha os detalhes da tarefa
3. Clique em "Criar"

**Opção 2: Abrir Arquivo Existente**
1. Clique em "Abrir" ou pressione `Ctrl+O`
2. Selecione um arquivo `tasks.json` ou `TASKS.md`
3. O board será carregado automaticamente

---

## Criando Tarefas

### Campos Disponíveis

- **Título** (obrigatório): Nome da tarefa
- **Status**: Coluna onde a tarefa aparecerá
- **Prioridade**: P1 (urgente) a P4 (baixa)
- **Tags**: Palavras-chave para organização
- **Due Date**: Prazo de conclusão
- **Estimativa**: Tempo estimado (ex: 2h, 1d)
- **Notas**: Descrição detalhada

### Exemplo de Tarefa

```
Título: Implementar autenticação
Status: Doing
Prioridade: P1
Tags: backend, security
Due Date: 2026-01-25
Estimativa: 4h
Notas: Usar JWT para tokens
```

---

## Organizando com Drag-and-Drop

### Mover entre Colunas

1. Clique e segure uma tarefa
2. Arraste para a coluna desejada
3. Solte para mover

### Reordenar na Mesma Coluna

1. Clique e segure uma tarefa
2. Arraste para cima ou para baixo
3. Solte na posição desejada

**Dica**: O cursor muda para indicar que você pode arrastar!

---

## Usando Tags e Prioridades

### Tags

Tags ajudam a categorizar tarefas:

- Use palavras simples: `frontend`, `bug`, `feature`
- Adicione múltiplas tags separadas por vírgula
- Tags aparecem como chips coloridos no card

### Prioridades

Níveis de prioridade:

- **P1** 🔴 - Urgente/Crítico
- **P2** 🟠 - Alta
- **P3** 🔵 - Média
- **P4** ⚪ - Baixa

**Dica**: Use P1 apenas para tarefas realmente urgentes!

---

## Buscando e Filtrando

### Busca Full-Text

1. Clique no campo de busca ou pressione `/`
2. Digite qualquer termo
3. Resultados aparecem em tempo real

A busca procura em:
- Títulos
- Tags
- Notas

### Filtros

Use o painel de filtros (lado direito) para:

- **Filtrar por Prioridade**: Clique em P1, P2, P3 ou P4
- **Filtrar por Tag**: Clique em qualquer tag
- **Combinar Filtros**: Múltiplos filtros funcionam juntos

**Limpar Filtros**: Clique em "✕ Limpar"

---

## Salvando e Carregando

### Salvando

**Chrome/Edge (File System Access API)**:
1. Pressione `Ctrl+S` ou clique em "Salvar"
2. Arquivo é atualizado automaticamente

**Firefox/Safari (Fallback)**:
1. Clique em "Salvar"
2. Escolha "Salvar como JSON" ou "Salvar como Markdown"
3. Arquivo será baixado

### Carregando

**Chrome/Edge**:
1. Pressione `Ctrl+O` ou clique em "Abrir"
2. Selecione o arquivo
3. Permita acesso quando solicitado

**Firefox/Safari**:
1. Clique em "Abrir"
2. Selecione o arquivo via input
3. Arquivo será carregado (somente leitura)

---

## Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `N` | Criar nova tarefa |
| `/` | Focar no campo de busca |
| `Ctrl+S` | Salvar arquivo |
| `Ctrl+O` | Abrir arquivo |
| `Esc` | Fechar modal/diálogo |
| `Ctrl+Enter` | Salvar tarefa (no editor) |

**Dica**: Atalhos funcionam apenas quando não está digitando em um campo!

---

## Dicas e Truques

### Workflow Recomendado

1. **Backlog**: Todas as tarefas planejadas
2. **Doing**: Máximo 3 tarefas em progresso
3. **Done**: Tarefas concluídas (limpe periodicamente)

### Organização com Tags

Exemplos de tags úteis:

- Por tipo: `bug`, `feature`, `docs`, `refactor`
- Por área: `frontend`, `backend`, `design`, `infra`
- Por projeto: `projeto-a`, `projeto-b`

### Markdown Tips

Se usar `TASKS.md`, você pode:

- Editar diretamente no editor de texto
- Versionar com Git
- Compartilhar facilmente
- Visualizar em qualquer markdown viewer

### Performance

- Mantenha menos de 100 tarefas por coluna
- Arquive tarefas antigas em outro arquivo
- Use filtros para focar no que importa

### Backup

**Recomendação**: Versione seus arquivos com Git!

```bash
git add tasks.json
git commit -m "Update tasks"
git push
```

---

## Precisa de Ajuda?

- 📖 Leia a [documentação completa](../README.md)
- 💬 Abra uma [issue no GitHub](https://github.com/seu-usuario/zframe/issues)
- ℹ️ Clique no botão "ℹ️" no app para ver a página About

---

**Bom trabalho! 🚀**
