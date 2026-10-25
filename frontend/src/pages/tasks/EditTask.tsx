import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useProjectStore from "../../stores/projectStore";
import {
  useTaskStore,
  type TaskPriority,
  type TaskStatus,
} from "../../stores/taskStore";

const EditTask = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const task = useTaskStore((state) => state.task);
  const loading = useTaskStore((state) => state.loading);
  const getTaskById = useTaskStore((state) => state.getTaskById);
  const updateTask = useTaskStore((state) => state.updateTask);
  const project = useProjectStore((state) => state.project);
  const fetchProjectById = useProjectStore((state) => state.fetchProjectById);
  const [draft, setDraft] = useState<{
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assignedTo?: string;
    dueDate?: string;
  }>({});

  useEffect(() => {
    if (projectId && taskId) {
      void getTaskById(taskId, projectId).catch((error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : "Unable to load this task.",
        );
      });
    }
    if (projectId) void fetchProjectById(projectId);
  }, [fetchProjectById, getTaskById, projectId, taskId]);

  const currentAssignee =
    task?.assignedTo && typeof task.assignedTo === "object"
      ? task.assignedTo._id
      : "";
  const inputClassName =
    "mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-rose-400 focus:ring-4 focus:ring-rose-400/10";
  const labelClassName = "text-sm font-medium text-slate-300";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!projectId || !taskId || !task) {
      toast.error("Unable to load this task.");
      return;
    }

    try {
      await updateTask(
        taskId,
        projectId,
        (draft.title ?? task.title).trim(),
        draft.description ?? task.description ?? "",
        draft.assignedTo ?? currentAssignee ?? "",
        draft.status ?? task.status,
        draft.priority ?? task.priority,
        draft.dueDate ?? task.dueDate?.slice(0, 10),
      );
      toast.success("Task updated successfully.");
      navigate(`/projects/${projectId}/tasks/${taskId}`);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update task.",
      );
    }
  };

  if (!task) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
        {loading ? (
          <p className="text-sm text-slate-400">Loading task…</p>
        ) : (
          <>
            <p className="text-sm text-slate-300">Task not found.</p>
            <Link
              to={projectId ? `/projects/${projectId}` : "/projects"}
              className="mt-3 inline-block text-sm font-medium text-rose-300 hover:text-rose-200"
            >
              Back to project
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-8">
      <header>
        <Link
          to={`/projects/${projectId}/tasks/${taskId}`}
          className="text-sm font-medium text-slate-400 hover:text-white"
        >
          ← Back to task
        </Link>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
          Task management
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Edit task
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Update the details and progress for {task.title}.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-8"
      >
        <div>
          <label htmlFor="task-title" className={labelClassName}>
            Task name
          </label>
          <input
            id="task-title"
            required
            autoFocus
            value={draft.title ?? task.title}
            onChange={(event) =>
              setDraft((current) => ({ ...current, title: event.target.value }))
            }
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="task-description" className={labelClassName}>
            Description
          </label>
          <textarea
            id="task-description"
            rows={4}
            value={draft.description ?? task.description ?? ""}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            className={`${inputClassName} resize-y`}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="task-status" className={labelClassName}>
              Status
            </label>
            <select
              id="task-status"
              value={draft.status ?? task.status}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  status: event.target.value as TaskStatus,
                }))
              }
              className={inputClassName}
            >
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label htmlFor="task-priority" className={labelClassName}>
              Priority
            </label>
            <select
              id="task-priority"
              value={draft.priority ?? task.priority}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  priority: event.target.value as TaskPriority,
                }))
              }
              className={inputClassName}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label htmlFor="task-assignee" className={labelClassName}>
              Assignee
            </label>
            <select
              id="task-assignee"
              value={draft.assignedTo ?? currentAssignee}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  assignedTo: event.target.value,
                }))
              }
              className={inputClassName}
            >
              <option value="">Unassigned</option>
              {project?.members.map((member) =>
                member.user?._id ? (
                  <option key={member.user._id} value={member.user._id}>
                    {member.user.username || "Project member"}
                  </option>
                ) : null,
              )}
            </select>
          </div>
          <div>
            <label htmlFor="task-due-date" className={labelClassName}>
              Due date
            </label>
            <input
              id="task-due-date"
              type="date"
              value={draft.dueDate ?? task.dueDate?.slice(0, 10) ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  dueDate: event.target.value,
                }))
              }
              className={inputClassName}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
          <Link
            to={`/projects/${projectId}/tasks/${taskId}`}
            className="rounded-lg border border-slate-700 px-4 py-2.5 text-center text-sm font-medium text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-rose-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-rose-300 disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;
