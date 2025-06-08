import { Link } from "react-router-dom";
import { HeartIcon } from "./icons";
import { toggleFavorite, isFavorite } from "../services/favoritesService";
import { useState } from "react";
import type { Performance } from "../types";
import PerformanceTimeLabel from "./PerformanceTimeLabel";

interface PerformanceCardProps {
  performance: Performance & {
    artist?: {
      name: string;
      collective?: string | null;
      description?: string;
      genre?: string | null;
    };
    stage?: {
      name: string;
      icon?: string;
    };
    day?: {
      themeColors?: {
        background: string;
        text: string;
        primary: string;
      };
    };
  };
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({
  performance,
  highlightActive,
}) => {
  const [isFavorited, setIsFavorited] = useState(isFavorite(performance.id));

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavorited = !isFavorited;
    toggleFavorite(performance.id);
    setIsFavorited(newFavorited);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("hu-HU", {
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("hu-HU", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { formattedDate, formattedTime };
  };

  const startTime = performance.startTime ? formatDateTime(performance.startTime) : null;
  const endTime = performance.endTime ? formatDateTime(performance.endTime) : null;
  const isActive =
    highlightActive &&
    new Date(performance.startTime).getTime() < new Date().getTime() &&
    new Date(performance.endTime).getTime() > new Date().getTime();

  return (
    <div
      className="p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
      style={{
        backgroundColor: performance.day?.themeColors?.background,
        color: performance.day?.themeColors?.text,
        border: isActive ? `2px dashed ${performance.day?.themeColors?.primary}` : "",
      }}
    >
      <Link to={`/performance/${performance.id}`} className="block group">
        <div className="grid grid-cols-[1fr,auto] gap-2">
          {/* Top row: Artist name and favorite button */}
          <div className="flex items-center gap-2 overflow-hidden">
            <h3
              className="font-bold text-lg leading-tight truncate group-hover:underline"
              style={{ color: performance.day?.themeColors?.primary }}
            >
              {performance.artist?.name || "Ismeretlen előadó"}
            </h3>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleFavoriteClick(e);
            }}
            className="p-1 -mt-1 -mr-1 rounded-full hover:bg-white/20 transition-colors self-start"
            aria-label={isFavorited ? "Eltávolítás a kedvencekből" : "Hozzáadás a kedvencekhez"}
          >
            <HeartIcon
              filled={isFavorited}
              className={`h-5 w-5 ${isFavorited ? "text-red-500" : "text-current opacity-70 group-hover:opacity-100"}`}
            />
          </button>

          {/* Second row: Date, time and stage */}
          <div className="col-span-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm opacity-90">
            <div className="flex items-center gap-1 text-sm">
              {startTime && endTime && <PerformanceTimeLabel performance={performance} full />}
            </div>
            {performance.stage?.name && (
              <div className="flex items-center gap-1.5">
                <span className="opacity-50">•</span>
                {performance.stage.icon && (
                  <span className="opacity-80">{performance.stage.icon}</span>
                )}
                <span className="opacity-80">{performance.stage.name}</span>
              </div>
            )}
          </div>

          {/* Third row: Genre tag */}
          {performance.artist?.genre && (
            <div className="col-span-2 mt-1">
              <span
                className="inline-block text-xs px-2 py-0.5 rounded-full opacity-90"
                style={{
                  backgroundColor: `${performance.day?.themeColors?.primary}20`,
                  color: performance.day?.themeColors?.primary,
                }}
              >
                {performance.artist.genre}
              </span>
            </div>
          )}

          {/* Fourth row: Collective/Description */}
          <div className="col-span-2 space-y-1">
            {performance.artist?.collective && (
              <p className="text-sm opacity-80 line-clamp-1">{performance.artist.collective}</p>
            )}
            {performance.description && (
              <p className="text-sm opacity-80 line-clamp-1">{performance.description}</p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PerformanceCard;
