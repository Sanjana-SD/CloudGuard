import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import MigrationTracker from './pages/MigrationTracker';
import Infrastructure from './pages/Infrastructure';
import SecurityScanner from './pages/SecurityScanner';
import EventsAlerts from './pages/EventsAlerts';
import Incidents from './pages/Incidents';
import AIAssistant from './pages/AIAssistant';
import AuditLogs from './pages/AuditLogs';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="applications" element={<Applications />} />
            <Route path="migration" element={<MigrationTracker />} />
            <Route path="infrastructure" element={<Infrastructure />} />
            <Route path="security" element={<SecurityScanner />} />
            <Route path="alerts" element={<EventsAlerts />} />
            <Route path="incidents" element={<Incidents />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
            <Route path="audit-logs" element={<AuditLogs />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
