import { create } from 'zustand';

export type TaskItem = {
  id: string;
  title: string;
  description?: string | null;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: Date | null;
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
}

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  tasks: [],
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
}));
