import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  CalendarDays,
  ChevronDown,
  CircleDashed,
  FolderKanban,
  Grid2X2,
  List,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import useProjectStore from "../../stores/projectStore";
import CreateProjectModal from "./CreateProject";
import EditProject from "./EditProject";
import AddMembersToProject from "./AddMembersToProject";

type ProjectStatus = "On track" | "At risk" | "Completed";

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  due: string;
  dueLabel: string;
  tasks: string;
  team: string;
  members: string[];
  color: string;
}

const statusOptions = [
  "All projects",
  "On track",
  "At risk",
  "Completed",
] as const;

const colorStyles: Record<string, { icon: string; bar: string; wash: string }> =
  {
    rose: {
      icon: "bg-rose-400/15 text-rose-300",
      bar: "bg-rose-400",
      wash: "bg-rose-400/5",
    },
    lime: {
      icon: "bg-lime-400/15 text-lime-300",
      bar: "bg-lime-300",
      wash: "bg-lime-400/5",
    },
    sky: {
      icon: "bg-sky-400/15 text-sky-300",
      bar: "bg-sky-300",
      wash: "bg-sky-400/5",
    },
    violet: {
      icon: "bg-violet-400/15 text-violet-300",
      bar: "bg-violet-300",
      wash: "bg-violet-400/5",
    },
  };

function statusStyle(status: ProjectStatus) {
  if (status === "Completed") return "bg-sky-400/10 text-sky-300";
  if (status === "At risk") return "bg-amber-400/10 text-amber-300";
  return "bg-emerald-400/10 text-emerald-300";
}

function ProjectCard({
  project,
  deleteProjectById,
  updateProjectById,
}: {
  project: Project;
  deleteProjectById: (projectId: string) => Promise<void>;
  updateProjectById: (
    projectId: string,
    payload: { name: string; description: string },
  ) => Promise<void>;
}) {
  const colors = colorStyles[project.color];
  const [openOptions, setOpenOptions] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [addMembersOpen, setAddMembersOpen] = useState(false);

  return (
    <>
      <article className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/10 transition hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors?.icon}`}
          >
            <FolderKanban size={20} />
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenOptions((isOpen) => !isOpen)}
              className={`rounded-xl p-2 text-slate-600 transition hover:bg-slate-800 hover:text-white ${openOptions ? "bg-slate-800 text-white" : ""}`}
              aria-label={`More options for ${project.name}`}
              aria-expanded={openOptions}
              aria-haspopup="menu"
            >
              <MoreHorizontal size={19} />
            </button>

            <div
              className={`absolute right-0 top-full z-20 mt-2 w-52 origin-top-right rounded-2xl border border-slate-700/80 bg-slate-900/95 p-1.5 shadow-2xl shadow-slate-950/50 backdrop-blur-xl transition-all duration-200 ease-out ${
                openOptions
                  ? "translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none -translate-y-2 scale-95 opacity-0"
              }`}
              role="menu"
              aria-hidden={!openOptions}
            >
              <p className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Project actions
              </p>
              <button
                type="button"
                onClick={() => setOpenEdit(true)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-slate-800 hover:text-white"
                role="menuitem"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-400/10 text-sky-300">
                  <Pencil size={14} />
                </span>
                <span>Edit project</span>
              </button>
              <button
                type="button"
                onClick={() => setAddMembersOpen(true)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-green-300 transition hover:bg-green-400/10 hover:text-green-200"
                role="menuitem"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-400/10 text-rose-300">
                  <Plus size={14} />
                </span>
                <span>Add Members</span>
              </button>
              <button
                type="button"
                onClick={() => deleteProjectById(project._id)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-rose-300 transition hover:bg-rose-400/10 hover:text-rose-200"
                role="menuitem"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-400/10 text-rose-300">
                  <Trash2 size={14} />
                </span>
                <span>Delete project</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="wrap-break-word text-base font-semibold text-white">
              {project.name}
            </h2>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusStyle(project.status)}`}
            >
              <CircleDashed size={11} /> {project.status}
            </span>
          </div>
          <p className="mt-2 min-h-10 wrap-break-word text-sm leading-5 text-slate-500">
            {project.description}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs">
          <span className="text-slate-500">Progress</span>
          <span className="font-semibold text-slate-200">
            {project.progress}%
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
          <span
            className={`block h-full rounded-full ${colors?.bar}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>

        <div className="mt-5 flex min-w-0 items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <div className="flex min-w-0 max-w-[70%] -space-x-2 overflow-hidden">
            {project.members?.map((member, index) => (
              <span
                key={member}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-900 text-[10px] font-bold ${index % 2 === 0 ? "bg-slate-700 text-slate-200" : "bg-slate-800 text-slate-400"}`}
              >
                {member}
              </span>
            ))}
          </div>
          <span className="shrink-0 text-right text-xs text-slate-500">
            {project.tasks}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <CalendarDays size={14} /> Due {project.dueLabel}
        </div>
      </article>

      {openEdit && (
        <EditProject
          project={project}
          onClose={() => setOpenEdit(false)}
          onUpdated={updateProjectById}
        />
      )}

      {addMembersOpen && (
        <AddMembersToProject
          project={project}
          onClose={() => setAddMembersOpen(false)}
        />
      )}
    </>
  );
}

const Projects = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] =
    useState<(typeof statusOptions)[number]>("All projects");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { projects, fetchProjects, deleteProjectById, updateProjectById } =
    useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  console.log("Projects: ", projects);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesQuery =
        !normalizedQuery ||
        `${project.name} ${project?.team || "No team"}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesStatus =
        status === "All projects" || project?.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [projects, query, status]);

  return (
    <div className="space-y-8 pb-8 text-slate-100">
      <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">
            Portfolio
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Projects<span className="text-rose-400">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Keep every initiative moving, from the first idea to the final
            checkmark.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-rose-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-rose-950/20 transition hover:bg-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <Plus size={17} /> New project
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-500">Total projects</p>
          <strong className="mt-2 block text-2xl text-white">
            {projects?.length}
          </strong>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-500">On track</p>
          <strong className="mt-2 block text-2xl text-emerald-300">
            {
              projects?.filter((project) => project?.status === "On track")
                .length
            }
          </strong>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-500">Needs attention</p>
          <strong className="mt-2 block text-2xl text-amber-300">
            {
              projects?.filter((project) => project?.status === "At risk")
                ?.length
            }
          </strong>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
            size={16}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects or teams"
            className="h-10 w-full rounded-xl border border-slate-800 bg-slate-950/60 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-rose-400/60"
          />
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <SlidersHorizontal size={16} className="mr-1 text-slate-600" />
          <div className="relative">
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as (typeof statusOptions)[number])
              }
              className="h-10 max-w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/60 py-2 pl-3 pr-8 text-xs font-medium text-slate-300 outline-none focus:border-rose-400/60"
            >
              {statusOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600"
              size={14}
            />
          </div>
          <div className="flex h-10 rounded-xl border border-slate-800 bg-slate-950/60 p-1">
            <button
              onClick={() => setView("grid")}
              className={`rounded-lg px-2.5 ${view === "grid" ? "bg-slate-800 text-white" : "text-slate-600 hover:text-slate-300"}`}
              aria-label="Grid view"
            >
              <Grid2X2 size={16} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded-lg px-2.5 ${view === "list" ? "bg-slate-800 text-white" : "text-slate-600 hover:text-slate-300"}`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </section>

      {filteredProjects?.length > 0 ? (
        <section
          className={
            view === "grid" ? "grid gap-4 md:grid-cols-2" : "space-y-3"
          }
        >
          {filteredProjects?.map((project) => (
            <ProjectCard
              key={project.name}
              project={project}
              deleteProjectById={deleteProjectById}
              updateProjectById={updateProjectById}
            />
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-800 py-20 text-center">
          <Archive className="mx-auto text-slate-700" size={32} />
          <h2 className="mt-4 text-base font-semibold text-white">
            No projects found
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Try a different search or status filter.
          </p>
        </section>
      )}

      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={fetchProjects}
      />
    </div>
  );
};

export default Projects;
