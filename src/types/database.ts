export type User = {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Board = {
  id: string;
  title: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  columns: Column[];
  tasks: Task[];
};

export type Column = {
  id: string;
  title: string;
  order: number;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
  board: Board;
  tasks: Task[];
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: Date | null;
  order: number;
  boardId: string;
  columnId: string;
  assigneeId: string | null;
  createdAt: Date;
  updatedAt: Date;
  board: Board;
  column: Column;
  assignee: User | null;
  tags: TaskTag[];
};

export type Tag = {
  id: string;
  name: string;
  color: string;
  tasks: TaskTag[];
};

export type TaskTag = {
  id: string;
  taskId: string;
  tagId: string;
  task: Task;
  tag: Tag;
};

export type CreateUserInput = {
  email: string;
  name: string;
  password: string;
};

export type CreateBoardInput = {
  title: string;
  description?: string;
  userId: string;
};

export type CreateColumnInput = {
  title: string;
  order: number;
  boardId: string;
};

export type CreateTaskInput = {
  title: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: Date;
  order: number;
  boardId: string;
  columnId: string;
  assigneeId?: string;
};

export type CreateTagInput = {
  name: string;
  color?: string;
};

export type UpdateUserInput = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateBoardInput = Partial<Omit<Board, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;
export type UpdateColumnInput = Partial<Omit<Column, 'id' | 'boardId' | 'createdAt' | 'updatedAt'>>;
export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'boardId' | 'createdAt' | 'updatedAt'>>;
export type UpdateTagInput = Partial<Omit<Tag, 'id'>>;
