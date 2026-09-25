import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import AppLayout from "../components/layout/AppLayout";
import Projects from "../pages/projects/Projects";
import Login from "../pages/auth/Login";
import ProtectedRoutes from "./ProtectedRoutes";
import Signup from "../pages/auth/Signup";
import ProjectDetails from "../pages/projects/ProjectDetails";

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
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
