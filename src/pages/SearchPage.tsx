import React, { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import type { Artist, Performance, Stage, Day } from '../types';
import { formatDate } from '../lib/formatTime';
import { getAllPerformances, getArtistById, getStageById, getDayById } from '../services/dataService';
import PerformanceTimeLabel from '../components/PerformanceTimeLabel';
import { byStartTime } from '../lib/sorting';

export type EnrichedPerformance = Performance & {
  artist: Artist | null;
  stage: Stage | null;
  day: Day | null;
};

export const loadSearchPageData = (): EnrichedPerformance[] => {
  const performances = getAllPerformances();

  const enrichedPerformances = performances.map((performance) => ({
    ...performance,
    artist: getArtistById(performance.artistId) ?? null,
    stage: getStageById(performance.stageId) ?? null,
    day: getDayById(performance.dayId) ?? null,
  })).sort(byStartTime);

  return enrichedPerformances;
};

const SearchTarget = {
  ARTISTS: 'artists',
  ALL: 'all'
} as const;

type SearchTargetType = typeof SearchTarget[keyof typeof SearchTarget];

export const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTarget, setSearchTarget] = useState<SearchTargetType>(SearchTarget.ALL);
  const programmeData = useLoaderData() as EnrichedPerformance[];
  const [searchResults, setSearchResults] = useState<EnrichedPerformance[]>(programmeData);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setSearchResults(programmeData);
      return;
    }

    const results = programmeData.filter(item => {
      const artistName = item.artist?.name?.toLowerCase() || '';
      const description = item.description?.toLowerCase() || '';

      switch (searchTarget) {
        case SearchTarget.ARTISTS:
          return artistName.includes(term);
        case SearchTarget.ALL:
          return (
            artistName.includes(term) || 
            description.includes(term) || 
            (item.artist?.genre?.toLowerCase() || '').includes(term) || 
            (item.artist?.collective?.toLowerCase() || '').includes(term)
          );
        default:
          return false;
      }
    });

    setSearchResults(results);
  };

  return (
    <div className="space-y-8">
      <div className="max-w-md mx-auto">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSearchTarget(SearchTarget.ARTISTS)}
            className={`px-4 py-2 rounded-lg ${
              searchTarget === SearchTarget.ARTISTS 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Előadó neve
          </button>
          <button
            onClick={() => setSearchTarget(SearchTarget.ALL)}
            className={`px-4 py-2 rounded-lg ${
              searchTarget === SearchTarget.ALL 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Teljes keresés
          </button>
          <button
            onClick={() => { setSearchTerm(''); setSearchResults(programmeData); }}
            className={`px-4 py-2 rounded-lg ${
              !searchTerm 
                ? 'bg-blue-200 text-blue-700' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
            disabled={!searchTerm}
          >
            Mindent mutass
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Keresés..."
            className="w-full px-4 py-3 pr-10 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchResults([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((item) => (
            <Link
              key={item.id}
              to={`/performance/${item.id}`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              style={{ backgroundColor: item.day?.themeColors.background }}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold" style={{ color: item.day?.themeColors.primary }}>{item.artist?.name}</h3>
                  <span className="text-sm text-gray-500 font-medium">
                    {formatDate(item.startTime)}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{item.artist?.genre}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded-full">
                    {item.stage?.name}
                  </span>
                  <span className="text-gray-400">•</span>
                  <PerformanceTimeLabel performance={item} /> 
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : searchTerm ? (
        <div className="text-center py-8 text-gray-500">
          <p>Nincs találat a kereséshez.</p>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Írja be a keresési feltételt...</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;