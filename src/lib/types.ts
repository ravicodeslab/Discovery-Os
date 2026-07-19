export interface FileUpload {
  transcript_id: string;
  status: 'UPLOADED' | 'ANALYZING' | 'ANALYZED';
  file_name: string;
}

export interface AnalysisJob {
  transcript_id: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  progress_percent: number;
  error: string | null;
}

export interface PainPoint {
  title: string;
  description?: string;
  frequency: number;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  supporting_quote?: string;
}

export interface UserSegment {
  name: string;
  role?: string;
  company_size?: string;
  characteristics: string;
}

export interface Theme {
  name: string;
  description?: string;
  frequency: number;
  related_to_pain_points?: string[];
}

export interface Recommendation {
  title: string;
  description?: string;
  addresses: string[];
  effort: 'HIGH' | 'MEDIUM' | 'LOW';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  priority_score: number;
}

export interface InsightResponse {
  pain_points: PainPoint[];
  segments: UserSegment[];
  themes: Theme[];
  recommendations: Recommendation[];
}

export interface ReportData {
  transcript_id: string;
  file_name: string;
  created_at: string;
  insights: InsightResponse;
}
