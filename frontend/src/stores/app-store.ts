import { create } from 'zustand';
import type {
  User,
  Project,
  Task,
  ProjectMember,
  Activity,
  Note,
  TaskStatus,
} from '../lib/types';
import type { FilterState } from './types';

interface AppState {
  users: User[];
  projects: Project[];
  tasks: Task[];
  members: ProjectMember[];
  activities: Activity[];
  notes: Note[];
  currentProjectId: string | null;
  selectedTaskId: string | null;
  viewMode: 'list' | 'kanban';
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  taskDrawerOpen: boolean;
  filters: FilterState;

  setCurrentProject: (id: string | null) => void;
  setSelectedTask: (id: string | null) => void;
  setViewMode: (mode: 'list' | 'kanban') => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  openTaskDrawer: (taskId: string) => void;
  closeTaskDrawer: () => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addComment: (note: Note) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
}

const defaultFilters: FilterState = {
  assignees: [],
  priorities: [],
  tags: [],
  statuses: [],
  search: '',
};

export const useAppStore = create<AppState>((set) => ({
  users: [],
  projects: [],
  tasks: [],
  members: [],
  activities: [],
  notes: [],
  currentProjectId: null,
  selectedTaskId: null,
  viewMode: 'list',
  theme: 'light',
  sidebarOpen: true,
  taskDrawerOpen: false,
  filters: defaultFilters,

  setCurrentProject: (id) => set({ currentProjectId: id }),
  setSelectedTask: (id) => set({ selectedTaskId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      return { theme: next };
    }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openTaskDrawer: (taskId) => set({ selectedTaskId: taskId, taskDrawerOpen: true }),
  closeTaskDrawer: () => set({ taskDrawerOpen: false, selectedTaskId: null }),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  resetFilters: () => set({ filters: defaultFilters }),

  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === id ? { ...t, ...updates } : t)),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== id),
    })),

  toggleSubtask: (taskId, subtaskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((st) =>
                st._id === subtaskId
                  ? { ...st, isCompleted: !st.isCompleted }
                  : st
              ),
            }
          : t
      ),
    })),

  addComment: (note) =>
    set((state) => ({ notes: [...state.notes, note] })),

  moveTask: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === taskId ? { ...t, status: newStatus } : t
      ),
    })),
}));
