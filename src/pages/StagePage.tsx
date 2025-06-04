import type { LoaderFunction } from "react-router-dom";
import { Link, useLoaderData } from "react-router-dom";
import { BasePage } from "./BasePage";
import {
  getStageById,
  getPerformancesByStageId,
  getArtistById,
  getDayById,
} from "../services/dataService";
import type { Stage, Performance, Artist, Day } from "../types";
import { formatTime2Digit } from "../lib/formatTime";
import MapComponent from "../components/MapComponent";
import PerformanceTimeLabel from "../components/PerformanceTimeLabel";

type PerformanceWithDetails = Performance & {
  artist: Artist | undefined;
  day: Day | undefined;
};

type StagePageData = Stage & {
  performances: PerformanceWithDetails[];
};

export const loadStagePageData: LoaderFunction<StagePageData> = ({
  params,
}) => {
  const stageId = params.id;
  if (!stageId) {
    throw new Response("Stage ID is required", { status: 400 });
  }

  const stage = getStageById(stageId);
  if (!stage) {
    throw new Response("Stage not found", { status: 404 });
  }

  const performances = getPerformancesByStageId(stageId).map((performance) => ({
    ...performance,
    artist: getArtistById(performance.artistId),
    day: getDayById(performance.dayId),
  }));

  return { ...stage, performances };
};

export const StagePage: React.FC = () => {
  const stage = useLoaderData() as StagePageData;

  const upcomingPerformances = stage.performances
    .filter((performance) => {
      const now = new Date();
      const start = new Date(performance.startTime);
      return start >= now;
    })
    .sort((a, b) => {
      const aDate = new Date(a.startTime);
      const bDate = new Date(b.startTime);
      return aDate.getTime() - bDate.getTime();
    });

  return (
    <BasePage>
      <div className="space-y-8">
        {/* Stage Header */}
        <div className="relative rounded-lg overflow-hidden">
          <div className="h-64 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">Stage Image</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
            <h2 className="text-3xl font-bold">{stage.name}</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Stage Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="prose max-w-none">
                <p>
                  {stage.description ||
                    "Ez a színpad részletes leírása. Itt megjelenhet a színpad helyszíne, kapacitása és egyéb fontos információk."}
                </p>
              </div>
            </div>

            {/* Schedule */}
            {upcomingPerformances.length > 0 && (
              <div>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b font-medium">
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-3">
                        Közelgő események
                      </h3>
                      <div className="space-y-4">
                        {upcomingPerformances.slice(0, 5).map((performance) => (
                          <UpcomingPerformanceCard performance={performance} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Térkép</h3>
              <Link to={`/map`}>
                <MapComponent stage={stage} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BasePage>
  );
};

function UpcomingPerformanceCard({
  performance,
}: {
  performance: PerformanceWithDetails;
}) {
  return (
    <Link to={`/performance/${performance.id}`} key={performance.id}>
      <div className="mb-6">
        <div className="space-y-3">
          <div className="p-4 border rounded-lg hover:bg-gray-50 w-full">
            <div>
              <div className="font-medium">
                {performance.artist?.name}
                {performance.artist?.collective &&
                  ` (${performance.artist.collective})`}
                {" • "}
                <PerformanceTimeLabel performance={performance} full />
              </div>
              <div
                className="text-sm text-gray-600 rounded-full px-2 py-1"
                style={{
                  backgroundColor: performance.day?.themeColors?.background,
                  color: performance.day?.themeColors?.text,
                }}
              >
                {performance.day?.name}
              </div>
              {performance.description && (
                <p className="text-sm text-gray-600">
                  {performance.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default StagePage;
