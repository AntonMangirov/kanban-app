'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskItem } from '@/store/taskStore';

interface TaskCardProps {
  task: TaskItem;
  className?: string;
}

export default function TaskCard({ task, className = '' }: TaskCardProps) {
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

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'URGENT':
        return 'border-l-red-500 bg-red-50';
      case 'HIGH':
        return 'border-l-orange-500 bg-orange-50';
      case 'MEDIUM':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'LOW':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white rounded-lg shadow-sm border-l-4 p-4 cursor-grab active:cursor-grabbing
        hover:shadow-md transition-all duration-200 select-none
        ${getPriorityColor(task.priority)}
        ${isDragging ? 'rotate-2 scale-105 shadow-lg' : ''}
        ${className}
      `}
    >
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-gray-900 text-sm leading-tight">
          {task.title}
        </h3>
        
        {task.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-2">
          {task.priority && (
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${task.priority === 'URGENT' ? 'bg-red-100 text-red-700' : ''}
              ${task.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : ''}
              ${task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : ''}
              ${task.priority === 'LOW' ? 'bg-green-100 text-green-700' : ''}
            `}>
              {task.priority}
            </span>
          )}
          
          {task.dueDate && (
            <span className="text-xs text-gray-500">
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
