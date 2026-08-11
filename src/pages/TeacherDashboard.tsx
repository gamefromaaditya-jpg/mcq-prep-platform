import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../features/auth/AuthContext';
import { Users, ClipboardList, BookMarked, BarChart2, Plus } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { profile } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="brand">Teacher Portal</Badge>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Welcome, Educator {profile?.displayName || ''}! 👨‍🏫
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage test creation, assign homework, and review student performance analytics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Create New Test
            </Button>
            <Button variant="outline" leftIcon={<Plus className="w-4 h-4" />}>
              Create Assignment
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card hoverEffect>
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Assigned Classes</p>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100">4 Classes</h4>
              </div>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Tests</p>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100">8 Tests</h4>
              </div>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <BookMarked className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Assignments</p>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100">15 Active</h4>
              </div>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Submissions Reviewed</p>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100">342 Answers</h4>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Test Batches</CardTitle>
              <CardDescription>Tests created and published for your batches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Batch A1 - Physics Chapter Test</h4>
                  <p className="text-xs text-slate-500">25 Questions • 48 Students Submitted</p>
                </div>
                <Badge variant="success">Published</Badge>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Batch B2 - Chemistry Periodic Table</h4>
                  <p className="text-xs text-slate-500">15 Questions • 32 Students Submitted</p>
                </div>
                <Badge variant="success">Published</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Class Performance Summary</CardTitle>
              <CardDescription>Average batch percentile distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Batch A1 (JEE Advanced Focus)</span>
                  <span className="text-brand-600">84.2% Avg Score</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-brand-600 h-full rounded-full" style={{ width: '84.2%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Batch B2 (NEET Foundation)</span>
                  <span className="text-emerald-600">79.5% Avg Score</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '79.5%' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
