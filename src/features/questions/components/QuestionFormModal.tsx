import React, { useState, useEffect } from 'react';
import { Question, QuestionType, QuestionDifficulty, Subject, Chapter } from '../../../types';
import { Dialog } from '../../../components/ui/Dialog';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { ErrorState } from '../../../components/ui/ErrorState';
import { validateQuestion } from '../utils/questionValidation';
import { uploadQuestionImageFile } from '../../../services/questionService';
import { Upload, X, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (questionData: Partial<Question>, shouldPublish: boolean) => Promise<void>;
  editingQuestion?: Question | null;
  subjects: Subject[];
  chapters: Chapter[];
  userId: string;
}

export const QuestionFormModal: React.FC<QuestionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingQuestion,
  subjects,
  chapters,
  userId,
}) => {
  const [subjectId, setSubjectId] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [type, setType] = useState<QuestionType>('single_correct');
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>('medium');
  const [questionText, setQuestionText] = useState('');
  const [marks, setMarks] = useState<number>(4);
  const [negativeMarks, setNegativeMarks] = useState<number>(1);
  const [exam, setExam] = useState('');
  const [year, setYear] = useState<string>('');
  const [source, setSource] = useState('');
  const [tags, setTags] = useState('');
  const [explanation, setExplanation] = useState('');
  const [questionImageUrl, setQuestionImageUrl] = useState('');

  // Type-specific answer states
  const [options, setOptions] = useState([
    { id: 'opt_1', text: '' },
    { id: 'opt_2', text: '' },
    { id: 'opt_3', text: '' },
    { id: 'opt_4', text: '' },
  ]);
  const [singleCorrectAns, setSingleCorrectAns] = useState('opt_1');
  const [multiCorrectAns, setMultiCorrectAns] = useState<string[]>(['opt_1']);
  const [integerAns, setIntegerAns] = useState<number | string>(0);
  const [numValue, setNumValue] = useState<number | string>(0);
  const [numTolerance, setNumTolerance] = useState<number | string>(0.01);
  const [matchPairs, setMatchPairs] = useState<Array<{ left: string; right: string }>>([
    { left: 'A', right: '1' },
    { left: 'B', right: '2' },
    { left: 'C', right: '3' },
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showTypeWarn, setShowTypeWarn] = useState(false);
  const [pendingType, setPendingType] = useState<QuestionType | null>(null);

  useEffect(() => {
    if (editingQuestion) {
      setSubjectId(editingQuestion.subjectId || '');
      setChapterId(editingQuestion.chapterId || '');
      setType(editingQuestion.type || 'single_correct');
      setDifficulty(editingQuestion.difficulty || 'medium');
      setQuestionText(editingQuestion.questionText || '');
      setMarks(editingQuestion.marks ?? 4);
      setNegativeMarks(editingQuestion.negativeMarks ?? 1);
      setExam(editingQuestion.exam || '');
      setYear(editingQuestion.year ? String(editingQuestion.year) : '');
      setSource(editingQuestion.source || '');
      setTags(editingQuestion.tags ? editingQuestion.tags.join(', ') : '');
      setExplanation(editingQuestion.explanation || '');
      setQuestionImageUrl(editingQuestion.questionImageUrl || '');

      if (editingQuestion.options && editingQuestion.options.length > 0) {
        setOptions(editingQuestion.options);
      }

      if (editingQuestion.type === 'single_correct') {
        setSingleCorrectAns(String(editingQuestion.correctAnswer || 'opt_1'));
      } else if (editingQuestion.type === 'multiple_correct' && Array.isArray(editingQuestion.correctAnswer)) {
        setMultiCorrectAns(editingQuestion.correctAnswer);
      } else if (editingQuestion.type === 'integer') {
        setIntegerAns(Number(editingQuestion.correctAnswer || 0));
      } else if (editingQuestion.type === 'numerical') {
        if (typeof editingQuestion.correctAnswer === 'object' && editingQuestion.correctAnswer !== null && 'value' in editingQuestion.correctAnswer) {
          setNumValue(editingQuestion.correctAnswer.value);
          setNumTolerance(editingQuestion.correctAnswer.tolerance ?? 0.01);
        } else {
          setNumValue(Number(editingQuestion.correctAnswer || 0));
        }
      } else if (editingQuestion.type === 'match' && typeof editingQuestion.correctAnswer === 'object') {
        const map = editingQuestion.correctAnswer as Record<string, string>;
        setMatchPairs(Object.entries(map).map(([left, right]) => ({ left, right })));
      }
    } else {
      resetForm();
    }
  }, [editingQuestion, isOpen]);

  const resetForm = () => {
    setSubjectId(subjects.length > 0 ? subjects[0].id : '');
    setChapterId('');
    setType('single_correct');
    setDifficulty('medium');
    setQuestionText('');
    setMarks(4);
    setNegativeMarks(1);
    setExam('');
    setYear('');
    setSource('');
    setTags('');
    setExplanation('');
    setQuestionImageUrl('');
    setOptions([
      { id: 'opt_1', text: '' },
      { id: 'opt_2', text: '' },
      { id: 'opt_3', text: '' },
      { id: 'opt_4', text: '' },
    ]);
    setSingleCorrectAns('opt_1');
    setMultiCorrectAns(['opt_1']);
    setIntegerAns(0);
    setNumValue(0);
    setNumTolerance(0.01);
    setMatchPairs([
      { left: 'A', right: '1' },
      { left: 'B', right: '2' },
      { left: 'C', right: '3' },
    ]);
    setErrors([]);
  };

  const handleTypeChange = (newType: QuestionType) => {
    if (newType === type) return;
    if (questionText || options.some((o) => o.text)) {
      setPendingType(newType);
      setShowTypeWarn(true);
    } else {
      setType(newType);
    }
  };

  const confirmTypeChange = () => {
    if (pendingType) {
      setType(pendingType);
      setPendingType(null);
    }
    setShowTypeWarn(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const qId = editingQuestion?.id || `temp_${Date.now()}`;
      const url = await uploadQuestionImageFile(file, qId);
      setQuestionImageUrl(url);
    } catch (err: any) {
      setErrors([err.message || 'Image upload failed.']);
    } finally {
      setIsUploading(false);
    }
  };

  const buildCorrectAnswer = (): any => {
    switch (type) {
      case 'single_correct':
        return singleCorrectAns;
      case 'multiple_correct':
        return multiCorrectAns;
      case 'integer':
        return Number(integerAns);
      case 'numerical':
        return { value: Number(numValue), tolerance: Number(numTolerance) };
      case 'match': {
        const map: Record<string, string> = {};
        matchPairs.forEach((p) => {
          if (p.left.trim()) map[p.left.trim()] = p.right.trim();
        });
        return map;
      }
      default:
        return singleCorrectAns;
    }
  };

  const handleSubmit = async (shouldPublish: boolean) => {
    const computedCorrectAnswer = buildCorrectAnswer();
    const tagsArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const questionData: Partial<Question> = {
      subjectId,
      chapterId,
      type,
      difficulty,
      questionText,
      options: type === 'single_correct' || type === 'multiple_correct' ? options : undefined,
      correctAnswer: computedCorrectAnswer,
      explanation,
      marks: Number(marks),
      negativeMarks: Number(negativeMarks),
      exam: exam.trim() || undefined,
      year: year ? Number(year) : undefined,
      source: source.trim() || undefined,
      tags: tagsArray,
      questionImageUrl: questionImageUrl || undefined,
      isPublished: shouldPublish,
      createdBy: userId,
    };

    const validationErrors = validateQuestion(questionData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors.map((e) => e.message));
      return;
    }

    setErrors([]);
    setIsLoading(true);

    try {
      await onSave(questionData, shouldPublish);
      onClose();
    } catch (err: any) {
      setErrors([err.message || 'Failed to save question.']);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredChapters = chapters.filter((c) => !subjectId || c.subjectId === subjectId);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={editingQuestion ? 'Edit Master Question' : 'Create New Master Question'}
      description="Configure question attributes, choices, dynamic scoring, and publishing state"
      size="xl"
    >
      <div className="space-y-6">
        {errors.length > 0 && (
          <ErrorState message={errors.join(' | ')} />
        )}

        {/* Warning on Question Type Change */}
        {showTypeWarn && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-xl text-xs space-y-2">
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              Warning: Changing question type will reset current option and answer structures.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="danger" onClick={confirmTypeChange}>
                Confirm Change
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowTypeWarn(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Section 1: Taxonomy & Attributes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Subject *"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            options={subjects.map((s) => ({ value: s.id, label: s.name }))}
          />

          <Select
            label="Chapter *"
            value={chapterId}
            onChange={(e) => setChapterId(e.target.value)}
            options={[
              { value: '', label: '-- Select Chapter --' },
              ...filteredChapters.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />

          <Select
            label="Question Type *"
            value={type}
            onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
            options={[
              { value: 'single_correct', label: 'Single Correct MCQ' },
              { value: 'multiple_correct', label: 'Multiple Correct MCQ' },
              { value: 'integer', label: 'Integer Type' },
              { value: 'numerical', label: 'Numerical (Value + Tolerance)' },
              { value: 'match', label: 'Match Matrix' },
            ]}
          />
        </div>

        {/* Section 2: Question Text & Image */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Question Text *
          </label>
          <textarea
            rows={4}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Type the full question statement..."
            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />

          <div className="flex items-center gap-4">
            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Upload className="w-4 h-4 text-slate-500" />
              {isUploading ? 'Uploading Image...' : 'Upload Question Image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
            </label>

            {questionImageUrl && (
              <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                <span>Image attached</span>
                <button onClick={() => setQuestionImageUrl('')} className="text-rose-500 hover:text-rose-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Dynamic Answer Editor */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Answer & Choices Setup ({type.replace('_', ' ')})
          </h4>

          {/* Single Correct Editor */}
          {type === 'single_correct' && (
            <div className="space-y-3">
              {options.map((opt, idx) => (
                <div key={opt.id} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="single_ans"
                    checked={singleCorrectAns === opt.id}
                    onChange={() => setSingleCorrectAns(opt.id)}
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs font-bold uppercase text-slate-400">Option {String.fromCharCode(65 + idx)}:</span>
                  <Input
                    value={opt.text}
                    onChange={(e) => {
                      const next = [...options];
                      next[idx].text = e.target.value;
                      setOptions(next);
                    }}
                    placeholder={`Enter choice text for Option ${String.fromCharCode(65 + idx)}`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Multiple Correct Editor */}
          {type === 'multiple_correct' && (
            <div className="space-y-3">
              {options.map((opt, idx) => (
                <div key={opt.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={multiCorrectAns.includes(opt.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMultiCorrectAns([...multiCorrectAns, opt.id]);
                      } else {
                        setMultiCorrectAns(multiCorrectAns.filter((id) => id !== opt.id));
                      }
                    }}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                  />
                  <span className="text-xs font-bold uppercase text-slate-400">Option {String.fromCharCode(65 + idx)}:</span>
                  <Input
                    value={opt.text}
                    onChange={(e) => {
                      const next = [...options];
                      next[idx].text = e.target.value;
                      setOptions(next);
                    }}
                    placeholder={`Enter choice text for Option ${String.fromCharCode(65 + idx)}`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Integer Editor */}
          {type === 'integer' && (
            <Input
              label="Correct Integer Answer *"
              type="number"
              value={integerAns}
              onChange={(e) => setIntegerAns(e.target.value)}
              placeholder="e.g. 5"
            />
          )}

          {/* Numerical Editor */}
          {type === 'numerical' && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Target Numerical Value *"
                type="number"
                step="any"
                value={numValue}
                onChange={(e) => setNumValue(e.target.value)}
                placeholder="e.g. 12.5"
              />
              <Input
                label="Allowed Tolerance Band (±) *"
                type="number"
                step="any"
                value={numTolerance}
                onChange={(e) => setNumTolerance(e.target.value)}
                placeholder="e.g. 0.01"
              />
            </div>
          )}

          {/* Match Matrix Editor */}
          {type === 'match' && (
            <div className="space-y-3">
              {matchPairs.map((pair, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Input
                    value={pair.left}
                    onChange={(e) => {
                      const next = [...matchPairs];
                      next[idx].left = e.target.value;
                      setMatchPairs(next);
                    }}
                    placeholder="Col A Item (e.g. A)"
                    className="w-1/3"
                  />
                  <span className="text-slate-400 font-bold">➔</span>
                  <Input
                    value={pair.right}
                    onChange={(e) => {
                      const next = [...matchPairs];
                      next[idx].right = e.target.value;
                      setMatchPairs(next);
                    }}
                    placeholder="Col B Match (e.g. 1)"
                    className="w-1/2"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMatchPairs(matchPairs.filter((_, i) => i !== idx))}
                    className="text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMatchPairs([...matchPairs, { left: '', right: '' }])}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Pair Mapping
              </Button>
            </div>
          )}
        </div>

        {/* Section 4: Scoring & Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Difficulty *"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as QuestionDifficulty)}
            options={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' },
            ]}
          />

          <Input
            label="Marks (+)"
            type="number"
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
          />

          <Input
            label="Negative Marks (-)"
            type="number"
            value={negativeMarks}
            onChange={(e) => setNegativeMarks(Number(e.target.value))}
          />

          <Input
            label="Exam Tag"
            value={exam}
            onChange={(e) => setExam(e.target.value)}
            placeholder="e.g. JEE Main"
          />
        </div>

        {/* Section 5: Metadata & Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 2024"
          />

          <Input
            label="Source / Reference"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. PYQ 2024 Shift 1"
          />
        </div>

        <Input
          label="Tags (Comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="mechanics, rotational, high-yield"
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Explanation / Solution
          </label>
          <textarea
            rows={3}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Step-by-step mathematical or conceptual solution..."
            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        {/* Action Buttons: Save Draft vs Publish */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit(false)}
            isLoading={isLoading}
          >
            Save as Draft
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSubmit(true)}
            isLoading={isLoading}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Publish Question
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
