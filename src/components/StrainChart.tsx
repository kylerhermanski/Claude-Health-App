"use client";

import { StrainData } from "@/types/health";
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
  data: StrainData[];
}

export default function StrainChart({ data }: Props) {
  const dates = [...new Set(data.map((d) => d.date))].sort();

  const chartData = dates.map((date) => {
    const whoop = data.find((d) => d.date === date && d.source === "whoop");
    const garmin = data.find((d) => d.date === date && d.source === "garmin");
    return {
      date: date.slice(5),
      "Whoop Strain": whoop?.strainScore,
      "Garmin Strain": garmin?.strainScore,
    };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Strain / Activity Load Comparison
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} barGap={2} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis domain={[0, 21]} fontSize={12} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Whoop Strain" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Garmin Strain" fill="#F59E0B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
