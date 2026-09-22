import api from "./axios";

export const getAllProjects = async () => {
  const { data } = await api.get("/projects");
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
