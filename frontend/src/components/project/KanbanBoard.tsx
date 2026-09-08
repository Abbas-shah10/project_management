import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAppStore } from "../../stores/app-store";
import { TaskCard } from "./TaskCard";
import type { Task, TaskStatus } from "../../lib/types";

interface KanbanBoardProps {
  projectId: string;
  onTaskClick: (taskId: string) => void;
}

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: "todo", label: "Todo", color: "var(--text-tertiary)" },
  { status: "in_progress", label: "In Progress", color: "var(--accent-primary)" },
  { status: "done", label: "Done", color: "var(--success)" },
];

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export function KanbanBoard({ projectId, onTaskClick }: KanbanBoardProps) {
  const tasks = useAppStore((s) => s.tasks);
  const moveTask = useAppStore((s) => s.moveTask);
  const filters = useAppStore((s) => s.filters);
  const [menuTaskId, setMenuTaskId] = useState<string | null>(null);

  const projectTasks = useMemo(() => {
    let result = tasks.filter((t) => t.project === projectId);

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
    if (filters.statuses.length > 0) {
      result = result.filter((t) => filters.statuses.includes(t.status));
    }
    if (filters.priorities.length > 0) {
      result = result.filter((t) => filters.priorities.includes(t.priority));
    }
    if (filters.assignees.length > 0) {
      result = result.filter(
        (t) => t.assignedTo && filters.assignees.includes(t.assignedTo._id)
      );
    }
    if (filters.tags.length > 0) {
      result = result.filter((t) =>
        t.tags.some((tag) => filters.tags.includes(tag))
      );
    }

    return result;
  }, [tasks, projectId, filters]);

  const columns = useMemo(() => {
    return COLUMNS.map((col) => ({
      ...col,
      tasks: projectTasks.filter((t) => t.status === col.status),
    }));
  }, [projectTasks]);

  const handleMove = (taskId: string, newStatus: TaskStatus) => {
    moveTask(taskId, newStatus);
    setMenuTaskId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((col) => (
        <div key={col.status} className="flex flex-col">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: col.color }}
            />
            <h3 className="text-sm font-medium text-[var(--text-primary)]">
              {col.label}
            </h3>
            <span className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">
              {col.tasks.length}
            </span>
          </div>
          <div className="space-y-2 min-h-[200px] bg-[var(--bg-secondary)] rounded-lg p-2">
            {col.tasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-[var(--text-tertiary)]">No tasks</p>
              </div>
            ) : (
              col.tasks.map((task) => (
                <div key={task._id} className="relative">
                  <TaskCard
                    task={task}
                    onClick={() => onTaskClick(task._id)}
                  />
                  {col.status !== "done" && (
                    <div className="absolute top-1 right-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuTaskId(
                            menuTaskId === task._id ? null : task._id
                          );
                        }}
                        className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)]"
                      >
                        <ChevronDown size={12} />
                      </button>
                      {menuTaskId === task._id && (
                        <div className="absolute right-0 top-7 z-10 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg shadow-lg py-1 min-w-[120px]">
                          {STATUS_OPTIONS.filter(
                            (o) => o.value !== col.status
                          ).map((opt) => (
                            <button
                              key={opt.value}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMove(task._id, opt.value);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                            >
                              Move to {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
