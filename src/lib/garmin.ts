import { SleepData, RecoveryData, StrainData } from "@/types/health";

// Garmin uses OAuth 1.0a via their Connect API
// In production, you'd use a Garmin Connect developer application
// Garmin Health API: https://developer.garmin.com/gc-developer-program/

const GARMIN_API_BASE = "https://apis.garmin.com/wellness-api/rest";

interface GarminTokens {
  accessToken: string;
  accessTokenSecret: string;
}

export function getGarminAuthUrl(): string {
  // Garmin uses OAuth 1.0a - this would require request token flow
  // Step 1: Get request token from Garmin
  // Step 2: Redirect user to authorization URL
  const params = new URLSearchParams({
    oauth_consumer_key: process.env.GARMIN_CONSUMER_KEY!,
    oauth_callback: `${process.env.NEXTAUTH_URL}/api/garmin/callback`,
  });
  return `https://connect.garmin.com/oauthConfirm?${params}`;
}

export async function exchangeGarminToken(
  oauthToken: string,
  oauthVerifier: string,
  requestTokenSecret: string
): Promise<GarminTokens> {
  // OAuth 1.0a token exchange
  // In production, sign this request with HMAC-SHA1
  const res = await fetch("https://connectapi.garmin.com/oauth-service/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      oauth_consumer_key: process.env.GARMIN_CONSUMER_KEY!,
      oauth_token: oauthToken,
      oauth_verifier: oauthVerifier,
    }),
  });
  const text = await res.text();
  const params = new URLSearchParams(text);
  return {
    accessToken: params.get("oauth_token") ?? "",
    accessTokenSecret: params.get("oauth_token_secret") ?? "",
  };
}

async function garminFetch(path: string, accessToken: string) {
  // In production, this requires OAuth 1.0a signed requests
  const res = await fetch(`${GARMIN_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Garmin API error: ${res.status}`);
  return res.json();
}

export async function fetchGarminSleep(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<SleepData[]> {
  const params = new URLSearchParams({
    uploadStartTimeInSeconds: String(new Date(startDate).getTime() / 1000),
    uploadEndTimeInSeconds: String(new Date(endDate + "T23:59:59Z").getTime() / 1000),
  });
  const data = await garminFetch(`/sleeps?${params}`, accessToken);

  return (data ?? []).map((record: Record<string, unknown>) => {
    const durationSec = (record.durationInSeconds as number) ?? 0;
    const deepSec = (record.deepSleepDurationInSeconds as number) ?? 0;
    const remSec = (record.remSleepInSeconds as number) ?? 0;
    const lightSec = (record.lightSleepDurationInSeconds as number) ?? 0;
    const awakeSec = (record.awakeDurationInSeconds as number) ?? 0;

    return {
      date: new Date(((record.startTimeInSeconds as number) ?? 0) * 1000)
        .toISOString()
        .slice(0, 10),
      source: "garmin" as const,
      totalSleepHours: durationSec / 3600,
      deepSleepHours: deepSec / 3600,
      remSleepHours: remSec / 3600,
      lightSleepHours: lightSec / 3600,
      awakeDurationHours: awakeSec / 3600,
      sleepScore: record.sleepScores
        ? ((record.sleepScores as Record<string, number>).overallScore ?? undefined)
        : undefined,
    };
  });
}

export async function fetchGarminRecovery(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<RecoveryData[]> {
  // Garmin provides HRV and resting HR via daily summaries
  const params = new URLSearchParams({
    uploadStartTimeInSeconds: String(new Date(startDate).getTime() / 1000),
    uploadEndTimeInSeconds: String(new Date(endDate + "T23:59:59Z").getTime() / 1000),
  });
  const data = await garminFetch(`/dailies?${params}`, accessToken);

  return (data ?? []).map((record: Record<string, unknown>) => {
    const restingHr = (record.restingHeartRateInBeatsPerMinute as number) ?? 0;
    // Garmin Body Battery is their recovery equivalent (0-100)
    const bodyBattery = (record.bodyBatteryChargedValue as number) ?? 50;
    // Garmin provides HRV via a separate endpoint; approximate from daily summary
    const stressAvg = (record.averageStressLevel as number) ?? 25;
    const estimatedHrv = Math.max(10, 100 - stressAvg);

    return {
      date: new Date(((record.startTimeInSeconds as number) ?? 0) * 1000)
        .toISOString()
        .slice(0, 10),
      source: "garmin" as const,
      recoveryScore: bodyBattery,
      hrvMs: estimatedHrv,
      restingHeartRate: restingHr,
      spo2: (record.averageSpo2 as number) ?? undefined,
    };
  });
}

export async function fetchGarminStrain(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<StrainData[]> {
  const params = new URLSearchParams({
    uploadStartTimeInSeconds: String(new Date(startDate).getTime() / 1000),
    uploadEndTimeInSeconds: String(new Date(endDate + "T23:59:59Z").getTime() / 1000),
  });
  const data = await garminFetch(`/dailies?${params}`, accessToken);

  return (data ?? []).map((record: Record<string, unknown>) => {
    const calories = (record.activeKilocalories as number) ?? 0;
    const avgHr = (record.averageHeartRateInBeatsPerMinute as number) ?? 0;
    const maxHr = (record.maxHeartRateInBeatsPerMinute as number) ?? 0;
    const activeSec = (record.activeTimeInSeconds as number) ?? 0;
    // Garmin doesn't have a strain score like Whoop; derive from intensity
    const intensityMinutes =
      ((record.moderateIntensityDurationInSeconds as number) ?? 0) / 60 +
      (((record.vigorousIntensityDurationInSeconds as number) ?? 0) / 60) * 2;
    // Normalize to 0-21 scale similar to Whoop
    const normalizedStrain = Math.min(21, (intensityMinutes / 60) * 14);

    return {
      date: new Date(((record.startTimeInSeconds as number) ?? 0) * 1000)
        .toISOString()
        .slice(0, 10),
      source: "garmin" as const,
      strainScore: Math.round(normalizedStrain * 10) / 10,
      calories,
      avgHeartRate: avgHr,
      maxHeartRate: maxHr,
      activeDurationMinutes: activeSec / 60,
    };
  });
}
