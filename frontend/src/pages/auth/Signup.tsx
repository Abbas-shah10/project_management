import { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        <section className="hidden bg-linear-to-br from-indigo-600 to-violet-700 p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <div className="mb-10 flex items-center gap-3 text-xl font-bold">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                P
              </span>
              Projectly
            </div>
            <h1 className="text-4xl font-bold leading-tight">
              Build something great together.
            </h1>
            <p className="mt-5 max-w-sm text-indigo-100">
              Organize your projects, collaborate with your team, and turn ideas
              into results.
            </p>
          </div>
          <p className="text-sm text-indigo-200">
            Simple project management for growing teams.
          </p>
        </section>

        <section className="p-6 sm:p-10">
          <div className="mx-auto max-w-md">
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Get started
              </p>
              <h2 className="text-3xl font-bold text-slate-900">
                Create your account
              </h2>
              <p className="mt-2 text-slate-500">
                Join your team and start managing projects today.
              </p>
            </div>

            <form className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="johndoe"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Your role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="user">Team member</option>
                  <option value="manager">Project manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 px-4 py-3.5 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
              >
                Create account
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Signup;
