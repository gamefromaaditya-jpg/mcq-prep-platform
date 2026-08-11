import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Dialog } from '../components/ui/Dialog';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { useToast } from '../components/ui/Toast';
import { QuestionPreview } from '../features/questions/components/QuestionPreview';
import { QuestionFormModal } from '../features/questions/components/QuestionFormModal';
import { CSVImportModal } from '../features/questions/components/CSVImportModal';
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  publishQuestion,
  unpublishQuestion,
  deleteOrArchiveQuestion,
  QuestionFilterOptions,
} from '../services/questionService';
import { getSubjects, getChapters } from '../services/subjectService';
import { Question, QuestionType, QuestionDifficulty, Subject, Chapter } from '../types';
import { useAuth } from '../features/auth/AuthContext';
import {
  Plus,
  FileUp,
  Search,
  Eye,
  Edit2,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  FileQuestion,
  Layers,
  ChevronDown,
} from 'lucide-react';

export const AdminQuestionBank: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [chapterFilter, setChapterFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchText, setSearchText] = useState('');

  // Pagination state
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCSVOpen, setIsCSVOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  // Stats summary
  const totalCount = questions.length;
  const publishedCount = questions.filter((q) => q.isPublished).length;
  const draftCount = questions.filter((q) => !q.isPublished).length;

  const loadTaxonomies = async () => {
    try {
      const subs = await getSubjects();
      setSubjects(subs);
      const chaps = await getChapters();
      setChapters(chaps);
    } catch (err) {
      console.error('Error fetching taxonomies:', err);
    }
  };

  const loadQuestionsData = useCallback(async (reset = true) => {
    if (reset) {
      setIsLoading(true);
      setLastDoc(null);
    } else {
      setIsLoadingMore(true);
    }

    setError(null);

    try {
      const filterOpts: QuestionFilterOptions = {
        subjectId: subjectFilter !== 'all' ? subjectFilter : undefined,
        chapterId: chapterFilter !== 'all' ? chapterFilter : undefined,
        type: typeFilter !== 'all' ? (typeFilter as QuestionType) : undefined,
        difficulty: difficultyFilter !== 'all' ? (difficultyFilter as QuestionDifficulty) : undefined,
        isPublished: statusFilter === 'published' ? true : statusFilter === 'draft' ? false : undefined,
        searchText: searchText.trim() || undefined,
        pageSize: 15,
        lastDoc: reset ? null : lastDoc,
      };

      const result = await getQuestions(filterOpts);

      if (reset) {
        setQuestions(result.questions);
      } else {
        setQuestions((prev) => [...prev, ...result.questions]);
      }

      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err: any) {
      console.error('Error loading question bank:', err);
      setError(err.message || 'Failed to load question bank data.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [subjectFilter, chapterFilter, typeFilter, difficultyFilter, statusFilter, searchText, lastDoc]);

  useEffect(() => {
    loadTaxonomies();
  }, []);

  useEffect(() => {
    loadQuestionsData(true);
  }, [subjectFilter, chapterFilter, typeFilter, difficultyFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadQuestionsData(true);
  };

  const handleSaveQuestion = async (questionData: Partial<Question>, shouldPublish: boolean) => {
    const userId = user?.uid || 'admin';
    if (selectedQuestion) {
      await updateQuestion(selectedQuestion.id, {
        ...questionData,
        isPublished: shouldPublish,
      });
      showToast({ type: 'success', title: 'Question Updated', description: 'Question changes saved successfully.' });
    } else {
      await createQuestion({
        ...(questionData as any),
        isPublished: shouldPublish,
        createdBy: userId,
      });
      showToast({ type: 'success', title: 'Question Created', description: shouldPublish ? 'Question created and published.' : 'Question saved as draft.' });
    }
    loadQuestionsData(true);
  };

  const handleTogglePublishStatus = async (q: Question) => {
    try {
      if (q.isPublished) {
        await unpublishQuestion(q.id);
        showToast({ type: 'info', title: 'Question Unpublished', description: 'Question moved to draft state.' });
      } else {
        await publishQuestion(q.id);
        showToast({ type: 'success', title: 'Question Published', description: 'Question is now live for students.' });
      }
      loadQuestionsData(true);
    } catch (err: any) {
      showToast({ type: 'error', title: 'Action Failed', description: err.message });
    }
  };

  const handleArchiveDelete = async (q: Question) => {
    if (window.confirm(`Archive question "${q.questionText.substring(0, 40)}..."? This will set it to draft to preserve test reference integrity.`)) {
      await deleteOrArchiveQuestion(q.id);
      showToast({ type: 'info', title: 'Question Archived', description: 'Question set to unpublished status.' });
      loadQuestionsData(true);
    }
  };

  const filteredChapters = chapters.filter((c) => subjectFilter === 'all' || c.subjectId === subjectFilter);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="brand">Master Question Bank</Badge>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Master Question Bank
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Curate, edit, validate, and bulk import exam questions across subjects and formats
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsCSVOpen(true)}
              leftIcon={<FileUp className="w-4 h-4" />}
            >
              Import CSV
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setSelectedQuestion(null);
                setIsFormOpen(true);
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Question
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card hoverEffect>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-brand-50 dark:bg-brand-950/60 text-brand-600 rounded-xl">
                <FileQuestion className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Questions</p>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">{totalCount}</h4>
              </div>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Published Live</p>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">{publishedCount}</h4>
              </div>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 rounded-xl">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Drafts</p>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">{draftCount}</h4>
              </div>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 dark:bg-purple-950/60 text-purple-600 rounded-xl">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Active Subjects</p>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">{subjects.length}</h4>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar: Multi-Filter & Search */}
        <Card className="p-4">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-3 items-center">
              <div className="w-full lg:flex-1">
                <Input
                  placeholder="Search question text, tags, or source..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <Select
                  value={subjectFilter}
                  onChange={(e) => {
                    setSubjectFilter(e.target.value);
                    setChapterFilter('all');
                  }}
                  options={[
                    { value: 'all', label: 'All Subjects' },
                    ...subjects.map((s) => ({ value: s.id, label: s.name })),
                  ]}
                  className="w-40"
                />

                <Select
                  value={chapterFilter}
                  onChange={(e) => setChapterFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Chapters' },
                    ...filteredChapters.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                  className="w-40"
                />

                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Types' },
                    { value: 'single_correct', label: 'Single Correct' },
                    { value: 'multiple_correct', label: 'Multiple Correct' },
                    { value: 'integer', label: 'Integer' },
                    { value: 'numerical', label: 'Numerical' },
                    { value: 'match', label: 'Match Matrix' },
                  ]}
                  className="w-36"
                />

                <Select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Difficulty' },
                    { value: 'easy', label: 'Easy' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'hard', label: 'Hard' },
                  ]}
                  className="w-32"
                />

                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'published', label: 'Published' },
                    { value: 'draft', label: 'Draft' },
                  ]}
                  className="w-32"
                />

                <Button type="submit" variant="secondary" size="md">
                  Search
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setSearchText('');
                    setSubjectFilter('all');
                    setChapterFilter('all');
                    setTypeFilter('all');
                    setDifficultyFilter('all');
                    setStatusFilter('all');
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {error && <ErrorState message={error} onRetry={() => loadQuestionsData(true)} />}

        {/* Questions Table View */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Question Records</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadQuestionsData(true)}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : questions.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="No Questions Found"
                  description="No master questions match the current filter criteria. Create a new question or import a CSV file."
                  actionLabel="Add Question"
                  onAction={() => {
                    setSelectedQuestion(null);
                    setIsFormOpen(true);
                  }}
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-4">Question Statement</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Difficulty</th>
                      <th className="p-4">Scoring</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    {questions.map((q) => {
                      const sub = subjects.find((s) => s.id === q.subjectId);
                      const chap = chapters.find((c) => c.id === q.chapterId);

                      return (
                        <tr key={q.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                          <td className="p-4 max-w-md">
                            <div className="font-medium text-slate-900 dark:text-slate-100 line-clamp-2 leading-relaxed">
                              {q.questionText}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                              <span>{sub?.name || 'Subject'}</span>
                              <span>•</span>
                              <span>{chap?.name || 'Chapter'}</span>
                              {q.exam && (
                                <>
                                  <span>•</span>
                                  <span className="font-semibold text-slate-500">{q.exam} {q.year}</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="brand">{q.type.replace('_', ' ')}</Badge>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={
                                q.difficulty === 'easy'
                                  ? 'success'
                                  : q.difficulty === 'medium'
                                  ? 'warning'
                                  : 'danger'
                              }
                            >
                              {q.difficulty}
                            </Badge>
                          </td>
                          <td className="p-4 font-semibold">
                            <span className="text-emerald-600">+{q.marks}</span> /{' '}
                            <span className="text-rose-600">-{q.negativeMarks}</span>
                          </td>
                          <td className="p-4">
                            {q.isPublished ? (
                              <Badge variant="success">Published</Badge>
                            ) : (
                              <Badge variant="neutral">Draft</Badge>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedQuestion(q);
                                  setIsPreviewOpen(true);
                                }}
                                title="Preview Question"
                              >
                                <Eye className="w-4 h-4 text-slate-600" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedQuestion(q);
                                  setIsFormOpen(true);
                                }}
                                title="Edit Question"
                              >
                                <Edit2 className="w-4 h-4 text-blue-600" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleTogglePublishStatus(q)}
                                title={q.isPublished ? 'Unpublish to Draft' : 'Publish Question'}
                              >
                                {q.isPublished ? (
                                  <XCircle className="w-4 h-4 text-amber-600" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                )}
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleArchiveDelete(q)}
                                className="text-rose-500 hover:text-rose-700"
                                title="Archive / Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Load More Pagination */}
        {hasMore && (
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={() => loadQuestionsData(false)}
              isLoading={isLoadingMore}
              leftIcon={<ChevronDown className="w-4 h-4" />}
            >
              Load More Questions
            </Button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <QuestionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveQuestion}
        editingQuestion={selectedQuestion}
        subjects={subjects}
        chapters={chapters}
        userId={user?.uid || 'admin'}
      />

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={isCSVOpen}
        onClose={() => setIsCSVOpen(false)}
        onImportComplete={() => loadQuestionsData(true)}
        subjects={subjects}
        chapters={chapters}
        userId={user?.uid || 'admin'}
      />

      {/* Preview Dialog */}
      {selectedQuestion && (
        <Dialog
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title="Master Question Admin Preview"
          size="lg"
        >
          <QuestionPreview question={selectedQuestion} showAnswerKey={true} />
        </Dialog>
      )}
    </DashboardLayout>
  );
};
