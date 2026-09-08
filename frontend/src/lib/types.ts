export type TaskStatus = "todo" | "in_progress" | "done";
export type UserRole = "admin" | "project_admin" | "member";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  project: string;
  assignedTo: User | null;
  status: TaskStatus;
  priority: Priority;
  tags: string[];
  dueDate: string | null;
  attachments: Attachment[];
  subtasks: SubTask[];
  createdAt: string;
  updatedAt: string;
}

export interface SubTask {
  _id: string;
  title: string;
  task: string;
  isCompleted: boolean;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  _id: string;
  project: string;
  createdBy: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  _id: string;
  user: User;
  project: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  url: string;
  mimeType: string;
  size: number;
}

export interface Activity {
  _id: string;
  type:
    | "task_created"
    | "task_completed"
    | "task_updated"
    | "member_added"
    | "comment_added"
    | "project_created";
  user: User;
  description: string;
  project: string;
  projectName: string;
  createdAt: string;
}

export interface FilterState {
  assignees: string[];
  priorities: string[];
  tags: string[];
  statuses: string[];
  search: string;
}
