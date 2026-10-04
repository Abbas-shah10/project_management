export type ProjectRole = "admin" | "project_admin" | "member";

export const canManageProject = (role?: ProjectRole): boolean =>
  role === "admin";
