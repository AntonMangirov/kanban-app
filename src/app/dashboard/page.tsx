'use client';

import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useTaskStore } from '@/store/taskStore';
import { useState, useEffect } from 'react';
import { LoadingOverlay } from '@/components/TaskSkeleton';
import KanbanColumn from '@/components/KanbanColumn';

export default function DashboardPage() {
  const { moveTask, tasks, isSyncing } = useTaskStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    const task = tasks.find(t => t.id === active.id);
    if (!task) {
      console.error('Задача не найдена:', active.id);
      return;
    }

    const targetColumnId = over.id as string;
    
    const tasksInTargetColumn = tasks.filter(t => t.columnId === targetColumnId);
    const maxOrder = tasksInTargetColumn.length > 0 
      ? Math.max(...tasksInTargetColumn.map(t => t.order)) 
      : 0;
    const targetOrder = maxOrder + 1;

    try {
      setError(null);
      
      moveTask({
        taskId: task.id,
        targetColumnId,
        targetOrder
      });

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          columnId: targetColumnId,
          order: targetOrder,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка обновления задачи: ${response.statusText}`);
      }

    } catch (err) {
      console.error('Ошибка при обновлении задачи:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при обновлении задачи');
    }
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}
      
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-row gap-4 overflow-x-auto">
          <KanbanColumn 
            id="todo" 
            title="To Do" 
            isLoading={isLoading}
            taskCount={2}
          >
            <div>Задачи To Do</div>
          </KanbanColumn>
          
          <KanbanColumn 
            id="in-progress" 
            title="In Progress" 
            isLoading={isLoading}
            taskCount={3}
          >
            <div>Задачи In Progress</div>
          </KanbanColumn>
          
          <KanbanColumn 
            id="done" 
            title="Done" 
            isLoading={isLoading}
            taskCount={1}
          >
            <div>Задачи Done</div>
          </KanbanColumn>
        </div>
      </DndContext>
      
      <LoadingOverlay 
        isVisible={isSyncing} 
        message="Синхронизация с сервером..." 
      />
    </div>
  );
}


