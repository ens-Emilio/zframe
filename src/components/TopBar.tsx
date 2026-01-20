/**
 * TopBar Component - Barra superior do app
 */

import { useRef, useState, useEffect } from 'react';
import { IconClipboardList, IconSearch, IconFolderOpen, IconDeviceFloppy, IconPlus, IconInfoCircle, IconFile } from '@tabler/icons-react';
import type { FileState, FileFormat } from '../core/types';

interface TopBarProps {
    fileState: FileState | null;
    hasFileSystemAccess: boolean;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onOpenFile: () => void;
    onOpenFileFallback: (file: File) => void;
    onSave: () => void;
    onSaveAs: (format: FileFormat) => void;
    onAddTask: () => void;
    onAbout: () => void;
}

export function TopBar({
    fileState,
    hasFileSystemAccess,
    searchQuery,
    onSearchChange,
    onOpenFile,
    onOpenFileFallback,
    onSave,
    onSaveAs,
    onAddTask,
    onAbout,
}: TopBarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showSaveMenu, setShowSaveMenu] = useState(false);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + S = Save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (fileState?.handle) {
                    onSave();
                }
            }
            // Ctrl/Cmd + O = Open
            if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
                e.preventDefault();
                if (hasFileSystemAccess) {
                    onOpenFile();
                } else {
                    fileInputRef.current?.click();
                }
            }
            // N = New task (when not in input)
            if (e.key === 'n' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
                e.preventDefault();
                onAddTask();
            }
            // / = Focus search
            if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
                e.preventDefault();
                document.querySelector<HTMLInputElement>('.topbar-search input')?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [fileState, hasFileSystemAccess, onSave, onOpenFile, onAddTask]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onOpenFileFallback(file);
        }
        e.target.value = '';
    };

    return (
        <header className="topbar">
            {/* Logo */}
            <div className="topbar-logo">
                <IconClipboardList size={32} stroke={1.5} />
                <span>ZFrame</span>
            </div>

            {/* Search */}
            <div className="topbar-search">
                <IconSearch className="topbar-search-icon" size={18} stroke={1.5} />
                <input
                    type="text"
                    className="glass-input"
                    placeholder="Buscar tarefas... (pressione /)"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* File info */}
            {fileState && (
                <div className={`topbar-file-info ${fileState.isDirty ? 'dirty' : ''}`}>
                    <IconFile size={16} stroke={1.5} />
                    <span>{fileState.path ?? 'Novo arquivo'}</span>
                </div>
            )}

            {/* Actions */}
            <div className="topbar-actions">
                {/* Open button */}
                {hasFileSystemAccess ? (
                    <button className="glass-button" onClick={onOpenFile} title="Abrir arquivo (Ctrl+O)">
                        <IconFolderOpen size={18} stroke={1.5} /> Abrir
                    </button>
                ) : (
                    <>
                        <button
                            className="glass-button"
                            onClick={() => fileInputRef.current?.click()}
                            title="Abrir arquivo"
                        >
                            <IconFolderOpen size={18} stroke={1.5} /> Abrir
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,.md,.markdown"
                            style={{ display: 'none' }}
                            onChange={handleFileInput}
                        />
                    </>
                )}

                {/* Save button */}
                <div style={{ position: 'relative' }}>
                    <button
                        className="glass-button"
                        onClick={() => {
                            if (fileState?.handle) {
                                onSave();
                            } else {
                                setShowSaveMenu(!showSaveMenu);
                            }
                        }}
                        title="Salvar (Ctrl+S)"
                    >
                        <IconDeviceFloppy size={18} stroke={1.5} /> Salvar
                    </button>

                    {showSaveMenu && (
                        <div
                            className="glass-panel"
                            style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '8px',
                                padding: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                minWidth: '150px',
                                zIndex: 100,
                            }}
                        >
                            <button
                                className="glass-button"
                                style={{ justifyContent: 'flex-start' }}
                                onClick={() => {
                                    onSaveAs('json');
                                    setShowSaveMenu(false);
                                }}
                            >
                                <IconFile size={16} stroke={1.5} /> Salvar como JSON
                            </button>
                            <button
                                className="glass-button"
                                style={{ justifyContent: 'flex-start' }}
                                onClick={() => {
                                    onSaveAs('markdown');
                                    setShowSaveMenu(false);
                                }}
                            >
                                <IconFile size={16} stroke={1.5} /> Salvar como Markdown
                            </button>
                        </div>
                    )}
                </div>

                {/* Add task button */}
                <button className="glass-button primary" onClick={onAddTask} title="Nova tarefa (N)">
                    <IconPlus size={18} stroke={1.5} /> Nova Tarefa
                </button>

                {/* About button */}
                <button className="glass-button" onClick={onAbout} title="Sobre o ZFrame">
                    <IconInfoCircle size={18} stroke={1.5} />
                </button>
            </div>

            {/* Click outside to close save menu */}
            {showSaveMenu && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 99,
                    }}
                    onClick={() => setShowSaveMenu(false)}
                />
            )}
        </header>
    );
}
