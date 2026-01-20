/**
 * Markdown Adapter - Parse e Serialize arquivos TASKS.md
 *
 * Convenção GFM:
 * - ## Coluna     → Nome da coluna
 * - - [ ] Tarefa  → Task incompleta
 * - - [x] Tarefa  → Task completa (movida para Done)
 * - #tag          → Tags
 * - P1-P4         → Prioridade
 * - > Nota        → Notas (bloco quote indentado)
 */

import type { Task, Board, Column, Priority } from '../core/types';
import { generateTaskId, generateColumnId, now } from '../core/board';

// Regex patterns
const HEADING_REGEX = /^##\s+(.+)$/;
const TASK_REGEX = /^-\s+\[([ xX])\]\s+(.+)$/;
const TAG_REGEX = /#([a-zA-Z0-9_-]+)/g;
const PRIORITY_REGEX = /\b(P[1-4])\b/;
const NOTE_REGEX = /^\s*>\s*(.+)$/;

interface ParsedTask {
    title: string;
    isComplete: boolean;
    tags: string[];
    priority: Priority;
    rawLine: string;
}

/**
 * Extrai tags de uma linha
 */
function extractTags(text: string): string[] {
    const matches = text.match(TAG_REGEX);
    return matches ? matches.map((t) => t.slice(1)) : [];
}

/**
 * Extrai prioridade de uma linha
 */
function extractPriority(text: string): Priority {
    const match = text.match(PRIORITY_REGEX);
    return (match?.[1] as Priority) ?? 'P3';
}

/**
 * Remove tags e prioridade do título
 */
function cleanTitle(text: string): string {
    return text
        .replace(TAG_REGEX, '')
        .replace(PRIORITY_REGEX, '')
        .trim();
}

/**
 * Parse uma linha de tarefa
 */
function parseTaskLine(line: string): ParsedTask | null {
    const match = line.match(TASK_REGEX);
    if (!match) return null;

    const [, checkbox, content] = match;
    const isComplete = checkbox.toLowerCase() === 'x';
    const tags = extractTags(content);
    const priority = extractPriority(content);
    const title = cleanTitle(content);

    return {
        title,
        isComplete,
        tags,
        priority,
        rawLine: line,
    };
}

/**
 * Parse Markdown para Board
 */
export function parseMarkdown(content: string): Board {
    const lines = content.split('\n');
    const columns: Column[] = [];
    let currentColumn: Column | null = null;
    let projectName = 'Projeto';
    let projectDescription: string | undefined;
    let lastTask: Task | null = null;

    // Procura pelo título do projeto (# Título)
    const titleMatch = lines.find((l) => /^#\s+(.+)$/.test(l));
    if (titleMatch) {
        const match = titleMatch.match(/^#\s+(.+)$/);
        if (match) projectName = match[1];
    }

    // Procura pela descrição (> Descrição)
    const descMatch = lines.find((l, i) => {
        const prevLine = lines[i - 1];
        return /^>\s+(.+)$/.test(l) && prevLine && /^#\s+/.test(prevLine);
    });
    if (descMatch) {
        const match = descMatch.match(/^>\s+(.+)$/);
        if (match) projectDescription = match[1];
    }

    for (const line of lines) {
        // Verifica se é um heading de coluna
        const headingMatch = line.match(HEADING_REGEX);
        if (headingMatch) {
            const columnName = headingMatch[1];
            currentColumn = {
                id: generateColumnId(columnName),
                name: columnName,
                tasks: [],
            };
            columns.push(currentColumn);
            lastTask = null;
            continue;
        }

        // Verifica se é uma task
        const parsedTask = parseTaskLine(line);
        if (parsedTask && currentColumn) {
            // Se está marcada como completa e não estamos em "Done", mover para Done
            let status = currentColumn.name;
            if (parsedTask.isComplete && currentColumn.name.toLowerCase() !== 'done') {
                // Mantém na coluna atual mas preserva o estado de conclusão
                status = currentColumn.name;
            }

            const task: Task = {
                id: generateTaskId(),
                title: parsedTask.title,
                status,
                tags: parsedTask.tags,
                priority: parsedTask.priority,
                createdAt: now(),
                updatedAt: now(),
            };

            currentColumn.tasks.push(task);
            lastTask = task;
            continue;
        }

        // Verifica se é uma nota (para a última task)
        const noteMatch = line.match(NOTE_REGEX);
        if (noteMatch && lastTask) {
            lastTask.notes = lastTask.notes
                ? `${lastTask.notes}\n${noteMatch[1]}`
                : noteMatch[1];
        }
    }

    // Se não encontrou colunas, criar padrão
    if (columns.length === 0) {
        columns.push(
            { id: 'backlog', name: 'Backlog', tasks: [] },
            { id: 'doing', name: 'Doing', tasks: [] },
            { id: 'done', name: 'Done', tasks: [] }
        );
    }

    return {
        project: {
            name: projectName,
            description: projectDescription,
            columns: columns.map((c) => c.name),
        },
        columns,
    };
}

/**
 * Serialize Board para Markdown
 */
export function serializeMarkdown(board: Board): string {
    const lines: string[] = [];

    // Título do projeto
    lines.push(`# ${board.project.name}`);
    if (board.project.description) {
        lines.push(`> ${board.project.description}`);
    }
    lines.push('');

    // Colunas e tasks
    for (const column of board.columns) {
        lines.push(`## ${column.name}`);

        if (column.tasks.length === 0) {
            lines.push('');
            continue;
        }

        for (const task of column.tasks) {
            const checkbox = column.name.toLowerCase() === 'done' ? '[x]' : '[ ]';
            const tags = task.tags.length > 0 ? ' ' + task.tags.map((t) => `#${t}`).join(' ') : '';
            const priority = task.priority !== 'P3' ? ` ${task.priority}` : '';

            lines.push(`- ${checkbox} ${task.title}${tags}${priority}`);

            if (task.notes) {
                const noteLines = task.notes.split('\n');
                for (const noteLine of noteLines) {
                    lines.push(`  > ${noteLine}`);
                }
            }
        }

        lines.push('');
    }

    return lines.join('\n');
}

/**
 * Cria um arquivo Markdown de exemplo
 */
export function createExampleMarkdown(): string {
    return `# Meu Projeto
> Descrição do projeto

## Backlog
- [ ] Escrever documentação #docs P3
- [ ] Adicionar testes unitários #testing P2

## Doing
- [ ] Implementar feature principal #feature #core P1
  > Lembre-se de adicionar validação

## Done
- [x] Configurar ambiente de desenvolvimento #setup P1
  > Instalar dependências e configurar IDE
`;
}
