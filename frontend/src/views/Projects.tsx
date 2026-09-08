import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  List,
  LayoutGrid,
  Filter,
} from "lucide-react";
import { useAppStore } from "../stores/app-store";
import { ProjectCard } from "../components/project/ProjectCard";
import { ListView } from "../components/project/ListView";
import { KanbanBoard } from "../components/project/KanbanBoard";
import { FiltersPane } from "../components/project/FiltersPane";

export default function Projects() {
  const { projectId } = useParams<{ projectId?: string }>();
  const navigate = useNavigate();

  const projects = useAppStore((s) => s.projects);
  const tasks = useAppStore((s) => s.tasks);
  const members = useAppStore((s) => s.members);
  const viewMode = useAppStore((s) => s.viewMode);
  const setViewMode = useAppStore((s) => s.setViewMode);
  const openTaskDrawer = useAppStore((s) => s.openTaskDrawer);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentProject = useMemo(
    () => projects.find((p) => p._id === projectId),
    [projects, projectId]
  );

  const projectTasks = useMemo(
    () => (projectId ? tasks.filter((t) => t.project === projectId) : []),
    [tasks, projectId]
  );

  const projectMembers = useMemo(
    () => (projectId ? members.filter((m) => m.project === projectId) : []),
    [members, projectId]
  );

  if (!projectId) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            Projects
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage your projects
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="bg-[var(--bg-secondary)] rounded-lg p-12 text-center">
            <p className="text-[var(--text-tertiary)]">No projects yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                tasks={tasks.filter((t) => t.project === project._id)}
                members={members.filter((m) => m.project === project._id)}
                onClick={() => navigate(`/projects/${project._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-[var(--bg-secondary)] rounded-lg p-12 text-center">
          <p className="text-[var(--text-tertiary)]">Project not found</p>
          <button
            onClick={() => navigate("/projects")}
            className="mt-3 text-sm text-[var(--accent-primary)] hover:underline"
          >
            Back to projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate("/projects")}
            className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-2"
          >
            <ArrowLeft size={14} />
            Projects
          </button>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            {currentProject.name}
          </h1>
          {currentProject.description && (
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {currentProject.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className={`p-2 rounded-md border transition-colors ${
              filtersOpen
                ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            <Filter size={16} />
          </button>
          <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${
                viewMode === "list"
                  ? "bg-[var(--accent-primary)] text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-2 transition-colors ${
                viewMode === "kanban"
                  ? "bg-[var(--accent-primary)] text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      <FiltersPane
        projectId={projectId}
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      {viewMode === "list" ? (
        <ListView
          projectId={projectId}
          onTaskClick={(taskId) => openTaskDrawer(taskId)}
        />
      ) : (
        <KanbanBoard
          projectId={projectId}
          onTaskClick={(taskId) => openTaskDrawer(taskId)}
        />
      )}
    </div>
  );
}
