import type { LoaderFunction } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import { BasePage } from './BasePage';
import { getPerformanceById, getArtistById, getDayById, getStageById } from '../services/dataService';
import type { Performance, Artist, Day, Stage } from '../types';
import { formatDate, formatTime2Digit, printDuration } from '../lib/formatTime';

type PerformanceWithDetails = Performance & {
  artist: Artist | undefined;
  day: Day | undefined;
  stage: Stage | undefined;
};

export const loadPerformancePageData: LoaderFunction<PerformanceWithDetails> = ({ params }) => {
  const performanceId = params.id;
  if (!performanceId) {
    throw new Response('Performance ID is required', { status: 400 });
  }
  
  const performance = getPerformanceById(performanceId);
  if (!performance) {
    throw new Response('Performance not found', { status: 404 });
  }
  
  return {
    ...performance,
    artist: getArtistById(performance.artistId),
    day: getDayById(performance.dayId),
    stage: getStageById(performance.stageId)
  };
};

export const PerformancePage: React.FC = () => {
  const performance = useLoaderData() as PerformanceWithDetails;
  
  if (!performance.artist || !performance.day || !performance.stage) {
    return (
      <BasePage title="Előadás nem található">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800">Az előadás nem található</h2>
          <p className="mt-2 text-gray-600">Kérjük, próbálja meg később vagy lépjen kapcsolatba az ügyfélszolgálattal.</p>
        </div>
      </BasePage>
    );
  }

  return (
    <BasePage title={performance.artist.name}>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
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
                <h3 className="text-xl font-semibold mb-2">Részletek</h3>
                <div className="prose max-w-none">
                  <p>{performance.description}</p>
                </div>
              </div>
            )}
            
            {performance.stage && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Színpad információ</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">{performance.stage.name}</h4>
                  {performance.stage.description && (
                    <p className="text-gray-600 mt-1">{performance.stage.description}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {performance.artist && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Előadó</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-gray-500">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <title>Előadó ikon</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
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
                  <p className="mt-3 text-sm text-gray-600">
                    {performance.artist.description}
                  </p>
                )}
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Előadás részletei</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Dátum</dt>
                  <dd>
                    {formatDate(performance.day.date)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Időpont</dt>
                  <dd>
                    {formatTime2Digit(performance.startTime)} - {formatTime2Digit(performance.endTime)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Időtartam</dt>
                  <dd>
                    {printDuration(performance.startTime, performance.endTime)}
                  </dd>
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
