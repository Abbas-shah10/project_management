import { create } from "zustand";
import { getAllProjects, createProject } from "../api/projectApi";

interface Project {
  _id: string;
  name: string;
  description: string;
  status: "On track" | "At risk" | "Completed";
  progress: number;
  due: string;
  dueLabel: string;
  tasks: string;
  team: string;
  members: string[];
  color: string;
}

type ProjectApiRecord = {
  project: Partial<Project> & { _id?: string };
  role?: string;
};

function normalizeProject(record: ProjectApiRecord): Project {
  const project = record.project;

  return {
    _id: project._id || crypto.randomUUID(),
    name: project.name || "Untitled project",
    description: project.description || "No description yet.",
    status: project.status || "On track",
    progress: project.progress || 0,
    due: project.due || "",
    dueLabel: project.dueLabel || "No due date",
    tasks: project.tasks || "0 tasks",
    team: project.team || record.role || "No team",
    members: Array.isArray(project.members) ? project.members : [],
    color: project.color || "sky",
  };
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createNewProject: (name: string, description: string) => Promise<void>;
}

const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: "" });

    try {
      const data = await getAllProjects();

      set({
        projects: (data?.projects || []).map(normalizeProject),
        loading: false,
        error: null,
      });
    } catch (error: unknown) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "Unable to fetch projects",
      });
    }
  },
  createNewProject: async (name: string, description: string) => {
    set({ loading: true, error: "error" });

    try {
      const payload = await createProject(name, description);

      set((state) => ({
        projects: payload?.project
          ? [
              ...(state.projects || []),
              normalizeProject({ project: payload.project }),
            ]
          : state.projects || [],
        loading: false,
        error: null,
      }));
    } catch (error: unknown) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "Error creating new project",
      });
    }
  },
}));

export default useProjectStore;
