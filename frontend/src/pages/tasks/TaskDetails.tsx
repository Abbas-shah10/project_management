import { useParams } from "react-router-dom";
import { useTaskStore } from "../../stores/taskStore";
import { useEffect } from "react";

type TaskRecord = {
  title?: string;
  status?: string;
  description?: string;
  subTasks?: Array<{
    _id?: string;
    id?: string;
    title: string;
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
      getTaskById(taskId, projectId);
    }
  }, [getTaskById, taskId, projectId]);

  const taskData: TaskRecord = task ?? {};

  const subtasks = Array.isArray(taskData.subTasks) ? taskData.subTasks : [];

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

          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              task?.status === "completed"
                ? "bg-emerald-100 text-emerald-700"
                : task?.status === "in-progress"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-200 text-slate-700"
            }`}
          >
            {task?.status ?? "pending"}
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-6">
            <section className="rounded-xl bg-slate-50 p-4">
              <h2 className="mb-2 text-lg font-semibold text-slate-900">
                Description
              </h2>
              <p className="leading-7 text-slate-600">
                {task?.description ?? "No description provided for this task."}
              </p>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Sub Tasks
                </h2>
                <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                  {subtasks.length} items
                </span>
              </div>

              {subtasks.length > 0 ? (
                <div className="space-y-3">
                  {subtasks.map((subtask) => (
                    <div
                      key={subtask._id ?? subtask.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label={`Mark ${subtask.title} as ${
                            subtask.completed ? "pending" : "completed"
                          }`}
                          onClick={() => {}}
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                            subtask.completed
                              ? "border-emerald-500 bg-emerald-500"
                              : "border-slate-300 bg-white hover:border-indigo-400"
                          }`}
                        >
                          {subtask.completed && (
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
                          className={`font-medium ${
                            subtask.completed
                              ? "text-slate-500 line-through"
                              : "text-slate-700"
                          }`}
                        >
                          {subtask.title}
                        </span>
                      </div>

                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          subtask.completed
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {subtask.completed ? "Done" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  No subtasks available for this task.
                </div>
              )}
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
                      (subtasks.filter((subtask) => subtask.completed).length /
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
