import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import MainLayout from './layout/MainLayout';
import DashboardHome from './pages/DashboardHome';
import StudentsList from './pages/StudentsList';
import StudentRegistration from './pages/StudentRegistration';
import AttendanceForm from './pages/AttendanceForm';
import QRManagement from './pages/QRManagement';
import Settings from './pages/Settings';
import Login from './pages/Login';
import CoursesCatalog from './pages/CoursesCatalog';
import CoursesAdmin from './pages/CoursesAdmin';
import BatchesView from './pages/BatchesView';
import BatchesAdmin from './pages/BatchesAdmin';
import ReportsHub from './pages/ReportsHub';
import Toast from './components/Toast';
import DebugPanel from './components/DebugPanel';

function App() {
  return (
    <Router>
      <DataProvider>
        <Toast />
        {/* <DebugPanel /> */}
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Public Routes (No Sidebar) */}
          <Route path="/students/register" element={<StudentRegistration />} />
          <Route path="/attendance" element={<AttendanceForm />} />

          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="students" element={<StudentsList />} />
            {/* <Route path="students/register" element={<StudentRegistration />} /> */}
            {/* <Route path="attendance" element={<AttendanceForm />} /> */}
            <Route path="qr-management" element={<QRManagement />} />
            <Route path="settings" element={<Settings />} />

            <Route path="courses" element={<CoursesCatalog />} />
            <Route path="courses-admin" element={<CoursesAdmin />} />
            <Route path="batches" element={<BatchesView />} />
            <Route path="batches-admin" element={<BatchesAdmin />} />
            <Route path="reports" element={<ReportsHub />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DataProvider>
    </Router>
  );
}

export default App;
