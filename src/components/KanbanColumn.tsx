'use client';

import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';

interface KanbanColumnProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function KanbanColumn({ id, title, children, className = '' }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-80 bg-gray-50 rounded-lg p-4 border-2 border-dashed transition-colors ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
      } ${className}`}
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="flex flex-col gap-3 min-h-96">
        {children}
      </div>
    </div>
  );
}
