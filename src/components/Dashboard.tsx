import {
  AlertCircle,
  Users,
  Lightbulb,
  Zap,
} from 'lucide-react';
import { InsightResponse } from '../lib/types';
import { Card } from './Card';

interface DashboardProps {
  insights: InsightResponse;
  isLoading?: boolean;
}

export function Dashboard({ insights, isLoading = false }: DashboardProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-64 bg-slate-800/50 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-slate-800/50 rounded-xl animate-pulse" />
          <div className="h-48 bg-slate-800/50 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideIn">
      {/* Pain Points */}
      <Card
        title={`Top Pain Points (${insights.pain_points.length})`}
        icon={<AlertCircle className="w-5 h-5 text-error" />}
        variant="error"
      >
        <div className="space-y-3">
          {insights.pain_points.slice(0, 5).map((point, idx) => (
            <div key={idx} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-medium text-slate-100 flex-1">{point.title}</h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  point.impact === 'HIGH' ? 'bg-error/30 text-error' :
                  point.impact === 'MEDIUM' ? 'bg-warning/30 text-warning' :
                  'bg-success/30 text-success'
                }`}>
                  {point.impact}
                </span>
              </div>
              {point.description && (
                <p className="text-sm text-slate-400 mb-2">{point.description}</p>
              )}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Mentioned {point.frequency}x</span>
                {point.supporting_quote && (
                  <span className="italic">"{point.supporting_quote.substring(0, 40)}..."</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* User Segments */}
      <Card
        title={`User Segments (${insights.segments.length})`}
        icon={<Users className="w-5 h-5 text-primary-400" />}
        variant="info"
      >
        <div className="flex flex-wrap gap-2">
          {insights.segments.map((segment, idx) => (
            <div
              key={idx}
              className="px-4 py-3 rounded-lg bg-primary-500/20 border border-primary-500/30 hover:bg-primary-500/30 transition-colors group"
            >
              <div className="flex flex-col gap-1">
                <p className="font-medium text-primary-300">{segment.name}</p>
                {segment.role && (
                  <p className="text-xs text-primary-200">{segment.role}</p>
                )}
                {segment.company_size && (
                  <p className="text-xs text-primary-200">{segment.company_size}</p>
                )}
                {segment.characteristics && (
                  <p className="text-xs text-primary-300 mt-1">{segment.characteristics}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Themes */}
      <Card
        title={`Key Themes (${insights.themes.length})`}
        icon={<Lightbulb className="w-5 h-5 text-warning" />}
        variant="warning"
      >
        <div className="space-y-3">
          {insights.themes.map((theme, idx) => (
            <div key={idx} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-medium text-slate-100 flex-1">{theme.name}</h4>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-warning/30 text-warning">
                  {theme.frequency}x
                </span>
              </div>
              {theme.description && (
                <p className="text-sm text-slate-400 mb-2">{theme.description}</p>
              )}
              {theme.related_to_pain_points && theme.related_to_pain_points.length > 0 && (
                <div className="text-xs text-slate-500">
                  Related to: <span className="text-slate-300">{theme.related_to_pain_points.join(', ')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card
        title={`Product Recommendations (${insights.recommendations.length})`}
        icon={<Zap className="w-5 h-5 text-accent-400" />}
        variant="success"
      >
        <div className="space-y-3">
          {insights.recommendations.slice(0, 6).map((rec, idx) => (
            <div key={idx} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-medium text-slate-100 flex-1">{rec.title}</h4>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    rec.impact === 'HIGH' ? 'bg-success/30 text-success' :
                    rec.impact === 'MEDIUM' ? 'bg-warning/30 text-warning' :
                    'bg-slate-500/30 text-slate-300'
                  }`}>
                    {rec.impact} Impact
                  </span>
                  <span className="text-sm font-bold text-accent-400">
                    {rec.priority_score}
                  </span>
                </div>
              </div>
              {rec.description && (
                <p className="text-sm text-slate-400 mb-2">{rec.description}</p>
              )}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Effort: {rec.effort}</span>
                {rec.addresses.length > 0 && (
                  <span>Addresses: {rec.addresses.slice(0, 2).join(', ')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
