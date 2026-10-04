import api from "./axios";

export const fetchAllTasks = async () => {
  const { data } = await api.get("/tasks");
  return data.data;
};

export const fetchTaskById = async (taskId: string) => {
  const { data } = await api.get(`/tasks/${taskId}`);
  return data.data;
};

export const createTask = async (
  title: string,
  description: string,
  assignedTo: string,
  status: "todo" | "in_progress" | "done",
) => {
  const { data } = await api.post("/tasks", {
    title,
    description,
    assignedTo,
    status,
  });
  return data.data;
};
