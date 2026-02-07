export type DataSource = "whoop" | "garmin";

export interface SleepData {
  date: string;
  source: DataSource;
  totalSleepHours: number;
  deepSleepHours: number;
  remSleepHours: number;
  lightSleepHours: number;
  awakeDurationHours: number;
  sleepScore?: number;
}

export interface RecoveryData {
  date: string;
  source: DataSource;
  recoveryScore: number; // 0-100
  hrvMs: number;
  restingHeartRate: number;
  spo2?: number;
  skinTempC?: number;
}

export interface StrainData {
  date: string;
  source: DataSource;
  strainScore: number; // Whoop: 0-21, Garmin: normalized to same scale
  calories: number;
  avgHeartRate: number;
  maxHeartRate: number;
  activeDurationMinutes: number;
}

export interface DailyHealthSummary {
  date: string;
  sleep: SleepData[];
  recovery: RecoveryData[];
  strain: StrainData[];
}

export interface ConnectionStatus {
  whoop: boolean;
  garmin: boolean;
}
