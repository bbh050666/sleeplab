import React from 'react';
import { X, Check, RotateCcw, ArrowRight, TrendingUp } from 'lucide-react';
import { useSleep } from '../context/SleepContext';

interface ConcludeExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConcluded?: () => void;
}

export const ConcludeExperimentModal: React.FC<ConcludeExperimentModalProps> = ({
  isOpen,
  onClose,
  onConcluded,
}) => {
  const { activeExperiment, concludeExperiment } = useSleep();

  if (!isOpen || !activeExperiment) return null;

  const baseline = activeExperiment.baselineMetrics;
  const during = activeExperiment.duringMetrics || {
    onsetLatencyMinutes: 19,
    sleepDurationMinutes: 425,
    morningEnergy: 3.9,
    sleepQuality: 4.1,
    completedDays: 7,
  };

  const handleDecision = (decision: 'keep' | 'change') => {
    concludeExperiment(decision);
    onClose();
    if (onConcluded) onConcluded();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeExperiment.icon}</span>
              <h2 className="text-base font-semibold text-white">
                7-Day Experiment Complete!
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {activeExperiment.title} · Baseline vs Experiment Comparison
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* The Core Results Matrix */}
        <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
            <div className="text-xs font-medium text-slate-400">Average Time to Fall Asleep</div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Baseline: </span>
                <span className="font-mono text-sm text-slate-300 tabular-nums">
                  {baseline.onsetLatencyMinutes} min
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-600" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">Experiment: </span>
                <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">
                  {during.onsetLatencyMinutes} min
                </span>
                <span className="ml-1.5 text-xs text-emerald-400">
                  (-{baseline.onsetLatencyMinutes - during.onsetLatencyMinutes}m faster)
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
            <div className="text-xs font-medium text-slate-400">Morning Energy Rating</div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Baseline: </span>
                <span className="font-mono text-sm text-slate-300 tabular-nums">
                  {baseline.morningEnergy} / 5
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-600" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">Experiment: </span>
                <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">
                  {during.morningEnergy} / 5
                </span>
                <span className="ml-1.5 text-xs text-emerald-400">
                  (+{(during.morningEnergy - baseline.morningEnergy).toFixed(1)} boost)
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
            <div className="text-xs font-medium text-slate-400">Subjective Sleep Quality</div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Baseline: </span>
                <span className="font-mono text-sm text-slate-300 tabular-nums">
                  {baseline.sleepQuality} / 5
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-600" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold">Experiment: </span>
                <span className="font-mono text-base font-bold text-amber-300 tabular-nums">
                  {during.sleepQuality} / 5
                </span>
                <span className="ml-1.5 text-xs text-amber-300">
                  (+{(during.sleepQuality - baseline.sleepQuality).toFixed(1)})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* The Soul of the Product: Keep habit / Try something else */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="text-xs font-medium text-slate-300 mb-3 text-center">
            What is your decision based on these results?
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDecision('keep')}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 active:scale-[0.99] transition-all"
            >
              <Check className="h-4 w-4" />
              <span>Keep this habit</span>
            </button>
            <button
              onClick={() => handleDecision('change')}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-700 active:scale-[0.99] transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Try something else</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
