import { create } from "zustand";
import type { Project } from "../pages/projects/Projects";
import * as taskApi from "../api/taskApi";

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  project: Project | string | { _id?: string; name?: string };
  assignedTo?: {
    _id?: string;
    username?: string;
    fullName?: string;
  } | null;
  status: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  createdAt?: string;
  attachment?: string;
  createdBy?: string | { _id?: string; username?: string };
  subTasks?: SubTask[];
}

export interface SubTask {
  _id: string;
  title: string;
  isCompleted: boolean;
  createdBy?: string | { _id?: string; username?: string };
}

interface TaskState {
  tasks: Task[];
  task: Task | null;
  loading: boolean;
  error: string | null;
  fetchAllTasks: (projectId: string) => Promise<void>;
  createTask: (
    title: string,
    description: string,
    status: TaskStatus,
    assignedTo: string,
    projectId: string,
    priority?: TaskPriority,
    dueDate?: string,
  ) => Promise<void>;
  deleteTask: (taskId: string, projectId: string) => Promise<void>;
  getTaskById: (taskId: string, projectId: string) => Promise<void>;
  updateTask: (
    taskId: string,
    projectId: string,
    title: string,
    description: string,
    assignedTo: string,
    status: TaskStatus,
    priority?: TaskPriority,
    dueDate?: string,
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
    } catch (error: unknown) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch tasks",
      });
      throw error;
    }
  },
  createTask: async (
    title: string,
    description: string,
    status: "todo" | "in_progress" | "done",
    assignedTo: string,
    projectId: string,
    priority: TaskPriority = "medium",
    dueDate?: string,
  ) => {
    set({ loading: true, error: null });
    try {
      const res = await taskApi.createTask(
        title,
        description,
        status,
        assignedTo,
        projectId,
        priority,
        dueDate,
      );
      set((state) => ({
        tasks: [...state.tasks, res],
        loading: false,
        error: null,
      }));
    } catch (error: unknown) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to create task",
      });
      throw error;
    }
  },
  deleteTask: async (taskId: string, projectId: string) => {
    set({ loading: true, error: null });
    try {
      await taskApi.deleteTask(taskId, projectId);
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== taskId),
        loading: false,
        error: null,
      }));
    } catch (error: unknown) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to delete task",
      });
      throw error;
    }
  },
  getTaskById: async (taskId: string, projectId: string) => {
    set({ loading: true, error: null, task: null });
    try {
      const data = await taskApi.fetchTaskById(taskId, projectId);
      set({ task: data, loading: false, error: null });
    } catch (error: unknown) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch task",
      });
      throw error;
    }
  },
  updateTask: async (
    taskId: string,
    projectId: string,
    title: string,
    description: string,
    assignedTo: string,
    status: TaskStatus,
    priority: TaskPriority = "medium",
    dueDate?: string,
  ) => {
    set({ loading: true, error: null });
    try {
      const res = await taskApi.updateTask({
        taskId,
        projectId,
        title,
        description,
        assignedTo,
        status,
        priority,
        dueDate,
      });

      set((state) => ({
        tasks: state.tasks.map((task) => (task._id === taskId ? res : task)),
        task: state.task?._id === taskId ? res : state.task,
        loading: false,
        error: null,
      }));
    } catch (error: unknown) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to update task",
      });
      throw error;
    }
  },
}));

export { useTaskStore };
