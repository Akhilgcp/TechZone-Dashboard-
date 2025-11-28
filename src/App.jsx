import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import DashboardHome from './pages/DashboardHome';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Batches from './pages/Batches';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { DataProvider } from './context/DataContext';
import './Dashboard.css';
import ErrorBoundary from './components/ErrorBoundary'; // Added ErrorBoundary import

import StudentRegistration from './pages/StudentRegistration';
import AttendanceForm from './pages/AttendanceForm';
import QRManagement from './pages/QRManagement';

function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <Router>
          <Routes>
            {/* Public Routes (No Sidebar/Header) */}
            <Route path="/qr-registration" element={<StudentRegistration />} />
            <Route path="/qr-attendance" element={<AttendanceForm />} />

            {/* Protected Dashboard Routes */}
            <Route path="/*" element={
              <MainLayout>
                <Routes>
                  <Route path="/" element={<DashboardHome />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/batches" element={<Batches />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/qr-management" element={<QRManagement />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </MainLayout>
            } />
          </Routes>
        </Router>
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;
