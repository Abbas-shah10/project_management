import { useMemo, useState } from "react";
import { CheckCircle2, Circle, Clock, ChevronUp, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { useAppStore } from "../../stores/app-store";
import type { Task, TaskStatus, Priority } from "../../lib/types";

interface ListViewProps {
  projectId: string;
  onTaskClick: (taskId: string) => void;
}

type SortField = "title" | "status" | "priority" | "dueDate" | "assignee";
type SortDir = "asc" | "desc";

const STATUS_ICONS: Record<TaskStatus, typeof Circle> = {
  todo: Circle,
  in_progress: Clock,
  done: CheckCircle2,
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: "text-[var(--text-tertiary)]",
  in_progress: "text-[var(--accent-primary)]",
  done: "text-[var(--success)]",
};

const PRIORITY_STYLES: Record<Priority, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const PRIORITY_ORDER: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ListView({ projectId, onTaskClick }: ListViewProps) {
  const tasks = useAppStore((s) => s.tasks);
  const filters = useAppStore((s) => s.filters);

  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = sortDir === "asc" ? ChevronUp : ChevronDown;

  const filteredTasks = useMemo(() => {
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

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "status": {
          const order: Record<TaskStatus, number> = {
            todo: 0,
            in_progress: 1,
            done: 2,
          };
          cmp = order[a.status] - order[b.status];
          break;
        }
        case "priority":
          cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
          break;
        case "dueDate":
          cmp =
            (a.dueDate ? new Date(a.dueDate).getTime() : Infinity) -
            (b.dueDate ? new Date(b.dueDate).getTime() : Infinity);
          break;
        case "assignee":
          cmp = (a.assignedTo?.fullName || "zzz").localeCompare(
            b.assignedTo?.fullName || "zzz"
          );
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [tasks, projectId, filters, sortField, sortDir]);

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <th
      className="text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider px-3 py-2 cursor-pointer hover:text-[var(--text-primary)] select-none"
      onClick={() => toggleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && <SortIcon size={12} />}
      </div>
    </th>
  );

  if (filteredTasks.length === 0) {
    return (
      <div className="bg-[var(--bg-secondary)] rounded-lg p-8 text-center">
        <p className="text-[var(--text-tertiary)] text-sm">
          No tasks match your filters
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="border-b border-[var(--border-primary)]">
          <tr>
            <th className="w-8 px-3 py-2" />
            <SortableHeader field="title">Title</SortableHeader>
            <SortableHeader field="assignee">Assignee</SortableHeader>
            <SortableHeader field="priority">Priority</SortableHeader>
            <SortableHeader field="dueDate">Due Date</SortableHeader>
            <th className="text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider px-3 py-2">
              Tags
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-primary)]">
          {filteredTasks.map((task) => {
            const StatusIcon = STATUS_ICONS[task.status];
            return (
              <tr
                key={task._id}
                onClick={() => onTaskClick(task._id)}
                className="hover:bg-[var(--bg-hover)] cursor-pointer"
              >
                <td className="px-3 py-2">
                  <StatusIcon
                    size={16}
                    className={STATUS_COLORS[task.status]}
                  />
                </td>
                <td className="px-3 py-2">
                  <span className="text-sm text-[var(--text-primary)] font-medium">
                    {task.title}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {task.assignedTo ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white text-[9px] font-medium">
                        {getInitials(task.assignedTo.fullName)}
                      </div>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {task.assignedTo.fullName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-[var(--text-tertiary)]">
                      --
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      PRIORITY_STYLES[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="text-xs text-[var(--text-secondary)]">
                    {task.dueDate
                      ? format(new Date(task.dueDate), "MMM d, yyyy")
                      : "--"}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
