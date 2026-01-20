/**
 * useBoard Hook - Gerencia estado do Board
 */

import { useState, useCallback } from 'react';
import type {
    Board,
    Task,
    CreateTaskInput,
    UpdateTaskInput,
    Priority,
} from '../core/types';
import {
    createTask,
    addTaskToBoard,
    removeTaskFromBoard,
    updateTaskInBoard,
    moveTaskInBoard,
    reorderTasksInColumn,
    findTaskById,
    filterByTags,
    filterByPriority,
    searchTasks,
    createEmptyBoard,
} from '../core/board';

export interface UseBoardReturn {
    board: Board;
    setBoard: React.Dispatch<React.SetStateAction<Board>>;

    // CRUD
    addTask: (input: CreateTaskInput) => Task;
    deleteTask: (taskId: string) => void;
    updateTask: (taskId: string, input: UpdateTaskInput) => void;

    // Movement
    moveTask: (taskId: string, toColumnId: string, toIndex?: number) => void;
    reorderTasks: (columnId: string, fromIndex: number, toIndex: number) => void;

    // Query
    getTask: (taskId: string) => Task | undefined;

    // Filters (retornam board filtrado, não modificam o original)
    filteredBoard: Board;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    tagFilter: string[];
    setTagFilter: (tags: string[]) => void;
    priorityFilter: Priority[];
    setPriorityFilter: (priorities: Priority[]) => void;
    clearFilters: () => void;
}

export function useBoard(initialBoard?: Board): UseBoardReturn {
    const [board, setBoard] = useState<Board>(
        initialBoard ?? createEmptyBoard()
    );

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [tagFilter, setTagFilter] = useState<string[]>([]);
    const [priorityFilter, setPriorityFilter] = useState<Priority[]>([]);

    // CRUD Operations
    const addTask = useCallback(
        (input: CreateTaskInput): Task => {
            const defaultStatus = board.columns[0]?.name ?? 'Backlog';
            const newTask = createTask(input, input.status ?? defaultStatus);
            setBoard((b) => addTaskToBoard(b, newTask));
            return newTask;
        },
        [board.columns]
    );

    const deleteTask = useCallback((taskId: string) => {
        setBoard((b) => removeTaskFromBoard(b, taskId));
    }, []);

    const updateTask = useCallback((taskId: string, input: UpdateTaskInput) => {
        setBoard((b) => updateTaskInBoard(b, taskId, input));
    }, []);

    // Movement
    const moveTask = useCallback(
        (taskId: string, toColumnId: string, toIndex?: number) => {
            setBoard((b) => moveTaskInBoard(b, taskId, toColumnId, toIndex));
        },
        []
    );

    const reorderTasks = useCallback(
        (columnId: string, fromIndex: number, toIndex: number) => {
            setBoard((b) => reorderTasksInColumn(b, columnId, fromIndex, toIndex));
        },
        []
    );

    // Query
    const getTask = useCallback(
        (taskId: string): Task | undefined => {
            return findTaskById(board, taskId);
        },
        [board]
    );

    // Filtered Board
    const getFilteredBoard = useCallback((): Board => {
        let result = board;

        if (searchQuery) {
            result = searchTasks(result, searchQuery);
        }

        if (tagFilter.length > 0) {
            result = filterByTags(result, tagFilter);
        }

        if (priorityFilter.length > 0) {
            result = filterByPriority(result, priorityFilter);
        }

        return result;
    }, [board, searchQuery, tagFilter, priorityFilter]);

    const clearFilters = useCallback(() => {
        setSearchQuery('');
        setTagFilter([]);
        setPriorityFilter([]);
    }, []);

    return {
        board,
        setBoard,
        addTask,
        deleteTask,
        updateTask,
        moveTask,
        reorderTasks,
        getTask,
        filteredBoard: getFilteredBoard(),
        searchQuery,
        setSearchQuery,
        tagFilter,
        setTagFilter,
        priorityFilter,
        setPriorityFilter,
        clearFilters,
    };
}
