/**
 * TaskCard Component - Card de tarefa no Kanban
 */

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task, Priority } from '../core/types';

interface TaskCardProps {
    task: Task;
    onClick: () => void;
}

const priorityLabels: Record<Priority, string> = {
    P1: 'P1',
    P2: 'P2',
    P3: 'P3',
    P4: 'P4',
};

function formatDue(due: string): { text: string; isOverdue: boolean } {
    const dueDate = new Date(due);
    const now = new Date();
    const diffMs = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { text: `${Math.abs(diffDays)}d atrás`, isOverdue: true };
    } else if (diffDays === 0) {
        return { text: 'Hoje', isOverdue: false };
    } else if (diffDays === 1) {
        return { text: 'Amanhã', isOverdue: false };
    } else if (diffDays <= 7) {
        return { text: `${diffDays}d`, isOverdue: false };
    } else {
        return {
            text: dueDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
            isOverdue: false,
        };
    }
}

export function TaskCard({ task, onClick }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const dueInfo = task.due ? formatDue(task.due) : null;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`task-card glass-card ${isDragging ? 'dragging' : ''}`}
            onClick={onClick}
        >
            <div className="task-card-header">
                <span className="task-card-title">{task.title}</span>
                <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                    {priorityLabels[task.priority]}
                </span>
            </div>

            <div className="task-card-footer">
                {task.tags.length > 0 && (
                    <div className="task-card-tags">
                        {task.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="tag">
                                #{tag}
                            </span>
                        ))}
                        {task.tags.length > 3 && (
                            <span className="tag">+{task.tags.length - 3}</span>
                        )}
                    </div>
                )}

                {dueInfo && (
                    <span className={`task-card-due ${dueInfo.isOverdue ? 'overdue' : ''}`}>
                        📅 {dueInfo.text}
                    </span>
                )}

                {task.estimate && (
                    <span className="task-card-due">
                        ⏱️ {task.estimate}
                    </span>
                )}
            </div>
        </div>
    );
}
