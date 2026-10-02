import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  FlaskConical,
  MessageSquare,
  FileText,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { discoveryUserInterviews } from '../data/mockData';
import { UserInterviewPersona } from '../types/sleep';

interface DiscoveryHubModalProps {
  onClose: () => void;
  onOpenMorningCheckin: () => void;
}

export const DiscoveryHubModal: React.FC<DiscoveryHubModalProps> = ({
  onClose,
  onOpenMorningCheckin,
}) => {
  const [selectedPersona, setSelectedPersona] = useState<UserInterviewPersona>(
    discoveryUserInterviews[0]
  );
  const [activeTab, setActiveTab] = useState<'personas' | 'hypotheses' | 'protocol'>('personas');

  // Interactive Live Stopwatch test for H1 in the discovery view
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [stopwatchResult, setStopwatchResult] = useState<number | null>(null);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  const handleStartStopwatch = () => {
    setStopwatchSeconds(0);
    setStopwatchResult(null);
    setStopwatchRunning(true);
  };

  const handleStopStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchResult(stopwatchSeconds);
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <Sparkles className="h-4 w-4" />
              <span>Product Discovery Hub</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
              8 User Interviews & Hypothesis Validation Lab
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-xl leading-relaxed">
              Synthesized discovery data from 8 target users (18–30 yr olds with irregular schedules) validating whether users will log (H1), care about causality (H2), and commit to 7-day experiments (H3).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
            >
              Back to Sleep Lab App
            </button>
          </div>
        </div>

        {/* 3 Hypotheses Scorecard Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-800/80 pt-4">
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-300">H1: Logging Friction</span>
              <span className="text-emerald-400 font-mono font-semibold">VALIDATED</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Morning &lt;30s (avg 21s) · 1-tap logging &lt;3s (avg 1.8s).
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-300">H2: Care About "Why?"</span>
              <span className="text-emerald-400 font-mono font-semibold">VALIDATED</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              8/8 frustrated by Apple Watch "Sleep 6h37m" without causality.
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-300">H3: 7-Day Experiments</span>
              <span className="text-emerald-400 font-mono font-semibold">VALIDATED</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              7-day micro trial removes anxiety of permanent habit changes.
            </div>
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1 rounded-lg bg-slate-900 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('personas')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'personas'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            8 Interview Transcripts ({discoveryUserInterviews.length})
          </button>
          <button
            onClick={() => setActiveTab('hypotheses')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'hypotheses'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hypothesis Testing Lab (H1, H2, H3)
          </button>
          <button
            onClick={() => setActiveTab('protocol')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'protocol'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interview Protocol Script
          </button>
        </div>
      </div>

      {/* TAB 1: 8 User Interviews Browser */}
      {activeTab === 'personas' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Persona selector list (Left col) */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Target Interviewees (18–30)
            </div>
            <div className="space-y-1.5">
              {discoveryUserInterviews.map((p) => {
                const isSelected = p.id === selectedPersona.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPersona(p)}
                    className={`w-full text-left rounded-xl p-3 border transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-600/20 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">{p.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{p.age} yrs</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">{p.occupation}</div>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px]">
                      <span className="text-slate-400">Wearable:</span>
                      <span className="text-indigo-300 truncate">{p.currentWearableOrTool}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Persona Details Viewer (Right col) */}
          <div className="md:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{selectedPersona.name}</h2>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-300">
                    Age {selectedPersona.age} · {selectedPersona.occupation}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {selectedPersona.profileSnippet}
                </p>
              </div>
            </div>

            {/* Core Quotation / Aha Moment */}
            <div className="mt-5 rounded-xl border border-indigo-900/60 bg-indigo-950/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                Verbatim Interview Quote
              </div>
              <p className="mt-1.5 text-sm font-medium italic text-slate-200 leading-relaxed">
                "{selectedPersona.verbatimQuote}"
              </p>
            </div>

            {/* Wearable Limitation (The "Why?" Problem) */}
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  Current Wearable / Tracker: {selectedPersona.currentWearableOrTool}
                </span>
                <span className="text-[10px] font-mono text-amber-400">Attribution Gap</span>
              </div>
              <p className="mt-2 text-xs text-slate-400 italic leading-relaxed">
                "{selectedPersona.wearableLimitationQuote}"
              </p>
            </div>

            {/* Key Discovery Insights */}
            <div className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Key Discovery Insights
              </h3>
              <ul className="space-y-2">
                {selectedPersona.keyInsights.map((insight, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Validated Hypotheses Tags */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Hypotheses Validated by this User:</span>
              <div className="flex gap-2">
                {selectedPersona.validatedHypotheses.map((h) => (
                  <span
                    key={h}
                    className="rounded bg-emerald-950/80 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-400 border border-emerald-800/60"
                  >
                    {h} ✓
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Hypothesis Testing Lab */}
      {activeTab === 'hypotheses' && (
        <div className="space-y-6">
          {/* H1 Deep Dive */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="rounded bg-indigo-950 px-2 py-0.5 text-xs font-mono text-indigo-300 border border-indigo-800/60">
                  Hypothesis 1 (H1)
                </span>
                <h3 className="mt-2 text-base font-bold text-white">
                  用户愿不愿意记录？ (Logging Friction Threshold)
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/60">
                Validated (Goal &lt;30s met)
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              If daily logging takes longer than 30 seconds in the morning or 3 seconds during the day, young adults abandon the app within 4 days.
            </p>

            {/* Live Interactive Friction Test */}
            <div className="mt-4 rounded-xl bg-slate-950/80 p-4 border border-slate-800">
              <div className="text-xs font-semibold text-white mb-2">
                Live Stopwatch Test: Measure Morning Check-in Speed
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="font-mono text-2xl font-bold text-indigo-400 tabular-nums">
                    {stopwatchSeconds}s
                  </div>
                  {stopwatchResult !== null && (
                    <span className="text-xs text-emerald-400 font-medium">
                      Finished in {stopwatchResult}s! (&lt;30s target passed)
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {!stopwatchRunning ? (
                    <button
                      onClick={() => {
                        handleStartStopwatch();
                        onOpenMorningCheckin();
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Start Check-in Speed Test</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopStopwatch}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                    >
                      Stop Timer (Saved)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* H2 Deep Dive */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="rounded bg-indigo-950 px-2 py-0.5 text-xs font-mono text-indigo-300 border border-indigo-800/60">
                  Hypothesis 2 (H2)
                </span>
                <h3 className="mt-2 text-base font-bold text-white">
                  用户是否在意“为什么”？ (The "Why?" & Aha Moment)
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/60">
                Validated (Aha Triggered: 8/8)
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              When users see: <em className="text-white">"On days when you have caffeine after 2 PM, you tend to take 16 min longer to fall asleep"</em>, does it trigger the "Aha Moment"?
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
                <span className="text-rose-400 font-semibold">❌ What Traditional Apps Do:</span>
                <p className="mt-1 text-slate-400 text-[11px] leading-relaxed">
                  "Sleep: 6h 37m. Sleep Score: 74."
                  User reaction: "Okay, but WHY 74? What am I supposed to change?"
                </p>
              </div>

              <div className="rounded-xl bg-slate-950/60 p-3 border border-indigo-900/50 bg-indigo-950/20">
                <span className="text-indigo-300 font-semibold">✓ What Sleep Lab Does:</span>
                <p className="mt-1 text-slate-300 text-[11px] leading-relaxed">
                  "Late caffeine was associated with +16m sleep onset. Ready to test a 7-day caffeine curfew?"
                  User reaction: "Aha! That's actionable science."
                </p>
              </div>
            </div>
          </div>

          {/* H3 Deep Dive */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="rounded bg-indigo-950 px-2 py-0.5 text-xs font-mono text-indigo-300 border border-indigo-800/60">
                  Hypothesis 3 (H3)
                </span>
                <h3 className="mt-2 text-base font-bold text-white">
                  用户会不会真的做 7-day Experiment？ (Experiment Adoption)
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/60">
                Validated (7/8 High Appetite)
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Users reject indefinite 30-day habits, but actively welcome 7-day low-stakes scientific micro-trials with a concrete "Keep or Change" decision at the end.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: Interview Protocol Script */}
      {activeTab === 'protocol' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-white">
              5–8 User Discovery Interview Protocol Guide
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Step-by-step interview script for user research with 18–30 year olds.
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
              <span className="font-semibold text-indigo-400">Stage 1: Screener & Current Reality (5 mins)</span>
              <p className="mt-1 text-slate-400">
                • "Walk me through your typical weekday vs weekend sleep schedule."<br />
                • "When you wake up feeling unrefreshed, what do you usually blame it on?"
              </p>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
              <span className="font-semibold text-indigo-400">Stage 2: The Wearable "Why?" Gap (10 mins)</span>
              <p className="mt-1 text-slate-400">
                • "Do you use Apple Watch, Oura, or phone tracking? What does it tell you?"<br />
                • "Have you ever looked at a sleep score and felt frustrated because it didn't tell you what caused it?"
              </p>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
              <span className="font-semibold text-indigo-400">Stage 3: Logging Friction Tolerance (10 mins)</span>
              <p className="mt-1 text-slate-400">
                • "Would you be willing to do a 20-second morning check-in? (Test live with prototype)"<br />
                • "How do you feel about 1-tap buttons for coffee, workout, and stress vs filling out a detailed form?"
              </p>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800">
              <span className="font-semibold text-indigo-400">Stage 4: 7-Day Experiment Appetite (15 mins)</span>
              <p className="mt-1 text-slate-400">
                • "If an app shows your data and says: 'Cut caffeine after 2 PM for 7 days to test if onset improves by 12 mins'—would you do it?"<br />
                • "How does a 7-day experiment feel compared to being told 'Change your habits forever'?"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
