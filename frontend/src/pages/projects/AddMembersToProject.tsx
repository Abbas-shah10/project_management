import useProjectStore from "../../stores/projectStore";
import type { Project } from "./Projects";
import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";

interface AddMembersProps {
  onClose: () => void;
  project: Project;
}
const AddMembersToProject = ({ onClose, project }: AddMembersProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin" | "project_admin">(
    "member",
  );
  const [loading, setLoading] = useState(false);
  const { AddMembersToProject } = useProjectStore();
  console.log(project);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await AddMembersToProject(project._id, email, role);
      toast.success("User added to project successfully");
    } catch (error: any) {
      console.log("Error adding members");
      toast.error("Error adding user to project", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Add member</h2>
            <p className="mt-1 text-sm text-slate-500">
              Invite a member to {project.name}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-slate-400 hover:text-slate-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="member-email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email address
            </label>
            <input
              id="member-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="member-role"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Role
            </label>
            <select
              id="member-role"
              value={role}
              onChange={(event) =>
                setRole(
                  event.target.value as "member" | "admin" | "project_admin",
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="project_admin">Project Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {loading ? "Adding Member" : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMembersToProject;
