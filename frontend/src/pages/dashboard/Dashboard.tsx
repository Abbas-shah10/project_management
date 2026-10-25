import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  CircleDashed,
  Clock3,
  FolderKanban,
  ListChecks,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getAllProjects } from "../../api/projectApi";
import { fetchAllTasks } from "../../api/taskApi";
import useAuthStore from "../../stores/authStore";

interface DashboardMember {
  user?: {
    _id?: string;
    username?: string;
    fullName?: string;
    email?: string;
  };
}

interface DashboardProject {
  _id: string;
  name: string;
  description?: string;
  members?: DashboardMember[];
}

interface DashboardTask {
  _id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high" | "urgent";
  createdAt?: string;
  project: string | { _id?: string; name?: string };
}

interface DashboardData {
  projects: DashboardProject[];
  tasks: DashboardTask[];
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(date));

const statusLabel: Record<DashboardTask["status"], string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [dashboard, setDashboard] = useState<DashboardData>({
    projects: [],
    tasks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAllProjects();
        const projects: DashboardProject[] = Array.isArray(response?.projects)
          ? response.projects
          : [];
        const taskResults = await Promise.all(
          projects.map(async (project) => {
            const taskResponse = await fetchAllTasks(project._id);
            return Array.isArray(taskResponse?.tasks)
              ? taskResponse.tasks.map((task: Omit<DashboardTask, "project">) => ({
                  ...task,
                  project: { _id: project._id, name: project.name },
                }))
              : [];
          }),
        );

        if (isCurrent) {
          setDashboard({ projects, tasks: taskResults.flat() });
        }
      } catch (loadError: unknown) {
        if (isCurrent) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load dashboard statistics.",
          );
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    void loadDashboard();
    return () => {
      isCurrent = false;
    };
  }, []);

  const completedTasks = dashboard.tasks.filter(
    (task) => task.status === "done",
  ).length;
  const totalTasks = dashboard.tasks.length;
  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;
  const memberCount = useMemo(
    () =>
      new Set(
        dashboard.projects.flatMap((project) =>
          (project.members || [])
            .map((member) => member.user?._id)
            .filter((id): id is string => Boolean(id)),
        ),
      ).size,
    [dashboard.projects],
  );
  const taskCounts = {
    todo: dashboard.tasks.filter((task) => task.status === "todo").length,
    in_progress: dashboard.tasks.filter(
      (task) => task.status === "in_progress",
    ).length,
    done: completedTasks,
  };
  const recentTasks = [...dashboard.tasks]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )
    .slice(0, 5);
  const greeting = new Date().getHours() < 12 ? "morning" : "evening";

  const metrics = [
    {
      label: "Projects",
      value: dashboard.projects.length,
      icon: FolderKanban,
      tone: "text-rose-300 bg-rose-400/15",
    },
    {
      label: "Total tasks",
      value: totalTasks,
      icon: ListChecks,
      tone: "text-sky-300 bg-sky-400/15",
    },
    {
      label: "Tasks completed",
      value: completedTasks,
      icon: Check,
      tone: "text-emerald-300 bg-emerald-400/15",
    },
    {
      label: "Team members",
      value: memberCount,
      icon: Users,
      tone: "text-amber-300 bg-amber-400/15",
    },
  ];

  return (
    <div className="space-y-8 pb-8 text-slate-100">
      <section className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">
            <Sparkles size={14} />
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Good {greeting},{" "}
            <span className="text-rose-400">{user?.username || "there"}</span>.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            A live overview of your projects, tasks, and team.
          </p>
        </div>
        <Link
          to="/projects"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-rose-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-rose-950/20 transition hover:bg-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          <FolderKanban size={17} /> View projects
        </Link>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"
        >
          Could not load dashboard data: {error}
        </div>
      )}

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Workspace statistics"
        aria-busy={loading}
      >
        {metrics.map(({ label, value, icon: Icon, tone }) => (
          <article
            key={label}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/10"
          >
            <div
              className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}
            >
              <Icon size={18} />
            </div>
            <p className="text-sm text-slate-400">{label}</p>
            <strong className="mt-1 block text-3xl font-semibold text-white">
              {loading || error ? "—" : value}
            </strong>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Task progress
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">
            Overall completion
          </h2>
          <div className="mt-7 flex items-center gap-6">
            <div
              className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full sm:h-32 sm:w-32"
              style={{
                background: `conic-gradient(#fb7185 ${completionRate}%, #1e293b 0)`,
              }}
              role="img"
              aria-label={`${completionRate}% of tasks completed`}
            >
              <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-slate-900 sm:h-24 sm:w-24">
                <span className="text-2xl font-semibold text-white">
                  {loading || error ? "—" : `${completionRate}%`}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500">
                  complete
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-400">
                {loading
                  ? "Loading task progress…"
                  : error
                    ? "Task progress is unavailable."
                    : `${completedTasks} of ${totalTasks} tasks completed`}
              </p>
              <div className="mt-4 space-y-3">
                {(["todo", "in_progress", "done"] as const).map((status) => (
                  <div key={status}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-slate-400">{statusLabel[status]}</span>
                      <span className="text-slate-300">
                        {loading || error ? "—" : taskCounts[status]}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <span
                        className={`block h-full rounded-full ${status === "done" ? "bg-emerald-400" : status === "in_progress" ? "bg-amber-300" : "bg-slate-500"}`}
                        style={{
                          width: `${totalTasks ? (taskCounts[status] / totalTasks) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Portfolio
              </p>
              <h2 className="mt-2 text-lg font-semibold text-white">
                Your projects
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-300 hover:text-rose-200"
            >
              View all <ArrowUpRight size={15} />
            </Link>
          </div>
          {loading ? (
            <p className="mt-6 text-sm text-slate-500">Loading projects…</p>
          ) : error ? (
            <p className="mt-6 text-sm text-slate-500">
              Project statistics are unavailable.
            </p>
          ) : dashboard.projects.length ? (
            <div className="mt-5 divide-y divide-slate-800">
              {dashboard.projects.slice(0, 5).map((project) => {
                const projectTasks = dashboard.tasks.filter((task) => {
                  const projectId =
                    typeof task.project === "string"
                      ? task.project
                      : task.project?._id;
                  return projectId === project._id;
                });
                const done = projectTasks.filter(
                  (task) => task.status === "done",
                ).length;
                const progress = projectTasks.length
                  ? Math.round((done / projectTasks.length) * 100)
                  : 0;

                return (
                  <Link
                    key={project._id}
                    to={`/projects/${project._id}`}
                    className="grid gap-2 py-4 sm:grid-cols-[1.2fr_1fr_auto] sm:items-center sm:gap-4"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-400/15 text-rose-300">
                        <FolderKanban size={16} />
                      </span>
                      <span className="truncate text-sm font-medium text-slate-200">
                        {project.name}
                      </span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                        <span
                          className="block h-full rounded-full bg-rose-400"
                          style={{ width: `${progress}%` }}
                        />
                      </span>
                      <span className="text-xs font-semibold text-slate-300">
                        {progress}%
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <CircleDashed size={13} />
                      {projectTasks.length} tasks
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-5 text-center">
              <p className="text-sm text-slate-300">No projects yet</p>
              <Link
                to="/projects"
                className="mt-2 inline-block text-xs font-semibold text-rose-300 hover:text-rose-200"
              >
                Create your first project
              </Link>
            </div>
          )}
        </article>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Recently added
            </p>
            <h2 className="mt-2 text-lg font-semibold text-white">
              Latest tasks
            </h2>
          </div>
          <Clock3 size={18} className="text-slate-500" />
        </div>
        {loading ? (
          <p className="mt-5 text-sm text-slate-500">Loading tasks…</p>
        ) : recentTasks.length ? (
          <div className="mt-4 divide-y divide-slate-800">
            {recentTasks.map((task) => {
              const project =
                typeof task.project === "string"
                  ? dashboard.projects.find((item) => item._id === task.project)
                  : task.project;
              return (
                <div
                  key={task._id}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-200">
                      {task.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {project?.name || "Project"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                      {statusLabel[task.status]}
                    </span>
                    {task.createdAt && (
                      <span className="text-xs text-slate-500">
                        {formatDate(task.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-500">
            {error ? "Task statistics are unavailable." : "No tasks to show yet."}
          </p>
        )}
      </section>

      {!loading && !error && (
        <div className="flex items-center gap-2 text-xs text-emerald-300">
          <Check size={15} /> Statistics are up to date
        </div>
      )}
    </div>
  );
};

export default Dashboard;
