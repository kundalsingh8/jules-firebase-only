import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { Sites } from './pages/Sites';
import { Personnel } from './pages/Personnel';

// Placeholders for other roles
const AreaOfficerDashboard = () => <div className="p-8 font-bold">Area Officer Dashboard</div>;
const SiteAdminDashboard = () => <div className="p-8 font-bold">Site Admin Dashboard</div>;
const ResidentDashboard = () => <div className="p-8 font-bold">Resident Dashboard</div>;
const GuardDashboard = () => <div className="p-8 font-bold">Guard Dashboard</div>;

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  if (!currentUser) return <Navigate to="/login" />;

  if (allowedRoles && userData && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

const RoleBasedRedirect = () => {
  const { userData, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  if (!userData?.role) {
    // If no role assigned yet, default to resident or basic view
    return <Navigate to="/dashboard/resident" />;
  }

  switch (userData.role) {
    case 'super_admin':
    case 'company_admin':
      return <Navigate to="/dashboard/super-admin" />;
    case 'area_officer':
    case 'guard_supervisor':
      return <Navigate to="/dashboard/area-officer" />;
    case 'society_admin':
      return <Navigate to="/dashboard/site-admin" />;
    case 'guard':
      return <Navigate to="/dashboard/guard" />;
    default:
      return <Navigate to="/dashboard/resident" />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><RoleBasedRedirect /></ProtectedRoute>} />

          <Route path="/dashboard/super-admin" element={
            <ProtectedRoute allowedRoles={['super_admin', 'company_admin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/area-officer" element={
            <ProtectedRoute allowedRoles={['area_officer', 'guard_supervisor']}>
              <AreaOfficerDashboard />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/site-admin" element={
            <ProtectedRoute allowedRoles={['society_admin']}>
              <SiteAdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/resident" element={
            <ProtectedRoute allowedRoles={['resident']}>
              <ResidentDashboard />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/guard" element={
            <ProtectedRoute allowedRoles={['guard']}>
              <GuardDashboard />
            </ProtectedRoute>
          } />

          <Route path="/unauthorized" element={
             <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600 font-bold">Unauthorized Access</div>
          } />

          <Route path="/sites" element={
            <ProtectedRoute allowedRoles={['super_admin', 'company_admin']}>
              <Sites />
            </ProtectedRoute>
          } />
          <Route path="/personnel" element={
            <ProtectedRoute allowedRoles={['super_admin', 'company_admin', 'area_officer']}>
              <Personnel />
            </ProtectedRoute>
          } />

          {/* Fallbacks */}
          <Route path="/incidents" element={<ProtectedRoute><SuperAdminDashboard /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><SuperAdminDashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
