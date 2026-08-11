import React, { useState } from 'react';
import { Subject, Chapter, CSVImportSummary, CSVRowResult, CSVValidationError } from '../../../types';
import { Dialog } from '../../../components/ui/Dialog';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardContent } from '../../../components/ui/Card';
import { ErrorState } from '../../../components/ui/ErrorState';
import { parseCSVText, validateAndAnalyzeCSV, executeBatchImport, generateErrorReportCSV } from '../../../services/csvImportService';
import { Upload, CheckCircle2, Download } from 'lucide-react';

export interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
  subjects: Subject[];
  chapters: Chapter[];
  userId: string;
}

export const CSVImportModal: React.FC<CSVImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
  subjects,
  chapters,
  userId,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects.length > 0 ? subjects[0].id : '');
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [summary, setSummary] = useState<CSVImportSummary | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importDone, setImportDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.endsWith('.csv')) {
        setErrorMsg('Please select a valid .csv file.');
        return;
      }
      setFile(selected);
      setErrorMsg(null);
      setSummary(null);
      setImportDone(false);
    }
  };

  const handleAnalyzeCSV = async () => {
    if (!file) {
      setErrorMsg('Please select a CSV file first.');
      return;
    }
    if (!selectedSubjectId || !selectedChapterId) {
      setErrorMsg('Please select both Subject and Chapter for the import.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const text = await file.text();
      const rows = parseCSVText(text);

      if (rows.length === 0) {
        setErrorMsg('The selected CSV file is empty or missing valid headers.');
        return;
      }

      const analyzedSummary = await validateAndAnalyzeCSV(rows, selectedSubjectId, selectedChapterId, userId);
      setSummary(analyzedSummary);
    } catch (err: any) {
      console.error('Error analyzing CSV:', err);
      setErrorMsg(err.message || 'Failed to parse CSV file.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunBatchImport = async () => {
    if (!summary || summary.validRowsCount === 0) return;

    setIsImporting(true);
    setErrorMsg(null);

    try {
      const validResults = summary.results.filter((r: CSVRowResult) => r.isValid);
      const { importedCount, failedCount } = await executeBatchImport(
        validResults,
        selectedSubjectId,
        selectedChapterId,
        userId
      );

      setSummary((prev: CSVImportSummary | null) =>
        prev
          ? {
              ...prev,
              importedCount,
              failedCount,
            }
          : null
      );
      setImportDone(true);
      onImportComplete();
    } catch (err: any) {
      console.error('Batch import failed:', err);
      setErrorMsg(err.message || 'Batch import failed.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadErrorReport = () => {
    if (!summary) return;
    const reportText = generateErrorReportCSV(summary);
    const blob = new Blob([reportText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `import_error_report_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredChapters = chapters.filter((c) => !selectedSubjectId || c.subjectId === selectedSubjectId);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk CSV Question Import"
      description="Upload and validate bulk question banks with automated duplicate detection and batch writes"
      size="xl"
    >
      <div className="space-y-6">
        {errorMsg && <ErrorState message={errorMsg} />}

        {/* Step 1: Target Taxonomies & File Upload */}
        {!importDone && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Target Subject *"
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setSelectedChapterId('');
              }}
              options={subjects.map((s) => ({ value: s.id, label: s.name }))}
            />

            <Select
              label="Target Chapter *"
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              options={[
                { value: '', label: '-- Select Chapter --' },
                ...filteredChapters.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Select .CSV File *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        {file && !summary && !importDone && (
          <Button
            onClick={handleAnalyzeCSV}
            isLoading={isAnalyzing}
            variant="primary"
            className="w-full py-2.5"
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Analyze & Validate CSV File
          </Button>
        )}

        {/* Step 2: Summary Stats Breakdown */}
        {summary && !importDone && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-slate-500 font-medium">Total Rows</p>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{summary.totalRows}</h4>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-emerald-600 font-medium">Valid Rows</p>
                  <h4 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{summary.validRowsCount}</h4>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-rose-600 font-medium">Invalid Rows</p>
                  <h4 className="text-2xl font-bold text-rose-600 dark:text-rose-400">{summary.invalidRowsCount}</h4>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-amber-600 font-medium">Duplicates</p>
                  <h4 className="text-2xl font-bold text-amber-600 dark:text-amber-400">{summary.duplicateRowsCount}</h4>
                </CardContent>
              </Card>
            </div>

            {/* Verification Table */}
            <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold sticky top-0">
                  <tr>
                    <th className="p-3">Row</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Question Snippet</th>
                    <th className="p-3">Validation Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {summary.results.map((res: CSVRowResult) => (
                    <tr key={res.row.rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="p-3 font-semibold text-slate-500">#{res.row.rowIndex}</td>
                      <td className="p-3">
                        {res.isValid ? (
                          <Badge variant="success">Valid</Badge>
                        ) : res.isDuplicate ? (
                          <Badge variant="warning">Duplicate</Badge>
                        ) : (
                          <Badge variant="danger">Invalid</Badge>
                        )}
                      </td>
                      <td className="p-3 font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs">
                        {res.row.question || 'N/A'}
                      </td>
                      <td className="p-3 text-slate-500">
                        {res.isValid ? (
                          <span className="text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ready for import
                          </span>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400">
                            {res.errors.map((e: CSVValidationError) => e.message).join(' | ')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Actions: Download Error Log & Confirm Batch Import */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              {summary.invalidRowsCount > 0 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadErrorReport}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download Error Report CSV
                </Button>
              ) : <div />}

              <Button
                variant="primary"
                onClick={handleRunBatchImport}
                isLoading={isImporting}
                disabled={summary.validRowsCount === 0}
                leftIcon={<Upload className="w-4 h-4" />}
              >
                Import {summary.validRowsCount} Valid Rows to Firestore
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Final Completion Summary Report */}
        {importDone && summary && (
          <div className="text-center py-8 space-y-4">
            <div className="inline-flex p-4 bg-emerald-500/10 text-emerald-500 rounded-full">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Bulk Import Successfully Completed!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Batch written <strong className="text-emerald-600 font-semibold">{summary.importedCount} questions</strong> directly to Cloud Firestore. Skipped {summary.invalidRowsCount} invalid or duplicate rows.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Button variant="primary" onClick={onClose}>
                Done & Return to Question Bank
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};
