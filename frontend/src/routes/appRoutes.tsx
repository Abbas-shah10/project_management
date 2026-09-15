import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import AppLayout from "../components/layout/AppLayout";
import Projects from "../pages/projects/Projects";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
