import { useState } from "react";
import {
  useTaskStore,
  type TaskPriority,
  type TaskStatus,
} from "../../stores/taskStore";
import useProjectStore from "../../stores/projectStore";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

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
  const { id } = useParams<string>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const { createTask, loading } = useTaskStore();
  const project = useProjectStore((state) => state.project);
  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (!id) throw new Error("This task must belong to a project.");
      await createTask(
        title.trim(),
        description.trim(),
        status,
        assignedTo,
        id,
        priority,
        dueDate,
      );
      toast.success("Task created successfully.");
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
      setAssignedTo("");
      setDueDate("");
      onCreated();
      onClose();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create task",
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020612] text-white p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
        className="w-full max-w-2xl rounded-2xl bg-slate-700/20 shadow-xl"
      >
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h1
              id="create-task-title"
              className="text-xl font-semibold  text-white"
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
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Priority
              </span>
              <select
                name="priority"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as TaskPriority)
                }
                className="w-full rounded-lg border border-slate-300 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>
            <label className="sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Assignee
              </span>
              <select
                name="assignee"
                value={assignedTo}
                onChange={(event) => setAssignedTo(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? "Creating task…" : "Create task"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default CreateTaskModal;
