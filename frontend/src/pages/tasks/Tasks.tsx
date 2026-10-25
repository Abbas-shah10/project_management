import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ListChecks, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { getAllProjects } from "../../api/projectApi";
import { deleteTask, fetchAllTasks } from "../../api/taskApi";

interface TaskRow {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high" | "urgent";
  project: { _id: string; name: string };
  assignedTo?: { username?: string; fullName?: string } | null;
  dueDate?: string;
  createdAt?: string;
}

interface TaskProject {
  _id: string;
  name: string;
}

const statusText: Record<TaskRow["status"], string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

const Tasks = () => {
  const [projects, setProjects] = useState<TaskProject[]>([]);
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");

  useEffect(() => {
    let isCurrent = true;

    const loadTasks = async () => {
      try {
        const response = await getAllProjects();
        const availableProjects: TaskProject[] = Array.isArray(
          response?.projects,
        )
          ? response.projects
          : [];
        const resultGroups = await Promise.all(
          availableProjects.map(async (project) => {
            const taskResponse = await fetchAllTasks(project._id);
            return (Array.isArray(taskResponse?.tasks)
              ? taskResponse.tasks
              : []
            ).map((task: Omit<TaskRow, "project">) => ({
              ...task,
              project: { _id: project._id, name: project.name },
            }));
          }),
        );

        if (isCurrent) {
          setProjects(availableProjects);
          setTasks(resultGroups.flat());
          setError(null);
        }
      } catch (loadError: unknown) {
        if (isCurrent) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load tasks.",
          );
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    void loadTasks();
    return () => {
      isCurrent = false;
    };
  }, []);

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesQuery =
        !normalizedQuery ||
        `${task.title} ${task.description || ""} ${task.project.name} ${task.assignedTo?.username || ""} ${task.assignedTo?.fullName || ""}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      const matchesProject =
        projectFilter === "all" || task.project._id === projectFilter;
      return matchesQuery && matchesStatus && matchesProject;
    });
  }, [projectFilter, query, statusFilter, tasks]);

  const handleDelete = async (task: TaskRow) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await deleteTask(task._id, task.project._id);
      setTasks((current) => current.filter((item) => item._id !== task._id));
      toast.success("Task deleted.");
    } catch (deleteError: unknown) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete task.",
      );
    }
  };

  const completedCount = tasks.filter((task) => task.status === "done").length;

  return (
    <div className="space-y-8 pb-8 text-slate-100">
      <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">
            Work tracker
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Tasks<span className="text-rose-400">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Review and manage work across all of your projects.
          </p>
        </div>
        <Link
          to="/projects"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-rose-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-rose-300"
        >
          <ListChecks size={17} /> Create a task in a project
        </Link>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"
        >
          Could not load tasks: {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Task totals">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">All tasks</p>
          <strong className="mt-2 block text-3xl font-semibold text-white">
            {loading || error ? "—" : tasks.length}
          </strong>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">In progress</p>
          <strong className="mt-2 block text-3xl font-semibold text-amber-300">
            {loading || error
              ? "—"
              : tasks.filter((task) => task.status === "in_progress").length}
          </strong>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Completed</p>
          <strong className="mt-2 block text-3xl font-semibold text-emerald-300">
            {loading || error ? "—" : completedCount}
          </strong>
        </article>
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative min-w-0 flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              size={16}
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tasks, projects, or assignees"
              aria-label="Search tasks"
              className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/60 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-rose-400/60"
            />
          </label>
          <select
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
            aria-label="Filter tasks by project"
            className="h-11 rounded-xl border border-slate-800 bg-slate-950/60 px-3 text-sm text-slate-300 outline-none focus:border-rose-400/60"
          >
            <option value="all">All projects</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter tasks by status"
            className="h-11 rounded-xl border border-slate-800 bg-slate-950/60 px-3 text-sm text-slate-300 outline-none focus:border-rose-400/60"
          >
            <option value="all">All statuses</option>
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {loading ? (
          <p className="rounded-xl border border-slate-800 p-8 text-center text-sm text-slate-500">
            Loading tasks…
          </p>
        ) : error ? (
          <p className="rounded-xl border border-slate-800 p-8 text-center text-sm text-slate-500">
            Task list data is unavailable.
          </p>
        ) : filteredTasks.length ? (
          <ul className="space-y-3">
            {filteredTasks.map((task) => (
              <li
                key={task._id}
                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <Link
                  to={`/projects/${task.project._id}/tasks/${task._id}`}
                  className="min-w-0 flex-1"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-sm font-semibold text-white">
                      {task.title}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        task.status === "done"
                          ? "bg-emerald-400/10 text-emerald-300"
                          : task.status === "in_progress"
                            ? "bg-amber-400/10 text-amber-300"
                            : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {statusText[task.status]}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {task.project.name}
                    {task.assignedTo?.username
                      ? ` · ${task.assignedTo.username}`
                      : " · Unassigned"}
                    {task.priority ? ` · ${task.priority} priority` : ""}
                    {task.dueDate
                      ? ` · Due ${new Date(task.dueDate).toLocaleDateString()}`
                      : ""}
                  </p>
                </Link>
                {task.status === "done" && (
                  <Check
                    size={16}
                    className="shrink-0 text-emerald-300"
                    aria-label="Completed"
                  />
                )}
                <button
                  type="button"
                  onClick={() => void handleDelete(task)}
                  aria-label={`Delete ${task.title}`}
                  className="shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-rose-400/10 hover:text-rose-300"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
            <p className="text-sm font-medium text-slate-300">
              {query || statusFilter !== "all" || projectFilter !== "all"
                ? "No tasks match those filters"
                : "No tasks found"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Create a task from one of your project pages to get started.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Tasks;
