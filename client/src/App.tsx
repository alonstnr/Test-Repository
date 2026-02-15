import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { rtlCache } from './theme/rtlCache';
import { theme } from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import VolunteerProfilePage from './pages/volunteer/VolunteerProfilePage';
import VolunteerCalendarPage from './pages/volunteer/VolunteerCalendarPage';
import ActivityDetailPage from './pages/volunteer/ActivityDetailPage';
import MyRegistrationsPage from './pages/volunteer/MyRegistrationsPage';
import OrganizationProfilePage from './pages/organization/OrganizationProfilePage';
import CreateActivityPage from './pages/organization/CreateActivityPage';
import ActivityManagementPage from './pages/organization/ActivityManagementPage';
import ActivityRegistrantsPage from './pages/organization/ActivityRegistrantsPage';
import InboxPage from './pages/messages/InboxPage';
import ConversationPage from './pages/messages/ConversationPage';
import ComposeMessagePage from './pages/messages/ComposeMessagePage';

export default function App() {
  return (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div dir="rtl">
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  <Route path="/dashboard" element={
                    <ProtectedRoute><DashboardPage /></ProtectedRoute>
                  } />

                  {/* Volunteer routes */}
                  <Route path="/volunteer/profile" element={
                    <ProtectedRoute><VolunteerProfilePage /></ProtectedRoute>
                  } />
                  <Route path="/volunteer/calendar" element={
                    <ProtectedRoute><VolunteerCalendarPage /></ProtectedRoute>
                  } />
                  <Route path="/volunteer/activities/:id" element={
                    <ProtectedRoute><ActivityDetailPage /></ProtectedRoute>
                  } />
                  <Route path="/volunteer/registrations" element={
                    <ProtectedRoute><MyRegistrationsPage /></ProtectedRoute>
                  } />

                  {/* Organization routes */}
                  <Route path="/organization/profile" element={
                    <ProtectedRoute requiredRole="ORGANIZATION"><OrganizationProfilePage /></ProtectedRoute>
                  } />
                  <Route path="/organization/activities" element={
                    <ProtectedRoute requiredRole="ORGANIZATION"><ActivityManagementPage /></ProtectedRoute>
                  } />
                  <Route path="/organization/activities/new" element={
                    <ProtectedRoute requiredRole="ORGANIZATION"><CreateActivityPage /></ProtectedRoute>
                  } />
                  <Route path="/organization/activities/:id/registrants" element={
                    <ProtectedRoute requiredRole="ORGANIZATION"><ActivityRegistrantsPage /></ProtectedRoute>
                  } />

                  {/* Messages routes */}
                  <Route path="/messages" element={
                    <ProtectedRoute><InboxPage /></ProtectedRoute>
                  } />
                  <Route path="/messages/compose" element={
                    <ProtectedRoute><ComposeMessagePage /></ProtectedRoute>
                  } />
                  <Route path="/messages/:threadId" element={
                    <ProtectedRoute><ConversationPage /></ProtectedRoute>
                  } />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
