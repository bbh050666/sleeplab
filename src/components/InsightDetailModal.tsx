import React from 'react';
import { X, ArrowRight, CheckCircle2, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { SleepFactorInsight } from '../types/sleep';
import { useSleep } from '../context/SleepContext';

interface InsightDetailModalProps {
  insight: SleepFactorInsight | null;
  onClose: () => void;
  onStartExperimentFromInsight: (templateId: string) => void;
}

export const InsightDetailModal: React.FC<InsightDetailModalProps> = ({
  insight,
  onClose,
  onStartExperimentFromInsight,
}) => {
  const { activeExperiment } = useSleep();

  if (!insight) return null;

  const { withFactor, withoutFactor } = insight.comparisonData;
  const isAlreadyActive = activeExperiment?.templateId === insight.recommendedExperimentId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 border border-slate-700/60 text-2xl">
              {insight.icon}
            </span>
            <div>
              <h2 className="text-base font-semibold text-white">{insight.title}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>N-of-1 Personal Analysis</span>
                <span aria-hidden="true">·</span>
                <span>Based on {insight.observationCount} days of your data</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Primary Discovery Headline */}
        <div className="mt-5 rounded-xl border border-indigo-900/50 bg-indigo-950/20 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Key Finding</span>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-200 leading-relaxed">
            {insight.summary}
          </p>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            {insight.effect.explanation}
          </p>
        </div>

        {/* N-of-1 Comparison Matrix (Raw Data) */}
        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Your Personal Comparison Data
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* With Factor Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">{withFactor.label}</span>
                <span className="text-[10px] font-mono text-slate-400">{withFactor.count} days</span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Sleep Onset:</span>
                  <span className="font-mono font-medium text-white tabular-nums">
                    ~{withFactor.onsetLatency} min
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Sleep Duration:</span>
                  <span className="font-mono font-medium text-white tabular-nums">
                    {withFactor.durationHours} hrs
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Morning Energy:</span>
                  <span className="font-mono font-medium text-emerald-400 tabular-nums">
                    {withFactor.energy}/5
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Sleep Quality:</span>
                  <span className="font-mono font-medium text-amber-300 tabular-nums">
                    {withFactor.quality}/5
                  </span>
                </div>
              </div>
            </div>

            {/* Without Factor Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">{withoutFactor.label}</span>
                <span className="text-[10px] font-mono text-slate-400">{withoutFactor.count} days</span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Sleep Onset:</span>
                  <span className="font-mono font-medium text-white tabular-nums">
                    ~{withoutFactor.onsetLatency} min
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Sleep Duration:</span>
                  <span className="font-mono font-medium text-white tabular-nums">
                    {withoutFactor.durationHours} hrs
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Morning Energy:</span>
                  <span className="font-mono font-medium text-emerald-400 tabular-nums">
                    {withoutFactor.energy}/5
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Sleep Quality:</span>
                  <span className="font-mono font-medium text-amber-300 tabular-nums">
                    {withoutFactor.quality}/5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistical Note */}
        <p className="mt-3 text-[11px] text-slate-400 leading-normal">
          *Note: This reflects correlation in your personal routine over the past 14 days, not population averages.
        </p>

        {/* Action CTA: Turn Discovery into 7-Day Experiment */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          {isAlreadyActive ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-xs font-medium text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Experiment currently in progress on your Today tab</span>
            </div>
          ) : insight.recommendedExperimentId ? (
            <button
              onClick={() => {
                onStartExperimentFromInsight(insight.recommendedExperimentId!);
                onClose();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.99] transition-all"
            >
              <span>Test This with a 7-Day Experiment</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-slate-800 py-3 text-xs font-medium text-white hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
