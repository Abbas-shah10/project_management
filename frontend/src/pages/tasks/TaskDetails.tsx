import { Link, useParams } from "react-router-dom";
import { useTaskStore } from "../../stores/taskStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createSubTask,
  deleteSubTask,
  updateSubTask,
} from "../../api/taskApi";
import { Trash2 } from "lucide-react";

type TaskRecord = {
  title?: string;
  status?: "todo" | "in_progress" | "done" | string;
  description?: string;
  subTasks?: Array<{
    _id?: string;
    id?: string;
    title: string;
    isCompleted?: boolean;
    completed?: boolean;
  }>;
  priority?: string;
  dueDate?: string | Date;
};

const TaskDetails = () => {
  const { projectId, taskId } = useParams();
  const getTaskById = useTaskStore((state) => state.getTaskById);
  const task = useTaskStore((state) => state.task) as
    | TaskRecord
    | null
    | undefined;

  useEffect(() => {
    if (taskId && projectId) {
      void getTaskById(taskId, projectId).catch((error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : "Unable to load this task.",
        );
      });
    }
  }, [getTaskById, taskId, projectId]);

  const taskData: TaskRecord = task ?? {};

  const subtasks = Array.isArray(taskData.subTasks) ? taskData.subTasks : [];
  const [subTaskTitle, setSubTaskTitle] = useState("");
  const [subTaskLoading, setSubTaskLoading] = useState(false);

  const reloadTask = async () => {
    if (projectId && taskId) await getTaskById(taskId, projectId);
  };

  const handleAddSubTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!projectId || !taskId || !subTaskTitle.trim()) return;
    setSubTaskLoading(true);
    try {
      await createSubTask(projectId, taskId, subTaskTitle.trim());
      setSubTaskTitle("");
      await reloadTask();
      toast.success("Subtask added.");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to add subtask.",
      );
    } finally {
      setSubTaskLoading(false);
    }
  };

  const handleSubTaskCompletion = async (
    subTaskId: string,
    isCompleted: boolean,
  ) => {
    if (!projectId) return;
    setSubTaskLoading(true);
    try {
      await updateSubTask(projectId, subTaskId, !isCompleted);
      await reloadTask();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update subtask.",
      );
    } finally {
      setSubTaskLoading(false);
    }
  };

  const handleDeleteSubTask = async (subTaskId: string) => {
    if (!projectId) return;
    setSubTaskLoading(true);
    try {
      await deleteSubTask(projectId, subTaskId);
      await reloadTask();
      toast.success("Subtask deleted.");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete subtask.",
      );
    } finally {
      setSubTaskLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950/50 px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl rounded-2xl bg-slate-950/50 p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-indigo-500">
              Task details
            </p>
            <h1 className="text-3xl font-bold text-white">
              {task?.title ?? "Loading task..."}
            </h1>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-3">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                task?.status === "done"
                  ? "bg-emerald-400/10 text-emerald-300"
                  : task?.status === "in_progress"
                    ? "bg-amber-400/10 text-amber-300"
                    : "bg-slate-800 text-slate-300"
              }`}
            >
              {task?.status === "in_progress"
                ? "In progress"
                : task?.status === "done"
                  ? "Done"
                  : task?.status === "todo"
                    ? "To do"
                    : task?.status ?? "Loading"}
            </span>
            {projectId && taskId && (
              <Link
                to={`/projects/${projectId}/tasks/${taskId}/edit`}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Edit task
              </Link>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-6">
            <section className="rounded-xl bg-slate-950/50 p-4 text-white">
              <h2 className="mb-2 text-lg font-semibold text-slate-300">
                Description
              </h2>
              <p className="leading-7 text-slate-300">
                {task?.description ?? "No description provided for this task."}
              </p>
            </section>

            <section className="rounded-xl border border-slate-200 bg-slate-950/50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-300">
                  Sub Tasks
                </h2>
                <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                  {subtasks.length} items
                </span>
              </div>

              {subtasks.length > 0 ? (
                <div className="space-y-3">
                  {subtasks.map((subtask) => {
                    const isCompleted =
                      subtask.isCompleted ?? subtask.completed ?? false;
                    const subTaskId = subtask._id ?? subtask.id;
                    return (
                      <div
                        key={subTaskId ?? subtask.title}
                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-950/50 px-3 py-3 text-white"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <button
                            type="button"
                            disabled={subTaskLoading || !subTaskId}
                            aria-label={`Mark ${subtask.title} as ${
                              isCompleted ? "pending" : "completed"
                            }`}
                            onClick={() =>
                              subTaskId &&
                              void handleSubTaskCompletion(
                                subTaskId,
                                isCompleted,
                              )
                            }
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-slate-300 transition-colors disabled:opacity-50 ${
                              isCompleted
                                ? "border-emerald-500 bg-emerald-500"
                                : "border-slate-500 hover:border-indigo-400"
                            }`}
                          >
                            {isCompleted && (
                              <svg
                                viewBox="0 0 20 20"
                                className="h-3 w-3 fill-white"
                                aria-hidden="true"
                              >
                                <path d="M7.05 13.4L2.5 8.85l1.4-1.4 3.15 3.15 7.05-7.05 1.4 1.4-8.45 8.45z" />
                              </svg>
                            )}
                          </button>
                          <span
                            className={`truncate font-medium ${
                              isCompleted
                                ? "text-slate-500 line-through"
                                : "text-slate-200"
                            }`}
                          >
                            {subtask.title}
                          </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              isCompleted
                                ? "bg-emerald-400/10 text-emerald-300"
                                : "bg-amber-400/10 text-amber-300"
                            }`}
                          >
                            {isCompleted ? "Done" : "Pending"}
                          </span>
                          <button
                            type="button"
                            disabled={subTaskLoading || !subTaskId}
                            onClick={() =>
                              subTaskId && void handleDeleteSubTask(subTaskId)
                            }
                            aria-label={`Delete ${subtask.title}`}
                            className="rounded-md p-1.5 text-slate-500 hover:bg-rose-400/10 hover:text-rose-300 disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  No subtasks available for this task.
                </div>
              )}
              <form
                onSubmit={handleAddSubTask}
                className="mt-4 flex flex-col gap-2 sm:flex-row"
              >
                <input
                  value={subTaskTitle}
                  onChange={(event) => setSubTaskTitle(event.target.value)}
                  aria-label="New subtask title"
                  placeholder="Add a subtask"
                  className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
                />
                <button
                  type="submit"
                  disabled={subTaskLoading || !subTaskTitle.trim()}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add subtask
                </button>
              </form>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                Details
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex justify-between gap-3">
                  <span>Priority</span>
                  <span className="font-medium text-slate-800">
                    {task?.priority ?? "Medium"}
                  </span>
                </li>
                <li className="flex justify-between gap-3">
                  <span>Due date</span>
                  <span className="font-medium text-slate-800">
                    {task?.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "Not set"}
                  </span>
                </li>
                <li className="flex justify-between gap-3">
                  <span>Project</span>
                  <span className="font-medium text-slate-800">
                    {projectId ?? "N/A"}
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-indigo-600 p-4 text-white">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-indigo-100">
                Progress
              </h3>
              <p className="text-3xl font-bold">
                {subtasks.length > 0
                  ? `${Math.round(
                      (subtasks.filter(
                        (subtask) =>
                          subtask.isCompleted ?? subtask.completed ?? false,
                      ).length /
                        subtasks.length) *
                        100,
                    )}%`
                  : "0%"}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
