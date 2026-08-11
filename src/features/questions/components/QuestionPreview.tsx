import React from 'react';
import { Question } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { CheckCircle2 } from 'lucide-react';

export interface QuestionPreviewProps {
  question: Question;
  showAnswerKey?: boolean;
}

export const QuestionPreview: React.FC<QuestionPreviewProps> = ({
  question,
  showAnswerKey = true,
}) => {
  const difficultyBadges = {
    easy: <Badge variant="success">Easy</Badge>,
    medium: <Badge variant="warning">Medium</Badge>,
    hard: <Badge variant="danger">Hard</Badge>,
  };

  const typeLabels = {
    single_correct: 'Single Correct',
    multiple_correct: 'Multiple Correct',
    integer: 'Integer Type',
    numerical: 'Numerical Type',
    match: 'Match Matrix',
  };

  return (
    <div className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      {/* Top Metadata Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-2">
          <Badge variant="brand">{typeLabels[question.type] || question.type}</Badge>
          {difficultyBadges[question.difficulty]}
          {question.isPublished ? (
            <Badge variant="success">Published</Badge>
          ) : (
            <Badge variant="neutral">Draft</Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Marks: <strong className="text-emerald-600 dark:text-emerald-400">+{question.marks}</strong></span>
          <span>Negative: <strong className="text-rose-600 dark:text-rose-400">-{question.negativeMarks}</strong></span>
          {question.exam && <span>Exam: {question.exam} {question.year}</span>}
        </div>
      </div>

      {/* Question Text */}
      <div className="space-y-3">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line">
          {question.questionText}
        </div>

        {question.questionImageUrl && (
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 max-w-md">
            <img
              src={question.questionImageUrl}
              alt="Question illustration"
              className="w-full h-auto max-h-72 object-contain bg-slate-50 dark:bg-slate-900"
            />
          </div>
        )}
      </div>

      {/* Dynamic Options / Answer Renderer */}
      <div className="space-y-3 pt-2">
        {/* Single & Multiple Correct */}
        {(question.type === 'single_correct' || question.type === 'multiple_correct') && question.options && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((opt) => {
              const isCorrect =
                showAnswerKey &&
                (question.type === 'single_correct'
                  ? question.correctAnswer === opt.id
                  : Array.isArray(question.correctAnswer) && question.correctAnswer.includes(opt.id));

              return (
                <div
                  key={opt.id}
                  className={`p-3.5 rounded-xl border text-xs font-medium flex items-start gap-3 transition-colors ${
                    isCorrect
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-200'
                      : 'bg-slate-50/50 border-slate-200 text-slate-700 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="font-bold shrink-0 uppercase text-slate-400 dark:text-slate-500">
                    {opt.id.replace('opt_', 'Option ')}:
                  </span>
                  <span className="flex-1">{opt.text}</span>
                  {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                </div>
              );
            })}
          </div>
        )}

        {/* Integer Answer */}
        {question.type === 'integer' && showAnswerKey && (
          <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl text-xs">
            <span className="font-semibold text-purple-900 dark:text-purple-300">Correct Integer Answer: </span>
            <strong className="text-base text-purple-700 dark:text-purple-200 ml-2">{String(question.correctAnswer)}</strong>
          </div>
        )}

        {/* Numerical Answer */}
        {question.type === 'numerical' && showAnswerKey && (
          <div className="p-4 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl text-xs">
            <span className="font-semibold text-sky-900 dark:text-sky-300">Correct Numerical Value: </span>
            {typeof question.correctAnswer === 'object' && question.correctAnswer !== null && 'value' in question.correctAnswer ? (
              <span className="text-sky-700 dark:text-sky-200 font-bold ml-2">
                {question.correctAnswer.value} (±{question.correctAnswer.tolerance || 0.01} tolerance)
              </span>
            ) : (
              <strong className="text-base text-sky-700 dark:text-sky-200 ml-2">{String(question.correctAnswer)}</strong>
            )}
          </div>
        )}

        {/* Match Matrix */}
        {question.type === 'match' && showAnswerKey && typeof question.correctAnswer === 'object' && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs space-y-2">
            <span className="font-semibold text-amber-900 dark:text-amber-300 block mb-1">Correct Pair Mappings:</span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(question.correctAnswer as Record<string, string>).map(([left, right]) => (
                <div key={left} className="px-2.5 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-amber-200 dark:border-amber-700 font-medium">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{left}</span> ➔ <span className="text-brand-600 font-bold">{right}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Explanation */}
      {question.explanation && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Solution & Explanation
          </h4>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
            {question.explanation}
          </p>
        </div>
      )}

      {/* Tags & Source */}
      {(question.tags?.length || question.source) && (
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-500">
          {question.source && <span className="font-medium">Source: {question.source}</span>}
          {question.tags?.map((t) => (
            <span key={t} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 rounded-md font-medium">
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
