import { useMemo } from "react";
import { Search, X } from "lucide-react";
import { useAppStore } from "../../stores/app-store";
import type { Task } from "../../lib/types";

interface FiltersPaneProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FiltersPane({ projectId, isOpen, onClose }: FiltersPaneProps) {
  const tasks = useAppStore((s) => s.tasks);
  const users = useAppStore((s) => s.users);
  const members = useAppStore((s) => s.members);
  const filters = useAppStore((s) => s.filters);
  const setFilters = useAppStore((s) => s.setFilters);
  const resetFilters = useAppStore((s) => s.resetFilters);

  const projectMembers = useMemo(
    () => members.filter((m) => m.project === projectId),
    [members, projectId]
  );

  const projectTasks = useMemo(
    () => tasks.filter((t) => t.project === projectId),
    [tasks, projectId]
  );

  const uniqueTags = useMemo(() => {
    const tagSet = new Set<string>();
    projectTasks.forEach((t: Task) => t.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [projectTasks]);

  const assignedUserIds = useMemo(
    () => new Set(projectMembers.map((m) => m.user._id)),
    [projectMembers]
  );

  const assignedUsers = useMemo(
    () => users.filter((u) => assignedUserIds.has(u._id)),
    [users, assignedUserIds]
  );

  if (!isOpen) return null;

  const hasActiveFilters =
    filters.search ||
    filters.assignees.length > 0 ||
    filters.priorities.length > 0 ||
    filters.tags.length > 0 ||
    filters.statuses.length > 0;

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--text-primary)]">
          Filters
        </h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-[var(--accent-primary)] hover:underline"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-tertiary)]"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="relative">
        <Search
          size={14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
        />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="w-full pl-8 pr-3 py-1.5 text-sm bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-md focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
        />
      </div>

      <div>
        <h4 className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">
          Assignees
        </h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {assignedUsers.map((user) => (
            <label
              key={user._id}
              className="flex items-center gap-2 text-sm text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-hover)] rounded px-1 py-0.5"
            >
              <input
                type="checkbox"
                checked={filters.assignees.includes(user._id)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...filters.assignees, user._id]
                    : filters.assignees.filter((id) => id !== user._id);
                  setFilters({ assignees: next });
                }}
                className="w-3.5 h-3.5 rounded border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
              />
              <span className="truncate">{user.fullName}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">
          Priority
        </h4>
        <div className="space-y-1">
          {["low", "medium", "high", "urgent"].map((p) => (
            <label
              key={p}
              className="flex items-center gap-2 text-sm text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-hover)] rounded px-1 py-0.5"
            >
              <input
                type="checkbox"
                checked={filters.priorities.includes(p)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...filters.priorities, p]
                    : filters.priorities.filter((pr) => pr !== p);
                  setFilters({ priorities: next });
                }}
                className="w-3.5 h-3.5 rounded border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
              />
              <span className="capitalize">{p}</span>
            </label>
          ))}
        </div>
      </div>

      {uniqueTags.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">
            Tags
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {uniqueTags.map((tag) => (
              <label
                key={tag}
                className="flex items-center gap-2 text-sm text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-hover)] rounded px-1 py-0.5"
              >
                <input
                  type="checkbox"
                  checked={filters.tags.includes(tag)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...filters.tags, tag]
                      : filters.tags.filter((t) => t !== tag);
                    setFilters({ tags: next });
                  }}
                  className="w-3.5 h-3.5 rounded border-[var(--border-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                />
                <span>{tag}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
