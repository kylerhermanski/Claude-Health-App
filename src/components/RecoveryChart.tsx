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

export default function RecoveryChart({ data }: Props) {
  const dates = [...new Set(data.map((d) => d.date))].sort();

  const chartData = dates.map((date) => {
    const whoop = data.find((d) => d.date === date && d.source === "whoop");
    const garmin = data.find((d) => d.date === date && d.source === "garmin");
    return {
      date: date.slice(5),
      "Whoop Recovery": whoop?.recoveryScore,
      "Garmin Recovery": garmin?.recoveryScore,
    };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Recovery Score Comparison
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis domain={[0, 100]} fontSize={12} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Whoop Recovery"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="Garmin Recovery"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
