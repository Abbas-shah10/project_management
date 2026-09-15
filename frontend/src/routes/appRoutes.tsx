import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import AppLayout from "../components/layout/AppLayout";
import Projects from "../pages/projects/Projects";
import Login from "../pages/auth/Login";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      {/* App Layout */}
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="/projects" element={<Projects />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
