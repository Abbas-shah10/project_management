import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDashed,
  Clock3,
  FolderKanban,
  ListChecks,
  MoreHorizontal,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import useAuthStore from "../stores/authStore";

const projects = [
  {
    name: "Website redesign",
    team: "Design team",
    progress: 72,
    status: "On track",
    color: "coral",
    due: "Sep 28",
  },
  {
    name: "Mobile app launch",
    team: "Product team",
    progress: 48,
    status: "At risk",
    color: "lime",
    due: "Oct 04",
  },
  {
    name: "Q4 marketing campaign",
    team: "Growth team",
    progress: 86,
    status: "On track",
    color: "sky",
    due: "Sep 24",
  },
];

const activity = [
  {
    person: "Maya Chen",
    action: "completed Homepage wireframes",
    time: "12 min ago",
    initials: "MC",
    tone: "coral",
  },
  {
    person: "Leo Park",
    action: "commented on Mobile app launch",
    time: "48 min ago",
    initials: "LP",
    tone: "lime",
  },
  {
    person: "You",
    action: "created a new task in Website redesign",
    time: "2 hrs ago",
    initials: "AK",
    tone: "sky",
  },
];

function ProgressRing({ value }: { value: number }) {
  return (
    <div
      className="relative flex h-36 w-36 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(#fb7185 ${value}%, #334155 0)`,
      }}
    >
      <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-slate-900">
        <span className="text-3xl font-semibold tracking-tight text-white">
          {value}%
        </span>
        <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
          done
        </span>
      </div>
    </div>
  );
}

const Home = () => {
  const range = "This week";
  const { user } = useAuthStore();
  return (
    <div className="space-y-8 pb-8 text-slate-100">
      <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">
            <Sparkles size={14} /> Monday, September 17, 2026
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Good morning,{" "}
            <span className="text-rose-400">{user?.username}</span>
            <span className="text-rose-400">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Here&apos;s the pulse of your workspaces. You&apos;re making great
            progress.
          </p>
        </div>
        <button className="inline-flex w-fit items-center gap-2 rounded-xl bg-rose-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-rose-950/20 transition hover:bg-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 focus:ring-offset-slate-950">
          <Plus size={17} /> New project
        </button>
      </section>

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Workspace overview"
      >
        <article className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-5 shadow-xl shadow-slate-950/10">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-300/20 text-rose-200">
            <FolderKanban size={18} />
          </div>
          <p className="text-sm text-slate-400">Active projects</p>
          <strong className="mt-1 block text-3xl font-semibold text-white">
            12
          </strong>
          <span className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-300">
            <ArrowUpRight size={14} /> 18.2%{" "}
            <em className="not-italic text-slate-500">vs last month</em>
          </span>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/10">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
            <ListChecks size={18} />
          </div>
          <p className="text-sm text-slate-400">Tasks completed</p>
          <strong className="mt-1 block text-3xl font-semibold text-white">
            84
          </strong>
          <span className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-300">
            <ArrowUpRight size={14} /> 12.5%{" "}
            <em className="not-italic text-slate-500">vs last month</em>
          </span>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/10">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
            <Clock3 size={18} />
          </div>
          <p className="text-sm text-slate-400">Hours tracked</p>
          <strong className="mt-1 block text-3xl font-semibold text-white">
            128.5
          </strong>
          <span className="mt-3 flex items-center gap-1 text-xs font-medium text-amber-300">
            + 6.4% <em className="not-italic text-slate-500">vs last month</em>
          </span>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/10">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/15 text-sky-300">
            <Users size={18} />
          </div>
          <p className="text-sm text-slate-400">Team members</p>
          <strong className="mt-1 block text-3xl font-semibold text-white">
            24
          </strong>
          <span className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-300">
            <ArrowUpRight size={14} /> 2 new{" "}
            <em className="not-italic text-slate-500">this month</em>
          </span>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_1fr]">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/10 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Workspace pulse
              </p>
              <h2 className="mt-2 text-lg font-semibold text-white">
                Overall progress
              </h2>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:text-white">
              {range}
              <ChevronDown size={15} />
            </button>
          </div>
          <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
            <div className="flex flex-col items-center gap-3">
              <ProgressRing value={68} />
            </div>
            <div className="w-full max-w-xs">
              <strong className="text-3xl font-semibold tracking-tight text-white">
                68%
              </strong>
              <p className="mt-1 text-sm text-slate-400">
                of all tasks are complete
              </p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                <span className="block h-full w-[68%] rounded-full bg-rose-400" />
              </div>
              <small className="mt-2 block text-xs text-emerald-300">
                +8.4% from last week
              </small>
            </div>
          </div>
          <div className="mt-8 flex gap-6 border-t border-slate-800 pt-4 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <i className="h-2 w-2 rounded-full bg-rose-400" /> Completed{" "}
              <b className="text-white">84</b>
            </span>
            <span className="flex items-center gap-2">
              <i className="h-2 w-2 rounded-full bg-slate-600" /> Remaining{" "}
              <b className="text-white">40</b>
            </span>
          </div>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/10 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Your focus
              </p>
              <h2 className="mt-2 text-lg font-semibold text-white">
                Today&apos;s schedule
              </h2>
            </div>
            <button
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
              aria-label="More schedule options"
            >
              <MoreHorizontal size={19} />
            </button>
          </div>
          <div className="mt-6 divide-y divide-slate-800">
            <div className="flex items-center gap-3 py-4 first:pt-0">
              <span className="w-11 shrink-0 text-xs font-semibold text-slate-500">
                09:30
              </span>
              <div>
                <strong className="text-sm font-medium text-slate-200">
                  Team stand-up
                </strong>
                <p className="mt-1 text-xs text-slate-500">
                  Daily sync ·{" "}
                  <span className="text-emerald-300">+8 attendees</span>
                </p>
              </div>
              <span className="ml-auto rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                Live
              </span>
            </div>
            <div className="flex items-center gap-3 py-4">
              <span className="w-11 shrink-0 text-xs font-semibold text-slate-500">
                11:00
              </span>
              <div>
                <strong className="text-sm font-medium text-slate-200">
                  Review homepage concepts
                </strong>
                <p className="mt-1 text-xs text-slate-500">
                  Website redesign · 45 min
                </p>
              </div>
              <span className="ml-auto rounded-full bg-slate-800 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Work
              </span>
            </div>
            <div className="flex items-center gap-3 py-4 last:pb-0">
              <span className="w-11 shrink-0 text-xs font-semibold text-slate-500">
                15:30
              </span>
              <div>
                <strong className="text-sm font-medium text-slate-200">
                  Product roadmap review
                </strong>
                <p className="mt-1 text-xs text-slate-500">
                  Mobile app launch · 1 hr
                </p>
              </div>
              <span className="ml-auto rounded-full bg-slate-800 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Work
              </span>
            </div>
          </div>
          <button className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-rose-300 transition hover:text-rose-200">
            <CalendarDays size={15} /> Open calendar <ArrowUpRight size={14} />
          </button>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/10 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Portfolio
              </p>
              <h2 className="mt-2 text-lg font-semibold text-white">
                Project health
              </h2>
            </div>
            <button className="inline-flex items-center gap-1 text-xs font-semibold text-rose-300 transition hover:text-rose-200">
              View all <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="mt-6 hidden grid-cols-[1.4fr_1fr_0.8fr_0.55fr] gap-4 border-b border-slate-800 pb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600 sm:grid">
            <span>Project</span>
            <span>Progress</span>
            <span>Status</span>
            <span>Due date</span>
          </div>
          <div className="divide-y divide-slate-800">
            {projects.map((project) => (
              <div
                className="grid gap-3 py-4 sm:grid-cols-[1.4fr_1fr_0.8fr_0.55fr] sm:items-center sm:gap-4"
                key={project.name}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${project.color === "coral" ? "bg-rose-400/15 text-rose-300" : project.color === "lime" ? "bg-lime-400/15 text-lime-300" : "bg-sky-400/15 text-sky-300"}`}
                  >
                    <FolderKanban size={16} />
                  </span>
                  <div>
                    <strong className="block text-sm font-medium text-slate-200">
                      {project.name}
                    </strong>
                    <small className="mt-1 block text-xs text-slate-500">
                      {project.team}
                    </small>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <span
                      className={`block h-full rounded-full ${project.color === "coral" ? "bg-rose-400" : project.color === "lime" ? "bg-lime-300" : "bg-sky-300"}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <b className="text-xs font-semibold text-slate-300">
                    {project.progress}%
                  </b>
                </div>
                <span
                  className={`flex items-center gap-1.5 text-xs font-medium ${project.status === "At risk" ? "text-amber-300" : "text-emerald-300"}`}
                >
                  <CircleDashed size={13} />
                  {project.status}
                </span>
                <span className="text-xs text-slate-400">{project.due}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/10 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Live feed
              </p>
              <h2 className="mt-2 text-lg font-semibold text-white">
                Recent activity
              </h2>
            </div>
            <button
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
              aria-label="More activity options"
            >
              <MoreHorizontal size={19} />
            </button>
          </div>
          <div className="mt-6 space-y-5">
            {activity.map((item) => (
              <div className="flex gap-3" key={`${item.person}-${item.time}`}>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${item.tone === "coral" ? "bg-rose-400/20 text-rose-200" : item.tone === "lime" ? "bg-lime-400/20 text-lime-200" : "bg-sky-400/20 text-sky-200"}`}
                >
                  {item.initials}
                </span>
                <div>
                  <p className="text-sm leading-5 text-slate-400">
                    <strong className="font-medium text-slate-200">
                      {item.person}
                    </strong>{" "}
                    {item.action}
                  </p>
                  <small className="mt-1 block text-xs text-slate-600">
                    {item.time}
                  </small>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-7 inline-flex items-center gap-2 text-xs font-semibold text-rose-300 transition hover:text-rose-200">
            See all activity <ArrowUpRight size={14} />
          </button>
        </article>
      </section>
      <div className="flex items-center gap-2 text-xs text-emerald-300">
        <Check size={15} /> Everything is up to date
        <span className="text-slate-600">Last synced just now</span>
      </div>
    </div>
  );
};

export default Home;
