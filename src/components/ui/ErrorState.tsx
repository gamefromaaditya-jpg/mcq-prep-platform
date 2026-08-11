import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/50">
      <div className="p-3 bg-rose-100 dark:bg-rose-900/50 rounded-full mb-3 text-rose-600 dark:text-rose-400">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-rose-950 dark:text-rose-200">{title}</h3>
      <p className="text-sm text-rose-700 dark:text-rose-300 mt-1 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-4 border-rose-300 text-rose-700 hover:bg-rose-100" leftIcon={<RotateCcw className="w-4 h-4" />}>
          Try Again
        </Button>
      )}
    </div>
  );
};
