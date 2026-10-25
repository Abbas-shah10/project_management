import api from "./axios";

export interface TaskApiSubTask {
  _id: string;
  title: string;
  isCompleted: boolean;
  createdBy?: string | { _id?: string; username?: string };
}

export interface TaskApiRecord {
  _id: string;
  title: string;
  description?: string;
  project: string | { _id?: string; name?: string };
  assignedTo?: {
    _id?: string;
    username?: string;
    fullName?: string;
  } | null;
  status: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  createdAt?: string;
  createdBy?: string | { _id?: string; username?: string };
  subTasks?: TaskApiSubTask[];
}

export const fetchAllTasks = async (
  projectId: string,
): Promise<{ tasks: TaskApiRecord[] }> => {
  const { data } = await api.get<{ data: { tasks: TaskApiRecord[] } }>(
    `/tasks/projects/${projectId}`,
  );
  return data.data;
};

export const fetchTaskById = async (
  taskId: string,
  projectId: string,
): Promise<TaskApiRecord> => {
  const { data } = await api.get<{ data: TaskApiRecord }>(
    `/tasks/projects/${projectId}/${taskId}`,
  );
  return data.data;
};

export const createTask = async (
  title: string,
  description: string,
  status: "todo" | "in_progress" | "done",
  assignedTo: string,
  projectId: string,
  priority: "low" | "medium" | "high" | "urgent" = "medium",
  dueDate?: string,
): Promise<TaskApiRecord> => {
  const { data } = await api.post<{ data: TaskApiRecord }>(
    `/tasks/projects/${projectId}`,
    {
      title,
      description,
      status,
      priority,
      ...(assignedTo ? { assignedTo } : {}),
      ...(dueDate ? { dueDate } : {}),
    },
  );
  return data.data;
};

export const deleteTask = async (
  taskId: string,
  projectId: string,
): Promise<null> => {
  const { data } = await api.delete<{ data: null }>(
    `/tasks/projects/${projectId}/${taskId}`,
  );
  return data.data;
};

interface UpdateTaskParams {
  taskId: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: string;
  status: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  removeAttachments?: string[];
}

export const updateTask = async ({
  taskId,
  projectId,
  title,
  description,
  assignedTo,
  status,
  priority,
  dueDate,
  removeAttachments,
}: UpdateTaskParams): Promise<TaskApiRecord> => {
  const { data } = await api.put<{ data: TaskApiRecord }>(
    `/tasks/projects/${projectId}/${taskId}`,
    {
      title,
      description,
      assignedTo: assignedTo || "",
      status,
      priority,
      dueDate: dueDate || null,
      removeAttachments,
    },
  );
  return data.data;
};

export const createSubTask = async (
  projectId: string,
  taskId: string,
  title: string,
): Promise<TaskApiSubTask> => {
  const { data } = await api.post<{ data: TaskApiSubTask }>(
    `/tasks/projects/${projectId}/${taskId}/subtasks`,
    { title },
  );
  return data.data;
};

export const updateSubTask = async (
  projectId: string,
  subTaskId: string,
  isCompleted: boolean,
) => {
  const { data } = await api.put<{ data: TaskApiSubTask }>(
    `/tasks/projects/${projectId}/subtasks/${subTaskId}`,
    { isCompleted },
  );
  return data.data;
};

export const deleteSubTask = async (projectId: string, subTaskId: string) => {
  const { data } = await api.delete<{ data: null }>(
    `/tasks/projects/${projectId}/subtasks/${subTaskId}`,
  );
  return data.data;
};
