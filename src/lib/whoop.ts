import { SleepData, RecoveryData, StrainData } from "@/types/health";

const WHOOP_API_BASE = "https://api.prod.whoop.com/developer/v1";

interface WhoopTokens {
  accessToken: string;
  refreshToken: string;
}

export function getWhoopAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: process.env.WHOOP_CLIENT_ID!,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/whoop/callback`,
    response_type: "code",
    scope: "read:sleep read:recovery read:workout read:cycles read:profile",
  });
  return `https://api.prod.whoop.com/oauth/oauth2/auth?${params}`;
}

export async function exchangeWhoopCode(code: string): Promise<WhoopTokens> {
  const res = await fetch("https://api.prod.whoop.com/oauth/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.WHOOP_CLIENT_ID!,
      client_secret: process.env.WHOOP_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/whoop/callback`,
    }),
  });
  const data = await res.json();
  return { accessToken: data.access_token, refreshToken: data.refresh_token };
}

async function whoopFetch(path: string, accessToken: string) {
  const res = await fetch(`${WHOOP_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Whoop API error: ${res.status}`);
  return res.json();
}

export async function fetchWhoopSleep(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<SleepData[]> {
  const params = new URLSearchParams({
    start: `${startDate}T00:00:00.000Z`,
    end: `${endDate}T23:59:59.999Z`,
  });
  const data = await whoopFetch(`/activity/sleep?${params}`, accessToken);

  return (data.records ?? []).map((record: Record<string, unknown>) => {
    const score = record.score as Record<string, number> | undefined;
    const totalMs = score?.total_in_bed_time_milli ?? 0;
    const remMs = score?.rem_sleep_time_milli ?? 0;
    const swsMs = score?.slow_wave_sleep_time_milli ?? 0;
    const lightMs = score?.light_sleep_time_milli ?? 0;
    const awakeMs = score?.wake_time_milli ?? 0;

    return {
      date: (record.start as string).slice(0, 10),
      source: "whoop" as const,
      totalSleepHours: totalMs / 3_600_000,
      deepSleepHours: swsMs / 3_600_000,
      remSleepHours: remMs / 3_600_000,
      lightSleepHours: lightMs / 3_600_000,
      awakeDurationHours: awakeMs / 3_600_000,
      sleepScore: score?.sleep_performance_percentage,
    };
  });
}

export async function fetchWhoopRecovery(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<RecoveryData[]> {
  const params = new URLSearchParams({
    start: `${startDate}T00:00:00.000Z`,
    end: `${endDate}T23:59:59.999Z`,
  });
  const data = await whoopFetch(`/recovery?${params}`, accessToken);

  return (data.records ?? []).map((record: Record<string, unknown>) => {
    const score = record.score as Record<string, number> | undefined;
    return {
      date: (record.created_at as string).slice(0, 10),
      source: "whoop" as const,
      recoveryScore: score?.recovery_score ?? 0,
      hrvMs: score?.hrv_rmssd_milli ?? 0,
      restingHeartRate: score?.resting_heart_rate ?? 0,
      spo2: score?.spo2_percentage,
      skinTempC: score?.skin_temp_celsius,
    };
  });
}

export async function fetchWhoopStrain(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<StrainData[]> {
  const params = new URLSearchParams({
    start: `${startDate}T00:00:00.000Z`,
    end: `${endDate}T23:59:59.999Z`,
  });
  const data = await whoopFetch(`/cycle?${params}`, accessToken);

  return (data.records ?? []).map((record: Record<string, unknown>) => {
    const score = record.score as Record<string, number> | undefined;
    return {
      date: (record.start as string).slice(0, 10),
      source: "whoop" as const,
      strainScore: score?.strain ?? 0,
      calories: score?.kilojoule ? (score.kilojoule as number) / 4.184 : 0,
      avgHeartRate: score?.average_heart_rate ?? 0,
      maxHeartRate: score?.max_heart_rate ?? 0,
      activeDurationMinutes: 0,
    };
  });
}
