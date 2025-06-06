import type { LoaderFunction } from "react-router-dom";
import { Link, useLoaderData } from "react-router-dom";
import { BasePage } from "./BasePage";
import {
  getPerformanceById,
  getArtistById,
  getDayById,
  getStageById,
} from "../services/dataService";
import type { Performance, Artist, Day, Stage } from "../types";
import { formatDate, formatTime2Digit, printDuration } from "../lib/formatTime";
import { isFavorite, toggleFavorite } from "../services/favoritesService";
import { useEffect, useState } from "react";
import { missingArtistFallbackIcon, CalendarIcon } from "../components/icons";
import { addToGoogleCalendar } from "../lib/addToGcal";

type PerformanceWithDetails = Performance & {
  artist: Artist | undefined;
  day: Day | undefined;
  stage: Stage | undefined;
};

export const loadPerformancePageData: LoaderFunction<PerformanceWithDetails> = ({ params }) => {
  const performanceId = params.id;
  if (!performanceId) {
    throw new Response("Performance ID is required", { status: 400 });
  }

  const performance = getPerformanceById(performanceId);
  if (!performance) {
    throw new Response("Performance not found", { status: 404 });
  }

  return {
    ...performance,
    artist: getArtistById(performance.artistId),
    day: getDayById(performance.dayId),
    stage: getStageById(performance.stageId),
  };
};

export const PerformancePage: React.FC = () => {
  const performance = useLoaderData() as PerformanceWithDetails;
  const [isPerformanceFavorite, setIsPerformanceFavorite] = useState(false);

  useEffect(() => {
    setIsPerformanceFavorite(isFavorite(performance.id));
  }, [performance.id]);

  const handleFavoriteClick = () => {
    toggleFavorite(performance.id);
    setIsPerformanceFavorite(!isPerformanceFavorite);
  };

  if (!performance.artist || !performance.day || !performance.stage) {
    return (
      <BasePage>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800">
            Az előadás nem található - valami hiba történt <br /> {performance.id}
          </h2>
        </div>
      </BasePage>
    );
  }

  return (
    <BasePage>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-accent to-blue-800 rounded-lg p-6 text-white">
          <h2 className="text-3xl font-bold">
            {performance.artist.name}
            {performance.artist.collective && ` (${performance.artist.collective})`}
          </h2>
          <div className="flex flex-wrap gap-4 mt-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {performance.day.name}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {formatTime2Digit(performance.startTime)} - {formatTime2Digit(performance.endTime)}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {performance.stage.name}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {performance.description && (
              <div>
                <div className="prose max-w-none">
                  <p>{performance.description}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <button
                  type="button"
                  onClick={handleFavoriteClick}
                  className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors ${
                    isPerformanceFavorite
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  aria-label={
                    isPerformanceFavorite ? "Eltávolítás a kedvencekből" : "Hozzáadás a kedvencekhez"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${isPerformanceFavorite ? "text-white" : "text-current"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-label="Heart icon"
                  >
                    <title>Heart icon</title>
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {isPerformanceFavorite ? "Eltávolítás a kedvencekből" : "Mentés a kedvencekbe"}
                  </span>
                </button>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <button
                  type="button"
                  onClick={() => addToGoogleCalendar({
                    startTime: performance.startTime,
                    endTime: performance.endTime,
                    artist: {
                      name: performance.artist?.name || '',
                      description: performance.artist?.description || ''
                    },
                    stage: {
                      name: performance.stage?.name || ''
                    }
                  })}
                  className="w-full py-2 px-4 bg-blue-50 text-blue-700 rounded-md flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                  aria-label="Hozzáadás a Google Naptárhoz"
                >
                  <CalendarIcon className="h-5 w-5" />
                  <span>Hozzáadás a naptárhoz</span>
                </button>
              </div>
            </div>
            <Link to={`/artist/${performance.artistId}`}>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Előadó</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                    {performance.artist.image ? (
                      <img
                        src={performance.artist.image}
                        alt={performance.artist.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = missingArtistFallbackIcon;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                          role="img"
                        >
                          <title>Előadó ikon</title>
                          <desc>Alapértelmezett előadói avatar</desc>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{performance.artist.name}</p>
                    {performance.artist.genre && (
                      <p className="text-sm text-gray-600">
                        {performance.artist.genre}
                        {performance.artist.collective && ` • ${performance.artist.collective}`}
                      </p>
                    )}
                  </div>
                </div>
                {performance.artist.description && (
                  <p className="mt-3 text-sm text-gray-600">{performance.artist.description}</p>
                )}
              </div>
            </Link>

            {performance.stage && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <Link to={`/stage/${performance.stageId}`}>
                  <h4 className="font-medium">{performance.stage.icon} {performance.stage.name}</h4>
                  {performance.stage.description && (
                    <p className="text-gray-600 mt-1">{performance.stage.description}</p>
                  )}
                </Link>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Esemény részletei</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Dátum</dt>
                  <dd>{formatDate(performance.day.date)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Időpont</dt>
                  <dd>
                    {formatTime2Digit(performance.startTime)} -{" "}
                    {formatTime2Digit(performance.endTime)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Időtartam</dt>
                  <dd>{printDuration(performance.startTime, performance.endTime)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default PerformancePage;
