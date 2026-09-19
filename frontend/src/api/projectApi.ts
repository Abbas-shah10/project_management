import api from "./axios";

export const getAllProjects = async () => {
  const { data } = await api.get("/projects");
  return data.data;
};

export const createProject = async (name: string, description: string) => {
  const { data } = await api.post("/projects", { name, description });
  return data.data;
};

export const deleteProject = async (projectId: number) => {
  const response = await api.delete(`/api/projects/${projectId}`);
  return response.data;
};
