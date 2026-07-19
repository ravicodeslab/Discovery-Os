import { useState, useCallback } from 'react';
import { apiClient } from '../lib/api';
import { FileUpload, AnalysisJob, InsightResponse } from '../lib/types';

export function useAnalysis() {
  const [upload, setUpload] = useState<FileUpload | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisJob | null>(null);
  const [insights, setInsights] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upload file
  const uploadFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.uploadTranscript(file);
      setUpload(result);
      // Start polling immediately
      pollAnalysisStatus(result.transcript_id);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll analysis status
  const pollAnalysisStatus = useCallback((transcriptId: string) => {
    const interval = setInterval(async () => {
      try {
        const status = await apiClient.getAnalysisStatus(transcriptId);
        setAnalysisStatus(status);

        if (status.status === 'COMPLETED') {
          clearInterval(interval);
          // Fetch insights
          const insightsData = await apiClient.getInsights(transcriptId);
          setInsights(insightsData);
        } else if (status.status === 'FAILED') {
          clearInterval(interval);
          setError(status.error || 'Analysis failed');
        }
      } catch (err) {
        console.error('Poll error:', err);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch insights for a transcript
  const fetchInsights = useCallback(async (transcriptId: string) => {
    setLoading(true);
    setError(null);
    try {
      const insightsData = await apiClient.getInsights(transcriptId);
      setInsights(insightsData);
      return insightsData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch insights';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setUpload(null);
    setAnalysisStatus(null);
    setInsights(null);
    setError(null);
  }, []);

  return {
    upload,
    analysisStatus,
    insights,
    loading,
    error,
    uploadFile,
    fetchInsights,
    reset,
  };
}
