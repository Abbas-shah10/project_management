import { format } from "date-fns";
import { Calendar } from "lucide-react";
import type { Task } from "../../lib/types";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onMove?: (taskId: string, status: string) => void;
}

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter((s) => s.isCompleted).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <div
      onClick={onClick}
      className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg p-3 hover:border-[var(--accent-primary)] cursor-pointer transition-colors"
    >
      <p className="font-medium text-sm text-[var(--text-primary)] truncate mb-2">
        {task.title}
      </p>

      <div className="flex flex-wrap gap-1 mb-2">
        <span
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
            PRIORITY_STYLES[task.priority]
          }`}
        >
          {task.priority}
        </span>
        {task.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="text-[10px] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-1.5 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
        {task.tags.length > 2 && (
          <span className="text-[10px] text-[var(--text-tertiary)]">
            +{task.tags.length - 2}
          </span>
        )}
      </div>

      {task.assignedTo && (
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-4 h-4 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white text-[8px] font-medium">
            {getInitials(task.assignedTo.fullName)}
          </div>
          <span className="text-xs text-[var(--text-secondary)] truncate">
            {task.assignedTo.fullName}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar size={10} />
            <span>{format(new Date(task.dueDate), "MMM d")}</span>
          </div>
        )}
        {totalSubtasks > 0 && (
          <span>
            {completedSubtasks}/{totalSubtasks} subtasks
          </span>
        )}
      </div>
    </div>
  );
}
