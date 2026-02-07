"use client";

import { useCallback, useEffect, useState } from "react";
import { SleepData, RecoveryData, StrainData, ConnectionStatus } from "@/types/health";
import ConnectionPanel from "./ConnectionPanel";
import DateRangeSelector from "./DateRangeSelector";
import SleepChart from "./SleepChart";
import RecoveryChart from "./RecoveryChart";
import HrvChart from "./HrvChart";
import StrainChart from "./StrainChart";
import HeartRateChart from "./HeartRateChart";

interface HealthData {
  sleep: SleepData[];
  recovery: RecoveryData[];
  strain: StrainData[];
}

export default function Dashboard() {
  const [days, setDays] = useState(14);
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    whoop: false,
    garmin: false,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/health-data?days=${days}`);
      const json = await res.json();
      setData(json);
      // If we got data, mark sources as "connected" (demo mode)
      setConnectionStatus({ whoop: true, garmin: true });
    } catch (err) {
      console.error("Failed to fetch health data:", err);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleConnect = (source: "whoop" | "garmin") => {
    // In production, redirect to OAuth flow
    // For demo, just toggle and refetch
    setConnectionStatus((prev) => ({ ...prev, [source]: !prev[source] }));
  };

  const filteredSleep =
    data?.sleep.filter(
      (d) =>
        (d.source === "whoop" && connectionStatus.whoop) ||
        (d.source === "garmin" && connectionStatus.garmin)
    ) ?? [];

  const filteredRecovery =
    data?.recovery.filter(
      (d) =>
        (d.source === "whoop" && connectionStatus.whoop) ||
        (d.source === "garmin" && connectionStatus.garmin)
    ) ?? [];

  const filteredStrain =
    data?.strain.filter(
      (d) =>
        (d.source === "whoop" && connectionStatus.whoop) ||
        (d.source === "garmin" && connectionStatus.garmin)
    ) ?? [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Health Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Compare your wearable data across Whoop and Garmin
              </p>
            </div>
            <DateRangeSelector days={days} onChange={setDays} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <ConnectionPanel status={connectionStatus} onConnect={handleConnect} />

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
          </div>
        ) : !data ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <p className="text-lg">No health data available.</p>
            <p className="text-sm mt-2">Connect a wearable device to get started.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Sleep and Recovery side by side on large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SleepChart data={filteredSleep} />
              <RecoveryChart data={filteredRecovery} />
            </div>

            {/* HRV and Heart Rate side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HrvChart data={filteredRecovery} />
              <HeartRateChart data={filteredRecovery} />
            </div>

            {/* Strain full width */}
            <StrainChart data={filteredStrain} />

            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard
                label="Avg Sleep (Whoop)"
                value={avg(filteredSleep.filter((d) => d.source === "whoop"), "totalSleepHours")}
                unit="hrs"
                color="blue"
              />
              <StatCard
                label="Avg Sleep (Garmin)"
                value={avg(filteredSleep.filter((d) => d.source === "garmin"), "totalSleepHours")}
                unit="hrs"
                color="green"
              />
              <StatCard
                label="Avg Recovery (Whoop)"
                value={avg(filteredRecovery.filter((d) => d.source === "whoop"), "recoveryScore")}
                unit="%"
                color="blue"
              />
              <StatCard
                label="Avg Recovery (Garmin)"
                value={avg(filteredRecovery.filter((d) => d.source === "garmin"), "recoveryScore")}
                unit="%"
                color="green"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function avg<T>(items: T[], key: keyof T): string {
  if (items.length === 0) return "—";
  const sum = items.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
  return (sum / items.length).toFixed(1);
}

function StatCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  color: "blue" | "green";
}) {
  const colorClasses =
    color === "blue"
      ? "border-blue-200 dark:border-blue-800"
      : "border-green-200 dark:border-green-800";

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border ${colorClasses}`}
    >
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
        <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
      </p>
    </div>
  );
}
