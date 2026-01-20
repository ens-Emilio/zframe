/**
 * ZFrame - Minimalist Task-Board
 * 
 * Um Kanban local, offline-first, que lê/escreve arquivos do repositório.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Task, CreateTaskInput, UpdateTaskInput, FileFormat } from './core/types';
import { createEmptyBoard } from './core/board';
import { useBoard, useFileSystem } from './hooks';
import { TopBar, Board, TaskEditor, FilterPanel, About } from './components';
import './styles/index.css';

interface EditorState {
  isOpen: boolean;
  task?: Task;
  defaultStatus?: string;
}

export default function App() {
  const {
    board,
    setBoard,
    filteredBoard,
    addTask,
    deleteTask,
    updateTask,
    moveTask,
    reorderTasks,
    searchQuery,
    setSearchQuery,
    tagFilter,
    setTagFilter,
    priorityFilter,
    setPriorityFilter,
    clearFilters,
  } = useBoard(createEmptyBoard('Novo Projeto'));

  const {
    fileState,
    hasFileSystemAccess,
    handleOpen,
    handleOpenFallback,
    handleSave,
    handleSaveAs,
    handleDownload,
    markDirty,
    error,
    isReadOnly,
  } = useFileSystem();

  const [editorState, setEditorState] = useState<EditorState>({ isOpen: false });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  // Show toast
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Handle file open
  const onOpenFile = useCallback(async () => {
    const newBoard = await handleOpen();
    if (newBoard) {
      setBoard(newBoard);
      showToast('Arquivo carregado com sucesso!');
    }
  }, [handleOpen, setBoard, showToast]);

  // Handle file open fallback
  const onOpenFileFallback = useCallback(async (file: File) => {
    const newBoard = await handleOpenFallback(file);
    if (newBoard) {
      setBoard(newBoard);
      showToast('Arquivo carregado com sucesso!');
    }
  }, [handleOpenFallback, setBoard, showToast]);

  // Handle save
  const onSave = useCallback(async () => {
    await handleSave(board);
    showToast('Arquivo salvo!');
  }, [handleSave, board, showToast]);

  // Handle save as
  const onSaveAs = useCallback(async (format: FileFormat) => {
    if (hasFileSystemAccess) {
      await handleSaveAs(board, format);
      showToast('Arquivo salvo!');
    } else {
      handleDownload(board, format);
      showToast('Arquivo baixado!');
    }
  }, [hasFileSystemAccess, handleSaveAs, handleDownload, board, showToast]);

  // Mark dirty on board changes
  useEffect(() => {
    if (fileState) {
      markDirty();
    }
  }, [board]);

  // Handle add task
  const onAddTask = useCallback((status?: string) => {
    const defaultStatus = status ?? board.columns[0]?.name ?? 'Backlog';
    setEditorState({ isOpen: true, defaultStatus });
  }, [board.columns]);

  // Handle task click (edit)
  const onTaskClick = useCallback((task: Task) => {
    setEditorState({ isOpen: true, task });
  }, []);

  // Handle editor save
  const onEditorSave = useCallback((input: CreateTaskInput | UpdateTaskInput) => {
    if (editorState.task) {
      updateTask(editorState.task.id, input as UpdateTaskInput);
      showToast('Tarefa atualizada!');
    } else {
      addTask(input as CreateTaskInput);
      showToast('Tarefa criada!');
    }
  }, [editorState.task, updateTask, addTask, showToast]);

  // Handle task delete
  const onDeleteTask = useCallback(() => {
    if (editorState.task) {
      deleteTask(editorState.task.id);
      showToast('Tarefa excluída!');
    }
  }, [editorState.task, deleteTask, showToast]);

  // Handle add click from column
  const onAddClick = useCallback((columnId: string) => {
    const column = board.columns.find(c => c.id === columnId);
    if (column) {
      onAddTask(column.name);
    }
  }, [board.columns, onAddTask]);

  // Show error
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error, showToast]);

  return (
    <div className="app-layout">
      <TopBar
        fileState={fileState}
        hasFileSystemAccess={hasFileSystemAccess}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenFile={onOpenFile}
        onOpenFileFallback={onOpenFileFallback}
        onSave={onSave}
        onSaveAs={onSaveAs}
        onAddTask={() => onAddTask()}
        onAbout={() => setShowAbout(true)}
      />

      <Board
        board={filteredBoard}
        onMoveTask={moveTask}
        onReorderTasks={reorderTasks}
        onTaskClick={onTaskClick}
        onAddClick={onAddClick}
      />

      {/* Filter Panel */}
      <FilterPanel
        board={board}
        tagFilter={tagFilter}
        priorityFilter={priorityFilter}
        onTagFilterChange={setTagFilter}
        onPriorityFilterChange={setPriorityFilter}
        onClearFilters={clearFilters}
      />

      {/* Read-Only Banner */}
      {isReadOnly && fileState && (
        <div className="readonly-banner">
          ⚠️ Modo somente leitura (use Chrome/Edge para editar)
        </div>
      )}

      {editorState.isOpen && (
        <TaskEditor
          task={editorState.task}
          defaultStatus={editorState.defaultStatus}
          onSave={onEditorSave}
          onDelete={editorState.task ? onDeleteTask : undefined}
          onClose={() => setEditorState({ isOpen: false })}
        />
      )}

      {/* About Modal */}
      {showAbout && <About onClose={() => setShowAbout(false)} />}

      {/* Toast notifications */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>{toast.message}</div>
        </div>
      )}
    </div>
  );
}
