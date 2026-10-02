import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, Zap, Star, Check } from 'lucide-react';
import { useSleep } from '../context/SleepContext';
import { SleepQualityRating, EnergyRating } from '../types/sleep';

interface MorningReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MorningReflectionModal: React.FC<MorningReflectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addSleepRecord } = useSleep();

  // Form state
  const [bedTime, setBedTime] = useState('00:45');
  const [wakeTime, setWakeTime] = useState('07:45');
  const [onsetLatency, setOnsetLatency] = useState(20);
  const [awakenings, setAwakenings] = useState(1);
  const [quality, setQuality] = useState<SleepQualityRating>(4);
  const [energy, setEnergy] = useState<EnergyRating>(4);
  const [notes, setNotes] = useState('');

  // Live stopwatch for H1 hypothesis validation (<30s check-in)
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSecondsElapsed(0);
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate sleep duration in minutes
  const calculateDurationMinutes = () => {
    const [bH, bM] = bedTime.split(':').map(Number);
    const [wH, wM] = wakeTime.split(':').map(Number);
    let totalMinutes = wH * 60 + wM - (bH * 60 + bM);
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    return Math.max(0, totalMinutes - onsetLatency);
  };

  const durationMin = calculateDurationMinutes();
  const durationHours = (durationMin / 60).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    addSleepRecord({
      date: today,
      bedTime,
      wakeTime,
      sleepDurationMinutes: durationMin,
      sleepOnsetLatencyMinutes: onsetLatency,
      nightAwakenings: awakenings,
      quality,
      morningEnergy: energy,
      notes: notes.trim() || undefined,
      checkInDurationSeconds: secondsElapsed || 18,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Header with H1 Timer Proof */}
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-white">Morning Reflection</h2>
              <span className="flex items-center gap-1 rounded bg-indigo-950/80 px-2 py-0.5 text-[11px] font-mono font-medium text-indigo-300 border border-indigo-800/40">
                <Clock className="h-3 w-3" />
                <span className="tabular-nums">{secondsElapsed}s</span>
                <span className="text-slate-400">/ goal &lt;30s</span>
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              20–30 second check-in to quantify subjective sleep and morning energy.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Bedtime & Wake time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Bedtime
              </label>
              <input
                type="time"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-mono text-white focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Wake Time
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-mono text-white focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Sleep duration computed preview */}
          <div className="flex items-center justify-between rounded-lg bg-slate-950/60 p-2.5 border border-slate-800/60 text-xs">
            <span className="text-slate-400">Calculated Sleep Duration:</span>
            <span className="font-mono font-medium text-indigo-300 tabular-nums">
              {Math.floor(durationMin / 60)}h {durationMin % 60}m ({durationHours} hours)
            </span>
          </div>

          {/* Time to fall asleep (Sleep Latency) */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
              <span>Time to fall asleep</span>
              <span className="font-mono text-indigo-400 tabular-nums font-medium">~{onsetLatency} min</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 35, 50].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setOnsetLatency(mins)}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    onsetLatency === mins
                      ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 font-semibold shadow-sm'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mins === 50 ? '45m+' : `~${mins}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Night Awakenings */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
              <span>Night awakenings</span>
              <span className="font-mono text-slate-400 tabular-nums">{awakenings} times</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setAwakenings(count)}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    awakenings === count
                      ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 font-semibold'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {count === 4 ? '4+' : count}
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Quality (1-5) */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
              <span>Subjective sleep quality</span>
              <span className="font-mono text-amber-300 tabular-nums font-medium">
                {quality}/5 · {['Very Poor', 'Poor', 'Fair', 'Good', 'Restful'][quality - 1]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {([1, 2, 3, 4, 5] as SleepQualityRating[]).map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setQuality(star)}
                  className={`flex-1 py-2 rounded-lg border flex items-center justify-center transition-all ${
                    quality >= star
                      ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-600 hover:text-slate-400'
                  }`}
                >
                  <Star className="h-4 w-4 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Morning Energy (1-5) */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
              <span>Energy right now</span>
              <span className="font-mono text-emerald-400 tabular-nums font-medium">
                {energy}/5 · {['Drained', 'Sluggish', 'Neutral', 'Clear', 'Energized'][energy - 1]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {([1, 2, 3, 4, 5] as EnergyRating[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setEnergy(level)}
                  className={`flex-1 py-2 rounded-lg border flex items-center justify-center transition-all ${
                    energy >= level
                      ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-800 bg-slate-950/40 text-slate-600 hover:text-slate-400'
                  }`}
                >
                  <Zap className="h-4 w-4 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Optional notes */}
          <div>
            <input
              type="text"
              placeholder="Quick note (e.g. late cold brew, room was warm)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.99] transition-all"
            >
              <Check className="h-4 w-4" />
              <span>Save Morning Reflection</span>
              <span className="text-xs font-mono text-indigo-200">({secondsElapsed}s)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
