import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

// Import pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import OrdersPage from './pages/OrdersPage';
import SegmentsPage from './pages/SegmentsPage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignHistoryPage from './pages/CampaignHistoryPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import ProfilePage from './pages/ProfilePage';
import CustomerDetailPage from './pages/CustomerDetailPage';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Redirect root to login if not authenticated */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Login route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/customers" element={
              <ProtectedRoute>
                <Layout>
                  <CustomersPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/customers/:id" element={
              <ProtectedRoute>
                <Layout>
                  <CustomerDetailPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/orders" element={
              <ProtectedRoute>
                <Layout>
                  <OrdersPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/segments" element={
              <ProtectedRoute>
                <Layout>
                  <SegmentsPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/campaigns" element={
              <ProtectedRoute>
                <Layout>
                  <CampaignsPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/campaign-history" element={
              <ProtectedRoute>
                <Layout>
                  <CampaignHistoryPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/campaign-history/:id" element={
              <ProtectedRoute>
                <Layout>
                  <CampaignDetailPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Catch all route - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;