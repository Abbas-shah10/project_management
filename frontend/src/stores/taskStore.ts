import { create } from "zustand";
import type { Project } from "../pages/projects/Projects";

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
}

const useTaskStore = create<TaskState>((set) => ({
  tasks: null,
  task: null,
  loading: false,
  error: null,
}));

export { useTaskStore };
