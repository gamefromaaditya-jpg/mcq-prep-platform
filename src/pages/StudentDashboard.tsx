import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../features/auth/AuthContext';
import { Award, Target, Clock, ArrowRight, CheckCircle } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { profile } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Hero banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-purple-600 p-8 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <Badge variant="brand" className="bg-white/20 text-white border-white/30 mb-3">
              Student Dashboard
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Welcome back, {profile?.displayName || 'Student'}! 👋
            </h2>
            <p className="text-brand-100 text-sm mt-2 leading-relaxed">
              Target Exam: <strong className="text-white font-semibold">JEE Main / NEET 2026</strong>. Keep up your momentum with daily practice questions and scheduled mock tests.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="secondary" className="bg-white text-brand-900 hover:bg-slate-100 border-none shadow" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Start Full Mock Test
              </Button>
              <Button variant="outline" className="text-white border-white/40 hover:bg-white/10">
                Browse Question Bank
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card hoverEffect>
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-xl">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tests Attempted</p>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100">12</h4>
              </div>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Overall Accuracy</p>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100">78.4%</h4>
              </div>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Current Percentile</p>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100">96.2</h4>
              </div>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Practice Hours</p>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100">34.5 hrs</h4>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Mock Tests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Upcoming & Recommended Tests</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Handcrafted exam simulations with negative marking</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card hoverEffect>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="brand">Full Length Mock</Badge>
                  <span className="text-xs font-semibold text-slate-500">3 hrs (180 mins)</span>
                </div>
                <CardTitle className="text-base">JEE Main Grand All-India Mock #4</CardTitle>
                <CardDescription>Physics, Chemistry, Mathematics (300 Marks)</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <p>• 75 Questions (Single Correct + Integer)</p>
                <p>• Correct: +4 | Negative: -1</p>
              </CardContent>
              <div className="p-4 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Available Now</span>
                <Button size="sm">Start Exam</Button>
              </div>
            </Card>

            <Card hoverEffect>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="warning">Chapter Test</Badge>
                  <span className="text-xs font-semibold text-slate-500">60 mins</span>
                </div>
                <CardTitle className="text-base">Physics: Rotational Dynamics & Rigids</CardTitle>
                <CardDescription>Advanced Problem Solving Practice</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <p>• 25 Questions (Multiple Correct & Match)</p>
                <p>• Correct: +4 | Negative: -2</p>
              </CardContent>
              <div className="p-4 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Available Now</span>
                <Button size="sm">Start Exam</Button>
              </div>
            </Card>

            <Card hoverEffect>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="info">Daily Practice (DPP)</Badge>
                  <span className="text-xs font-semibold text-slate-500">30 mins</span>
                </div>
                <CardTitle className="text-base">Chemistry: Electrochemistry DPP-03</CardTitle>
                <CardDescription>Daily High-Yield MCQ Drill</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <p>• 10 Questions (Single Correct)</p>
                <p>• Correct: +4 | Negative: -1</p>
              </CardContent>
              <div className="p-4 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Available Now</span>
                <Button size="sm">Start Drill</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
