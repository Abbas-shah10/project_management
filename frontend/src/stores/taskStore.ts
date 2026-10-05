import { create } from "zustand";

interface TaskState {
  tasks: null | [];
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
