import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../../components/navigation/ProtectedRoute';
import { Login } from '../../pages/Login';
import { Register } from '../../pages/Register';
import { ForgotPassword } from '../../pages/ForgotPassword';
import { StudentDashboard } from '../../pages/StudentDashboard';
import { TeacherDashboard } from '../../pages/TeacherDashboard';
import { AdminDashboard } from '../../pages/AdminDashboard';
import { AdminQuestionBank } from '../../pages/AdminQuestionBank';
import { AdminSubjects } from '../../pages/AdminSubjects';
import { Unauthorized } from '../../pages/Unauthorized';
import { useAuth } from '../../features/auth/AuthContext';
import { getDefaultRedirectPath } from '../../utils/roleGuards';

export const AppRouter: React.FC = () => {
  const { role, user } = useAuth();

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Student Protected Routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Routes>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="questions" element={<StudentDashboard />} />
              <Route path="tests" element={<StudentDashboard />} />
              <Route path="results" element={<StudentDashboard />} />
              <Route path="bookmarks" element={<StudentDashboard />} />
              <Route path="leaderboard" element={<StudentDashboard />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Teacher Protected Routes */}
      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <Routes>
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="classes" element={<TeacherDashboard />} />
              <Route path="tests" element={<TeacherDashboard />} />
              <Route path="assignments" element={<TeacherDashboard />} />
              <Route path="results" element={<TeacherDashboard />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminDashboard />} />
              <Route path="questions" element={<AdminQuestionBank />} />
              <Route path="subjects" element={<AdminSubjects />} />
              <Route path="tests" element={<AdminDashboard />} />
              <Route path="settings" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Default Catch-all Redirect */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate to={getDefaultRedirectPath(role)} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};
