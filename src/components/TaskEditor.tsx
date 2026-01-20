/**
 * TaskEditor Component - Modal para criar/editar tarefa
 */

import { useState, useEffect, useRef } from 'react';
import type { Task, Priority, CreateTaskInput, UpdateTaskInput } from '../core/types';

interface TaskEditorProps {
    task?: Task; // Se undefined, é criação
    defaultStatus?: string;
    onSave: (input: CreateTaskInput | UpdateTaskInput) => void;
    onDelete?: () => void;
    onClose: () => void;
}

const priorities: Priority[] = ['P1', 'P2', 'P3', 'P4'];

export function TaskEditor({
    task,
    defaultStatus,
    onSave,
    onDelete,
    onClose,
}: TaskEditorProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState(task?.title ?? '');
    const [priority, setPriority] = useState<Priority>(task?.priority ?? 'P3');
    const [tagsInput, setTagsInput] = useState(task?.tags.join(', ') ?? '');
    const [notes, setNotes] = useState(task?.notes ?? '');
    const [due, setDue] = useState(task?.due ?? '');
    const [estimate, setEstimate] = useState(task?.estimate ?? '');

    const isEditing = !!task;

    // Focus on title when opening
    useEffect(() => {
        titleRef.current?.focus();
    }, []);

    // Escape to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
            // Ctrl/Cmd + Enter to save
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                handleSubmit();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [title, priority, tagsInput, notes, due, estimate]);

    const handleSubmit = () => {
        if (!title.trim()) return;

        const tags = tagsInput
            .split(',')
            .map((t) => t.trim().replace(/^#/, ''))
            .filter(Boolean);

        if (isEditing) {
            const input: UpdateTaskInput = {
                title: title.trim(),
                priority,
                tags,
                notes: notes.trim() || undefined,
                due: due || undefined,
                estimate: estimate.trim() || undefined,
            };
            onSave(input);
        } else {
            const input: CreateTaskInput = {
                title: title.trim(),
                status: defaultStatus,
                priority,
                tags,
                notes: notes.trim() || undefined,
                due: due || undefined,
                estimate: estimate.trim() || undefined,
            };
            onSave(input);
        }

        onClose();
    };

    return (
        <div className="glass-modal-overlay" onClick={onClose}>
            <div className="glass-modal task-editor" onClick={(e) => e.stopPropagation()}>
                <div className="task-editor-header">
                    <h2 className="task-editor-title">
                        {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
                    </h2>
                    <button
                        className="glass-button icon-only"
                        onClick={onClose}
                        title="Fechar (Esc)"
                    >
                        ✕
                    </button>
                </div>

                <div className="task-editor-body">
                    {/* Title */}
                    <div className="task-editor-field">
                        <label className="task-editor-label">Título</label>
                        <input
                            ref={titleRef}
                            type="text"
                            className="glass-input"
                            placeholder="O que precisa ser feito?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Priority */}
                    <div className="task-editor-field">
                        <label className="task-editor-label">Prioridade</label>
                        <div className="priority-select">
                            {priorities.map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    className={`priority-option ${p.toLowerCase()} ${priority === p ? 'selected' : ''}`}
                                    onClick={() => setPriority(p)}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="task-editor-field">
                        <label className="task-editor-label">Tags</label>
                        <input
                            type="text"
                            className="glass-input"
                            placeholder="frontend, bug, feature (separar por vírgula)"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                        />
                    </div>

                    {/* Due Date and Estimate */}
                    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                        <div className="task-editor-field" style={{ flex: 1 }}>
                            <label className="task-editor-label">Prazo</label>
                            <input
                                type="date"
                                className="glass-input"
                                value={due}
                                onChange={(e) => setDue(e.target.value)}
                            />
                        </div>
                        <div className="task-editor-field" style={{ flex: 1 }}>
                            <label className="task-editor-label">Estimativa</label>
                            <input
                                type="text"
                                className="glass-input"
                                placeholder="2h, 1d, etc."
                                value={estimate}
                                onChange={(e) => setEstimate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="task-editor-field">
                        <label className="task-editor-label">Notas</label>
                        <textarea
                            className="glass-textarea"
                            placeholder="Detalhes adicionais..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>

                <div className="task-editor-footer">
                    {isEditing && onDelete && (
                        <button
                            className="glass-button"
                            style={{ color: 'var(--color-error)', marginRight: 'auto' }}
                            onClick={() => {
                                if (confirm('Excluir esta tarefa?')) {
                                    onDelete();
                                    onClose();
                                }
                            }}
                        >
                            🗑️ Excluir
                        </button>
                    )}
                    <button className="glass-button" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="glass-button primary" onClick={handleSubmit}>
                        {isEditing ? 'Salvar' : 'Criar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
