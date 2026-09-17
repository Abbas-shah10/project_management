import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex  border-slate-800 text-[(--text-primary)] antialiased">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-4 bg-slate-950 text-white sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl ">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
