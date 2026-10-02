import React, { useState } from 'react';
import {
  User,
  Database,
  Download,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Zap,
  Star,
  Trash2,
  Clock,
  Activity,
  Sliders,
} from 'lucide-react';
import { useSleep } from '../context/SleepContext';

export const MeView: React.FC = () => {
  const {
    sleepRecords,
    behaviorLogs,
    deleteSleepRecord,
    deleteBehaviorLog,
    resetToDemoData,
    h1Metrics,
  } = useSleep();

  const [activeTab, setActiveTab] = useState<'sleep' | 'behaviors'>('sleep');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Export dataset as JSON
  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      user: {
        name: 'Alex Chen',
        age: 24,
        archetype: '18-30 Young Professional with Irregular Schedule',
      },
      sleepRecords,
      behaviorLogs,
      h1Metrics,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sleep-lab-n-of-1-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-24 max-w-xl mx-auto">
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Profile & N-of-1 Dataset</h1>
        <p className="mt-1 text-xs text-slate-400">
          Your personal longitudinal records, logging telemetry, and data controls.
        </p>
      </div>

      {/* Target User Persona Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-lg font-bold">
              AC
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Alex Chen</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>24 yrs old</span>
                <span>·</span>
                <span>CS Grad Student</span>
                <span>·</span>
                <span className="text-indigo-400">Irregular schedule</span>
              </div>
            </div>
          </div>
          <span className="rounded bg-indigo-950 px-2 py-0.5 text-[10px] font-mono font-medium text-indigo-300 border border-indigo-800/40">
            Target Persona
          </span>
        </div>

        <div className="mt-4 rounded-xl bg-slate-950/60 p-3 border border-slate-800/60 text-xs text-slate-300 space-y-1.5">
          <div className="font-semibold text-slate-200">Current Objective:</div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            "Understand why I take 40+ min to fall asleep after late lab sessions and discover if afternoon caffeine or screen time is the culprit."
          </p>
        </div>

        {/* Integration Status */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span>Wearable Sync:</span>
            <span className="text-slate-200 font-medium">Apple Health (Simulated)</span>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Active</span>
          </span>
        </div>
      </div>

      {/* H1 Friction Telemetry Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Hypothesis 1: Logging Friction Telemetry
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            Goal Met
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <div className="text-slate-400 text-[11px]">Morning Check-in Avg:</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold font-mono text-white tabular-nums">
                {h1Metrics.avgCheckInSeconds}s
              </span>
              <span className="text-[10px] text-emerald-400">(&lt;30s goal)</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-500 font-mono">
              {h1Metrics.totalCheckIns} check-ins logged
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <div className="text-slate-400 text-[11px]">Quick Behavior Log Avg:</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold font-mono text-white tabular-nums">
                {h1Metrics.avgQuickLogSeconds}s
              </span>
              <span className="text-[10px] text-emerald-400">(&lt;3s goal)</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-500 font-mono">
              {h1Metrics.totalQuickLogs} daytime logs
            </div>
          </div>
        </div>
      </div>

      {/* Longitudinal Dataset Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">N-of-1 Data Log</h3>
          <div className="flex items-center rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('sleep')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'sleep'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sleep ({sleepRecords.length})
            </button>
            <button
              onClick={() => setActiveTab('behaviors')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'behaviors'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Behaviors ({behaviorLogs.length})
            </button>
          </div>
        </div>

        {activeTab === 'sleep' ? (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {sleepRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 text-xs border border-slate-800/60"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white font-medium">{record.date}</span>
                    <span className="text-slate-500">·</span>
                    <span className="font-mono text-indigo-300">
                      {Math.floor(record.sleepDurationMinutes / 60)}h {record.sleepDurationMinutes % 60}m
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">onset ~{record.sleepOnsetLatencyMinutes}m</span>
                  </div>
                  {record.notes && (
                    <div className="mt-1 text-[11px] text-slate-400 italic">
                      "{record.notes}"
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-amber-400 font-mono text-[11px]">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{record.quality}/5</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                    <Zap className="h-3 w-3 fill-current" />
                    <span>{record.morningEnergy}/5</span>
                  </div>
                  <button
                    onClick={() => deleteSleepRecord(record.id)}
                    className="text-slate-600 hover:text-rose-400 transition-colors p-1"
                    title="Delete record"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {behaviorLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 text-xs border border-slate-800/60"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400">{log.date} {log.time}</span>
                    <span className="text-slate-500">·</span>
                    <span className="font-medium text-white">{log.title}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-400">{log.detail}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">
                    {log.loggedDurationSeconds}s log
                  </span>
                  <button
                    onClick={() => deleteBehaviorLog(log.id)}
                    className="text-slate-600 hover:text-rose-400 transition-colors p-1"
                    title="Delete log"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data Export & Reset Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Data Management</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExportData}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-medium text-white hover:bg-slate-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export N-of-1 Data (JSON)</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-900/40 bg-rose-950/20 py-2.5 px-4 text-xs font-medium text-rose-300 hover:bg-rose-900/40 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {showResetConfirm && (
          <div className="mt-4 rounded-xl border border-rose-900/60 bg-rose-950/40 p-3 text-xs text-rose-200">
            <p>Restore original 14-day pre-seeded baseline and active experiment?</p>
            <div className="mt-2 flex gap-2 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1 rounded bg-rose-600 text-white hover:bg-rose-500 text-xs font-semibold"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
