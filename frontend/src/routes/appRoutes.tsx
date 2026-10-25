import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import AppLayout from "../components/layout/AppLayout";
import Projects from "../pages/projects/Projects";
import Login from "../pages/auth/Login";
import ProtectedRoutes from "./ProtectedRoutes";
import Signup from "../pages/auth/Signup";
import ProjectDetails from "../pages/projects/ProjectDetails";
import TaskDetails from "../pages/tasks/TaskDetails";
import Teams from "../pages/teams/Teams";
import EditTask from "../pages/tasks/EditTask";
import Tasks from "../pages/tasks/Tasks";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route
            path="/projects/:projectId/tasks/:taskId"
            element={<TaskDetails />}
          />
          <Route
            path="/projects/:projectId/tasks/:taskId/edit"
            element={<EditTask />}
          />
          <Route path="/teams" element={<Teams />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
