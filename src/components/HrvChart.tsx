"use client";

import { RecoveryData } from "@/types/health";
import {
  AreaChart,
  Area,
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

export default function HrvChart({ data }: Props) {
  const dates = [...new Set(data.map((d) => d.date))].sort();

  const chartData = dates.map((date) => {
    const whoop = data.find((d) => d.date === date && d.source === "whoop");
    const garmin = data.find((d) => d.date === date && d.source === "garmin");
    return {
      date: date.slice(5),
      "Whoop HRV": whoop?.hrvMs ? Math.round(whoop.hrvMs) : null,
      "Garmin HRV": garmin?.hrvMs ? Math.round(garmin.hrvMs) : null,
    };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        HRV Comparison (ms)
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="Whoop HRV"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Garmin HRV"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
