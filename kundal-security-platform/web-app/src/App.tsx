import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Simple placeholder components for now
const Login = () => <div className="p-8 text-center text-xl font-bold">Login Page (WIP)</div>;
const Dashboard = () => {
  const { currentUser, userData, signOut } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-brand-navy">Kundal Security Platform</h1>
      <p>Welcome, {currentUser?.phoneNumber || currentUser?.email || 'User'}</p>
      <p>Role: <span className="font-semibold text-brand-emerald">{userData?.role || 'Loading...'}</span></p>
      <button onClick={signOut} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Sign Out</button>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
