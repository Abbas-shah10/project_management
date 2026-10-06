import { create } from "zustand";
import type { Project } from "../pages/projects/Projects";
import * as taskApi from "../api/taskApi";

interface Task {
  _id: string;
  title: string;
  description: string;
  project: Project;
  assignedTo: {
    _id: string;
    username: string;
  };
  status: "todo" | "in-progress" | "done";
  attachment?: string;
  priority: "low" | "medium" | "high";
  createdBy: string;
}

interface TaskState {
  tasks: Task[];
  task: null;
  loading: boolean;
  error: string | null;
  fetchAllTasks: (projectId: string) => Promise<void>;
  createTask: (
    title: string,
    description: string,
    status: "todo" | "in_progress" | "done",
    assignedTo: string,
    projectId: string,
  ) => Promise<void>;
}

const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  task: null,
  loading: false,
  error: null,
  fetchAllTasks: async (projectId: string) => {
    set({ loading: true, error: null });

    try {
      const res = await taskApi.fetchAllTasks(projectId);

      set({ tasks: res.tasks || [], loading: false, error: null });
    } catch (error: any) {
      set({ loading: false, error: error.message || "Failed to fetch tasks" });
    }
  },
  createTask: async (
    title: string,
    description: string,
    status: "todo" | "in_progress" | "done",
    assignedTo: string,
    projectId: string,
  ) => {
    set({ loading: true, error: null });
    try {
      const res = await taskApi.createTask(
        title,
        description,
        status,
        assignedTo,
        projectId,
      );
      set({ tasks: [...res.tasks], loading: false, error: null });
    } catch (error: any) {
      set({ loading: false, error: error.message || "Failed to create task" });
    }
  },
}));

export { useTaskStore };
