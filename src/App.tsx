import { useEffect, useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { Upload } from './components/Upload';
import { AnalysisProgress } from './components/AnalysisProgress';
import { Dashboard } from './components/Dashboard';
import { ReportButton } from './components/ReportButton';
import { useAnalysis } from './hooks/useAnalysis';
import { ReportData } from './lib/types';
import { apiClient } from './lib/api';

export function App() {
  const { upload, analysisStatus, insights, loading, error, uploadFile, reset } = useAnalysis();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch report data on successful analysis completion
  useEffect(() => {
    if (insights && upload) {
      apiClient.getReport(upload.transcript_id)
        .then((data) => setReportData(data))
        .catch((err) => {
          console.error('Failed to fetch report:', err);
          setReportData({
            transcript_id: upload.transcript_id,
            file_name: upload.file_name,
            created_at: new Date().toISOString(),
            insights: insights,
          });
        });
    }
  }, [insights, upload]);

  // Handle any API errors
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  const handleError = (err: string) => {
    setErrorMessage(err);
  };

  const handleReset = () => {
    reset();
    setReportData(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">DiscoveryOS</h1>
                <p className="text-xs text-slate-400">AI-Powered User Research Intelligence</p>
              </div>
            </div>
            {insights && (
              <button
                onClick={handleReset}
                className="btn-secondary"
              >
                Analyze Another
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-8 bg-error/10 border border-error/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-error mb-1">Error</h3>
              <p className="text-sm text-error/80">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Upload Section */}
        {!insights && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-3">
                Transform User Research Into{' '}
                <span className="text-gradient">Actionable Insights</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Upload interview transcripts and let our AI agent extract pain points, identify user segments, 
                discover themes, and generate product recommendations instantly.
              </p>
            </div>

            <Upload
              onUpload={uploadFile}
              onUploadStart={() => setErrorMessage(null)}
              onError={handleError}
              isLoading={loading}
            />

            {/* Analysis Progress */}
            {analysisStatus && !insights && (
              <AnalysisProgress
                status={analysisStatus}
                fileName={upload?.file_name}
              />
            )}
          </div>
        )}

        {/* Dashboard Section */}
        {insights && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gradient mb-2">
                  Your Insights Dashboard
                </h2>
                <p className="text-slate-400">
                  Detailed analysis from <span className="text-slate-300 font-medium">{upload?.file_name}</span>
                </p>
              </div>
              <ReportButton report={reportData} fileName={upload?.file_name} />
            </div>

            <Dashboard insights={insights} />

            {/* Footer CTA */}
            <div className="mt-12 p-8 rounded-xl border border-accent-500/30 bg-accent-500/5">
              <h3 className="text-xl font-semibold text-accent-300 mb-2">
                Ready for more insights?
              </h3>
              <p className="text-slate-400 mb-4">
                Upload additional transcripts to see cross-interview patterns and trends emerge.
              </p>
              <button
                onClick={handleReset}
                className="btn-primary"
              >
                Analyze Another Interview
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!upload && !insights && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/10 mb-6">
              <Sparkles className="w-8 h-8 text-primary-400" />
            </div>
            <p className="text-slate-400">
              Start by uploading a transcript to see the magic happen ✨
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/50 backdrop-blur-md mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-slate-500">
          <p>
            DiscoveryOS • AI-powered product discovery platform for the hackathon era 🚀
          </p>
        </div>
      </footer>
    </div>
  );
}
