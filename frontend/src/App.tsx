import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import { useAppStore } from "./stores/app-store";
import {
  users,
  projects,
  tasks,
  members,
  activities,
  notes,
} from "./lib/mock-data";
import Home from "./pages/Home";

function App() {
  useEffect(() => {
    useAppStore.setState({
      users,
      projects,
      tasks,
      members,
      activities,
      notes,
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
