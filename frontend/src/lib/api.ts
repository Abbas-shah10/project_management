import type {
  User,
  Project,
  Task,
  SubTask,
  Note,
  ProjectMember,
  TaskStatus,
} from "./types";
import { useAppStore } from "../stores/app-store";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const authApi = {
  async login(
    email: string,
    _password: string
  ): Promise<{ user: User; token: string }> {
    await delay();
    const users = useAppStore.getState().users;
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error("Invalid email or password");
    return { user, token: `mock-token-${user._id}` };
  },

  async register(
    username: string,
    email: string,
    fullName: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    await delay();
    const user: User = {
      _id: generateId(),
      username,
      email,
      fullName,
      isEmailVerified: false,
      createdAt: now(),
      updatedAt: now(),
    };
    useAppStore.setState((state) => ({ users: [...state.users, user] }));
    return { user, token: `mock-token-${user._id}` };
  },

  async getCurrentUser(): Promise<User> {
    await delay(100);
    const users = useAppStore.getState().users;
    return users[0];
  },

  async logout(): Promise<void> {
    await delay(100);
  },
};

export const projectApi = {
  async getProjects(): Promise<Project[]> {
    await delay(200);
    return useAppStore.getState().projects;
  },

  async getProjectById(id: string): Promise<Project | undefined> {
    await delay(150);
    return useAppStore.getState().projects.find((p) => p._id === id);
  },

  async createProject(
    name: string,
    description: string,
    createdBy: User
  ): Promise<Project> {
    await delay(300);
    const project: Project = {
      _id: generateId(),
      name,
      description,
      createdBy,
      createdAt: now(),
      updatedAt: now(),
    };
    useAppStore.setState((state) => ({
      projects: [...state.projects, project],
    }));
    return project;
  },

  async updateProject(
    id: string,
    updates: Partial<Pick<Project, "name" | "description">>
  ): Promise<Project> {
    await delay(250);
    let updated!: Project;
    useAppStore.setState((state) => ({
      projects: state.projects.map((p) => {
        if (p._id === id) {
          updated = { ...p, ...updates, updatedAt: now() };
          return updated;
        }
        return p;
      }),
    }));
    return updated;
  },

  async deleteProject(id: string): Promise<void> {
    await delay(200);
    useAppStore.setState((state) => ({
      projects: state.projects.filter((p) => p._id !== id),
      tasks: state.tasks.filter((t) => t.project !== id),
      members: state.members.filter((m) => m.project !== id),
      notes: state.notes.filter((n) => n.project !== id),
      activities: state.activities.filter((a) => a.project !== id),
    }));
  },

  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    await delay(150);
    return useAppStore
      .getState()
      .members.filter((m) => m.project === projectId);
  },

  async addMember(
    projectId: string,
    userId: string,
    role: ProjectMember["role"]
  ): Promise<ProjectMember> {
    await delay(300);
    const users = useAppStore.getState().users;
    const user = users.find((u) => u._id === userId);
    if (!user) throw new Error("User not found");

    const member: ProjectMember = {
      _id: generateId(),
      user,
      project: projectId,
      role,
      createdAt: now(),
      updatedAt: now(),
    };
    useAppStore.setState((state) => ({
      members: [...state.members, member],
    }));
    return member;
  },

  async removeMember(memberId: string): Promise<void> {
    await delay(200);
    useAppStore.setState((state) => ({
      members: state.members.filter((m) => m._id !== memberId),
    }));
  },
};

export const taskApi = {
  async getTasksByProject(projectId: string): Promise<Task[]> {
    await delay(200);
    return useAppStore
      .getState()
      .tasks.filter((t) => t.project === projectId);
  },

  async getTaskById(id: string): Promise<Task | undefined> {
    await delay(150);
    return useAppStore.getState().tasks.find((t) => t._id === id);
  },

  async createTask(
    taskData: Omit<Task, "_id" | "createdAt" | "updatedAt">
  ): Promise<Task> {
    await delay(300);
    const task: Task = {
      ...taskData,
      _id: generateId(),
      createdAt: now(),
      updatedAt: now(),
    };
    useAppStore.setState((state) => ({
      tasks: [...state.tasks, task],
    }));
    return task;
  },

  async updateTask(
    id: string,
    updates: Partial<Task>
  ): Promise<Task> {
    await delay(250);
    let updated!: Task;
    useAppStore.setState((state) => ({
      tasks: state.tasks.map((t) => {
        if (t._id === id) {
          updated = { ...t, ...updates, updatedAt: now() };
          return updated;
        }
        return t;
      }),
    }));
    return updated;
  },

  async deleteTask(id: string): Promise<void> {
    await delay(200);
    useAppStore.setState((state) => ({
      tasks: state.tasks.filter((t) => t._id !== id),
    }));
  },

  async moveTask(id: string, newStatus: TaskStatus): Promise<Task> {
    await delay(200);
    let updated!: Task;
    useAppStore.setState((state) => ({
      tasks: state.tasks.map((t) => {
        if (t._id === id) {
          updated = { ...t, status: newStatus, updatedAt: now() };
          return updated;
        }
        return t;
      }),
    }));
    return updated;
  },
};

export const subtaskApi = {
  async createSubtask(
    taskId: string,
    title: string,
    createdBy: User
  ): Promise<SubTask> {
    await delay(250);
    const subtask: SubTask = {
      _id: generateId(),
      title,
      task: taskId,
      isCompleted: false,
      createdBy,
      createdAt: now(),
      updatedAt: now(),
    };
    useAppStore.setState((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === taskId
          ? { ...t, subtasks: [...t.subtasks, subtask] }
          : t
      ),
    }));
    return subtask;
  },

  async toggleSubtask(
    taskId: string,
    subtaskId: string
  ): Promise<SubTask> {
    await delay(150);
    let toggled!: SubTask;
    useAppStore.setState((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((st) => {
                if (st._id === subtaskId) {
                  toggled = { ...st, isCompleted: !st.isCompleted };
                  return toggled;
                }
                return st;
              }),
            }
          : t
      ),
    }));
    return toggled;
  },

  async deleteSubtask(taskId: string, subtaskId: string): Promise<void> {
    await delay(200);
    useAppStore.setState((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.filter((st) => st._id !== subtaskId),
            }
          : t
      ),
    }));
  },
};

export const noteApi = {
  async getNotesByProject(projectId: string): Promise<Note[]> {
    await delay(150);
    return useAppStore
      .getState()
      .notes.filter((n) => n.project === projectId);
  },

  async createNote(
    projectId: string,
    content: string,
    createdBy: User
  ): Promise<Note> {
    await delay(250);
    const note: Note = {
      _id: generateId(),
      project: projectId,
      createdBy,
      content,
      createdAt: now(),
      updatedAt: now(),
    };
    useAppStore.setState((state) => ({
      notes: [...state.notes, note],
    }));
    return note;
  },
};
