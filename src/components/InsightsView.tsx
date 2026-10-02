import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ChevronRight,
  FlaskConical,
  BarChart2,
  Calendar,
} from 'lucide-react';
import { useSleep } from '../context/SleepContext';
import { SleepFactorInsight } from '../types/sleep';
import { InsightDetailModal } from './InsightDetailModal';

interface InsightsViewProps {
  onStartExperiment: (templateId: string) => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ onStartExperiment }) => {
  const { insights, sleepRecords } = useSleep();
  const [selectedInsight, setSelectedInsight] = useState<SleepFactorInsight | null>(null);

  return (
    <div className="space-y-6 pb-24 max-w-xl mx-auto">
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Insights</h1>
        <p className="mt-1 text-xs text-slate-400">
          Personal N-of-1 statistical associations. What actually affects your sleep?
        </p>
      </div>

      {/* Weekly Learning Highlight Card (The "What we learned this week" moment) */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 p-5 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>What We Learned This Week</span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-2.5">
            <span className="text-base leading-none">🏃</span>
            <p className="text-xs text-slate-200 leading-relaxed">
              You slept <strong className="text-white font-semibold">+34 minutes longer</strong> on days you exercised.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="text-base leading-none">☕</span>
            <p className="text-xs text-slate-200 leading-relaxed">
              Late caffeine was associated with <strong className="text-white font-semibold">+16 minutes</strong> longer sleep onset latency.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="text-base leading-none">⏰</span>
            <p className="text-xs text-slate-200 leading-relaxed">
              Your sleep schedule was most consistent on weekdays (<span className="text-slate-300 font-mono">00:40 ± 20m</span>).
            </p>
          </div>
        </div>

        {/* Single Focus: "One thing to try next week" (Product discipline) */}
        <div className="mt-5 pt-3.5 border-t border-slate-800/80">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            One Thing to Try Next Week
          </div>
          <div className="mt-2 flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">☕</span>
              <div>
                <div className="text-xs font-semibold text-white">No caffeine after 2 PM</div>
                <div className="text-[11px] text-slate-400">Reduce time to fall asleep by ~15 min</div>
              </div>
            </div>
            <button
              onClick={() => onStartExperiment('exp-caffeine-curfew')}
              className="flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              <span>Test it</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Section: What's Affecting My Sleep? */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-white">What's Affecting My Sleep?</h2>
          <span className="text-xs text-slate-400">Tap to inspect raw data</span>
        </div>

        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              onClick={() => setSelectedInsight(insight)}
              className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-slate-700 hover:bg-slate-900 active:scale-[0.99] transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700/50 text-xl">
                    {insight.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {insight.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>Associated with</span>
                      <span className="font-mono font-semibold text-indigo-300">
                        {insight.effect.delta}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-500 group-hover:text-indigo-400 transition-colors">
                  <span className="text-[11px] font-mono">Inspect</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>

              {/* Data comparison quick glimpse */}
              <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-xs">
                <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/40">
                  <div className="text-[10px] text-slate-400">{insight.comparisonData.withFactor.label}</div>
                  <div className="mt-1 font-mono text-sm font-semibold text-white">
                    {insight.comparisonData.withFactor.onsetLatency}m latency
                  </div>
                </div>
                <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/40">
                  <div className="text-[10px] text-slate-400">{insight.comparisonData.withoutFactor.label}</div>
                  <div className="mt-1 font-mono text-sm font-semibold text-white">
                    {insight.comparisonData.withoutFactor.onsetLatency}m latency
                  </div>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                <span>Based on {insight.observationCount} observations</span>
                <span className="text-indigo-400 group-hover:underline">View comparison →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistical Methodology Disclaimer */}
      <div className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-3.5 text-xs text-slate-400 leading-relaxed">
        <strong className="text-slate-300">Why N-of-1? </strong>
        General population studies average thousands of distinct biologies. Sleep Lab isolates your personal lifestyle factors so you know what actually matters for your body.
      </div>

      {/* Deep-dive Inspection Modal */}
      <InsightDetailModal
        insight={selectedInsight}
        onClose={() => setSelectedInsight(null)}
        onStartExperimentFromInsight={(templateId) => {
          onStartExperiment(templateId);
          setSelectedInsight(null);
        }}
      />
    </div>
  );
};
