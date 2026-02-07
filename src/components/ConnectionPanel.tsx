"use client";

import { ConnectionStatus } from "@/types/health";

interface Props {
  status: ConnectionStatus;
  onConnect: (source: "whoop" | "garmin") => void;
}

export default function ConnectionPanel({ status, onConnect }: Props) {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <button
        onClick={() => onConnect("whoop")}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
          status.whoop
            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700"
            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-600"
        }`}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            status.whoop ? "bg-blue-500" : "bg-gray-400"
          }`}
        />
        {status.whoop ? "Whoop Connected" : "Connect Whoop"}
      </button>

      <button
        onClick={() => onConnect("garmin")}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
          status.garmin
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-300 dark:border-green-700"
            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-gray-600"
        }`}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            status.garmin ? "bg-green-500" : "bg-gray-400"
          }`}
        />
        {status.garmin ? "Garmin Connected" : "Connect Garmin"}
      </button>
    </div>
  );
}
