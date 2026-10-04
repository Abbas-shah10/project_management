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

export const deleteTask = async (taskId: string, projectId: string) => {
  const { data } = await api.delete(`/tasks/${taskId}`, {
    data: {
      projectId,
    },
  });
  return data.data;
};

interface UpdateTaskParams {
  taskId: string;
  projectId?: string;
  title?: string;
  description?: string;
  assignedTo?: string;
  status?: "todo" | "in_progress" | "done";
  removeAttachments?: string[];
}

export const updateTask = async ({
  taskId,
  projectId,
  title,
  description,
  assignedTo,
  status,
  removeAttachments,
}: UpdateTaskParams) => {
  const { data } = await api.put(`/tasks/${taskId}`, {
    projectId,
    title,
    description,
    assignedTo,
    status,
    removeAttachments,
  });
  return data.data;
};
