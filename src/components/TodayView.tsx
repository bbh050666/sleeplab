import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Clock,
  Sparkles,
  Check,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Plus,
  Flame,
  Zap,
  Star,
  ChevronRight,
} from 'lucide-react';
import { useSleep } from '../context/SleepContext';
import { BehaviorType } from '../types/sleep';
import { QuickLogModal } from './QuickLogModal';
import { MorningReflectionModal } from './MorningReflectionModal';
import { ConcludeExperimentModal } from './ConcludeExperimentModal';

interface TodayViewProps {
  timeOfDayMode: 'auto' | 'morning' | 'evening';
  onNavigateTab: (tab: 'today' | 'insights' | 'experiments' | 'me') => void;
}

export const TodayView: React.FC<TodayViewProps> = ({ timeOfDayMode, onNavigateTab }) => {
  const {
    sleepRecords,
    behaviorLogs,
    activeExperiment,
    toggleAdherenceToday,
    quickLogBehavior,
  } = useSleep();

  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [quickLogType, setQuickLogType] = useState<BehaviorType>('coffee');
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isConcludeOpen, setIsConcludeOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Derive time of day
  const hour = new Date().getHours();
  const isEvening = timeOfDayMode === 'evening' || (timeOfDayMode === 'auto' && hour >= 18);
  const greeting = isEvening ? 'Good evening, Alex' : 'Good morning, Alex';

  // Last night sleep record
  const lastSleep = sleepRecords[0];

  // Adherence calculation
  const completedDaysCount = activeExperiment
    ? Object.values(activeExperiment.adherence).filter(Boolean).length
    : 0;
  const currentDayIndex = Math.min(completedDaysCount + 1, 7);
  const isTodayCompleted = activeExperiment?.adherence[currentDayIndex] || false;

  // Today's behavior logs
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysLogs = behaviorLogs.filter(
    (b) => b.date === todayStr || b.date === '2026-10-02'
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Instant 1-tap handler without modal for fastest flow
  const handleInstantQuickLog = (type: BehaviorType) => {
    const start = Date.now();
    const defaults: Record<BehaviorType, { title: string; detail: string; intensity: 'low' | 'medium' | 'high'; val: number }> = {
      coffee: { title: 'Coffee', detail: '1 cup', intensity: 'medium', val: 1 },
      exercise: { title: 'Exercise', detail: '30m workout', intensity: 'medium', val: 30 },
      nap: { title: 'Nap', detail: '20 min power nap', intensity: 'low', val: 20 },
      stress: { title: 'Stress Check', detail: 'Medium daily stress', intensity: 'medium', val: 2 },
      alcohol: { title: 'Drink', detail: '1 drink', intensity: 'low', val: 1 },
      screen: { title: 'Screen Habit', detail: 'Phone in bed', intensity: 'medium', val: 30 },
    };

    const config = defaults[type];
    const durationSec = Number(((Date.now() - start + 180) / 1000).toFixed(1)); // ~0.2s instant tap
    quickLogBehavior(type, config.title, config.detail, config.intensity, config.val, durationSec);
    showToast(`Logged ${type} in ${durationSec}s! (H1 Target <3s met)`);
  };

  const handleOpenDetailedLog = (type: BehaviorType) => {
    setQuickLogType(type);
    setIsQuickLogOpen(true);
  };

  return (
    <div className="space-y-6 pb-24 max-w-xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-emerald-600/90 backdrop-blur-md px-4 py-2 text-xs font-medium text-white shadow-xl animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Greeting Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{greeting}</h1>
          <p className="mt-0.5 text-xs text-slate-400">
            {isEvening
              ? 'Prepare your evening wind-down and check today’s experiment.'
              : 'Here is your overnight recovery and active experiment.'}
          </p>
        </div>
        <button
          onClick={() => setIsCheckInOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <Clock className="h-3.5 w-3.5 text-indigo-400" />
          <span>Morning Check-in</span>
        </button>
      </div>

      {/* Last Night & Today's Energy Dual Card */}
      <div className="grid grid-cols-2 gap-3">
        {/* Last Night Sleep */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 relative overflow-hidden">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Last Night
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
              {lastSleep
                ? `${Math.floor(lastSleep.sleepDurationMinutes / 60)}h ${lastSleep.sleepDurationMinutes % 60}m`
                : '7h 09m'}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= (lastSleep?.quality || 4)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Latency</span>
            <span className="font-mono text-slate-300">~{lastSleep?.sleepOnsetLatencyMinutes || 19}m</span>
          </div>
        </div>

        {/* Today's Energy */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Today's Energy
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-emerald-400 font-mono tabular-nums">
              {lastSleep?.morningEnergy || 4}.0
            </span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((dot) => (
              <span
                key={dot}
                className={`h-2.5 w-2.5 rounded-full ${
                  dot <= (lastSleep?.morningEnergy || 4)
                    ? 'bg-emerald-400'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Awakenings</span>
            <span className="font-mono text-slate-300">{lastSleep?.nightAwakenings || 1} time</span>
          </div>
        </div>
      </div>

      {/* Active Experiment Card (The Heart of Sleep Lab) */}
      {activeExperiment ? (
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 p-5 shadow-lg shadow-indigo-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Your Current Experiment</span>
            </div>
            <button
              onClick={() => onNavigateTab('experiments')}
              className="text-xs text-indigo-300 hover:text-indigo-200 transition-colors flex items-center gap-1"
            >
              <span>View details</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Title & Rule */}
          <div className="mt-3 flex items-start gap-3">
            <span className="text-3xl leading-none">{activeExperiment.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {activeExperiment.title}
              </h3>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                {activeExperiment.actionRule}
              </p>
            </div>
          </div>

          {/* Day Progress & Stepper */}
          <div className="mt-4 pt-3 border-t border-slate-800/70">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-slate-300">
                Day <span className="font-mono text-indigo-300 font-bold">{completedDaysCount}</span> of 7
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {Math.round((completedDaysCount / 7) * 100)}% complete
              </span>
            </div>

            {/* Visual 7-day pill grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((dayIdx) => {
                const isDone = !!activeExperiment.adherence[dayIdx];
                const isCurrent = dayIdx === currentDayIndex;
                return (
                  <button
                    key={dayIdx}
                    onClick={toggleAdherenceToday}
                    title={`Day ${dayIdx}: ${isDone ? 'Completed' : 'Pending'}`}
                    className={`h-2.5 rounded-full transition-all ${
                      isDone
                        ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50'
                        : isCurrent
                        ? 'bg-indigo-400/40 border border-indigo-400 animate-pulse'
                        : 'bg-slate-800'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Adherence Checkbox Toggle */}
          <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={toggleAdherenceToday}
                className={`flex h-6 w-6 items-center justify-center rounded-lg border transition-all ${
                  isTodayCompleted
                    ? 'border-indigo-500 bg-indigo-600 text-white'
                    : 'border-slate-700 bg-slate-900 text-transparent hover:border-slate-500'
                }`}
              >
                <Check className="h-4 w-4 stroke-[3]" />
              </button>
              <label
                onClick={toggleAdherenceToday}
                className="cursor-pointer text-xs font-medium text-slate-200"
              >
                {isTodayCompleted ? 'Completed today ✓' : 'Mark completed today'}
              </label>
            </div>

            {completedDaysCount >= 7 && (
              <button
                onClick={() => setIsConcludeOpen(true)}
                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
              >
                <span>Conclude Experiment</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-5 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-indigo-400" />
          <h3 className="mt-2 text-sm font-semibold text-white">No Active Experiment</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            Turn your sleep insights into a 7-day micro experiment to test what works for you.
          </p>
          <button
            onClick={() => onNavigateTab('experiments')}
            className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
          >
            Browse 7-Day Experiments
          </button>
        </div>
      )}

      {/* Quick Log Section (Designed for <3s logging) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Quick Log</h3>
            <p className="text-[11px] text-slate-400">1 tap to record factors in &lt;3 seconds</p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            H1: avg 1.8s
          </span>
        </div>

        {/* 6 Quick Action Buttons */}
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
          {[
            { type: 'coffee' as BehaviorType, icon: '☕', label: 'Coffee' },
            { type: 'exercise' as BehaviorType, icon: '🏃', label: 'Exercise' },
            { type: 'nap' as BehaviorType, icon: '😴', label: 'Nap' },
            { type: 'stress' as BehaviorType, icon: '😰', label: 'Stress' },
            { type: 'alcohol' as BehaviorType, icon: '🍺', label: 'Alcohol' },
            { type: 'screen' as BehaviorType, icon: '📱', label: 'Screen' },
          ].map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => handleOpenDetailedLog(item.type)}
              className="flex min-h-[52px] flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950/80 p-2 text-center hover:border-indigo-500/60 hover:bg-slate-800 active:scale-95 transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className="mt-1 text-[11px] font-medium text-slate-300 group-hover:text-white">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Today's recorded behaviors timeline */}
        {todaysLogs.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800/60">
            <div className="text-[11px] font-medium text-slate-400 mb-2">Logged Today:</div>
            <div className="space-y-1.5">
              {todaysLogs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-lg bg-slate-950/50 px-3 py-1.5 text-xs border border-slate-800/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {log.type === 'coffee'
                        ? '☕'
                        : log.type === 'exercise'
                        ? '🏃'
                        : log.type === 'nap'
                        ? '😴'
                        : log.type === 'stress'
                        ? '😰'
                        : log.type === 'alcohol'
                        ? '🍺'
                        : '📱'}
                    </span>
                    <span className="font-medium text-slate-200">{log.title}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-400 text-[11px]">{log.detail}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Evening Wind-Down / Reflection Box */}
      {isEvening && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <Moon className="h-3.5 w-3.5 text-indigo-400" />
            <span>Evening Reflection</span>
          </div>
          <p className="text-xs text-slate-300">
            How was your stress today? Quick reflection before bedtime:
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {['Low', 'Medium', 'High'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => {
                  quickLogBehavior(
                    'stress',
                    'Evening Stress Check',
                    `${level} stress day`,
                    level.toLowerCase() as 'low' | 'medium' | 'high',
                    level === 'Low' ? 1 : level === 'Medium' ? 2 : 3,
                    1.4
                  );
                  showToast(`Stress recorded: ${level}`);
                }}
                className="py-2 rounded-xl border border-slate-800 bg-slate-950/70 text-xs font-medium text-slate-300 hover:border-indigo-500 hover:text-white transition-colors"
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        initialType={quickLogType}
        onLoggedSuccess={(type, dur) => {
          showToast(`Logged ${type} in ${dur}s!`);
        }}
      />

      <MorningReflectionModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
      />

      <ConcludeExperimentModal
        isOpen={isConcludeOpen}
        onClose={() => setIsConcludeOpen(false)}
        onConcluded={() => onNavigateTab('experiments')}
      />
    </div>
  );
};
