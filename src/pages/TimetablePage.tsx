import { useState, useEffect } from "react";
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
import { byStartTime } from "../lib/sorting";
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
    <Card className="p-0">
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
            <span style={{ whiteSpace: "nowrap" }}>
              {formatDate2Digit(day.date)}
            </span>
          </ButtonWithIcon>
        ))}
      </ButtonGroup>
    </Card>
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
    localStorage.getItem("activeStageId") || ""
  );

  const stageSelected = (stageId: string) => {
    setActiveStageId(stageId);
    localStorage.setItem("activeStageId", stageId);
    handleStageChange(stageId);
  };

  return (
    <Card className="p-0">
      <div className="space-y-4">
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
    </Card>
  );
}

export const TimetablePage: React.FC = () => {
  const { performances, days } = useLoaderData() as TimetableLoaderData;
  const [activeDayId, setActiveDayId] = useState<string>(
    localStorage.getItem("activeDayId") || ""
  );
  const [activeStageId, setActiveStageId] = useState<string>(
    localStorage.getItem("activeStageId") || ""
  );
  const stages = getAllStages().filter(
    (stage) => !stage.hidden && stage.id !== "merch"
  );

  const favorites = getFavorites();

  useEffect(() => {
    // Set the initial active day to the closest to current date
    if (days.length > 0 && !activeDayId) {
      const today = new Date();
      const closestDay = days.reduce((closest, day) => {
        const dayDate = new Date(day.date);
        return Math.abs(dayDate.getTime() - today.getTime()) <
          Math.abs(new Date(closest.date).getTime() - today.getTime())
          ? day
          : closest;
      });
      setActiveDayId(closestDay.id);
    }
  }, [days, activeDayId]);

  const handleDayChange = (dayId: string) => {
    setActiveDayId(dayId);
    localStorage.setItem("activeDayId", dayId);
  };
  const handleStageChange = (stageId: string) => {
    setActiveStageId(stageId);
    localStorage.setItem("activeStageId", stageId);
  };

  // Filter and sort performances for the active day and selected stage
  const sortedPerformances = performances
    .filter((performance) => {
      const matchesDay = performance.dayId === activeDayId;
      const matchesStage =
        !activeStageId || performance.stageId === activeStageId;
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
    .sort(byStartTime);

  if (days.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Nincs megjeleníthető nap.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Day selector */}
      <DaySelector
        days={days}
        activeDayId={activeDayId}
        handleDayChange={handleDayChange}
      />

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
              <PerformanceCard key={performance.id} performance={performance} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default TimetablePage;
