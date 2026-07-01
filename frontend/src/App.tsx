import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AdminProvider } from './admin/context/AdminContext';
import Login from './portal/pages/Login';
import Onboarding from './portal/pages/Onboarding';
import UserDashboard from './portal/pages/UserDashboard';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminUsers from './admin/pages/AdminUsers';
import ManageAdmins from './admin/pages/ManageAdmins';
import ProtectedRoute from './portal/components/ProtectedRoute';
import { useCallback, useEffect, useState } from 'react';
import api from './services/api';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
    }
    setUser(null);
    window.location.href = '/login';
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/users/me');
        setUser(res.data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f1f16]">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-500/30 border-t-green-500" />
        <p className="text-sm font-semibold tracking-wide text-green-400">Loading WeatherGuard…</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to={user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? '/admin' : '/user'} />}
        />

        <Route
          path="/onboarding"
          element={user && !user.city ? <Onboarding onComplete={setUser} /> : <Navigate to="/" />}
        />

        <Route element={<ProtectedRoute user={user} allowedRoles={['USER']} />}>
          <Route
            path="/user"
            element={<UserDashboard user={user} onUserUpdate={setUser} onLogout={handleLogout} />}
          />
        </Route>

        <Route element={<ProtectedRoute user={user} allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
          <Route element={<AdminProvider><Outlet /></AdminProvider>}>
            <Route path="/admin" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
            <Route path="/admin/users" element={<AdminUsers user={user} onLogout={handleLogout} />} />
            <Route path="/admin/admins" element={<ManageAdmins user={user} onLogout={handleLogout} />} />
          </Route>
        </Route>

        <Route
          path="/"
          element={
            !user ? (
              <Navigate to="/login" />
            ) : !user.city ? (
              <Navigate to="/onboarding" />
            ) : user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/user" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
