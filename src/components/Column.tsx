/**
 * Column Component - Coluna do Kanban
 */

import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { IconInbox } from '@tabler/icons-react';
import type { Column as ColumnType, Task } from '../core/types';
import { TaskCard } from './Card';

interface ColumnProps {
    column: ColumnType;
    onTaskClick: (task: Task) => void;
    onAddClick: () => void;
}

export function Column({ column, onTaskClick, onAddClick }: ColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
    });

    return (
        <div className="column">
            <div className="column-header">
                <h3 className="column-title">
                    {column.name}
                    <span className="column-count">{column.tasks.length}</span>
                </h3>
            </div>

            <SortableContext
                items={column.tasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
            >
                <div
                    ref={setNodeRef}
                    className={`column-content ${isOver ? 'drop-target' : ''}`}
                >
                    {column.tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onClick={() => onTaskClick(task)}
                        />
                    ))}

                    {column.tasks.length === 0 && (
                        <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
                            <IconInbox size={32} stroke={1.5} style={{ opacity: 0.5 }} />
                            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                                Nenhuma tarefa
                            </span>
                        </div>
                    )}
                </div>
            </SortableContext>

            <button className="column-add-btn" onClick={onAddClick}>
                + Adicionar tarefa
            </button>
        </div>
    );
}
