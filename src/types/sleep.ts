export type SleepQualityRating = 1 | 2 | 3 | 4 | 5;
export type EnergyRating = 1 | 2 | 3 | 4 | 5;

export interface SleepRecord {
  id: string;
  date: string; // YYYY-MM-DD
  bedTime: string; // HH:MM
  wakeTime: string; // HH:MM
  sleepDurationMinutes: number; // calculated minutes asleep
  sleepOnsetLatencyMinutes: number; // minutes to fall asleep
  nightAwakenings: number; // count
  quality: SleepQualityRating; // 1-5
  morningEnergy: EnergyRating; // 1-5
  notes?: string;
  recordedAt?: string;
  checkInDurationSeconds?: number; // for H1 validation (e.g. 18 seconds)
}

export type BehaviorType = 'coffee' | 'exercise' | 'nap' | 'stress' | 'alcohol' | 'screen';

export interface BehaviorLog {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  type: BehaviorType;
  title: string;
  detail: string;
  intensity?: 'low' | 'medium' | 'high';
  numericValue?: number; // e.g. minutes of exercise, cups of coffee, mins of screen
  loggedDurationSeconds?: number; // for H1 logging speed test (< 3 sec)
  createdAt: string;
}

export type ExperimentCategory = 'caffeine' | 'movement' | 'digital' | 'circadian' | 'relaxation';

export interface ExperimentTemplate {
  id: string;
  title: string;
  icon: string;
  category: ExperimentCategory;
  tagline: string;
  hypothesis: string;
  actionRule: string;
  durationDays: number;
  whyItWorks: string;
  targetBehavior: BehaviorType;
}

export interface ActiveExperiment {
  id: string;
  templateId: string;
  title: string;
  icon: string;
  category: ExperimentCategory;
  actionRule: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  durationDays: number; // 7
  adherence: Record<number, boolean>; // dayIndex 1..7 -> completed boolean
  baselineMetrics: {
    onsetLatencyMinutes: number;
    sleepDurationMinutes: number;
    morningEnergy: number;
    sleepQuality: number;
    sampleDays: number;
  };
  duringMetrics?: {
    onsetLatencyMinutes: number;
    sleepDurationMinutes: number;
    morningEnergy: number;
    sleepQuality: number;
    completedDays: number;
  };
  status: 'active' | 'completed' | 'abandoned';
  completedDate?: string;
  decision?: 'keep' | 'change' | 'undecided';
  learnedTakeaway?: string;
}

export interface SleepFactorInsight {
  id: string;
  factor: BehaviorType;
  title: string;
  icon: string;
  summary: string;
  observationCount: number;
  effect: {
    metric: string;
    delta: string;
    isPositive: boolean;
    explanation: string;
  };
  comparisonData: {
    withFactor: {
      label: string;
      onsetLatency: number;
      durationHours: number;
      quality: number;
      energy: number;
      count: number;
    };
    withoutFactor: {
      label: string;
      onsetLatency: number;
      durationHours: number;
      quality: number;
      energy: number;
      count: number;
    };
  };
  recommendedExperimentId?: string;
}

export interface UserInterviewPersona {
  id: string;
  name: string;
  age: number;
  occupation: string;
  profileSnippet: string;
  avatarSeed: string;
  currentSleepPain: string;
  currentWearableOrTool: string;
  wearableLimitationQuote: string;
  willingnessToLogScore: number; // 1-10
  ahaMomentTriggered: boolean;
  experimentAppetite: 'High' | 'Moderate' | 'Skeptical';
  verbatimQuote: string;
  validatedHypotheses: ('H1' | 'H2' | 'H3')[];
  keyInsights: string[];
}
