import { useState, useEffect } from "react";
import { Link, useLoaderData } from "react-router-dom";
import type { Day } from "../types";
import {
  getArtistById,
  getStageById,
  getDayById,
  getAllPerformances,
  getAllDays,
  getAllStages,
} from "../services/dataService";
import PerformanceTimeLabel from "../components/PerformanceTimeLabel";
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
  const [activeDayId, setActiveDayId] = useState<string>("");
  const [activeStageId, setActiveStageId] = useState<string>("");
  const stages = getAllStages().filter((stage) => !stage.hidden && stage.id !== 'merch');

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
  };

  const handleStageChange = (stageId: string) => {
    setActiveStageId(stageId);
  };

  // Filter and sort performances for the active day and selected stage
  const sortedPerformances = performances
    .filter((performance) => {
      const matchesDay = performance.dayId === activeDayId;
      const matchesStage = !activeStageId || performance.stageId === activeStageId;
      return (
        matchesDay &&
        matchesStage &&
        performance.startTime &&
        performance.endTime
      );
    })
    .sort((a, b) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  // Get display name for artist
  const getArtistDisplayName = (
    artist: { name: string; collective?: string | null } | undefined | null
  ) => {
    if (!artist) return "Ismeretlen előadó";
    return artist.collective
      ? `${artist.name} (${artist.collective})`
      : artist.name;
  };

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
            className={`px-4 py-2 rounded-lg transition-colors ${
              day.id === activeDayId
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
            onClick={() => handleDayChange(day.id)}
          >
            {day.name}
          </button>
        ))}
      </div>
      {/* Stage selector */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-2">
        <button
          type="button"
          key="all-stages"
          className={`px-4 py-2 rounded-lg transition-colors ${
            !activeStageId
              ? "bg-green-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleStageChange("")}
        >
          Összes helyszín
        </button>
        {stages.map((stage) => (
          <button
            type="button"
            key={stage.id}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              stage.id === activeStageId
                ? "bg-green-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
            onClick={() => handleStageChange(stage.id)}
          >
            {stage.icon && <span>{stage.icon}</span>}
            {stage.name}
          </button>
        ))}
      </div>

      {sortedPerformances.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Nincs előadás ezen a napon.</p>
        </div>
      ) : (
        <div
          className="space-y-4 overflow-y-scroll"
          style={{ height: "600px" }}
        >
          {sortedPerformances.map((performance) => (
            <div
              key={performance.id}
              className="p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              style={{
                backgroundColor: performance.day?.themeColors?.background,
                color: performance.day?.themeColors?.text,
              }}
            >
              <Link to={`/performance/${performance.id}`}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div>
                    <h3 className="font-bold text-lg">
                      {getArtistDisplayName(performance.artist)}
                    </h3>
                    <p className="text-gray-600">
                      {performance.stage?.name || "Ismeretlen színpad"}
                    </p>
                  </div>
                  {performance.startTime && performance.endTime && (
                    <PerformanceTimeLabel
                      performance={performance}
                      full={true}
                    />
                  )}
                </div>

                {performance.description && (
                  <p className="mt-2 text-gray-700">
                    {performance.artist?.description}
                  </p>
                )}

                {(performance.artist?.genre || performance.description) && (
                  <div className="mt-2 space-y-1">
                    {performance.artist?.genre && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                        {performance.artist.genre}
                      </span>
                    )}
                    {performance.description && (
                      <p className="text-sm text-gray-700 mt-1">
                        {performance.description}
                      </p>
                    )}
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimetablePage;
