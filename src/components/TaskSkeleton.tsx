'use client';

interface TaskSkeletonProps {
  className?: string;
}

export default function TaskSkeleton({ className = '' }: TaskSkeletonProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 border-l-gray-300 p-4 animate-pulse ${className}`}>
      <div className="flex flex-col gap-2">
        {}
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        
        {}
        <div className="space-y-1">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
        
        {}
        <div className="flex items-center justify-between mt-2">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

export function ColumnSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col min-w-80 bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200 ${className}`}>
      {}
      <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
      
      {}
      <div className="flex flex-col gap-3 min-h-96">
        <TaskSkeleton />
        <TaskSkeleton />
        <TaskSkeleton />
      </div>
    </div>
  );
}

export function LoadingOverlay({ isVisible, message = 'Загрузка...' }: { isVisible: boolean; message?: string }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex items-center gap-3 shadow-lg">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="text-gray-700">{message}</span>
      </div>
    </div>
  );
}
