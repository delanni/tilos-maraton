import { formatDay, formatTime2Digit } from "../lib/formatTime";
import type { Performance } from "../types";

export default function PerformanceTimeLabel({
  performance,
  full = false,
}: {
  performance: Pick<Performance, "startTime" | "endTime">;
  full?: boolean;
}) {
  const getPerformanceStatus = (
    startTime: string,
    endTime: string,
  ): { status: "running" | "ended" | "upcoming"; label: string } => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now >= start && now <= end) {
      return { status: "running", label: "Most!" };
    }
    if (now > end) {
      return { status: "ended", label: "Vége" };
    }
    return { status: "upcoming", label: "" };
  };

  const startDate = formatDay(performance.startTime);

  const getPerformanceTimeLabel = (
    performance: Pick<Performance, "startTime" | "endTime">,
  ): React.ReactNode => {
    const { status, label } = getPerformanceStatus(performance.startTime, performance.endTime);
    if (status === "running") {
      return (
        <span
          className="px-2 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full"
          style={{ fontWeight: "bold" }}
        >
          {label}
        </span>
      );
    }
    if (status === "ended") {
      return (
        <span className="px-2 py-1 text-sm font-medium text-gray-500 bg-gray-100 rounded-full">
          {label}
        </span>
      );
    }

    if (full) {
      return (
        <span className="px-2 py-1 text-sm font-medium text-gray-500 bg-gray-100 rounded-full">
          {startDate}, {formatTime2Digit(performance.startTime)} - {formatTime2Digit(performance.endTime)}
        </span>
      );
    }

    return (
      <span className="mt-2 px-2 py-1 text-sm font-medium text-gray-500 bg-gray-100 rounded-full">
        {formatTime2Digit(performance.startTime)}
      </span>
    );
  };

  return getPerformanceTimeLabel(performance);
}
