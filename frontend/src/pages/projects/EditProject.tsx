import type { Project } from "./Projects";
import { useState } from "react";

interface EditProjectProps {
  project: Project;
  onClose: () => void;
  onUpdated: (
    projectId: string,
    payload: { name: string; description: string },
  ) => void;
}
const EditProject = ({ project, onClose, onUpdated }: EditProjectProps) => {
  const [values, setValues] = useState<{ [key: string]: string }>({
    name: project.name,
    description: project.description,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      onUpdated(project._id, {
        name: values.name,
        description: values.description,
      });

      alert("project details updated successfully");
    } catch (err: any) {
      console.log(err.response.message || "Error updating the project details");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-project-title"
    >
      <form
        onSubmit={handleSubmit}
        className="max-h-[calc(100vh-2rem)] w-full max-w-lg space-y-5 overflow-y-auto rounded-lg bg-white p-4 text-gray-900 shadow-xl sm:p-6"
      >
        <div className="flex items-center justify-between">
          <h2 id="edit-project-title" className="text-xl font-semibold">
            Update project
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-500 transition-colors hover:text-gray-700"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            <input
              name="name"
              value={values.name}
              onChange={handleChange}
              type={
                values.name.toLowerCase().includes("date") ? "date" : "text"
              }
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              className="mt-1 min-h-24 w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 font-normal text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </label>
        </div>

        <div className="flex flex-col-reverse justify-end gap-3 border-t pt-4 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;
