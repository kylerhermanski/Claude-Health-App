import { SleepData, RecoveryData, StrainData } from "@/types/health";
import { format, subDays } from "date-fns";

function rand(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

export function generateMockData(days: number = 14) {
  const sleep: SleepData[] = [];
  const recovery: RecoveryData[] = [];
  const strain: StrainData[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd");

    // Whoop data
    const wDeep = rand(0.8, 2.0);
    const wRem = rand(1.0, 2.5);
    const wLight = rand(2.0, 4.0);
    const wAwake = rand(0.2, 0.8);
    sleep.push({
      date,
      source: "whoop",
      totalSleepHours: wDeep + wRem + wLight,
      deepSleepHours: wDeep,
      remSleepHours: wRem,
      lightSleepHours: wLight,
      awakeDurationHours: wAwake,
      sleepScore: Math.round(rand(50, 100)),
    });

    const wRecovery = Math.round(rand(30, 99));
    recovery.push({
      date,
      source: "whoop",
      recoveryScore: wRecovery,
      hrvMs: rand(30, 120),
      restingHeartRate: Math.round(rand(48, 68)),
      spo2: rand(95, 99),
    });

    strain.push({
      date,
      source: "whoop",
      strainScore: rand(4, 20),
      calories: Math.round(rand(1800, 3500)),
      avgHeartRate: Math.round(rand(60, 95)),
      maxHeartRate: Math.round(rand(140, 195)),
      activeDurationMinutes: Math.round(rand(30, 180)),
    });

    // Garmin data (slightly different patterns)
    const gDeep = rand(0.6, 1.8);
    const gRem = rand(0.8, 2.3);
    const gLight = rand(2.2, 4.2);
    const gAwake = rand(0.3, 1.0);
    sleep.push({
      date,
      source: "garmin",
      totalSleepHours: gDeep + gRem + gLight,
      deepSleepHours: gDeep,
      remSleepHours: gRem,
      lightSleepHours: gLight,
      awakeDurationHours: gAwake,
      sleepScore: Math.round(rand(40, 100)),
    });

    recovery.push({
      date,
      source: "garmin",
      recoveryScore: Math.round(rand(25, 100)),
      hrvMs: rand(25, 110),
      restingHeartRate: Math.round(rand(50, 70)),
      spo2: rand(94, 99),
    });

    strain.push({
      date,
      source: "garmin",
      strainScore: rand(3, 19),
      calories: Math.round(rand(1700, 3400)),
      avgHeartRate: Math.round(rand(58, 92)),
      maxHeartRate: Math.round(rand(135, 190)),
      activeDurationMinutes: Math.round(rand(20, 200)),
    });
  }

  return { sleep, recovery, strain };
}
