import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import AppLayout from "../components/layout/AppLayout";
import Projects from "../pages/projects/Projects";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="/projects" element={<Projects />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
