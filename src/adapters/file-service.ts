/**
 * File Service - Gerenciamento de arquivos via File System Access API
 *
 * Funcionalidades:
 * - Abrir arquivo com seletor (File System Access API)
 * - Salvar alterações
 * - Detectar formato (JSON/Markdown)
 * - Fallback para browsers sem suporte
 */

import type { Board, FileFormat, FileState } from '../core/types';
import { parseJson, serializeJson } from './json-adapter';
import { parseMarkdown, serializeMarkdown } from './markdown-adapter';

// Verifica suporte à File System Access API
export function supportsFileSystemAccess(): boolean {
    return 'showOpenFilePicker' in window;
}

/**
 * Detecta o formato do arquivo pela extensão
 */
export function detectFormat(filename: string): FileFormat {
    const lower = filename.toLowerCase();
    if (lower.endsWith('.json')) return 'json';
    if (lower.endsWith('.md') || lower.endsWith('.markdown')) return 'markdown';
    // Default para JSON
    return 'json';
}

/**
 * Parse conteúdo do arquivo para Board
 */
export function parseFile(content: string, format: FileFormat): Board {
    if (format === 'json') {
        return parseJson(content);
    }
    return parseMarkdown(content);
}

/**
 * Serialize Board para string do arquivo
 */
export function serializeFile(board: Board, format: FileFormat): string {
    if (format === 'json') {
        return serializeJson(board);
    }
    return serializeMarkdown(board);
}

/**
 * Abre um arquivo usando File System Access API
 */
export async function openFile(): Promise<{
    board: Board;
    fileState: FileState;
}> {
    if (!supportsFileSystemAccess()) {
        throw new Error(
            'File System Access API não suportada. Use Chrome, Edge ou Opera.'
        );
    }

    const [handle] = await window.showOpenFilePicker({
        types: [
            {
                description: 'Task Files',
                accept: {
                    'application/json': ['.json'],
                    'text/markdown': ['.md', '.markdown'],
                },
            },
        ],
        multiple: false,
    });

    const file = await handle.getFile();
    const content = await file.text();
    const format = detectFormat(file.name);
    const board = parseFile(content, format);

    return {
        board,
        fileState: {
            handle,
            format,
            path: file.name,
            isDirty: false,
            lastSaved: new Date(),
        },
    };
}

/**
 * Salva o arquivo atual
 */
export async function saveFile(
    board: Board,
    fileState: FileState
): Promise<FileState> {
    if (!fileState.handle) {
        throw new Error('Nenhum arquivo aberto');
    }

    const content = serializeFile(board, fileState.format);

    // Precisa verificar permissão de escrita
    const permission = await fileState.handle.queryPermission({ mode: 'readwrite' });
    if (permission !== 'granted') {
        const newPermission = await fileState.handle.requestPermission({
            mode: 'readwrite',
        });
        if (newPermission !== 'granted') {
            throw new Error('Permissão de escrita negada');
        }
    }

    const writable = await fileState.handle.createWritable();
    await writable.write(content);
    await writable.close();

    return {
        ...fileState,
        isDirty: false,
        lastSaved: new Date(),
    };
}

/**
 * Cria um novo arquivo (Save As)
 */
export async function saveFileAs(
    board: Board,
    format: FileFormat
): Promise<FileState> {
    if (!supportsFileSystemAccess()) {
        throw new Error(
            'File System Access API não suportada. Use Chrome, Edge ou Opera.'
        );
    }

    const extension = format === 'json' ? '.json' : '.md';
    const suggestedName = `tasks${extension}`;

    const handle = await window.showSaveFilePicker({
        suggestedName,
        types: [
            {
                description: format === 'json' ? 'JSON File' : 'Markdown File',
                accept:
                    format === 'json'
                        ? { 'application/json': ['.json'] }
                        : { 'text/markdown': ['.md', '.markdown'] },
            },
        ],
    });

    const content = serializeFile(board, format);
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();

    const file = await handle.getFile();

    return {
        handle,
        format,
        path: file.name,
        isDirty: false,
        lastSaved: new Date(),
    };
}

// === Fallback para browsers sem File System Access API ===

/**
 * Fallback: Abre arquivo via input file
 */
export function openFileFallback(file: File): Promise<{
    board: Board;
    fileState: FileState;
}> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            try {
                const content = reader.result as string;
                const format = detectFormat(file.name);
                const board = parseFile(content, format);

                resolve({
                    board,
                    fileState: {
                        format,
                        path: file.name,
                        isDirty: false,
                        lastSaved: new Date(),
                    },
                });
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}

/**
 * Fallback: Download do arquivo
 */
export function downloadFile(board: Board, format: FileFormat): void {
    const content = serializeFile(board, format);
    const mimeType = format === 'json' ? 'application/json' : 'text/markdown';
    const extension = format === 'json' ? '.json' : '.md';

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks${extension}`;
    a.click();

    URL.revokeObjectURL(url);
}
