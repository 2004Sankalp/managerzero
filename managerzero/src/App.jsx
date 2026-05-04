import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Standup from './pages/Standup';
import Meetings from './pages/Meetings';
import Feedback from './pages/Feedback';
import ClientFeedbackForm from './pages/ClientFeedbackForm';

import EmployeeDashboard from './pages/employee/Dashboard';
import RoleRoute from './components/RoleRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Legacy Redirection for old links */}
      <Route path="/app" element={<Navigate to="/manager" replace />} />

      {/* Engineering Manager Logic Tree */}
      <Route path="/manager" element={
        <RoleRoute allowedRole="manager">
          <Layout />
        </RoleRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="standup" element={<Standup />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="feedback" element={<Feedback />} />
      </Route>

      {/* Software Engineer Logic Tree */}
      <Route path="/employee" element={
        <RoleRoute allowedRole="employee">
          <Layout />
        </RoleRoute>
      }>
        <Route index element={<EmployeeDashboard />} />
        <Route path="meetings" element={<Meetings />} />
      </Route>

      {/* Public client feedback form – no auth required */}
      <Route path="/feedback/:token" element={<ClientFeedbackForm />} />

    </Routes>
  );
}

export default App;
