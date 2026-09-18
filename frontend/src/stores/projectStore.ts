import { create } from "zustand";
import { getAllProjects } from "../api/projectApi";

interface Project {
  name: string;
  description: string;
}

interface ProjectState {
  projects: null | Project[];
  loading: boolean;
  error: string | null;
  getAllProjects: () => Promise<void>;
}

const projectStore = create<ProjectState>((set) => ({
  projects: null,
  loading: false,
  error: null,

  getAllProjects: async () => {
    set({ loading: true, error: "" });

    try {
      const { data } = await getAllProjects();

      set({
        projects: data.project || [],
        loading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.message,
      });
    }
  },
}));

export default projectStore;
