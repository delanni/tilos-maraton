import type { LoaderFunction } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import { BasePage } from './BasePage';
import { getStageById, getPerformancesByStageId, getArtistById, getDayById } from '../services/dataService';
import type { Stage, Performance, Artist, Day } from '../types';
import { formatTime2Digit } from '../lib/formatTime';

type PerformanceWithDetails = Performance & {
  artist: Artist | undefined;
  day: Day | undefined;
};

type StagePageData = Stage & {
  performances: PerformanceWithDetails[];
};

export const loadStagePageData: LoaderFunction<StagePageData> = ({ params }) => {
  const stageId = params.id;
  if (!stageId) {
    throw new Response('Stage ID is required', { status: 400 });
  }
  
  const stage = getStageById(stageId);
  if (!stage) {
    throw new Response('Stage not found', { status: 404 });
  }
  
  const performances = getPerformancesByStageId(stageId).map(performance => ({
    ...performance,
    artist: getArtistById(performance.artistId),
    day: getDayById(performance.dayId)
  }));
  
  return { ...stage, performances };
};

export const StagePage: React.FC = () => {
  const stage = useLoaderData() as StagePageData;

  // Group performances by day for better display
  const performancesByDay = stage.performances.reduce<Record<string, typeof stage.performances>>((acc, performance) => {
    const dayId = performance.day?.id || 'other';
    if (!acc[dayId]) {
      acc[dayId] = [];
    }
    acc[dayId].push(performance);
    return acc;
  }, {});

  // Sort performances by start time within each day
  for (const dayPerformances of Object.values(performancesByDay)) {
    dayPerformances.sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }

  return (
    <BasePage title={stage.name}>
      <div className="space-y-8">
        {/* Stage Header */}
        <div className="relative rounded-lg overflow-hidden">
          <div className="h-64 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">Stage Image</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
            <h2 className="text-3xl font-bold">{stage.name}</h2>
            <p className="mt-2">{stage.description}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Stage Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">A színpadról</h3>
              <div className="prose max-w-none">
                <p>{stage.description || 'Ez a színpad részletes leírása. Itt megjelenhet a színpad helyszíne, kapacitása és egyéb fontos információk.'}</p>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Schedule</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b font-medium">
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-3">Előadások</h3>
                    <div className="space-y-4">
                      {Object.entries(performancesByDay).map(([dayId, dayPerformances]) => {
                        const day = dayPerformances[0]?.day;
                        return (
                          <div key={dayId} className="mb-6">
                            <h4 className="text-lg font-semibold mb-3">{day?.name || 'Egyéb nap'}</h4>
                            <div className="space-y-3">
                              {dayPerformances.map((performance) => (
                                <div key={performance.id} className="p-4 border rounded-lg hover:bg-gray-50">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium">
                                        {performance.artist?.name || 'Ismeretlen előadó'}
                                        {performance.artist?.collective && ` (${performance.artist.collective})`}
                                      </p>
                                      {performance.description && (
                                        <p className="text-sm text-gray-600">{performance.description}</p>
                                      )}
                                    </div>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium whitespace-nowrap">
                                      {formatTime2Digit(performance.startTime)}
                                      {' - '}
                                      {formatTime2Digit(performance.endTime)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Helyszín</h3>
              <p className="text-gray-700">{stage.description || 'A helyszín nincs megadva'}</p>
              <div className="mt-4 h-40 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500">Térkép</span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Előadások száma</h3>
              <p className="text-2xl font-bold">{stage.performances.length}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Elérhetőség</h3>
              <p className="text-sm text-gray-600">További információkért látogass el a fesztivál hivatalos weboldalára.</p>
            </div>
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default StagePage;
