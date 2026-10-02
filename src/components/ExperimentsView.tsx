import React, { useState } from 'react';
import {
  FlaskConical,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Check,
  RotateCcw,
  Plus,
} from 'lucide-react';
import { useSleep } from '../context/SleepContext';
import { ExperimentTemplate } from '../types/sleep';
import { ConcludeExperimentModal } from './ConcludeExperimentModal';

export const ExperimentsView: React.FC = () => {
  const {
    activeExperiment,
    completedExperiments,
    experimentTemplates,
    startExperiment,
    setAdherenceForDay,
    cancelActiveExperiment,
  } = useSleep();

  const [isConcludeOpen, setIsConcludeOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ExperimentTemplate | null>(null);

  const completedDaysCount = activeExperiment
    ? Object.values(activeExperiment.adherence).filter(Boolean).length
    : 0;

  return (
    <div className="space-y-6 pb-24 max-w-xl mx-auto">
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">7-Day Experiments</h1>
        <p className="mt-1 text-xs text-slate-400">
          The core loop: test one behavioral variable for 7 days against your baseline.
        </p>
      </div>

      {/* Active Experiment Spotlight */}
      {activeExperiment ? (
        <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <FlaskConical className="h-3.5 w-3.5" />
              <span>Active Experiment</span>
            </span>
            <span className="text-xs font-mono text-indigo-300">
              Day {completedDaysCount} / 7
            </span>
          </div>

          <div className="mt-3 flex items-start gap-3">
            <span className="text-3xl">{activeExperiment.icon}</span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {activeExperiment.title}
              </h2>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                {activeExperiment.actionRule}
              </p>
            </div>
          </div>

          {/* 7-Day Checklist Interactive Grid */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="text-xs font-medium text-slate-300 mb-2">
              Daily Adherence Checklist:
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((dayIdx) => {
                const isChecked = !!activeExperiment.adherence[dayIdx];
                return (
                  <button
                    key={dayIdx}
                    onClick={() => setAdherenceForDay(dayIdx, !isChecked)}
                    className={`flex flex-col items-center justify-center rounded-xl p-2 border transition-all ${
                      isChecked
                        ? 'border-indigo-500 bg-indigo-600/30 text-white'
                        : 'border-slate-800 bg-slate-950/60 text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-medium">D{dayIdx}</span>
                    <div
                      className={`mt-1 flex h-4 w-4 items-center justify-center rounded-full ${
                        isChecked ? 'bg-indigo-500 text-white' : 'border border-slate-700'
                      }`}
                    >
                      {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Baseline vs Current Live Comparison */}
          <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
            <div className="rounded-xl bg-slate-950/70 p-3 border border-slate-800">
              <span className="text-[10px] text-slate-400">Time to Fall Asleep</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-mono text-base font-bold text-emerald-400">
                  {activeExperiment.duringMetrics?.onsetLatencyMinutes || 19}m
                </span>
                <span className="text-[11px] text-slate-400 line-through">
                  {activeExperiment.baselineMetrics.onsetLatencyMinutes}m
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950/70 p-3 border border-slate-800">
              <span className="text-[10px] text-slate-400">Morning Energy</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-mono text-base font-bold text-emerald-400">
                  {activeExperiment.duringMetrics?.morningEnergy || 3.9}/5
                </span>
                <span className="text-[11px] text-slate-400">
                  (was {activeExperiment.baselineMetrics.morningEnergy})
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            <button
              onClick={cancelActiveExperiment}
              className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
            >
              Cancel experiment
            </button>
            <button
              onClick={() => setIsConcludeOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-colors"
            >
              <span>Conclude & Review Results</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Catalog of Curated 7-Day Experiments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-white">Experiment Catalog</h2>
          <span className="text-xs text-slate-400">Tested on 18–30 biologies</span>
        </div>

        <div className="space-y-3">
          {experimentTemplates.map((template) => {
            const isCurrentlyActive = activeExperiment?.templateId === template.id;
            return (
              <div
                key={template.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition-all hover:border-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700/60 text-xl">
                      {template.icon}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{template.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{template.tagline}</p>
                    </div>
                  </div>

                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                    7 Days
                  </span>
                </div>

                {/* Hypothesis & Rule */}
                <div className="mt-3 rounded-lg bg-slate-950/60 p-2.5 text-xs text-slate-300 border border-slate-800/60">
                  <span className="font-semibold text-indigo-300">Rule: </span>
                  {template.actionRule}
                </div>

                <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
                  {template.whyItWorks}
                </p>

                {/* Start Button */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex justify-end">
                  {isCurrentlyActive ? (
                    <span className="flex items-center gap-1 text-xs text-indigo-400 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Active Now</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => startExperiment(template.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-600 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Start 7-Day Experiment</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Experiments & Retained Habits */}
      {completedExperiments.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-white mb-3">Completed Experiments</h2>
          <div className="space-y-3">
            {completedExperiments.map((exp) => (
              <div
                key={exp.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{exp.icon}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{exp.title}</h4>
                      <span className="text-[11px] text-slate-400">
                        Completed on {exp.completedDate}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      exp.decision === 'keep'
                        ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {exp.decision === 'keep' ? 'Habit Retained ✓' : 'Tried & Pivoted'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  {exp.learnedTakeaway}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conclude Modal */}
      <ConcludeExperimentModal
        isOpen={isConcludeOpen}
        onClose={() => setIsConcludeOpen(false)}
      />
    </div>
  );
};
