import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { SocketProvider } from './contexts/SocketContext';

import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmsAndCropsPage from './pages/farmer/FarmsAndCropsPage';
import DiseaseScannerPage from './pages/farmer/DiseaseScannerPage';
import FinancialDashboardPage from './pages/farmer/FinancialDashboardPage';
import WhatIfSimulatorPage from './pages/farmer/WhatIfSimulatorPage';
import HistoricalIntelligencePage from './pages/farmer/HistoricalIntelligencePage';
import CropPassportPage from './pages/farmer/CropPassportPage';
import ConsultationsPage from './pages/farmer/ConsultationsPage';

import SpecialistDashboard from './pages/specialist/SpecialistDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import PassportVerifyPage from './pages/public/PassportVerifyPage';

// Protected Route Guard for Farmers & General Logged-in Users
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'specialist') return <Navigate to="/specialist/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Application Shell with Navbar & Collapsible Sidebar for Authenticated Views
const AppLayout = ({ children, hideSidebar = false }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-sage-50 text-slate-800 flex flex-col selection:bg-forest-800 selection:text-white">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row">
        {user && !hideSidebar && <Sidebar />}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route
        path="/"
        element={
          <AppLayout hideSidebar={true}>
            <LandingPage />
          </AppLayout>
        }
      />
      <Route
        path="/login"
        element={
          <AppLayout hideSidebar={true}>
            <LoginPage />
          </AppLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AppLayout hideSidebar={true}>
            <RegisterPage />
          </AppLayout>
        }
      />
      <Route path="/verify/:passportId" element={<PassportVerifyPage />} />

      {/* Farmer & Shared Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FarmerDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/farms-and-crops"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FarmsAndCropsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/disease-scanner"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DiseaseScannerPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profitability"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FinancialDashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/what-if-simulator"
        element={
          <ProtectedRoute>
            <AppLayout>
              <WhatIfSimulatorPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/historical-intelligence"
        element={
          <ProtectedRoute>
            <AppLayout>
              <HistoricalIntelligencePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/crop-passport"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CropPassportPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/consultations"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ConsultationsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Agricultural Specialist Route */}
      <Route
        path="/specialist/dashboard"
        element={
          <ProtectedRoute allowedRoles={['specialist', 'admin']}>
            <AppLayout>
              <SpecialistDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Dedicated Admin Portal Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <SocketProvider>
            <AppRoutes />
          </SocketProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
