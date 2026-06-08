"use client";

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  return (
    <div className={`glass-panel p-5 rounded-2xl transition-all duration-300 hover:shadow-lg group ${task.completed ? 'opacity-70' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onToggleStatus(task)}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                task.completed 
                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                  : 'border-slate-300 hover:border-emerald-500'
              }`}
            >
              {task.completed && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <h3 className={`font-semibold text-lg truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
              {task.title}
            </h3>
          </div>
          
          {task.description && (
            <p className={`mt-2 text-sm line-clamp-2 pl-9 ${task.completed ? 'text-slate-400' : 'text-slate-600 dark:text-slate-400'}`}>
              {task.description}
            </p>
          )}
          
          <div className="mt-4 pl-9 text-xs text-slate-400 font-medium">
            {new Date(task.createdAt).toLocaleDateString(undefined, { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(task)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="Edit task"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Delete task"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
