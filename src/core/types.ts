/**
 * Minimalist Task-Board - Core Domain Types
 */

// Prioridades de tarefa (P1 = mais alta)
export type Priority = 'P1' | 'P2' | 'P3' | 'P4';

// Status da tarefa (baseado no nome da coluna)
export type TaskStatus = string;

// Interface de uma tarefa
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  tags: string[];
  priority: Priority;
  estimate?: string;
  due?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  links?: string[];
}

// Interface de uma coluna do Kanban
export interface Column {
  id: string;
  name: string;
  tasks: Task[];
  wipLimit?: number;
}

// Metadados do projeto
export interface ProjectMeta {
  name: string;
  description?: string;
  columns: string[];
}

// Interface do Board completo
export interface Board {
  project: ProjectMeta;
  columns: Column[];
}

// Formato do arquivo JSON (para serialização)
export interface TaskFileJson {
  project: {
    name: string;
    description?: string;
    columns: string[];
  };
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    tags: string[];
    priority: Priority;
    estimate?: string;
    due?: string;
    createdAt: string;
    updatedAt: string;
    notes?: string;
    links?: string[];
  }>;
}

// Input para criar uma nova tarefa
export interface CreateTaskInput {
  title: string;
  status?: TaskStatus;
  tags?: string[];
  priority?: Priority;
  estimate?: string;
  due?: string;
  notes?: string;
  links?: string[];
}

// Input para atualizar uma tarefa
export interface UpdateTaskInput {
  title?: string;
  status?: TaskStatus;
  tags?: string[];
  priority?: Priority;
  estimate?: string;
  due?: string;
  notes?: string;
  links?: string[];
}

// Tipo de arquivo suportado
export type FileFormat = 'json' | 'markdown';

// Estado do arquivo
export interface FileState {
  handle?: FileSystemFileHandle;
  format: FileFormat;
  path?: string;
  isDirty: boolean;
  lastSaved?: Date;
}
