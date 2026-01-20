/**
 * JSON Adapter - Parse e Serialize arquivos tasks.json
 */

import type { TaskFileJson, Board } from '../core/types';
import { jsonToBoard, boardToJson } from '../core/board';

/**
 * Valida a estrutura do JSON do arquivo
 */
export function validateTaskJson(data: unknown): data is TaskFileJson {
    if (!data || typeof data !== 'object') return false;

    const obj = data as Record<string, unknown>;

    // Validar project
    if (!obj.project || typeof obj.project !== 'object') return false;
    const project = obj.project as Record<string, unknown>;
    if (typeof project.name !== 'string') return false;
    if (!Array.isArray(project.columns)) return false;

    // Validar tasks
    if (!Array.isArray(obj.tasks)) return false;

    return true;
}

/**
 * Parse JSON string para Board
 */
export function parseJson(content: string): Board {
    let data: unknown;

    try {
        data = JSON.parse(content);
    } catch (error) {
        throw new Error(`JSON inválido: ${(error as Error).message}`);
    }

    if (!validateTaskJson(data)) {
        throw new Error('Estrutura do JSON inválida. Esperado: { project, tasks }');
    }

    return jsonToBoard(data);
}

/**
 * Serialize Board para JSON string formatado
 */
export function serializeJson(board: Board): string {
    const json = boardToJson(board);

    // JSON formatado com ordem estável de chaves para diffs limpos
    return JSON.stringify(json, null, 2);
}

/**
 * Cria um arquivo JSON de exemplo
 */
export function createExampleJson(): string {
    const example: TaskFileJson = {
        project: {
            name: 'Meu Projeto',
            description: 'Descrição do projeto',
            columns: ['Backlog', 'Doing', 'Done'],
        },
        tasks: [
            {
                id: 'task_example_001',
                title: 'Configurar ambiente de desenvolvimento',
                status: 'Done',
                tags: ['setup'],
                priority: 'P1',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                notes: 'Instalar dependências e configurar IDE',
            },
            {
                id: 'task_example_002',
                title: 'Implementar feature principal',
                status: 'Doing',
                tags: ['feature', 'core'],
                priority: 'P1',
                estimate: '4h',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 'task_example_003',
                title: 'Escrever documentação',
                status: 'Backlog',
                tags: ['docs'],
                priority: 'P3',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 'task_example_004',
                title: 'Adicionar testes unitários',
                status: 'Backlog',
                tags: ['testing'],
                priority: 'P2',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ],
    };

    return JSON.stringify(example, null, 2);
}
