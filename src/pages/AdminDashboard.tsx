import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Shield, Users, FileQuestion, Layers, Upload, Plus } from 'lucide-react';

export const AdminDashboard: React.FC = () => {

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-purple-950/20 dark:bg-purple-950/40 p-6 rounded-2xl border border-purple-200 dark:border-purple-900/60 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="brand" className="bg-purple-600 text-white border-none">
                System Administrator
              </Badge>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Admin Control Center 🛡️
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Manage system users, curations for the master question bank, subjects, and global system configuration.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Add New Question
            </Button>
            <Button variant="outline" leftIcon={<Upload className="w-4 h-4" />}>
              Bulk CSV Import
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card hoverEffect>
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl">
                <FileQuestion className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Master Questions</p>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100">5,420</h4>
              </div>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Registered Users</p>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100">1,280</h4>
              </div>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Subjects & Chapters</p>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100">42 Chapters</h4>
              </div>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Security Health</p>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Optimal</h4>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Master Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverEffect>
            <CardHeader>
              <CardTitle className="text-base">Master Question Bank</CardTitle>
              <CardDescription>Single, Multiple, Integer, Numerical, and Match questions</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 dark:text-slate-400 space-y-3">
              <p>Create, edit, publish, or delete questions across subjects and chapters.</p>
              <Button size="sm" variant="outline" className="w-full">
                Manage Question Bank
              </Button>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardHeader>
              <CardTitle className="text-base">User Roles & Access Control</CardTitle>
              <CardDescription>Assign and audit Admin, Teacher, and Student roles</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 dark:text-slate-400 space-y-3">
              <p>Ensure security compliance and manage user permissions in Cloud Firestore.</p>
              <Button size="sm" variant="outline" className="w-full">
                Manage Users
              </Button>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardHeader>
              <CardTitle className="text-base">Taxonomies & Subjects</CardTitle>
              <CardDescription>Physics, Chemistry, Mathematics, Biology</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 dark:text-slate-400 space-y-3">
              <p>Structure curriculum hierarchies, chapters, and topic tags.</p>
              <Button size="sm" variant="outline" className="w-full">
                Manage Taxonomies
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
