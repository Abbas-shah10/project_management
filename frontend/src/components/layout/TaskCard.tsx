import type { Task } from "../../stores/taskStore";

interface TaskCardProps {
  task: Task;
}
const TaskCard = ({ task }: TaskCardProps) => {
  const details = task as unknown as Record<string, unknown>;
  const label = (...keys: string[]) => {
    for (const key of keys) {
      const value = details[key];
      if (
        (typeof value === "string" || typeof value === "number") &&
        String(value).trim()
      ) {
        return String(value);
      }
    }
    return "";
  };

  const title = label("title", "name") || "Untitled task";
  const description = label("description", "details");
  const status = label("status") || "To do";
  const priority = label("priority");
  const assignedTo = details.assignedTo;
  const assignedUsername =
    assignedTo && typeof assignedTo === "object" && "username" in assignedTo
      ? String(assignedTo.username ?? "")
      : "";
  const assignee = label("assignee", "owner") || assignedUsername;
  const dueDateValue = label("dueDate", "due_date");
  const dueDate = dueDateValue ? new Date(dueDateValue) : null;
  const formattedDate =
    dueDate && !Number.isNaN(dueDate.getTime())
      ? dueDate.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
      : "";
  const priorityColor = /high|urgent/i.test(priority)
    ? "bg-rose-50 text-rose-700 ring-rose-200"
    : /low/i.test(priority)
      ? "bg-slate-100 text-slate-600 ring-slate-200"
      : "bg-amber-50 text-amber-700 ring-amber-200";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-400" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
            {status}
          </span>
          <h3 className="mt-3 truncate text-lg font-bold text-slate-900">
            {title}
          </h3>
        </div>
        {priority && (
          <>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${priorityColor}`}
            >
              {priority}
            </span>
          </>
        )}
      </div>

      {description && (
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}

      {(formattedDate || assignee) && (
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          {formattedDate ? (
            <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span aria-hidden="true" className="text-indigo-500">
                ◷
              </span>
              Due {formattedDate}
            </span>
          ) : (
            <span />
          )}
          {assignee && (
            <span className="flex min-w-0 items-center gap-2 text-xs font-medium text-slate-700">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold uppercase text-indigo-700">
                {assignee.charAt(0)}
              </span>
              <span className="max-w-32 truncate">{assignee}</span>
            </span>
          )}
        </div>
      )}
    </article>
  );
};

export default TaskCard;
