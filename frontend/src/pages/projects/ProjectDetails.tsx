import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useProjectStore from "../../stores/projectStore";

const formatProjectTime = (value: unknown): string => {
  if (value === undefined || value === null || value === "") return "—";

  const date = new Date(value as string | number | Date);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const ProjectDetails = () => {
  const { id } = useParams();
  const { fetchProjectById, project } = useProjectStore();
  useEffect(() => {
    if (id) {
      fetchProjectById(id);
    }
  }, [fetchProjectById, id]);
  console.log(project);
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <a
          href="/projects"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← All projects
        </a>
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-medium text-indigo-600">
                Project Overview
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                {project?.name}
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Refresh the product experience with clearer navigation, an
                updated visual system, and faster onboarding.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {project?.status}
            </span>
          </div>
          <div className="mt-8 grid gap-6 border-t border-slate-100 pt-6 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Project lead
              </p>
              <p className="mt-2 font-medium">{project?.team}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Timeline
              </p>
              <p className="mt-2 font-medium">
                {formatProjectTime(project?.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Progress
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-3/5 rounded-full bg-indigo-600" />
                </div>
                <span className="text-sm font-semibold">60%</span>
              </div>
            </div>
          </div>
        </section>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Tasks</h2>
                <p className="mt-1 text-sm text-slate-500">
                  3 of 5 tasks completed
                </p>
              </div>
              <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                + Add task
              </button>
            </div>
            <ul className="mt-5 divide-y divide-slate-100">
              {[
                {
                  title: "Project kickoff and discovery",
                  done: true,
                  owner: "Alex Morgan",
                },
                { title: "Create wireframes", done: true, owner: "Jamie Lee" },
                {
                  title: "Review visual direction",
                  done: true,
                  owner: "Taylor Kim",
                },
                {
                  title: "Build responsive interface",
                  done: false,
                  owner: "Jamie Lee",
                },
                { title: "QA and launch", done: false, owner: "Alex Morgan" },
              ].map((task) => (
                <li key={task.title} className="flex items-center gap-3 py-4">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${task.done ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300"}`}
                  >
                    {task.done ? "✓" : ""}
                  </span>
                  <span
                    className={`flex-1 text-sm font-medium ${task.done ? "text-slate-400 line-through" : "text-slate-700"}`}
                  >
                    {task.title}
                  </span>
                  <span className="hidden text-xs text-slate-500 sm:block">
                    {task.owner}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Team</h2>
            <p className="mt-1 text-sm text-slate-500">
              People working on this project
            </p>
            <ul className="mt-5 space-y-4">
              {project?.members.map((member) => (
                <li
                  key={typeof member === "string" ? member : member._id}
                  className="flex items-center gap-3"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${typeof member === "string" ? "bg-slate-100 text-slate-600" : member.color}`}
                  >
                    {member.user?.username.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      {typeof member === "string"
                        ? member
                        : member.user?.username || ""}
                    </p>
                    <p className="text-xs text-slate-500">
                      {typeof member === "string" ? "" : member.user?.role}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <button className="mt-6 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Manage team
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ProjectDetails;
