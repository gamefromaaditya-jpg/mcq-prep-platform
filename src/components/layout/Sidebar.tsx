import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAuth } from '../../features/auth/AuthContext';
import {
  LayoutDashboard,
  FileQuestion,
  ClipboardList,
  BarChart3,
  Users,
  Settings,
  Bookmark,
  Award,
  BookMarked,
  Layers,
  GraduationCap,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();

  const getNavLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/admin/users', label: 'Users & Roles', icon: <Users className="w-4 h-4" /> },
          { to: '/admin/questions', label: 'Question Bank', icon: <FileQuestion className="w-4 h-4" /> },
          { to: '/admin/subjects', label: 'Subjects & Chapters', icon: <Layers className="w-4 h-4" /> },
          { to: '/admin/tests', label: 'Test Management', icon: <ClipboardList className="w-4 h-4" /> },
          { to: '/admin/settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> },
        ];
      case 'teacher':
        return [
          { to: '/teacher/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/teacher/classes', label: 'My Classes', icon: <GraduationCap className="w-4 h-4" /> },
          { to: '/teacher/tests', label: 'Create & Manage Tests', icon: <ClipboardList className="w-4 h-4" /> },
          { to: '/teacher/assignments', label: 'Assignments', icon: <BookMarked className="w-4 h-4" /> },
          { to: '/teacher/results', label: 'Student Results', icon: <BarChart3 className="w-4 h-4" /> },
        ];
      case 'student':
      default:
        return [
          { to: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/student/questions', label: 'Practice Questions', icon: <FileQuestion className="w-4 h-4" /> },
          { to: '/student/tests', label: 'Mock & Practice Tests', icon: <ClipboardList className="w-4 h-4" /> },
          { to: '/student/results', label: 'My Performance', icon: <BarChart3 className="w-4 h-4" /> },
          { to: '/student/bookmarks', label: 'Bookmarked Items', icon: <Bookmark className="w-4 h-4" /> },
          { to: '/student/leaderboard', label: 'Leaderboard', icon: <Award className="w-4 h-4" /> },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-57px)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Navigation</p>
          <nav className="mt-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-600 text-white font-semibold shadow-md shadow-brand-600/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">MARK Platform v1.0</p>
        <p>Engine: Spark Tier Optimized</p>
      </div>
    </aside>
  );
};
