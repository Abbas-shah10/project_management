import api from "./axios";

export const getAllProjects = async () => {
  const { data } = await api.get("/projects");
  return data.data;
};

export const createProject = async (name: string, description: string) => {
  const { data } = await api.post("/projects", { name, description });
  return data.data;
};
