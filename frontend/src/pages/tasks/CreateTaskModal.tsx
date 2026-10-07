import { useState } from "react";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateTaskModal = ({
  isOpen,
  onClose,
  onCreated,
}: CreateTaskModalProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCreated();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
        className="w-full max-w-2xl rounded-2xl bg-white shadow-xl"
      >
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h1
              id="create-task-title"
              className="text-xl font-semibold text-slate-900"
            >
              Create a task
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Add details and assign it to your team.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Task name
              </span>
              <input
                required
                autoFocus
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Prepare project proposal"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Description
              </span>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="What needs to be done?"
                className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Due date
              </span>
              <input
                type="date"
                name="dueDate"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Priority
              </span>
              <select
                name="priority"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                defaultValue="medium"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Assignee
              </span>
              <input
                name="assignee"
                placeholder="Name or email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
          </div>
          <footer className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create task
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default CreateTaskModal;
