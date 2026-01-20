/**
 * Minimalist Task-Board - Board Domain Logic
 */

import type {
    Task,
    Column,
    Board,
    CreateTaskInput,
    UpdateTaskInput,
    Priority,
    TaskFileJson,
} from './types';

/**
 * Gera um ID único para tarefas
 */
export function generateTaskId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `task_${timestamp}_${random}`;
}

/**
 * Gera um ID para coluna baseado no nome
 */
export function generateColumnId(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '_');
}

/**
 * Retorna timestamp ISO atual
 */
export function now(): string {
    return new Date().toISOString();
}

/**
 * Cria uma nova tarefa com valores padrão
 */
export function createTask(input: CreateTaskInput, defaultStatus: string): Task {
    const timestamp = now();
    return {
        id: generateTaskId(),
        title: input.title,
        status: input.status ?? defaultStatus,
        tags: input.tags ?? [],
        priority: input.priority ?? 'P3',
        estimate: input.estimate,
        due: input.due,
        createdAt: timestamp,
        updatedAt: timestamp,
        notes: input.notes,
        links: input.links,
    };
}

/**
 * Atualiza uma tarefa com novos valores
 */
export function updateTask(task: Task, input: UpdateTaskInput): Task {
    return {
        ...task,
        ...input,
        updatedAt: now(),
    };
}

/**
 * Move uma tarefa para uma nova coluna (status)
 */
export function moveTask(task: Task, newStatus: string): Task {
    return {
        ...task,
        status: newStatus,
        updatedAt: now(),
    };
}

/**
 * Cria um Board vazio com colunas padrão
 */
export function createEmptyBoard(
    name: string = 'Novo Projeto',
    columnNames: string[] = ['Backlog', 'Doing', 'Done']
): Board {
    const columns: Column[] = columnNames.map((colName) => ({
        id: generateColumnId(colName),
        name: colName,
        tasks: [],
    }));

    return {
        project: {
            name,
            columns: columnNames,
        },
        columns,
    };
}

/**
 * Converte TaskFileJson (formato do arquivo) para Board (domínio)
 */
export function jsonToBoard(json: TaskFileJson): Board {
    const columnNames = json.project.columns;

    // Criar colunas vazias
    const columnsMap = new Map<string, Column>();
    for (const name of columnNames) {
        columnsMap.set(name, {
            id: generateColumnId(name),
            name,
            tasks: [],
        });
    }

    // Distribuir tarefas nas colunas
    for (const taskData of json.tasks) {
        const task: Task = {
            id: taskData.id,
            title: taskData.title,
            status: taskData.status,
            tags: taskData.tags ?? [],
            priority: taskData.priority ?? 'P3',
            estimate: taskData.estimate,
            due: taskData.due,
            createdAt: taskData.createdAt,
            updatedAt: taskData.updatedAt,
            notes: taskData.notes,
            links: taskData.links,
        };

        const column = columnsMap.get(task.status);
        if (column) {
            column.tasks.push(task);
        } else {
            // Tarefa com status desconhecido vai para a primeira coluna
            const firstColumn = columnsMap.values().next().value;
            if (firstColumn) {
                task.status = firstColumn.name;
                firstColumn.tasks.push(task);
            }
        }
    }

    return {
        project: {
            name: json.project.name,
            description: json.project.description,
            columns: columnNames,
        },
        columns: Array.from(columnsMap.values()),
    };
}

/**
 * Converte Board (domínio) para TaskFileJson (formato do arquivo)
 */
export function boardToJson(board: Board): TaskFileJson {
    const tasks: TaskFileJson['tasks'] = [];

    for (const column of board.columns) {
        for (const task of column.tasks) {
            tasks.push({
                id: task.id,
                title: task.title,
                status: task.status,
                tags: task.tags,
                priority: task.priority,
                estimate: task.estimate,
                due: task.due,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
                notes: task.notes,
                links: task.links,
            });
        }
    }

    return {
        project: {
            name: board.project.name,
            description: board.project.description,
            columns: board.project.columns,
        },
        tasks,
    };
}

/**
 * Adiciona uma tarefa ao board
 */
export function addTaskToBoard(board: Board, task: Task): Board {
    const columns = board.columns.map((col) => {
        if (col.name === task.status) {
            return {
                ...col,
                tasks: [...col.tasks, task],
            };
        }
        return col;
    });

    return { ...board, columns };
}

/**
 * Remove uma tarefa do board
 */
export function removeTaskFromBoard(board: Board, taskId: string): Board {
    const columns = board.columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== taskId),
    }));

    return { ...board, columns };
}

/**
 * Atualiza uma tarefa no board
 */
export function updateTaskInBoard(
    board: Board,
    taskId: string,
    input: UpdateTaskInput
): Board {
    const columns = board.columns.map((col) => ({
        ...col,
        tasks: col.tasks.map((t) => (t.id === taskId ? updateTask(t, input) : t)),
    }));

    return { ...board, columns };
}

/**
 * Move uma tarefa entre colunas no board
 */
export function moveTaskInBoard(
    board: Board,
    taskId: string,
    toColumnId: string,
    toIndex?: number
): Board {
    let movedTask: Task | null = null;

    // Remove a tarefa da coluna atual
    const columnsWithoutTask = board.columns.map((col) => {
        const taskIndex = col.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
            movedTask = moveTask(col.tasks[taskIndex], '');
            return {
                ...col,
                tasks: col.tasks.filter((t) => t.id !== taskId),
            };
        }
        return col;
    });

    if (!movedTask) return board;

    // Adiciona à nova coluna
    const columns = columnsWithoutTask.map((col) => {
        if (col.id === toColumnId) {
            const updatedTask = { ...movedTask!, status: col.name };
            const newTasks = [...col.tasks];
            const insertIndex = toIndex ?? newTasks.length;
            newTasks.splice(insertIndex, 0, updatedTask);
            return { ...col, tasks: newTasks };
        }
        return col;
    });

    return { ...board, columns };
}

/**
 * Reordena tarefas dentro de uma coluna
 */
export function reorderTasksInColumn(
    board: Board,
    columnId: string,
    fromIndex: number,
    toIndex: number
): Board {
    const columns = board.columns.map((col) => {
        if (col.id === columnId) {
            const newTasks = [...col.tasks];
            const [removed] = newTasks.splice(fromIndex, 1);
            newTasks.splice(toIndex, 0, removed);
            return { ...col, tasks: newTasks };
        }
        return col;
    });

    return { ...board, columns };
}

/**
 * Encontra uma tarefa por ID
 */
export function findTaskById(board: Board, taskId: string): Task | undefined {
    for (const column of board.columns) {
        const task = column.tasks.find((t) => t.id === taskId);
        if (task) return task;
    }
    return undefined;
}

/**
 * Filtra tarefas por tags
 */
export function filterByTags(board: Board, tags: string[]): Board {
    if (tags.length === 0) return board;

    const columns = board.columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => tags.some((tag) => t.tags.includes(tag))),
    }));

    return { ...board, columns };
}

/**
 * Filtra tarefas por prioridade
 */
export function filterByPriority(board: Board, priorities: Priority[]): Board {
    if (priorities.length === 0) return board;

    const columns = board.columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => priorities.includes(t.priority)),
    }));

    return { ...board, columns };
}

/**
 * Busca tarefas por texto
 */
export function searchTasks(board: Board, query: string): Board {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return board;

    const columns = board.columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter(
            (t) =>
                t.title.toLowerCase().includes(lowerQuery) ||
                t.notes?.toLowerCase().includes(lowerQuery) ||
                t.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        ),
    }));

    return { ...board, columns };
}

/**
 * Conta total de tarefas no board
 */
export function countTasks(board: Board): number {
    return board.columns.reduce((sum, col) => sum + col.tasks.length, 0);
}

/**
 * Conta tarefas por coluna
 */
export function countTasksByColumn(board: Board): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const col of board.columns) {
        counts[col.name] = col.tasks.length;
    }
    return counts;
}
