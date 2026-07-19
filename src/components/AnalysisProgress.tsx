import { AnalysisJob } from '../lib/types';
import { Loader, CheckCircle2, AlertCircle } from 'lucide-react';

interface AnalysisProgressProps {
  status: AnalysisJob | null;
  fileName?: string;
}

export function AnalysisProgress({ status, fileName }: AnalysisProgressProps) {
  if (!status) return null;

  const isComplete = status.status === 'COMPLETED';
  const isFailed = status.status === 'FAILED';
  const isRunning = status.status === 'RUNNING' || status.status === 'QUEUED';

  return (
    <div className="w-full max-w-2xl mx-auto animate-slideIn">
      <div className="card-lg">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {isRunning && (
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-500/20 animate-pulse">
                <Loader className="w-6 h-6 text-primary-400 animate-spin" />
              </div>
            )}
            {isComplete && (
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/20">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
            )}
            {isFailed && (
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-error/20">
                <AlertCircle className="w-6 h-6 text-error" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-100 mb-1">
              {isRunning && 'Analyzing Transcript...'}
              {isComplete && 'Analysis Complete! 🎉'}
              {isFailed && 'Analysis Failed'}
            </h3>
            {fileName && (
              <p className="text-sm text-slate-400 mb-3 truncate">
                File: <span className="text-slate-300">{fileName}</span>
              </p>
            )}

            {isRunning && (
              <>
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">Progress</span>
                    <span className="text-sm font-medium text-primary-400">
                      {status.progress_percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500 rounded-full"
                      style={{ width: `${status.progress_percent}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Extracting pain points, themes, segments, and recommendations...
                </p>
              </>
            )}

            {isComplete && (
              <p className="text-sm text-slate-400">
                Your insights are ready. Scroll down to see the dashboard.
              </p>
            )}

            {isFailed && (
              <div className="bg-error/10 border border-error/30 rounded-lg p-3 mt-3">
                <p className="text-sm text-error">
                  {status.error || 'An error occurred during analysis'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
