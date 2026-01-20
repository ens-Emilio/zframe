/**
 * Board Component - Kanban Board principal
 */

import {
    DndContext,
    type DragEndEvent,
    type DragOverEvent,
    type DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
    DragOverlay,
} from '@dnd-kit/core';
import { useState } from 'react';
import type { Board as BoardType, Task } from '../core/types';
import { Column } from './Column';
import { TaskCard } from './Card';

interface BoardProps {
    board: BoardType;
    onMoveTask: (taskId: string, toColumnId: string, toIndex?: number) => void;
    onReorderTasks: (columnId: string, fromIndex: number, toIndex: number) => void;
    onTaskClick: (task: Task) => void;
    onAddClick: (columnId: string) => void;
}

export function Board({
    board,
    onMoveTask,
    onReorderTasks,
    onTaskClick,
    onAddClick,
}: BoardProps) {
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const findTask = (id: string): Task | undefined => {
        for (const column of board.columns) {
            const task = column.tasks.find((t) => t.id === id);
            if (task) return task;
        }
        return undefined;
    };

    const findColumnByTaskId = (taskId: string): string | undefined => {
        for (const column of board.columns) {
            if (column.tasks.some((t) => t.id === taskId)) {
                return column.id;
            }
        }
        return undefined;
    };

    const handleDragStart = (event: DragStartEvent) => {
        const task = findTask(event.active.id as string);
        setActiveTask(task ?? null);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeColumnId = findColumnByTaskId(activeId);
        const overColumn = board.columns.find((c) => c.id === overId);
        const overTaskColumnId = findColumnByTaskId(overId);

        // Se estamos sobre uma coluna diretamente
        if (overColumn && activeColumnId !== overColumn.id) {
            onMoveTask(activeId, overColumn.id);
            return;
        }

        // Se estamos sobre uma task de outra coluna
        if (overTaskColumnId && activeColumnId !== overTaskColumnId) {
            const overColumnData = board.columns.find((c) => c.id === overTaskColumnId);
            const overIndex = overColumnData?.tasks.findIndex((t) => t.id === overId) ?? 0;
            onMoveTask(activeId, overTaskColumnId, overIndex);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId === overId) return;

        const activeColumnId = findColumnByTaskId(activeId);
        const overTaskColumnId = findColumnByTaskId(overId);

        // Reordenação na mesma coluna
        if (activeColumnId === overTaskColumnId && activeColumnId) {
            const column = board.columns.find((c) => c.id === activeColumnId);
            if (column) {
                const fromIndex = column.tasks.findIndex((t) => t.id === activeId);
                const toIndex = column.tasks.findIndex((t) => t.id === overId);
                if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
                    onReorderTasks(activeColumnId, fromIndex, toIndex);
                }
            }
        }
    };

    if (board.columns.length === 0) {
        return (
            <div className="board-wrapper">
                <div className="board-empty">
                    <div className="empty-state">
                        <span className="empty-state-icon">📋</span>
                        <h2 className="empty-state-title">Nenhum projeto carregado</h2>
                        <p className="empty-state-description">
                            Abra um arquivo tasks.json ou TASKS.md para começar, ou crie um novo projeto.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="board-wrapper">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="board">
                    {board.columns.map((column) => (
                        <Column
                            key={column.id}
                            column={column}
                            onTaskClick={onTaskClick}
                            onAddClick={() => onAddClick(column.id)}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeTask && (
                        <TaskCard task={activeTask} onClick={() => { }} />
                    )}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
