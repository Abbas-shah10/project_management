import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  MailPlus,
  Search,
  Users,
  UserRound,
} from "lucide-react";
import {
  getAllProjects,
  type ProjectSummary,
} from "../../api/projectApi";
import AddMembersToProject from "../projects/AddMembersToProject";

interface TeamPerson {
  id: string;
  name: string;
  email: string;
  memberships: Array<{ projectId: string; projectName: string; role: string }>;
}

const roleLabel = (role?: string) =>
  role?.replaceAll("_", " ") || "Member";

const Teams = () => {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [inviteProject, setInviteProject] = useState<ProjectSummary | null>(null);

  const fetchProjects = useCallback(async () => {
    const response = await getAllProjects();
    return response.projects;
  }, []);

  useEffect(() => {
    let isCurrent = true;

    const load = async () => {
      try {
        const projectData = await fetchProjects();
        if (isCurrent) {
          setProjects(projectData);
          setError(null);
        }
      } catch (loadError: unknown) {
        if (isCurrent) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load team members.",
          );
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    void load();
    return () => {
      isCurrent = false;
    };
  }, [fetchProjects]);

  const loadProjects = useCallback(async () => {
    try {
      const projectData = await fetchProjects();
      setProjects(projectData);
      setError(null);
    } catch (loadError: unknown) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load team members.",
      );
    }
  }, [fetchProjects]);

  const people = useMemo(() => {
    const membersById = new Map<string, TeamPerson>();

    for (const project of projects) {
      for (const membership of project.members || []) {
        const user = membership.user;
        const id = user?._id || membership._id;
        if (!id) continue;

        const existing = membersById.get(id) || {
          id,
          name: user?.fullName || user?.username || "Unknown member",
          email: user?.email || "",
          memberships: [],
        };
        existing.memberships.push({
          projectId: project._id,
          projectName: project.name,
          role: membership.role || "member",
        });
        membersById.set(id, existing);
      }
    }

    return Array.from(membersById.values());
  }, [projects]);

  const filteredPeople = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return people
      .map((person) => ({
        ...person,
        memberships:
          projectFilter === "all"
            ? person.memberships
            : person.memberships.filter(
                (membership) => membership.projectId === projectFilter,
              ),
      }))
      .filter((person) => {
        const matchesProject = person.memberships.length > 0;
        const matchesQuery =
          !normalizedQuery ||
          `${person.name} ${person.email} ${person.memberships
            .map((membership) => membership.projectName)
            .join(" ")}`
            .toLowerCase()
            .includes(normalizedQuery);
        return matchesProject && matchesQuery;
      });
  }, [people, projectFilter, query]);

  const projectMembershipCount = projects.reduce(
    (count, project) => count + (project.members?.length || 0),
    0,
  );
  const manageableProjects = projects.filter(
    (project) => project.currentUserRole === "admin",
  );

  return (
    <div className="space-y-8 pb-8 text-slate-100">
      <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">
            Collaboration
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Teams<span className="text-rose-400">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            See who is working across your projects and invite teammates to
            collaborate.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setInviteProject(
              manageableProjects.find(
                (project) => project._id === projectFilter,
              ) ||
                manageableProjects[0] ||
                null,
            )
          }
          disabled={manageableProjects.length === 0}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-rose-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
          title={
            manageableProjects.length
              ? "Invite a member to a project"
              : "You need project admin access to invite members"
          }
        >
          <MailPlus size={17} /> Invite member
        </button>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"
        >
          Could not load teams: {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Team overview">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Unique members</p>
            <span className="rounded-xl bg-sky-400/15 p-2 text-sky-300">
              <Users size={18} />
            </span>
          </div>
          <strong className="mt-3 block text-3xl font-semibold text-white">
            {loading || error ? "—" : people.length}
          </strong>
          <p className="mt-1 text-xs text-slate-500">
            People across your projects
          </p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Projects</p>
            <span className="rounded-xl bg-rose-400/15 p-2 text-rose-300">
              <BriefcaseBusiness size={18} />
            </span>
          </div>
          <strong className="mt-3 block text-3xl font-semibold text-white">
            {loading || error ? "—" : projects.length}
          </strong>
          <p className="mt-1 text-xs text-slate-500">
            Projects available to you
          </p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Project memberships</p>
            <span className="rounded-xl bg-emerald-400/15 p-2 text-emerald-300">
              <UserRound size={18} />
            </span>
          </div>
          <strong className="mt-3 block text-3xl font-semibold text-white">
            {loading || error ? "—" : projectMembershipCount}
          </strong>
          <p className="mt-1 text-xs text-slate-500">
            Member-to-project assignments
          </p>
        </article>
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Team directory</h2>
            <p className="mt-1 text-sm text-slate-500">
              Members are grouped across every project you can access.
            </p>
          </div>
          <span className="text-xs text-slate-500">
            {loading ? "Loading…" : `${filteredPeople.length} members`}
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative min-w-0 flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              size={16}
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search members or projects"
              aria-label="Search members or projects"
              className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/60 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-rose-400/60"
            />
          </label>
          <select
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
            aria-label="Filter by project"
            className="h-11 rounded-xl border border-slate-800 bg-slate-950/60 px-3 text-sm text-slate-300 outline-none focus:border-rose-400/60"
          >
            <option value="all">All projects</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-800 p-8 text-center text-sm text-slate-500">
            Loading team directory…
          </div>
        ) : error ? (
          <div className="rounded-xl border border-slate-800 p-8 text-center text-sm text-slate-500">
            Team directory data is unavailable.
          </div>
        ) : filteredPeople.length ? (
          <ul className="grid gap-3 lg:grid-cols-2">
            {filteredPeople.map((person) => (
              <li
                key={person.id}
                className="min-w-0 rounded-xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-200">
                    {person.name
                      .split(/\s+/)
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {person.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {person.email || "No email available"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {person.memberships.map((membership) => (
                        <span
                          key={membership.projectId}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-[11px] text-slate-300"
                          title={`${membership.projectName} · ${roleLabel(membership.role)}`}
                        >
                          <span className="max-w-36 truncate">
                            {membership.projectName}
                          </span>
                          <span className="text-slate-500">·</span>
                          <span className="capitalize">
                            {roleLabel(membership.role)}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
            <Users className="mx-auto text-slate-600" size={24} />
            <p className="mt-3 text-sm font-medium text-slate-300">
              {query || projectFilter !== "all"
                ? "No members match those filters"
                : "No team members yet"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {manageableProjects.length
                ? "Invite teammates from a project to get started."
                : "Create or join a project to see its members here."}
            </p>
            {manageableProjects.length > 0 && (
              <button
                type="button"
                onClick={() => setInviteProject(manageableProjects[0])}
                className="mt-4 text-xs font-semibold text-rose-300 hover:text-rose-200"
              >
                Invite a teammate
              </button>
            )}
          </div>
        )}
      </section>

      {inviteProject && (
        <AddMembersToProject
          project={inviteProject}
          onClose={() => setInviteProject(null)}
          onAdded={loadProjects}
        />
      )}
    </div>
  );
};

export default Teams;
