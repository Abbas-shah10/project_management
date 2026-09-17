import { useMemo, useState } from "react";
import {
  Archive,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDashed,
  FolderKanban,
  Grid2X2,
  List,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

type ProjectStatus = "On track" | "At risk" | "Completed";

interface Project {
  id: number;
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

const initialProjects: Project[] = [
  {
    id: 1,
    name: "Website redesign",
    description: "A clearer, faster experience for every customer.",
    status: "On track",
    progress: 72,
    due: "2026-09-28",
    dueLabel: "Sep 28, 2026",
    tasks: "36 / 50 tasks",
    team: "Design team",
    members: ["MC", "LP", "AR"],
    color: "rose",
  },
  {
    id: 2,
    name: "Mobile app launch",
    description: "Bring the new mobile experience to the world.",
    status: "At risk",
    progress: 48,
    due: "2026-10-04",
    dueLabel: "Oct 04, 2026",
    tasks: "18 / 38 tasks",
    team: "Product team",
    members: ["AK", "JP", "SN", "RM"],
    color: "lime",
  },
  {
    id: 3,
    name: "Q4 marketing campaign",
    description: "Build momentum with a campaign people remember.",
    status: "On track",
    progress: 86,
    due: "2026-09-24",
    dueLabel: "Sep 24, 2026",
    tasks: "43 / 50 tasks",
    team: "Growth team",
    members: ["MC", "TD", "EW"],
    color: "sky",
  },
  {
    id: 4,
    name: "Design system refresh",
    description: "One thoughtful visual language for the whole product.",
    status: "Completed",
    progress: 100,
    due: "2026-09-12",
    dueLabel: "Sep 12, 2026",
    tasks: "24 / 24 tasks",
    team: "Design team",
    members: ["AR", "LP"],
    color: "violet",
  },
];

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
  onMenu,
}: {
  project: Project;
  onMenu: () => void;
}) {
  const colors = colorStyles[project.color];

  return (
    <article className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/10 transition hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors.icon}`}
        >
          <FolderKanban size={20} />
        </div>
        <button
          onClick={onMenu}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-800 hover:text-white"
          aria-label={`More options for ${project.name}`}
        >
          <MoreHorizontal size={19} />
        </button>
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold text-white">{project.name}</h2>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusStyle(project.status)}`}
          >
            <CircleDashed size={11} /> {project.status}
          </span>
        </div>
        <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
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
          className={`block h-full rounded-full ${colors.bar}`}
          style={{ width: `${project.progress}%` }}
        />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
        <div className="flex -space-x-2">
          {project.members.map((member, index) => (
            <span
              key={member}
              className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 text-[10px] font-bold ${index % 2 === 0 ? "bg-slate-700 text-slate-200" : "bg-slate-800 text-slate-400"}`}
            >
              {member}
            </span>
          ))}
        </div>
        <span className="text-xs text-slate-500">{project.tasks}</span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <CalendarDays size={14} /> Due {project.dueLabel}
      </div>
    </article>
  );
}

const Projects = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [query, setQuery] = useState("");
  const [status, setStatus] =
    useState<(typeof statusOptions)[number]>("All projects");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesQuery =
        !normalizedQuery ||
        `${project.name} ${project.team}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesStatus =
        status === "All projects" || project.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [projects, query, status]);

  const createProject = () => {
    const name = newProjectName.trim();
    if (!name) return;
    setProjects((current) => [
      {
        id: Date.now(),
        name,
        description: "A new project ready for your next big idea.",
        status: "On track",
        progress: 0,
        due: "2026-10-31",
        dueLabel: "Oct 31, 2026",
        tasks: "0 / 0 tasks",
        team: "Unassigned team",
        members: ["AK"],
        color: "rose",
      },
      ...current,
    ]);
    setNewProjectName("");
    setIsCreateOpen(false);
  };

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
            {projects.length}
          </strong>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-500">On track</p>
          <strong className="mt-2 block text-2xl text-emerald-300">
            {projects.filter((project) => project.status === "On track").length}
          </strong>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-500">Needs attention</p>
          <strong className="mt-2 block text-2xl text-amber-300">
            {projects.filter((project) => project.status === "At risk").length}
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
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal size={16} className="mr-1 text-slate-600" />
          <div className="relative">
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as (typeof statusOptions)[number])
              }
              className="h-10 appearance-none rounded-xl border border-slate-800 bg-slate-950/60 py-2 pl-3 pr-8 text-xs font-medium text-slate-300 outline-none focus:border-rose-400/60"
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

      {filteredProjects.length > 0 ? (
        <section
          className={
            view === "grid" ? "grid gap-4 md:grid-cols-2" : "space-y-3"
          }
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onMenu={() => undefined}
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

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
                  New project
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  Start something meaningful
                </h2>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <label
              className="mt-6 block text-xs font-medium text-slate-400"
              htmlFor="project-name"
            >
              Project name
            </label>
            <input
              id="project-name"
              autoFocus
              value={newProjectName}
              onChange={(event) => setNewProjectName(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && createProject()}
              placeholder="e.g. Customer portal"
              className="mt-2 h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-rose-400"
            />
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-rose-300"
              >
                <Check size={16} /> Create project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
