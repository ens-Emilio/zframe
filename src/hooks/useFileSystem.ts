/**
 * useFileSystem Hook - Gerencia arquivos via File System Access API
 */

import { useState, useCallback } from 'react';
import type { Board, FileState, FileFormat } from '../core/types';
import {
    supportsFileSystemAccess,
    openFile,
    saveFile,
    saveFileAs,
    openFileFallback,
    downloadFile,
} from '../adapters/file-service';

export interface UseFileSystemReturn {
    fileState: FileState | null;
    isLoading: boolean;
    error: string | null;
    hasFileSystemAccess: boolean;
    isReadOnly: boolean;

    // Actions
    handleOpen: () => Promise<Board | null>;
    handleOpenFallback: (file: File) => Promise<Board | null>;
    handleSave: (board: Board) => Promise<void>;
    handleSaveAs: (board: Board, format: FileFormat) => Promise<void>;
    handleDownload: (board: Board, format: FileFormat) => void;
    markDirty: () => void;
    clearError: () => void;
}

export function useFileSystem(): UseFileSystemReturn {
    const [fileState, setFileState] = useState<FileState | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hasFileSystemAccess = supportsFileSystemAccess();
    const isReadOnly = !hasFileSystemAccess || !fileState?.handle;

    // Open file (File System Access API)
    const handleOpen = useCallback(async (): Promise<Board | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await openFile();
            setFileState(result.fileState);
            return result.board;
        } catch (err) {
            if ((err as Error).name === 'AbortError') {
                // User cancelled
                return null;
            }
            setError((err as Error).message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Open file (Fallback for unsupported browsers)
    const handleOpenFallback = useCallback(
        async (file: File): Promise<Board | null> => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await openFileFallback(file);
                setFileState(result.fileState);
                return result.board;
            } catch (err) {
                setError((err as Error).message);
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Save file
    const handleSave = useCallback(
        async (board: Board): Promise<void> => {
            if (!fileState?.handle) {
                setError('Nenhum arquivo aberto para salvar');
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const newState = await saveFile(board, fileState);
                setFileState(newState);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        },
        [fileState]
    );

    // Save as new file
    const handleSaveAs = useCallback(
        async (board: Board, format: FileFormat): Promise<void> => {
            setIsLoading(true);
            setError(null);

            try {
                const newState = await saveFileAs(board, format);
                setFileState(newState);
            } catch (err) {
                if ((err as Error).name === 'AbortError') {
                    return;
                }
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Download (Fallback)
    const handleDownload = useCallback((board: Board, format: FileFormat) => {
        downloadFile(board, format);
    }, []);

    // Mark file as modified
    const markDirty = useCallback(() => {
        setFileState((prev) => (prev ? { ...prev, isDirty: true } : null));
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        fileState,
        isLoading,
        error,
        hasFileSystemAccess,
        isReadOnly,
        handleOpen,
        handleOpenFallback,
        handleSave,
        handleSaveAs,
        handleDownload,
        markDirty,
        clearError,
    };
}
