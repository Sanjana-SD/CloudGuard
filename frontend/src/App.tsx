import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './presentation/modules/auth/login-page';
import RegistrationPage from './presentation/modules/auth/registration-page';
import OverviewPage from './presentation/modules/dashboard/overview-page';
import InventoryPage from './presentation/modules/inventory/inventory-page';
import TrackerPage from './presentation/modules/migration/tracker-page';
import IncidentPage from './presentation/modules/security/incident-page';
import ChatPage from './presentation/modules/assistant/chat-page';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<OverviewPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/migration" element={<TrackerPage />} />
        <Route path="/security" element={<IncidentPage />} />
        <Route path="/assistant" element={<ChatPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
