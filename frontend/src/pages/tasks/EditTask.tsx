import { useState, type FormEvent } from "react";

type TaskForm = {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  project: string;
  dueDate: string;
};

const EditTask = () => {
  const [task, setTask] = useState<TaskForm>({
    title: "",
    description: "",
    status: "In progress",
    priority: "Medium",
    assignee: "",
    project: "",
    dueDate: "",
  });
  const [saved, setSaved] = useState(false);

  const updateField = (field: keyof TaskForm, value: string) => {
    setTask((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
  };

  const inputClassName =
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";
  const labelClassName = "text-sm font-medium text-slate-700";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <span aria-hidden="true">←</span> Back to tasks
        </button>

        <div className="mb-6">
          <p className="text-sm font-medium text-indigo-600">Task management</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Edit task
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Update the details and progress for this task.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="space-y-6 p-5 sm:p-8">
            {saved && (
              <div
                role="status"
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              >
                Task changes saved.
              </div>
            )}

            <div>
              <label htmlFor="task-title" className={labelClassName}>
                Task name <span className="text-rose-500">*</span>
              </label>
              <input
                id="task-title"
                required
                autoFocus
                value={task.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="e.g. Prepare project proposal"
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
                value={task.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Add details about this task..."
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
                  value={task.status}
                  onChange={(event) => updateField("status", event.target.value)}
                  className={inputClassName}
                >
                  <option>To do</option>
                  <option>In progress</option>
                  <option>In review</option>
                  <option>Done</option>
                </select>
              </div>
              <div>
                <label htmlFor="task-priority" className={labelClassName}>
                  Priority
                </label>
                <select
                  id="task-priority"
                  value={task.priority}
                  onChange={(event) => updateField("priority", event.target.value)}
                  className={inputClassName}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
              <div>
                <label htmlFor="task-assignee" className={labelClassName}>
                  Assignee
                </label>
                <input
                  id="task-assignee"
                  value={task.assignee}
                  onChange={(event) => updateField("assignee", event.target.value)}
                  placeholder="Name or email"
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="task-project" className={labelClassName}>
                  Project
                </label>
                <input
                  id="task-project"
                  value={task.project}
                  onChange={(event) => updateField("project", event.target.value)}
                  placeholder="Project name"
                  className={inputClassName}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="task-due-date" className={labelClassName}>
                  Due date
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  value={task.dueDate}
                  onChange={(event) => updateField("dueDate", event.target.value)}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/20"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditTask;
