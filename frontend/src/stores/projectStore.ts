import { create } from "zustand";
import {
  getAllProjects,
  createProject,
  deleteProject,
  updateProject,
} from "../api/projectApi";

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

type ProjectApiMember = {
  _id?: string;
  user?:
    | string
    | { fullName?: string; username?: string; email?: string; _id?: string };
};

type ProjectApiData = Partial<Project> & {
  _id?: string;
  members?: Array<string | ProjectApiMember>;
  currentUserRole?: string;
};

type ProjectApiRecord = {
  project: ProjectApiData;
  role?: string;
};

function getMemberLabel(member: string | ProjectApiMember): string {
  if (typeof member === "string") return member;

  if (typeof member.user === "object" && member.user) {
    return (
      member.user.fullName ||
      member.user.username ||
      member.user.email ||
      member.user._id ||
      member._id ||
      "?"
    );
  }

  return member._id || "?";
}

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
    members: Array.isArray(project.members)
      ? project.members.map(getMemberLabel)
      : [],
    color: project.color || "sky",
  };
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createNewProject: (name: string, description: string) => Promise<void>;
  deleteProjectById: (projectId: string) => Promise<void>;
  updateProjectById: (
    projectId: string,
    payload: { name: string; description: string },
  ) => Promise<void>;
}

const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: "" });

    try {
      const data = await getAllProjects();
      console.log(data);

      set({
        projects: Array.isArray(data?.projects)
          ? data.projects.map((project: ProjectApiData) =>
              normalizeProject({
                project,
                role: project.currentUserRole,
              }),
            )
          : [],
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
    set({ loading: true, error: null });

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
  deleteProjectById: async (projectId: string) => {
    set({ loading: true, error: null });

    try {
      await deleteProject(projectId);

      set((state) => ({
        projects: state.projects.filter((project) => project._id !== projectId),
        loading: false,
        error: null,
      }));
    } catch (error: unknown) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "Error Deleting project",
      });
    }
  },
  updateProjectById: async (
    projectId: string,
    payload: { name: string; description: string },
  ) => {
    set({ loading: true, error: null });

    try {
      const data = await updateProject(projectId, payload);

      set((state) => ({
        projects: state.projects.map((project) =>
          project._id !== projectId
            ? { ...project, ...(data || data.project) }
            : project,
        ),
        loading: false,
        error: null,
      }));
    } catch (error: unknown) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "Error Deleting project",
      });
    }
  },
}));

export default useProjectStore;
