import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Login } from '../modules/auth/Login';
import { SuperAdminDashboard } from '../dashboards/SuperAdminDashboard';
import { Sites } from '../modules/sites/Sites';
import { Personnel } from '../modules/personnel/Personnel';
import { Layout } from '../layouts/Layout';

// Shells for other roles
// These will be moved to their respective dashboards later
import { AreaOfficerDashboard } from "../dashboards/AreaOfficerDashboard";

import { SiteAdminDashboard } from "../dashboards/SiteAdminDashboard";

import { ResidentDashboard } from "../dashboards/ResidentDashboard";

import { GuardDashboard } from "../dashboards/GuardDashboard";

export const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  if (!currentUser) return <Navigate to="/login" />;

  const userRole = userData?.role || 'resident';

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export const RoleBasedRedirect = () => {
  const { userData, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  const userRole = userData?.role || 'resident';

  switch (userRole) {
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

export const AppRoutes = () => {
  return (
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
        <ProtectedRoute allowedRoles={['super_admin', 'company_admin', 'area_officer', 'guard_supervisor']}>
          <Sites />
        </ProtectedRoute>
      } />

      <Route path="/personnel" element={
        <ProtectedRoute allowedRoles={['super_admin', 'company_admin', 'area_officer', 'guard_supervisor', 'society_admin']}>
          <Personnel />
        </ProtectedRoute>
      } />

      {/* Fallbacks */}
      <Route path="/incidents" element={
        <ProtectedRoute allowedRoles={['super_admin', 'company_admin', 'area_officer', 'guard_supervisor', 'society_admin', 'guard', 'resident']}>
          <Layout title="Incidents">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Incidents Log</h2>
              <p className="text-gray-600">Incident reports will appear here.</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/reports" element={
        <ProtectedRoute allowedRoles={['super_admin', 'company_admin', 'area_officer', 'guard_supervisor', 'society_admin']}>
          <Layout title="Reports">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Reports & Analytics</h2>
              <p className="text-gray-600">Data analytics and reports will appear here.</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};
