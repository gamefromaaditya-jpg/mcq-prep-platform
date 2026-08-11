import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { getDefaultRedirectPath } from '../utils/roleGuards';

export const Unauthorized: React.FC = () => {
  const { role } = useAuth();
  const redirectPath = getDefaultRedirectPath(role);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
        <div className="inline-flex p-4 bg-rose-500/10 text-rose-400 rounded-full mb-4">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Access Denied</h2>
        <p className="text-sm text-slate-400 mt-2">
          You do not have the required permissions to access this page. Your assigned role (<span className="text-slate-200 font-semibold uppercase">{role || 'unassigned'}</span>) is restricted from this resource.
        </p>

        <div className="mt-6">
          <Link to={redirectPath}>
            <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Authorized Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
