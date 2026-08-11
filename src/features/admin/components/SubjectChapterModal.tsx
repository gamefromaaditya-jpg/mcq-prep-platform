import React, { useState, useEffect } from 'react';
import { Subject, Chapter } from '../../../types';
import { Dialog } from '../../../components/ui/Dialog';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { ErrorState } from '../../../components/ui/ErrorState';

export interface SubjectChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'subject' | 'chapter';
  editingSubject?: Subject | null;
  editingChapter?: Chapter | null;
  subjects: Subject[];
  onSaveSubject: (data: Partial<Subject>) => Promise<void>;
  onSaveChapter: (data: Partial<Chapter>) => Promise<void>;
}

export const SubjectChapterModal: React.FC<SubjectChapterModalProps> = ({
  isOpen,
  onClose,
  mode,
  editingSubject,
  editingChapter,
  subjects,
  onSaveSubject,
  onSaveChapter,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [subjectId, setSubjectId] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'subject') {
      if (editingSubject) {
        setName(editingSubject.name || '');
        setCode(editingSubject.code || '');
        setDescription(editingSubject.description || '');
        setDisplayOrder(editingSubject.displayOrder || 1);
        setIsActive(editingSubject.isActive ?? true);
      } else {
        setName('');
        setCode('');
        setDescription('');
        setDisplayOrder(1);
        setIsActive(true);
      }
    } else if (mode === 'chapter') {
      if (editingChapter) {
        setName(editingChapter.name || '');
        setCode(editingChapter.code || '');
        setDescription(editingChapter.description || '');
        setDisplayOrder(editingChapter.displayOrder || 1);
        setSubjectId(editingChapter.subjectId || '');
        setIsActive(editingChapter.isActive ?? true);
      } else {
        setName('');
        setCode('');
        setDescription('');
        setDisplayOrder(1);
        setSubjectId(subjects.length > 0 ? subjects[0].id : '');
        setIsActive(true);
      }
    }
  }, [mode, editingSubject, editingChapter, isOpen, subjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || name.trim().length === 0) {
      setError('Name is required.');
      return;
    }
    if (!code || code.trim().length === 0) {
      setError('Code is required.');
      return;
    }
    if (mode === 'chapter' && !subjectId) {
      setError('Subject selection is required for a chapter.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'subject') {
        await onSaveSubject({
          name: name.trim(),
          code: code.trim().toUpperCase(),
          description: description.trim(),
          displayOrder: Number(displayOrder),
          isActive,
        });
      } else {
        await onSaveChapter({
          subjectId,
          name: name.trim(),
          code: code.trim().toUpperCase(),
          description: description.trim(),
          displayOrder: Number(displayOrder),
          isActive,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save item.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'subject'
          ? editingSubject ? 'Edit Subject' : 'Add New Subject'
          : editingChapter ? 'Edit Chapter' : 'Add New Chapter'
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorState message={error} />}

        {mode === 'chapter' && (
          <Select
            label="Associated Subject *"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            options={subjects.map((s) => ({ value: s.id, label: s.name }))}
          />
        )}

        <Input
          label="Name *"
          placeholder={mode === 'subject' ? 'Physics' : 'Rotational Dynamics'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Code *"
          placeholder={mode === 'subject' ? 'PHYS' : 'PHYS_ROT'}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <Input
          label="Display Order *"
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(Number(e.target.value))}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description..."
            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="isActiveCheck"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
          />
          <label htmlFor="isActiveCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Active Status (Enabled for Question Bank selection)
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Save {mode === 'subject' ? 'Subject' : 'Chapter'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
