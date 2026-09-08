import { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import type { Task, TaskStatus, Priority } from '../../lib/types';
import { useAppStore } from '../../stores/app-store';
import SubtaskList from './SubtaskList';
import CommentTimeline from './CommentTimeline';
import ProgressBar from './ProgressBar';

const statusOptions: { value: TaskStatus; label: string; color: string }[] = [
  { value: 'todo', label: 'To Do', color: 'bg-[var(--text-tertiary)]' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-[var(--warning)]' },
  { value: 'done', label: 'Done', color: 'bg-[var(--success)]' },
];

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-[var(--text-tertiary)]' },
  { value: 'medium', label: 'Medium', color: 'text-[var(--accent-primary)]' },
  { value: 'high', label: 'High', color: 'text-[var(--warning)]' },
  { value: 'urgent', label: 'Urgent', color: 'text-[var(--danger)]' },
];

function Dropdown<T extends string>({
  value,
  options,
  onChange,
  renderOption,
}: {
  value: T;
  options: { value: T; label: string; color?: string }[];
  onChange: (v: T) => void;
  renderOption?: (opt: { value: T; label: string; color?: string }) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm border border-[var(--border-primary)] rounded-md hover:bg-[var(--bg-hover)] transition-colors min-w-[140px] justify-between"
      >
        {renderOption && selected ? renderOption(selected) : (
          <span className="text-[var(--text-primary)]">{selected?.label}</span>
        )}
        <ChevronDown size={14} className={`text-[var(--text-tertiary)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-md shadow-lg py-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--bg-hover)] transition-colors ${
                opt.value === value ? 'bg-[var(--bg-hover)] font-medium' : ''
              }`}
            >
              {renderOption ? renderOption(opt) : <span className="text-[var(--text-primary)]">{opt.label}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TaskDrawer() {
  const {
    taskDrawerOpen,
    selectedTaskId,
    tasks,
    users,
    notes,
    closeTaskDrawer,
    updateTask,
    moveTask,
  } = useAppStore();

  const task = tasks.find((t) => t._id === selectedTaskId);
  const [description, setDescription] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (taskDrawerOpen) {
      setIsAnimating(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPanelOpen(true));
      });
    } else {
      setPanelOpen(false);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [taskDrawerOpen]);

  useEffect(() => {
    if (task) setDescription(task.description);
  }, [task]);

  if (!isAnimating && !taskDrawerOpen) return null;
  if (!task) return null;

  const completedCount = task.subtasks.filter((st) => st.isCompleted).length;
  const totalSubtasks = task.subtasks.length;
  const progress = totalSubtasks > 0 ? (completedCount / totalSubtasks) * 100 : 0;

  const taskNotes = notes.filter((n) => n.project === task.project);

  const selectedStatus = statusOptions.find((s) => s.value === task.status);
  const selectedPriority = priorityOptions.find((p) => p.value === task.priority);

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          panelOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeTaskDrawer}
      />

      <div
        className={`absolute inset-y-0 right-0 w-[520px] bg-[var(--bg-primary)] border-l border-[var(--border-primary)] shadow-xl flex flex-col transition-transform duration-300 ease-out ${
          panelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-primary)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] truncate flex-1 mr-4">
            {task.title}
          </h2>
          <button
            type="button"
            onClick={closeTaskDrawer}
            className="p-1.5 rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-1.5 block">
                Status
              </label>
              <Dropdown
                value={task.status}
                options={statusOptions}
                onChange={(v) => moveTask(task._id, v)}
                renderOption={(opt) => (
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${opt.color}`} />
                    <span className="text-[var(--text-primary)]">{opt.label}</span>
                  </div>
                )}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-1.5 block">
                Priority
              </label>
              <Dropdown
                value={task.priority}
                options={priorityOptions}
                onChange={(v) => updateTask(task._id, { priority: v })}
                renderOption={(opt) => (
                  <span className={`font-medium ${opt.color}`}>{opt.label}</span>
                )}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-1.5 block">
                Assignee
              </label>
              <Dropdown
                value={task.assignedTo?._id || ''}
                options={[
                  { value: '', label: 'Unassigned' },
                  ...users.map((u) => ({ value: u._id, label: u.fullName || u.username })),
                ]}
                onChange={(v) => {
                  const user = users.find((u) => u._id === v) || null;
                  updateTask(task._id, { assignedTo: user });
                }}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-1.5 block">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    updateTask(task._id, {
                      dueDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                    });
                  }}
                  className="w-full px-3 py-1.5 text-sm border border-[var(--border-primary)] rounded-md bg-transparent text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                />
                <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
              </div>
            </div>
          </div>

          {task.tags.length > 0 && (
            <div className="mb-6">
              <label className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Tag size={12} />
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Description</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => {
                if (description !== task.description) {
                  updateTask(task._id, { description });
                }
              }}
              rows={4}
              className="w-full px-3 py-2 text-sm bg-transparent border border-transparent rounded-md focus:border-[var(--border-primary)] focus:bg-[var(--bg-secondary)] placeholder:text-[var(--text-tertiary)] text-[var(--text-secondary)] resize-none transition-colors"
              placeholder="Add a description..."
            />
          </div>

          {totalSubtasks > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Subtasks</h3>
                <span className="text-xs text-[var(--text-tertiary)]">{completedCount}/{totalSubtasks}</span>
              </div>
              <ProgressBar value={progress} size="md" />
            </div>
          )}

          <div className="mb-6">
            <SubtaskList taskId={task._id} subtasks={task.subtasks} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Comments</h3>
            <CommentTimeline taskId={task._id} notes={taskNotes} />
          </div>
        </div>
      </div>
    </div>
  );
}
