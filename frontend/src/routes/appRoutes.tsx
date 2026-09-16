import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import AppLayout from "../components/layout/AppLayout";
import Projects from "../pages/projects/Projects";
import Login from "../pages/auth/Login";
import ProtectedRoutes from "./ProtectedRoutes";
import Signup from "../pages/auth/Signup";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="/projects" element={<Projects />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
