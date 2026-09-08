import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './views/Dashboard';
import Projects from './views/Projects';
import Team from './views/Team';
import Settings from './views/Settings';
import { useAppStore } from './stores/app-store';
import { users, projects, tasks, members, activities, notes } from './lib/mock-data';

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
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<Projects />} />
          <Route path="/team" element={<Team />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
