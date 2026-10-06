import api from "./axios";

export const fetchAllTasks = async (projectId: string) => {
  const { data } = await api.get(`/tasks/projects/${projectId}`);
  return data.data;
};

export const fetchTaskById = async (taskId: string, projectId: string) => {
  const { data } = await api.get(`/projects/${projectId}/${taskId}`);
  return data.data;
};

export const createTask = async (
  title: string,
  description: string,
  status: "todo" | "in_progress" | "done",
  assignedTo: string,
  projectId: string,
) => {
  const { data } = await api.post(`/projects/${projectId}`, {
    title,
    description,
    assignedTo,
    status,
  });
  return data.data;
};

export const deleteTask = async (taskId: string, projectId: string) => {
  const { data } = await api.delete(`/projects/${projectId}/${taskId}`, {
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
  const { data } = await api.put(`/projects/${projectId}/${taskId}`, {
    title,
    description,
    assignedTo,
    status,
    removeAttachments,
  });
  return data.data;
};
