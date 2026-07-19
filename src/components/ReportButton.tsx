import { useState } from 'react';
import { Download, Loader } from 'lucide-react';
import { ReportData } from '../lib/types';

interface ReportButtonProps {
  report: ReportData | null;
  fileName?: string;
}

export function ReportButton({ report, fileName }: ReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    if (!report) return;

    setIsGenerating(true);
    try {
      // Create HTML report
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DiscoveryOS Report - ${fileName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    .header { border-bottom: 3px solid #0ea5e9; padding-bottom: 30px; margin-bottom: 40px; }
    .logo { font-size: 32px; font-weight: bold; color: #0ea5e9; margin-bottom: 10px; }
    .subtitle { color: #666; font-size: 18px; }
    .meta { display: flex; gap: 20px; margin-top: 20px; color: #999; font-size: 14px; }
    .section { margin-bottom: 40px; }
    .section-title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb; }
    .insights-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
    .insight-item { background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9; }
    .insight-title { font-size: 16px; font-weight: bold; color: #0ea5e9; margin-bottom: 8px; }
    .insight-content { color: #555; margin-bottom: 10px; }
    .insight-meta { display: flex; gap: 15px; font-size: 12px; color: #999; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-right: 8px; }
    .badge-high { background: #fee2e2; color: #991b1b; }
    .badge-medium { background: #fef3c7; color: #92400e; }
    .badge-low { background: #dcfce7; color: #166534; }
    .segments-container { display: flex; gap: 15px; flex-wrap: wrap; }
    .segment-tag { background: #dbeafe; color: #1e40af; padding: 10px 15px; border-radius: 6px; font-weight: 500; }
    .quote { font-style: italic; color: #666; padding: 15px; background: #f3f4f6; border-left: 4px solid #9333ea; margin: 15px 0; }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #999; font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">📊 DiscoveryOS Report</div>
      <div class="subtitle">AI-Powered User Research Intelligence</div>
      <div class="meta">
        <span>📄 Source: ${fileName}</span>
        <span>📅 Generated: ${new Date().toLocaleDateString()}</span>
        <span>✨ Analysis ID: ${report.transcript_id}</span>
      </div>
    </div>

    <!-- Pain Points Section -->
    <div class="section">
      <div class="section-title">🚨 Top Pain Points</div>
      <div class="insights-grid">
        ${report.insights.pain_points.map((point) => `
          <div class="insight-item">
            <div class="insight-title">${point.title}</div>
            <div class="insight-content">${point.description || ''}</div>
            <div class="insight-meta">
              <span class="badge badge-${point.impact.toLowerCase()}">${point.impact} Impact</span>
              <span>Mentioned ${point.frequency}x</span>
              ${point.supporting_quote ? `<span><strong>Quote:</strong> "${point.supporting_quote}"</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- User Segments Section -->
    <div class="section">
      <div class="section-title">👥 User Segments</div>
      <div class="segments-container">
        ${report.insights.segments.map((segment) => `
          <div class="segment-tag">
            <div><strong>${segment.name}</strong></div>
            ${segment.role ? `<div>${segment.role}</div>` : ''}
            ${segment.company_size ? `<div>${segment.company_size}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Themes Section -->
    <div class="section">
      <div class="section-title">💡 Key Themes</div>
      <div class="insights-grid">
        ${report.insights.themes.map((theme) => `
          <div class="insight-item">
            <div class="insight-title">${theme.name}</div>
            <div class="insight-content">${theme.description || ''}</div>
            <div class="insight-meta">
              <span>Mentioned ${theme.frequency}x</span>
              ${theme.related_to_pain_points && theme.related_to_pain_points.length > 0 ? 
                `<span>Related: ${theme.related_to_pain_points.join(', ')}</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Recommendations Section -->
    <div class="section">
      <div class="section-title">⚡ Product Recommendations</div>
      <div class="insights-grid">
        ${report.insights.recommendations.map((rec) => `
          <div class="insight-item">
            <div class="insight-title">${rec.title}</div>
            <div class="insight-content">${rec.description || ''}</div>
            <div class="insight-meta">
              <span class="badge badge-${rec.impact.toLowerCase()}">Impact: ${rec.impact}</span>
              <span>Effort: ${rec.effort}</span>
              <span><strong>Priority:</strong> ${rec.priority_score}</span>
              ${rec.addresses.length > 0 ? `<span>Addresses: ${rec.addresses.slice(0, 2).join(', ')}</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="footer">
      <p>Generated by DiscoveryOS - AI-Powered Product Discovery Platform</p>
    </div>
  </div>
</body>
</html>
      `;

      // Convert HTML to Blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DiscoveryOS-Report-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!report) return null;

  return (
    <button
      onClick={generateReport}
      disabled={isGenerating}
      className="btn-primary inline-flex items-center gap-2"
    >
      {isGenerating ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download Report
        </>
      )}
    </button>
  );
}
