import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { ButtonGroup } from "../components/ui/ButtonGroup";
import { Card } from "./BasePage";
import type { Day, Stage } from "../types";
import {
  getArtistById,
  getStageById,
  getDayById,
  getAllPerformances,
  getAllDays,
  getAllStages,
} from "../services/dataService";
import { getFavorites } from "../services/favoritesService";
import { PerformanceCard } from "../components/PerformanceCard";
import type { Performance } from "../types";
import ButtonWithIcon from "../components/ui/ButtonWithIcon";

import { formatDate2Digit } from "../lib/formatTime";

// Define the expected shape of the performance data
type PerformanceData = Performance & {
  artist?: {
    id: string;
    name: string;
    collective?: string | null;
    description?: string;
    genre?: string | null;
  };
  stage?: {
    id: string;
    name: string;
    description?: string;
  };
  day?: Day;
};

// Define the expected shape of the data from the loader
interface TimetableLoaderData {
  performances: PerformanceData[];
  days: Day[];
}

export const loadTimetableData = (): TimetableLoaderData => {
  const performances = getAllPerformances();
  const enrichedPerformances = performances.map((performance) => ({
    ...performance,
    artist: getArtistById(performance.artistId),
    stage: getStageById(performance.stageId),
    day: getDayById(performance.dayId),
  }));

  const days = getAllDays();
  return { performances: enrichedPerformances, days };
};

function DaySelector({
  days,
  activeDayId,
  handleDayChange,
}: {
  days: Day[];
  activeDayId: string;
  handleDayChange: (dayId: string) => void;
}) {
  return (
    <ButtonGroup>
      {days.map((day) => (
        <ButtonWithIcon
          id={`day-filter-${day.id}`}
          key={day.id}
          active={day.id === activeDayId}
          onClick={() => handleDayChange(day.id)}
          icon={day.name}
          activeBackgroundOverride={day.themeColors.background}
          activeColorOverride={day.themeColors.text}
        >
          <span style={{ whiteSpace: "nowrap" }}>{formatDate2Digit(day.date)}</span>
        </ButtonWithIcon>
      ))}
    </ButtonGroup>
  );
}

function StageSelector({
  stages,
  handleStageChange,
}: {
  stages: Stage[];
  handleStageChange: (stageId: string) => void;
}) {
  const [activeStageId, setActiveStageId] = useState<string>(
    localStorage.getItem("activeStageId") || "",
  );

  const stageSelected = (stageId: string) => {
    setActiveStageId(stageId);
    localStorage.setItem("activeStageId", stageId);
    handleStageChange(stageId);
  };

  return (
    <div className="space-y-2">
      <ButtonGroup>
        <ButtonWithIcon
          id="stage-filter-all"
          active={activeStageId === "all"}
          icon="💠"
          onClick={() => stageSelected("all")}
          activeBackgroundOverride="#379339"
        >
          Összes
        </ButtonWithIcon>
        <ButtonWithIcon
          id="stage-filter-favorites"
          active={activeStageId === "favorites"}
          icon="❤️"
          onClick={() => stageSelected("favorites")}
          activeBackgroundOverride="#EF5B5D"
        >
          Kedvencek
        </ButtonWithIcon>

        {stages.map((stage) => (
          <ButtonWithIcon
            id={`stage-fitler-${stage.id}`}
            key={stage.id}
            active={activeStageId === stage.id}
            icon={stage.icon}
            onClick={() => stageSelected(stage.id)}
          >
            {stage.name}
          </ButtonWithIcon>
        ))}
      </ButtonGroup>
    </div>
  );
}

export const TimetablePage: React.FC = () => {
  const { performances, days } = useLoaderData() as TimetableLoaderData;
  const [activeStageId, setActiveStageId] = useState<string>(
    localStorage.getItem("activeStageId") || "",
  );
  const stages = getAllStages().filter((stage) => !stage.hidden && stage.id !== "merch");

  // Find the active day based on festival hours (2 PM - 6 AM next day)
  const getClosestDayId = (days: Day[]) => {
    if (days.length === 0) return "";

    const now = new Date();
    const currentHour = now.getHours();

    // If it's before 2 PM, we're still in the previous festival day (which ended at 6 AM)
    const currentDate = new Date(now);
    if (currentHour < 14) {
      // Subtract one day to get the previous festival day
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Format as YYYY-MM-DD to match the day.date format
    const currentDateStr = currentDate.toISOString().split("T")[0];

    // Find the day that matches the calculated date
    const activeDay = days.find((day) => day.date === currentDateStr);

    // If no matching day found (shouldn't happen with valid data), fall back to closest day
    if (!activeDay) {
      return days.reduce((closest, day) => {
        const dayDate = new Date(day.date);
        return Math.abs(dayDate.getTime() - now.getTime()) <
          Math.abs(new Date(closest.date).getTime() - now.getTime())
          ? day
          : closest;
      }).id;
    }

    return activeDay.id;
  };

  const [activeDayId, setActiveDayId] = useState<string>(getClosestDayId(days));
  const favorites = getFavorites();

  const handleDayChange = (dayId: string) => {
    setActiveDayId(dayId);
  };

  const handleStageChange = (stageId: string) => {
    setActiveStageId(stageId);
    localStorage.setItem("activeStageId", stageId);
  };

  // Filter and sort performances for the active day and selected stage
  const sortedPerformances = performances
    .filter((performance) => {
      const matchesDay = performance.dayId === activeDayId;
      const matchesStage = !activeStageId || performance.stageId === activeStageId;
      const isFavorite = favorites.includes(performance.id);

      switch (activeStageId) {
        case "all":
          return matchesDay;
        case "favorites":
          return matchesDay && isFavorite;
        default:
          return matchesDay && matchesStage;
      }
    })
    .sort((a, b) => {
      // First sort by whether the performance has ended
      const now = new Date();
      const aHasEnded = new Date(a.endTime) < now;
      const bHasEnded = new Date(b.endTime) < now;

      if (aHasEnded && !bHasEnded) return 1; // a comes after b
      if (!aHasEnded && bHasEnded) return -1; // a comes before b

      // If both have ended or both haven't ended, sort by start time
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

  if (days.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Nincs megjeleníthető nap.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Day selector */}
      <DaySelector days={days} activeDayId={activeDayId} handleDayChange={handleDayChange} />

      {/* Stage selector */}
      <StageSelector stages={stages} handleStageChange={handleStageChange} />

      <Card className="p-4">
        {sortedPerformances.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              {activeStageId === "favorites"
                ? "Nincsenek mentett előadások ezen a napon."
                : "Nincs előadás ezen a napon."}
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 -mr-2">
            {sortedPerformances.map((performance) => (
              <PerformanceCard key={performance.id} performance={performance} highlightActive />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default TimetablePage;
