'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskItem, useTaskStore } from '@/store/taskStore';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

interface TaskCardProps {
  task: TaskItem;
  className?: string;
}

export default function TaskCard({ task, className = '' }: TaskCardProps) {
  const { deleteTask } = useTaskStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        group bg-white rounded-lg shadow-sm border-l-4 p-4 cursor-grab active:cursor-grabbing
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
          <div className="flex items-center gap-2">
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
                {new Date(task.dueDate).toLocaleDateString('ru-RU')}
              </span>
            )}
          </div>
          
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-500 focus:outline-none focus:text-red-500 disabled:opacity-50"
            title="Удалить задачу"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Удалить задачу"
        message={`Вы уверены, что хотите удалить задачу "${task.title}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
        isDestructive={true}
      />
    </div>
  );
}
