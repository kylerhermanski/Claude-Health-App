"use client";

import { SleepData } from "@/types/health";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: SleepData[];
}

export default function SleepChart({ data }: Props) {
  const dates = [...new Set(data.map((d) => d.date))].sort();

  const chartData = dates.map((date) => {
    const whoop = data.find((d) => d.date === date && d.source === "whoop");
    const garmin = data.find((d) => d.date === date && d.source === "garmin");
    return {
      date: date.slice(5), // MM-DD
      "Whoop Total": whoop?.totalSleepHours?.toFixed(1),
      "Garmin Total": garmin?.totalSleepHours?.toFixed(1),
      "Whoop Deep": whoop?.deepSleepHours?.toFixed(1),
      "Garmin Deep": garmin?.deepSleepHours?.toFixed(1),
      "Whoop REM": whoop?.remSleepHours?.toFixed(1),
      "Garmin REM": garmin?.remSleepHours?.toFixed(1),
    };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Sleep Duration Comparison
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} barGap={2} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis unit="h" fontSize={12} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Whoop Total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Garmin Total" fill="#10B981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
