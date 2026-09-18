import api from "./axios";

export const getAllProjects = async () => {
  const { data } = await api.get("/projects");
  return data;
};
