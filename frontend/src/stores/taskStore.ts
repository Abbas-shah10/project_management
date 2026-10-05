import { create } from "zustand";
import type { Project } from "../pages/projects/Projects";
import * as taskApi from "../api/taskApi";

interface Task {
  _id: string;
  title: string;
  description: string;
  project: Project;
  assignedTo: string;
  status: "todo" | "in-progress" | "done";
  attachment?: string;
  priority: "low" | "medium" | "high";
  createdBy: string;
}

interface TaskState {
  tasks: null | Task[];
  task: null;
  loading: boolean;
  error: string | null;
  fetchAllTasks: () => Promise<void>;
}

const useTaskStore = create<TaskState>((set) => ({
  tasks: null,
  task: null,
  loading: false,
  error: null,
  fetchAllTasks: async () => {
    set({ loading: true, error: null });

    try {
      const res = await taskApi.fetchAllTasks();

      set({ tasks: res.data || [], loading: false, error: null });
    } catch (error: any) {
      set({ loading: false, error: error.message || "Failed to fetch tasks" });
    }
  },
}));

export { useTaskStore };
