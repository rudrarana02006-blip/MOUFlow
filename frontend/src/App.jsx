import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminMous from './pages/AdminMous';
import AdminSettings from './pages/AdminSettings';
import DocumentSigning from './pages/DocumentSigning';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/mous" element={<AdminMous />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/sign-document/:token" element={<DocumentSigning />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
