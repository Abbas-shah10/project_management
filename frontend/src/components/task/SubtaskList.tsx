import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import type { SubTask } from '../../lib/types';
import { useAppStore } from '../../stores/app-store';

interface SubtaskListProps {
  taskId: string;
  subtasks: SubTask[];
}

export default function SubtaskList({ taskId, subtasks }: SubtaskListProps) {
  const [newTitle, setNewTitle] = useState('');
  const toggleSubtask = useAppStore((s) => s.toggleSubtask);
  const updateTask = useAppStore((s) => s.updateTask);

  const handleAdd = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    const newSub: SubTask = {
      _id: `st-${Date.now()}`,
      title: trimmed,
      task: taskId,
      isCompleted: false,
      createdBy: subtasks[0]?.createdBy || { _id: '', username: '', email: '', fullName: '', isEmailVerified: false, createdAt: '', updatedAt: '' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    updateTask(taskId, { subtasks: [...subtasks, newSub] });
    setNewTitle('');
  };

  return (
    <div className="flex flex-col gap-2">
      {subtasks.length > 0 && (
        <div className="flex flex-col gap-1">
          {subtasks.map((st) => (
            <div
              key={st._id}
              className="group flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-[var(--bg-hover)] transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleSubtask(taskId, st._id)}
                className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  st.isCompleted
                    ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)]'
                    : 'border-[var(--border-secondary)] hover:border-[var(--accent-primary)]'
                }`}
              >
                {st.isCompleted && (
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span className={`flex-1 text-sm ${
                st.isCompleted ? 'line-through text-[var(--text-tertiary)]' : 'text-[var(--text-primary)]'
              }`}>
                {st.title}
              </span>
              <button
                type="button"
                onClick={() => {
                  updateTask(taskId, { subtasks: subtasks.filter((s) => s._id !== st._id) });
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[var(--bg-active)] text-[var(--text-tertiary)] hover:text-[var(--danger)] transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 mt-1">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add subtask..."
          className="flex-1 text-sm px-3 py-1.5 bg-transparent border border-[var(--border-primary)] rounded-md focus:outline-none focus:border-[var(--accent-primary)] placeholder:text-[var(--text-tertiary)] transition-colors"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newTitle.trim()}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[var(--accent-primary)] hover:bg-[var(--bg-hover)] rounded-md transition-colors disabled:opacity-40"
        >
          <Plus size={14} />
          Add
        </button>
      </div>
    </div>
  );
}
