import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import type { Day } from "../types";
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

export const TimetablePage: React.FC = () => {
  const { performances, days } = useLoaderData() as TimetableLoaderData;
  const [activeDayId, setActiveDayId] = useState<string>(localStorage.getItem("activeDayId") || "");
  const [activeStageId, setActiveStageId] = useState<string>(
    localStorage.getItem("activeStageId") || "",
  );
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const stages = getAllStages().filter((stage) => !stage.hidden && stage.id !== "merch");

  const favorites = getFavorites();

  useEffect(() => {
    // Set the initial active day to the closes to current date
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
  }, [performances, days, activeDayId]);

  const handleDayChange = (dayId: string) => {
    setActiveDayId(dayId);
    localStorage.setItem("activeDayId", dayId);
  };

  const handleStageChange = (stageId: string) => {
    setActiveStageId(stageId);
    setShowFavorites(false);
    localStorage.setItem("activeStageId", stageId);
  };

  const handleFavoritesToggle = () => {
    const newShowFavorites = !showFavorites;
    setShowFavorites(newShowFavorites);
    if (newShowFavorites) {
      setActiveStageId("");
    }
  };

  // Filter and sort performances for the active day and selected stage
  const sortedPerformances = performances
    .filter((performance) => {
      const matchesDay = performance.dayId === activeDayId;
      const matchesStage = !activeStageId || performance.stageId === activeStageId;
      const isFavorite = favorites.includes(performance.id);

      if (showFavorites) {
        return matchesDay && isFavorite && performance.startTime && performance.endTime;
      }

      return matchesDay && matchesStage && performance.startTime && performance.endTime;
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  if (days.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Nincs megjeleníthető nap.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Day selector */}
      <div className="flex overflow-x-auto pb-2 mb-2 gap-2">
        {days.map((day) => (
          <button
            type="button"
            key={day.id}
            className={`px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ${
              day.id === activeDayId
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
            onClick={() => handleDayChange(day.id)}
          >
            <div>{day.name}</div>
            <div>
              {new Date(day.date).toLocaleDateString("hu-HU", {
                month: "short",
                day: "numeric",
              })}
            </div>
          </button>
        ))}
      </div>
      {/* Stage selector */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-2">
        <ButtonWithIcon
          icon="💠"
          label="Összes"
          onClick={() => handleStageChange("")}
          active={!activeStageId && !showFavorites}
          activeColor="#4fde66"
        />
        <ButtonWithIcon
          icon="❤️"
          label="Kedvencek"
          onClick={handleFavoritesToggle}
          active={showFavorites}
          activeColor="#f55555"
        />
        {stages.map((stage) => (
          <ButtonWithIcon
            key={stage.id}
            icon={stage.icon}
            label={stage.name}
            onClick={() => handleStageChange(stage.id)}
            active={activeStageId === stage.id}
          />
        ))}
      </div>

      {sortedPerformances.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {showFavorites
              ? "Nincsenek mentett előadások ezen a napon."
              : "Nincs előadás ezen a napon."}
          </p>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto" style={{ height: "600px" }}>
          {sortedPerformances.map((performance) => (
            <PerformanceCard key={performance.id} performance={performance} />
          ))}
        </div>
      )}
    </div>
  );
};

function ButtonWithIcon({
  icon,
  label,
  onClick,
  active,
  activeColor = "#3587eb",
}: {
  icon: string;
  label: string;
  onClick: () => void;
  active: boolean;
  activeColor?: string;
}) {
  return (
    <button
      type="button"
      className={`px-3 py-1.5 rounded-lg transition-colors text-xs font-medium flex flex-col items-center gap-1 ${
        active ? `text-white` : "bg-gray-100 hover:bg-gray-200 text-gray-800"
      }`}
      style={{
        backgroundColor: active ? activeColor : "#e5e7eb",
      }}
      onClick={() => onClick()}
    >
      {icon && <span className="block text-lg">{icon}</span>}
      <span className="block">{label}</span>
    </button>
  );
}

export default TimetablePage;
