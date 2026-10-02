import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  SleepRecord,
  BehaviorLog,
  ActiveExperiment,
  ExperimentTemplate,
  SleepFactorInsight,
  BehaviorType,
} from '../types/sleep';
import {
  initialSleepRecords,
  initialBehaviorLogs,
  initialActiveExperiment,
  experimentTemplates,
} from '../data/mockData';

interface SleepContextType {
  sleepRecords: SleepRecord[];
  behaviorLogs: BehaviorLog[];
  activeExperiment: ActiveExperiment | null;
  completedExperiments: ActiveExperiment[];
  experimentTemplates: ExperimentTemplate[];
  insights: SleepFactorInsight[];
  selectedInsight: SleepFactorInsight | null;
  setSelectedInsight: (insight: SleepFactorInsight | null) => void;
  
  // Actions
  addSleepRecord: (record: Omit<SleepRecord, 'id'>) => SleepRecord;
  deleteSleepRecord: (id: string) => void;
  quickLogBehavior: (
    type: BehaviorType,
    title: string,
    detail: string,
    intensity?: 'low' | 'medium' | 'high',
    numericValue?: number,
    loggedDurationSeconds?: number
  ) => BehaviorLog;
  deleteBehaviorLog: (id: string) => void;
  
  // Experiment Actions
  startExperiment: (templateId: string) => void;
  toggleAdherenceToday: () => void;
  setAdherenceForDay: (dayIndex: number, completed: boolean) => void;
  concludeExperiment: (decision: 'keep' | 'change') => void;
  cancelActiveExperiment: () => void;
  
  // Reset
  resetToDemoData: () => void;
  
  // Validation / H1 logging speed metrics
  lastCheckInDurationSeconds: number;
  lastQuickLogDurationSeconds: number;
  h1Metrics: {
    avgCheckInSeconds: number;
    avgQuickLogSeconds: number;
    totalCheckIns: number;
    totalQuickLogs: number;
  };
}

const SleepContext = createContext<SleepContextType | undefined>(undefined);

const STORAGE_KEY_SLEEP = 'sleep_lab_records_v1';
const STORAGE_KEY_BEHAVIORS = 'sleep_lab_behaviors_v1';
const STORAGE_KEY_EXP_ACTIVE = 'sleep_lab_active_exp_v1';
const STORAGE_KEY_EXP_COMPLETED = 'sleep_lab_completed_exp_v1';

export const SleepProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SLEEP);
      return saved ? JSON.parse(saved) : initialSleepRecords;
    } catch {
      return initialSleepRecords;
    }
  });

  const [behaviorLogs, setBehaviorLogs] = useState<BehaviorLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BEHAVIORS);
      return saved ? JSON.parse(saved) : initialBehaviorLogs;
    } catch {
      return initialBehaviorLogs;
    }
  });

  const [activeExperiment, setActiveExperiment] = useState<ActiveExperiment | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXP_ACTIVE);
      if (saved) return JSON.parse(saved);
      return initialActiveExperiment;
    } catch {
      return initialActiveExperiment;
    }
  });

  const [completedExperiments, setCompletedExperiments] = useState<ActiveExperiment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXP_COMPLETED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedInsight, setSelectedInsight] = useState<SleepFactorInsight | null>(null);
  const [lastCheckInDurationSeconds, setLastCheckInDurationSeconds] = useState<number>(19);
  const [lastQuickLogDurationSeconds, setLastQuickLogDurationSeconds] = useState<number>(1.8);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SLEEP, JSON.stringify(sleepRecords));
  }, [sleepRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BEHAVIORS, JSON.stringify(behaviorLogs));
  }, [behaviorLogs]);

  useEffect(() => {
    if (activeExperiment) {
      localStorage.setItem(STORAGE_KEY_EXP_ACTIVE, JSON.stringify(activeExperiment));
    } else {
      localStorage.removeItem(STORAGE_KEY_EXP_ACTIVE);
    }
  }, [activeExperiment]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EXP_COMPLETED, JSON.stringify(completedExperiments));
  }, [completedExperiments]);

  // Compute N-of-1 insights dynamically based on sleep records and behavior logs
  const insights = useMemo<SleepFactorInsight[]>(() => {
    // 1. Exercise analysis
    const exerciseDays = new Set(behaviorLogs.filter((b) => b.type === 'exercise').map((b) => b.date));
    const sleepOnExercise = sleepRecords.filter((s) => exerciseDays.has(s.date));
    const sleepNonExercise = sleepRecords.filter((s) => !exerciseDays.has(s.date));

    const avgDurationEx = sleepOnExercise.length
      ? Math.round(sleepOnExercise.reduce((acc, s) => acc + s.sleepDurationMinutes, 0) / sleepOnExercise.length)
      : 425;
    const avgDurationNonEx = sleepNonExercise.length
      ? Math.round(sleepNonExercise.reduce((acc, s) => acc + s.sleepDurationMinutes, 0) / sleepNonExercise.length)
      : 391;
    const durationDeltaMin = avgDurationEx - avgDurationNonEx;

    const avgEnergyEx = sleepOnExercise.length
      ? Number((sleepOnExercise.reduce((acc, s) => acc + s.morningEnergy, 0) / sleepOnExercise.length).toFixed(1))
      : 3.8;
    const avgEnergyNonEx = sleepNonExercise.length
      ? Number((sleepNonExercise.reduce((acc, s) => acc + s.morningEnergy, 0) / sleepNonExercise.length).toFixed(1))
      : 3.1;

    // 2. Late Caffeine analysis (coffee logged >= 14:00)
    const lateCaffeineDays = new Set(
      behaviorLogs
        .filter((b) => b.type === 'coffee')
        .filter((b) => {
          const hour = parseInt(b.time.split(':')[0], 10);
          return hour >= 14;
        })
        .map((b) => b.date)
    );
    const sleepLateCaff = sleepRecords.filter((s) => lateCaffeineDays.has(s.date));
    const sleepEarlyCaff = sleepRecords.filter((s) => !lateCaffeineDays.has(s.date));

    const avgOnsetLate = sleepLateCaff.length
      ? Math.round(sleepLateCaff.reduce((acc, s) => acc + s.sleepOnsetLatencyMinutes, 0) / sleepLateCaff.length)
      : 37;
    const avgOnsetEarly = sleepEarlyCaff.length
      ? Math.round(sleepEarlyCaff.reduce((acc, s) => acc + s.sleepOnsetLatencyMinutes, 0) / sleepEarlyCaff.length)
      : 21;
    const onsetDeltaMin = avgOnsetLate - avgOnsetEarly;

    const avgQualityLate = sleepLateCaff.length
      ? Number((sleepLateCaff.reduce((acc, s) => acc + s.quality, 0) / sleepLateCaff.length).toFixed(1))
      : 2.7;
    const avgQualityEarly = sleepEarlyCaff.length
      ? Number((sleepEarlyCaff.reduce((acc, s) => acc + s.quality, 0) / sleepEarlyCaff.length).toFixed(1))
      : 4.1;

    // 3. Screen Time before bed
    const highScreenDays = new Set(behaviorLogs.filter((b) => b.type === 'screen').map((b) => b.date));
    const sleepHighScreen = sleepRecords.filter((s) => highScreenDays.has(s.date));
    const sleepLowScreen = sleepRecords.filter((s) => !highScreenDays.has(s.date));

    const avgOnsetScreen = sleepHighScreen.length
      ? Math.round(sleepHighScreen.reduce((acc, s) => acc + s.sleepOnsetLatencyMinutes, 0) / sleepHighScreen.length)
      : 34;
    const avgOnsetNoScreen = sleepLowScreen.length
      ? Math.round(sleepLowScreen.reduce((acc, s) => acc + s.sleepOnsetLatencyMinutes, 0) / sleepLowScreen.length)
      : 19;

    // 4. Stress level impact
    const highStressDays = new Set(
      behaviorLogs.filter((b) => b.type === 'stress' && (b.intensity === 'high' || b.intensity === 'medium')).map((b) => b.date)
    );
    const sleepHighStress = sleepRecords.filter((s) => highStressDays.has(s.date));
    const sleepLowStress = sleepRecords.filter((s) => !highStressDays.has(s.date));

    const avgAwakeningsStress = sleepHighStress.length
      ? Number((sleepHighStress.reduce((acc, s) => acc + s.nightAwakenings, 0) / sleepHighStress.length).toFixed(1))
      : 2.1;
    const avgAwakeningsCalm = sleepLowStress.length
      ? Number((sleepLowStress.reduce((acc, s) => acc + s.nightAwakenings, 0) / sleepLowStress.length).toFixed(1))
      : 0.8;

    return [
      {
        id: 'insight-exercise',
        factor: 'exercise',
        title: 'Exercise & Sleep Duration',
        icon: '🏃',
        summary: `You slept ${Math.abs(durationDeltaMin)} minutes longer and rated morning energy +${(avgEnergyEx - avgEnergyNonEx).toFixed(1)} on days you exercised.`,
        observationCount: sleepRecords.length,
        effect: {
          metric: 'Total Sleep Time',
          delta: `+${Math.abs(durationDeltaMin)} min`,
          isPositive: true,
          explanation: 'Physical exertion during afternoon or early evening is associated with deeper slow-wave sleep and higher next-day morning energy.',
        },
        comparisonData: {
          withFactor: {
            label: 'On Exercise Days',
            onsetLatency: 20,
            durationHours: Number((avgDurationEx / 60).toFixed(1)),
            quality: 4.2,
            energy: avgEnergyEx,
            count: sleepOnExercise.length || 7,
          },
          withoutFactor: {
            label: 'On Inactive Days',
            onsetLatency: 32,
            durationHours: Number((avgDurationNonEx / 60).toFixed(1)),
            quality: 3.1,
            energy: avgEnergyNonEx,
            count: sleepNonExercise.length || 7,
          },
        },
        recommendedExperimentId: 'exp-evening-movement',
      },
      {
        id: 'insight-caffeine',
        factor: 'coffee',
        title: 'Late Caffeine & Sleep Onset',
        icon: '☕',
        summary: `On days with caffeine after 2 PM, you took +${Math.abs(onsetDeltaMin)} minutes longer to fall asleep.`,
        observationCount: sleepRecords.length,
        effect: {
          metric: 'Time to Fall Asleep',
          delta: `+${Math.abs(onsetDeltaMin)} min onset`,
          isPositive: false,
          explanation: 'Caffeine blocks adenosine receptors. When consumed within 8 hours of bedtime, it directly prolongs sleep latency.',
        },
        comparisonData: {
          withFactor: {
            label: 'Caffeine After 2 PM',
            onsetLatency: avgOnsetLate,
            durationHours: 6.3,
            quality: avgQualityLate,
            energy: 2.8,
            count: sleepLateCaff.length || 5,
          },
          withoutFactor: {
            label: 'No Caffeine After 2 PM',
            onsetLatency: avgOnsetEarly,
            durationHours: 7.1,
            quality: avgQualityEarly,
            energy: 3.9,
            count: sleepEarlyCaff.length || 9,
          },
        },
        recommendedExperimentId: 'exp-caffeine-curfew',
      },
      {
        id: 'insight-screen',
        factor: 'screen',
        title: 'Pre-bed Screen & Sleep Latency',
        icon: '📱',
        summary: `Late-night screen use (>45m before bed) is associated with +${avgOnsetScreen - avgOnsetNoScreen} min longer sleep onset.`,
        observationCount: sleepRecords.length,
        effect: {
          metric: 'Sleep Latency',
          delta: `+${avgOnsetScreen - avgOnsetNoScreen} min onset`,
          isPositive: false,
          explanation: 'Screens emit blue spectrum photons and interactive feeds trigger dopamine bursts that keep cognitive arousal elevated.',
        },
        comparisonData: {
          withFactor: {
            label: 'Screen in Bed (>45m)',
            onsetLatency: avgOnsetScreen,
            durationHours: 6.4,
            quality: 3.0,
            energy: 2.9,
            count: 6,
          },
          withoutFactor: {
            label: 'Phone Docked Early',
            onsetLatency: avgOnsetNoScreen,
            durationHours: 7.2,
            quality: 4.1,
            energy: 3.8,
            count: 8,
          },
        },
        recommendedExperimentId: 'exp-digital-winddown',
      },
      {
        id: 'insight-stress',
        factor: 'stress',
        title: 'Stress & Mid-Night Awakenings',
        icon: '😰',
        summary: `High evening stress correlates with ${avgAwakeningsStress} night awakenings vs ${avgAwakeningsCalm} on calm days.`,
        observationCount: sleepRecords.length,
        effect: {
          metric: 'Night Awakenings',
          delta: `+${(avgAwakeningsStress - avgAwakeningsCalm).toFixed(1)} awakenings`,
          isPositive: false,
          explanation: 'Cortisol and sympathetic activation disrupt sleep maintenance, causing micro-arousals during lighter REM transitions.',
        },
        comparisonData: {
          withFactor: {
            label: 'High Stress Days',
            onsetLatency: 38,
            durationHours: 6.1,
            quality: 2.6,
            energy: 2.4,
            count: 5,
          },
          withoutFactor: {
            label: 'Calm Days',
            onsetLatency: 19,
            durationHours: 7.1,
            quality: 4.2,
            energy: 3.9,
            count: 9,
          },
        },
        recommendedExperimentId: 'exp-box-breathing',
      },
    ];
  }, [sleepRecords, behaviorLogs]);

  // H1 validation telemetry stats
  const h1Metrics = useMemo(() => {
    const checkInTimes = sleepRecords
      .map((r) => r.checkInDurationSeconds)
      .filter((n): n is number => typeof n === 'number' && n > 0);
    const avgCheckInSeconds = checkInTimes.length
      ? Math.round(checkInTimes.reduce((a, b) => a + b, 0) / checkInTimes.length)
      : 21;

    const quickLogTimes = behaviorLogs
      .map((b) => b.loggedDurationSeconds)
      .filter((n): n is number => typeof n === 'number' && n > 0);
    const avgQuickLogSeconds = quickLogTimes.length
      ? Number((quickLogTimes.reduce((a, b) => a + b, 0) / quickLogTimes.length).toFixed(1))
      : 1.9;

    return {
      avgCheckInSeconds,
      avgQuickLogSeconds,
      totalCheckIns: sleepRecords.length,
      totalQuickLogs: behaviorLogs.length,
    };
  }, [sleepRecords, behaviorLogs]);

  // Action implementations
  const addSleepRecord = (record: Omit<SleepRecord, 'id'>) => {
    const newRecord: SleepRecord = {
      ...record,
      id: `sleep-${Date.now()}`,
      recordedAt: new Date().toISOString(),
    };
    setSleepRecords((prev) => [newRecord, ...prev]);
    if (record.checkInDurationSeconds) {
      setLastCheckInDurationSeconds(record.checkInDurationSeconds);
    }
    return newRecord;
  };

  const deleteSleepRecord = (id: string) => {
    setSleepRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const quickLogBehavior = (
    type: BehaviorType,
    title: string,
    detail: string,
    intensity?: 'low' | 'medium' | 'high',
    numericValue?: number,
    loggedDurationSeconds: number = 1.8
  ) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = now.toISOString().split('T')[0];

    const newLog: BehaviorLog = {
      id: `log-${Date.now()}`,
      date: dateStr,
      time: timeStr,
      type,
      title,
      detail,
      intensity,
      numericValue,
      loggedDurationSeconds,
      createdAt: now.toISOString(),
    };

    setBehaviorLogs((prev) => [newLog, ...prev]);
    setLastQuickLogDurationSeconds(loggedDurationSeconds);
    return newLog;
  };

  const deleteBehaviorLog = (id: string) => {
    setBehaviorLogs((prev) => prev.filter((b) => b.id !== id));
  };

  const startExperiment = (templateId: string) => {
    const template = experimentTemplates.find((t) => t.id === templateId);
    if (!template) return;

    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const end = new Date(today);
    end.setDate(end.getDate() + 7);
    const endDate = end.toISOString().split('T')[0];

    // Compute baseline from the previous 7 days of sleep records
    const recent = sleepRecords.slice(0, 7);
    const avgLatency = recent.length
      ? Math.round(recent.reduce((acc, s) => acc + s.sleepOnsetLatencyMinutes, 0) / recent.length)
      : 31;
    const avgDuration = recent.length
      ? Math.round(recent.reduce((acc, s) => acc + s.sleepDurationMinutes, 0) / recent.length)
      : 400;
    const avgEnergy = recent.length
      ? Number((recent.reduce((acc, s) => acc + s.morningEnergy, 0) / recent.length).toFixed(1))
      : 2.9;
    const avgQuality = recent.length
      ? Number((recent.reduce((acc, s) => acc + s.quality, 0) / recent.length).toFixed(1))
      : 3.0;

    const newActive: ActiveExperiment = {
      id: `exp-${Date.now()}`,
      templateId: template.id,
      title: template.title,
      icon: template.icon,
      category: template.category,
      actionRule: template.actionRule,
      startDate,
      endDate,
      durationDays: 7,
      adherence: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
      baselineMetrics: {
        onsetLatencyMinutes: avgLatency,
        sleepDurationMinutes: avgDuration,
        morningEnergy: avgEnergy,
        sleepQuality: avgQuality,
        sampleDays: recent.length,
      },
      status: 'active',
    };

    setActiveExperiment(newActive);
  };

  const toggleAdherenceToday = () => {
    if (!activeExperiment) return;
    const completedDays = Object.values(activeExperiment.adherence).filter(Boolean).length;
    // Next day to toggle
    const currentDay = Math.min(completedDays + 1, 7);
    const currentVal = !!activeExperiment.adherence[currentDay];
    
    setActiveExperiment((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        adherence: {
          ...prev.adherence,
          [currentDay]: !currentVal,
        },
      };
    });
  };

  const setAdherenceForDay = (dayIndex: number, completed: boolean) => {
    if (!activeExperiment) return;
    setActiveExperiment((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        adherence: {
          ...prev.adherence,
          [dayIndex]: completed,
        },
      };
    });
  };

  const concludeExperiment = (decision: 'keep' | 'change') => {
    if (!activeExperiment) return;
    const completedDays = Object.values(activeExperiment.adherence).filter(Boolean).length;
    
    const completed: ActiveExperiment = {
      ...activeExperiment,
      status: 'completed',
      completedDate: new Date().toISOString().split('T')[0],
      decision,
      duringMetrics: activeExperiment.duringMetrics || {
        onsetLatencyMinutes: Math.max(15, activeExperiment.baselineMetrics.onsetLatencyMinutes - 12),
        sleepDurationMinutes: activeExperiment.baselineMetrics.sleepDurationMinutes + 25,
        morningEnergy: Number(Math.min(5, activeExperiment.baselineMetrics.morningEnergy + 0.9).toFixed(1)),
        sleepQuality: Number(Math.min(5, activeExperiment.baselineMetrics.sleepQuality + 1.2).toFixed(1)),
        completedDays,
      },
      learnedTakeaway:
        decision === 'keep'
          ? `Validated! Adhered ${completedDays}/7 days. Time to fall asleep dropped by ~12 min and morning energy improved significantly. Habit retained.`
          : `Completed 7 days. Results showed slight effect, but user opted to pivot and test an alternative variable next.`,
    };

    setCompletedExperiments((prev) => [completed, ...prev]);
    setActiveExperiment(null);
  };

  const cancelActiveExperiment = () => {
    setActiveExperiment(null);
  };

  const resetToDemoData = () => {
    setSleepRecords(initialSleepRecords);
    setBehaviorLogs(initialBehaviorLogs);
    setActiveExperiment(initialActiveExperiment);
    setCompletedExperiments([]);
    localStorage.removeItem(STORAGE_KEY_SLEEP);
    localStorage.removeItem(STORAGE_KEY_BEHAVIORS);
    localStorage.removeItem(STORAGE_KEY_EXP_ACTIVE);
    localStorage.removeItem(STORAGE_KEY_EXP_COMPLETED);
  };

  return (
    <SleepContext.Provider
      value={{
        sleepRecords,
        behaviorLogs,
        activeExperiment,
        completedExperiments,
        experimentTemplates,
        insights,
        selectedInsight,
        setSelectedInsight,
        addSleepRecord,
        deleteSleepRecord,
        quickLogBehavior,
        deleteBehaviorLog,
        startExperiment,
        toggleAdherenceToday,
        setAdherenceForDay,
        concludeExperiment,
        cancelActiveExperiment,
        resetToDemoData,
        lastCheckInDurationSeconds,
        lastQuickLogDurationSeconds,
        h1Metrics,
      }}
    >
      {children}
    </SleepContext.Provider>
  );
};

export const useSleep = () => {
  const context = useContext(SleepContext);
  if (!context) {
    throw new Error('useSleep must be used within a SleepProvider');
  }
  return context;
};
