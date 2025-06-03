import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import type { Day } from '../types';
import { getArtistById, getStageById, getDayById } from '../services/dataService';
import { formatTime2Digit } from '../lib/formatTime';

// Define the expected shape of the performance data
interface PerformanceData {
  id: string;
  artistId: string;
  dayId: string;
  stageId: string;
  description?: string;
  startTime: string;
  endTime: string;
  artist?: {
    id: string;
    name: string;
    collective?: string | null;
    description?: string;
    genre?: string | null;
  } | null;
  stage?: {
    id: string;
    name: string;
    description?: string;
  } | null;
  day?: Day | null;
}

// Define the expected shape of the data from the loader
interface TimetableLoaderData {
  performances: PerformanceData[];
  days: Day[];
}



const Timetable = () => {
  // Get data from the router's loader
  const { performances: loadedPerformances, days } = useLoaderData() as TimetableLoaderData;
  const [performances, setPerformances] = useState<PerformanceData[]>([]);
  const [activeDayId, setActiveDayId] = useState<string>('');

  // Initialize data
  useEffect(() => {
    // Set the initial active day to the first day if available
    if (days.length > 0 && !activeDayId) {
      setActiveDayId(days[0].id);
    }
    
    // Enrich performances with artist and stage data
    const enrichedPerformances = loadedPerformances.map(performance => ({
      ...performance,
      artist: getArtistById(performance.artistId),
      stage: getStageById(performance.stageId),
      day: getDayById(performance.dayId),
    }));
    
    setPerformances(enrichedPerformances);
  }, [loadedPerformances, days, activeDayId]);

  const handleDayChange = (dayId: string) => {
    setActiveDayId(dayId);
  };

  // Filter and sort performances for the active day
  const sortedPerformances = performances
    .filter(performance => 
      performance.dayId === activeDayId && 
      performance.startTime && 
      performance.endTime
    )
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  // Format performance time range
  const formatPerformanceTime = (startTime: string, endTime: string) => {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      return `${formatTime2Digit(start)} - ${formatTime2Digit(end)}`;
    } catch (e) {
      console.error('Error formatting time:', e);
      return 'Időpont ismeretlen';
    }
  };
  
  // Get display name for artist
  const getArtistDisplayName = (artist: { name: string; collective?: string | null } | undefined | null) => {
    if (!artist) return 'Ismeretlen előadó';
    return artist.collective ? `${artist.name} (${artist.collective})` : artist.name;
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
      <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
        Tilos Maraton 2025 - Műsorrend
      </h1>
      
      {/* Day selector */}
      <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
        {days.map((day) => (
          <button
            type="button"
            key={day.id}
            className={`px-4 py-2 rounded-lg transition-colors ${
              day.id === activeDayId
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
            onClick={() => handleDayChange(day.id)}
          >
            {day.name}
          </button>
        ))}
      </div>

      {sortedPerformances.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Nincs előadás ezen a napon.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedPerformances.map((performance) => (
            <div 
              key={performance.id} 
              className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                <div>
                  <h3 className="font-bold text-lg">
                    {getArtistDisplayName(performance.artist)}
                  </h3>
                  <p className="text-gray-600">
                    {performance.stage?.name || 'Ismeretlen színpad'}
                  </p>
                </div>
                {performance.startTime && performance.endTime && (
                  <div className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full self-start">
                    {formatPerformanceTime(performance.startTime, performance.endTime)}
                  </div>
                )}
              </div>
              
              {performance.description && (
                <p className="mt-2 text-gray-700">{performance.description}</p>
              )}
              
              {(performance.artist?.genre || performance.description) && (
                <div className="mt-2 space-y-1">
                  {performance.artist?.genre && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                      {performance.artist.genre}
                    </span>
                  )}
                  {performance.description && (
                    <p className="text-sm text-gray-700 mt-1">{performance.description}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Timetable;
