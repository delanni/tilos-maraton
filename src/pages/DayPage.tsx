import type { LoaderFunction } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import { BasePage } from "./BasePage";
import {
  getDayById,
  getPerformancesByDayId,
  getArtistById,
  getStageById,
} from "../services/dataService";
import type { Day, Performance, Artist, Stage } from "../types";

type DayPageData = Day & {
  performances: Array<
    Performance & {
      artist: Artist | undefined;
      stage: Stage | undefined;
    }
  >;
};

export const loadDayPageData: LoaderFunction<DayPageData> = ({ params }) => {
  const dayId = params.id;
  if (!dayId) {
    throw new Response("Day ID is required", { status: 400 });
  }

  const day = getDayById(dayId);
  if (!day) {
    throw new Response("Day not found", { status: 404 });
  }

  const performances = getPerformancesByDayId(dayId).map((performance) => ({
    ...performance,
    artist: getArtistById(performance.artistId),
    stage: getStageById(performance.stageId),
  }));

  return { ...day, performances };
};

export const DayPage: React.FC = () => {
  const dayInfo = useLoaderData() as DayPageData;

  return (
    <BasePage>
      <div className="space-y-8">
        {/* Day Header */}
        <div
          className="rounded-lg p-6 text-white"
          style={{ backgroundColor: dayInfo.themeColors.primary }}
        >
          <h2 className="text-3xl font-bold">{dayInfo.name}</h2>
          <p className="text-xl mt-2">{dayInfo.date}</p>
          <p className="mt-4 max-w-3xl">{dayInfo.description}</p>
          <button
            type="button"
            className="mt-4 bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            View on Facebook
          </button>
        </div>

        {/* Stages */}
        {/* <div>
          <h3 className="text-2xl font-semibold mb-4">Stages & Schedule</h3>
          
          <div className="space-y-6">
            {dayInfo.stages.map((stage) => (
              <div key={stage.id} className="border rounded-lg overflow-hidden">
                <div 
                  className="p-4 font-semibold text-white"
                  style={{ backgroundColor: dayInfo.themeColors.secondary }}
                >
                  {stage.name}
                </div>
                <div className="divide-y">
                  {Array.from({ length: stage.performances }).map((_, i) => (
                    <div key={stage.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Performance {i + 1}</p>
                          <p className="text-sm text-gray-600">Artist Name</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">20:00 - 21:30</p>
                          <p className="text-sm text-gray-600">1h 30m</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Additional Day Info */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Venue</h4>
              <p className="text-gray-700">Dürer Kert, Budapest</p>
              <p className="text-sm text-gray-500">1114 Budapest, Dürer sor 19.</p>
              <button
                type="button"
                className="mt-2 text-blue-600 text-sm font-medium hover:underline"
              >
                View on map →
              </button>
            </div>
            <div>
              <h4 className="font-medium mb-2">Doors Open</h4>
              <p className="text-gray-700">19:00</p>
              <h4 className="font-medium mt-4 mb-2">Entry Fee</h4>
              <p className="text-gray-700">5,000 HUF</p>
            </div>
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default DayPage;
