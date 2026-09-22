import api from "./axios";

export const getAllProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

export const createProject = async (name: string, description: string) => {
  const { data } = await api.post("/projects", { name, description });
  return data.data;
};

export const deleteProject = async (projectId: string) => {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
};

export const updateProject = async (
  projectId: string,
  payload: { name: string; description: string },
) => {
  const response = await api.put(`/projects/${projectId}`, payload);
  return response.data;
};

export const getProjectById = async (id: string) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};
