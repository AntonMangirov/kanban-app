import { create } from 'zustand';

export type TaskItem = {
  id: string;
  title: string;
  description?: string | null;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string | null;
  order: number;
  boardId: string;
  columnId: string;
  assigneeId?: string | null;
};

interface TaskStoreState {
  tasks: TaskItem[];
  isSyncing: boolean;
  _optimisticSnapshots: Record<string, TaskItem | undefined>;

  setTasks: (tasks: TaskItem[]) => void;

  optimisticUpdateTask: (taskId: string, changes: Partial<TaskItem>) => void;

  moveTask: (args: { taskId: string; targetColumnId: string; targetOrder: number }) => void;

  syncTaskUpdate: (taskId: string) => Promise<void>;

  deleteTask: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  tasks: [
    {
      id: '1',
      title: 'Создать дизайн макета',
      description: 'Разработать wireframes для главной страницы приложения',
      priority: 'HIGH',
      dueDate: '2024-01-15',
      order: 1,
      boardId: 'board-1',
      columnId: 'todo',
      assigneeId: 'user-1'
    },
    {
      id: '2',
      title: 'Настроить базу данных',
      description: 'Создать схему БД и настроить подключение',
      priority: 'URGENT',
      dueDate: '2024-01-10',
      order: 2,
      boardId: 'board-1',
      columnId: 'todo',
      assigneeId: null
    },
    {
      id: '3',
      title: 'Реализовать API endpoints',
      description: 'Создать REST API для работы с задачами',
      priority: 'MEDIUM',
      dueDate: '2024-01-20',
      order: 1,
      boardId: 'board-1',
      columnId: 'in-progress',
      assigneeId: 'user-2'
    },
    {
      id: '4',
      title: 'Написать тесты',
      description: 'Покрыть код unit и integration тестами',
      priority: 'LOW',
      dueDate: '2024-01-25',
      order: 2,
      boardId: 'board-1',
      columnId: 'in-progress',
      assigneeId: 'user-3'
    },
    {
      id: '5',
      title: 'Деплой на продакшн',
      description: 'Настроить CI/CD и задеплоить приложение',
      priority: 'HIGH',
      dueDate: '2024-01-12',
      order: 1,
      boardId: 'board-1',
      columnId: 'done',
      assigneeId: 'user-1'
    },
    {
      id: '6',
      title: 'Документация API',
      description: 'Создать документацию для разработчиков',
      priority: 'MEDIUM',
      dueDate: '2024-01-18',
      order: 2,
      boardId: 'board-1',
      columnId: 'done',
      assigneeId: null
    }
  ],
  isSyncing: false,
  _optimisticSnapshots: {},

  setTasks: (tasks) => set({ tasks }),

  optimisticUpdateTask: (taskId, changes) => {
    const { tasks, _optimisticSnapshots } = get();
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    const current = tasks[taskIndex];
    if (!_optimisticSnapshots[taskId]) {
      _optimisticSnapshots[taskId] = { ...current };
    }

    const updated: TaskItem = { ...current, ...changes };
    const nextTasks = tasks.slice();
    nextTasks[taskIndex] = updated;

    set({ tasks: nextTasks, _optimisticSnapshots });
  },

  moveTask: ({ taskId, targetColumnId, targetOrder }) => {
    const { tasks } = get();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    get().optimisticUpdateTask(taskId, { columnId: targetColumnId, order: targetOrder });

    void get().syncTaskUpdate(taskId);
  },

  syncTaskUpdate: async (taskId: string) => {
    const { tasks, _optimisticSnapshots } = get();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    set({ isSyncing: true });

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate,
          order: task.order,
          columnId: task.columnId,
          assigneeId: task.assigneeId ?? undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to sync task update');
      }

      const snapshots = { ..._optimisticSnapshots };
      delete snapshots[taskId];
      set({ _optimisticSnapshots: snapshots, isSyncing: false });
    } catch (e) {
      
      const previous = _optimisticSnapshots[taskId];
      if (previous) {
        const idx = tasks.findIndex((t) => t.id === taskId);
        if (idx !== -1) {
          const rolledBack = tasks.slice();
          rolledBack[idx] = previous;
          const snapshots = { ..._optimisticSnapshots };
          delete snapshots[taskId];
          set({ tasks: rolledBack, _optimisticSnapshots: snapshots, isSyncing: false });
          return;
        }
      }
      set({ isSyncing: false });
    }
  },

  deleteTask: async (taskId: string) => {
    const { tasks } = get();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    set({ isSyncing: true });

    try {
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      set({ tasks: updatedTasks });

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка удаления задачи');
      }

      set({ isSyncing: false });
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
      
      set({ tasks, isSyncing: false });
      
      throw error;
    }
  },
}));


