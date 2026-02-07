"use client";

import { RecoveryData } from "@/types/health";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: RecoveryData[];
}

export default function HeartRateChart({ data }: Props) {
  const dates = [...new Set(data.map((d) => d.date))].sort();

  const chartData = dates.map((date) => {
    const whoop = data.find((d) => d.date === date && d.source === "whoop");
    const garmin = data.find((d) => d.date === date && d.source === "garmin");
    return {
      date: date.slice(5),
      "Whoop RHR": whoop?.restingHeartRate,
      "Garmin RHR": garmin?.restingHeartRate,
    };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Resting Heart Rate Comparison
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis domain={["auto", "auto"]} unit=" bpm" fontSize={12} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Whoop RHR"
            stroke="#EF4444"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="Garmin RHR"
            stroke="#F97316"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
