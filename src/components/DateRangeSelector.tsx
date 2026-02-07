"use client";

interface Props {
  days: number;
  onChange: (days: number) => void;
}

const options = [
  { label: "7 Days", value: 7 },
  { label: "14 Days", value: 14 },
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
];

export default function DateRangeSelector({ days, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            days === opt.value
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
