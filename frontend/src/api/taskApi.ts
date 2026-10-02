import api from "./axios";

export const fetchAllTasks = async () => {
  const { data } = await api.get("/tasks");
  return data.data;
};

export const fetchTaskById = async (taskId: string) => {
  const { data } = await api.get(`/tasks/${taskId}`);
  return data.data;
};
