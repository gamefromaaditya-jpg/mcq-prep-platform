import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { SubjectChapterModal } from '../features/admin/components/SubjectChapterModal';
import { getSubjects, createSubject, updateSubject, deleteSubject, getChapters, createChapter, updateChapter, deleteChapter } from '../services/subjectService';
import { Subject, Chapter } from '../types';
import { useAuth } from '../features/auth/AuthContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const AdminSubjects: React.FC = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalMode, setModalMode] = useState<'subject' | 'chapter'>('subject');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedSubjects = await getSubjects();
      setSubjects(fetchedSubjects);
      if (fetchedSubjects.length > 0 && !selectedSubjectId) {
        setSelectedSubjectId(fetchedSubjects[0].id);
      }
      const fetchedChapters = await getChapters();
      setChapters(fetchedChapters);
    } catch (err: any) {
      console.error('Error loading subjects/chapters:', err);
      setError(err.message || 'Failed to load subjects and chapters.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSubject = async (data: Partial<Subject>) => {
    const userId = user?.uid || 'admin';
    if (editingSubject) {
      await updateSubject(editingSubject.id, data);
    } else {
      await createSubject({
        name: data.name || '',
        code: data.code || '',
        description: data.description || '',
        displayOrder: data.displayOrder || 1,
        isActive: data.isActive ?? true,
        createdBy: userId,
      });
    }
    await loadData();
  };

  const handleSaveChapter = async (data: Partial<Chapter>) => {
    const userId = user?.uid || 'admin';
    if (editingChapter) {
      await updateChapter(editingChapter.id, data);
    } else {
      await createChapter({
        subjectId: data.subjectId || selectedSubjectId || '',
        name: data.name || '',
        code: data.code || '',
        description: data.description || '',
        displayOrder: data.displayOrder || 1,
        isActive: data.isActive ?? true,
        createdBy: userId,
      });
    }
    await loadData();
  };

  const handleDeleteSubject = async (id: string) => {
    if (window.confirm('Are you sure you want to deactivate/delete this subject?')) {
      await deleteSubject(id);
      await loadData();
    }
  };

  const handleDeleteChapter = async (id: string) => {
    if (window.confirm('Are you sure you want to deactivate this chapter?')) {
      await deleteChapter(id);
      await loadData();
    }
  };

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId);
  const activeChapters = chapters.filter((c) => c.subjectId === selectedSubjectId);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="brand">Taxonomy Curation</Badge>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Subjects & Chapters Management
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Define curriculum structure and active chapters for the Master Question Bank
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setModalMode('subject');
                setEditingSubject(null);
                setIsModalOpen(true);
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Subject
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setModalMode('chapter');
                setEditingChapter(null);
                setIsModalOpen(true);
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Chapter
            </Button>
          </div>
        </div>

        {error && <ErrorState message={error} onRetry={loadData} />}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 md:col-span-2 rounded-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Subjects List */}
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-base">Subjects ({subjects.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-1">
                {subjects.length === 0 ? (
                  <EmptyState title="No Subjects Found" description="Add your first subject (e.g. Physics, Chemistry)." />
                ) : (
                  subjects.map((sub) => {
                    const isSelected = sub.id === selectedSubjectId;
                    return (
                      <div
                        key={sub.id}
                        onClick={() => setSelectedSubjectId(sub.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-brand-50/80 border-brand-300 text-brand-950 dark:bg-brand-950/40 dark:border-brand-700 dark:text-brand-200 font-semibold'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm">{sub.name}</h4>
                            <span className="text-[10px] uppercase font-bold text-slate-400">({sub.code})</span>
                          </div>
                          {sub.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[180px]">
                              {sub.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {sub.isActive ? (
                            <Badge variant="success" size="sm">Active</Badge>
                          ) : (
                            <Badge variant="neutral" size="sm">Inactive</Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalMode('subject');
                              setEditingSubject(sub);
                              setIsModalOpen(true);
                            }}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSubject(sub.id);
                            }}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Right Column: Chapters List for Selected Subject */}
            <Card className="md:col-span-2">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    Chapters for {activeSubject?.name || 'Select Subject'} ({activeChapters.length})
                  </CardTitle>
                  <CardDescription>Chapter ordering and topic indexing</CardDescription>
                </div>
                {activeSubject && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setModalMode('chapter');
                      setEditingChapter(null);
                      setIsModalOpen(true);
                    }}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Chapter to {activeSubject.name}
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-4">
                {activeChapters.length === 0 ? (
                  <EmptyState
                    title="No Chapters in Subject"
                    description="Create chapter topics for this subject to organize question banks."
                  />
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    {activeChapters.map((chap) => (
                      <div key={chap.id} className="py-3 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs font-bold">
                              #{chap.displayOrder}
                            </span>
                            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{chap.name}</h4>
                            <span className="text-xs text-slate-400 font-mono">({chap.code})</span>
                          </div>
                          {chap.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{chap.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {chap.isActive ? (
                            <Badge variant="success" size="sm">Active</Badge>
                          ) : (
                            <Badge variant="neutral" size="sm">Inactive</Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setModalMode('chapter');
                              setEditingChapter(chap);
                              setIsModalOpen(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteChapter(chap.id)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <SubjectChapterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        editingSubject={editingSubject}
        editingChapter={editingChapter}
        subjects={subjects}
        onSaveSubject={handleSaveSubject}
        onSaveChapter={handleSaveChapter}
      />
    </DashboardLayout>
  );
};
