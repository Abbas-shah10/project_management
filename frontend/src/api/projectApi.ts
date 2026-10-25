import api from "./axios";

export interface ProjectSummary {
  _id: string;
  name: string;
  description?: string;
  currentUserRole?: "member" | "admin" | "project_admin";
  members?: Array<{
    _id?: string;
    role?: "member" | "admin" | "project_admin";
    user?: {
      _id?: string;
      username?: string;
      fullName?: string;
      email?: string;
      avatar?: string;
    };
  }>;
}

export const getAllProjects = async (): Promise<{
  projects: ProjectSummary[];
}> => {
  const { data } = await api.get<{ data: { projects: ProjectSummary[] } }>(
    "/projects",
  );
  return data.data;
};

export const createProject = async (name: string, description: string) => {
  const { data } = await api.post("/projects", { name, description });
  return data.data;
};

export const deleteProject = async (projectId: string) => {
  const { data } = await api.delete(`/projects/${projectId}`);
  return data.data;
};

export const updateProject = async (
  projectId: string,
  payload: { name: string; description: string },
) => {
  const { data } = await api.put(`/projects/${projectId}`, payload);
  return data.data;
};

export const getProjectById = async (id: string) => {
  const { data } = await api.get(`/projects/${id}`);
  return data.data;
};

export const addMembersToProject = async (
  projectId: string,
  email: string,
  role: "member" | "admin" | "project_admin",
) => {
  const { data } = await api.post(`/projects/${projectId}/members`, {
    email,
    role,
  });
  return data.data;
};

export const deleteMember = async (projectId: string, userId: string) => {
  const { data } = await api.delete(`/projects/${projectId}/members/${userId}`);
  return data.data;
};

export const updateMemberRoles = async (
  projectId: string,
  userId: string,
  role: "member" | "admin" | "project_admin",
) => {
  const { data } = await api.put(`/projects/${projectId}/members/${userId}`, {
    role,
  });
  return data.data;
};
