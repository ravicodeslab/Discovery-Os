import axios, { AxiosInstance } from 'axios';
import { FileUpload, AnalysisJob, InsightResponse, ReportData } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
    });
  }

  // Upload transcript
  async uploadTranscript(file: File): Promise<FileUpload> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await this.client.post<FileUpload>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  // Check analysis status
  async getAnalysisStatus(transcriptId: string): Promise<AnalysisJob> {
    try {
      const response = await this.client.get<AnalysisJob>(`/analysis/${transcriptId}`);
      return response.data;
    } catch (error) {
      console.error('Status check failed:', error);
      throw error;
    }
  }

  // Get insights
  async getInsights(transcriptId: string): Promise<InsightResponse> {
    try {
      const response = await this.client.get<InsightResponse>(`/insights/${transcriptId}`);
      return response.data;
    } catch (error) {
      console.error('Insights fetch failed:', error);
      throw error;
    }
  }

  // Get report
  async getReport(transcriptId: string): Promise<ReportData> {
    try {
      const response = await this.client.get<ReportData>(`/report/${transcriptId}`);
      return response.data;
    } catch (error) {
      console.error('Report fetch failed:', error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
