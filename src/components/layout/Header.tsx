import React from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { Button } from '../ui/Button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleBadges = {
    admin: { label: 'Admin', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
    teacher: { label: 'Teacher', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
    student: { label: 'Student', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  };

  const badge = profile?.role ? roleBadges[profile.role] : { label: 'User', color: 'bg-slate-100 text-slate-700' };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-600/30">
          M
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            MARK Platform
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Exam Preparation System</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {profile && (
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.color}`}>
              {badge.label}
            </span>
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.displayName || profile.email}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{profile.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
