import type React from "react";
import { useLoaderData, type LoaderFunction } from "react-router-dom";
import { BasePage } from "./BasePage";
import {
  getArtistById,
  getDayById,
  getPerformancesByArtistId,
  getStageById,
} from "../services/dataService";
import type { Artist, Performance, Day, Stage } from "../types";
import { PerformanceCard } from "../components/PerformanceCard";
import { LinkifiedDescription } from "../components/LinkifiedDescriptions";
import { DefaultArtistIcon, missingArtistFallbackIcon } from "../components/icons";

type ArtistPageData = Artist & {
  performances: Array<Performance & { day: Day | undefined; stage: Stage | undefined }>;
};

export const getEnrichedArtist = (id: string): ArtistPageData | undefined => {
  const artist = getArtistById(id);
  if (!artist) return undefined;

  const artistPerformances = getPerformancesByArtistId(id).map((performance) => ({
    ...performance,
    day: getDayById(performance.dayId),
    stage: getStageById(performance.stageId),
  }));

  return { ...artist, performances: artistPerformances };
};

export const loadArtistPageData: LoaderFunction<ArtistPageData> = ({ params }) => {
  const artistId = params.id;
  if (!artistId) {
    throw new Response("Artist ID is required", { status: 400 });
  }
  const artist = getEnrichedArtist(artistId);
  if (!artist) {
    throw new Response("Artist not found", { status: 404 });
  }
  return artist;
};

export const ArtistPage: React.FC = () => {
  const artist = useLoaderData() as ArtistPageData;

  return (
    <BasePage>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="bg-gray-200 rounded-lg aspect-square w-full max-w-xs mx-auto overflow-hidden">
              {artist.image ? (
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = missingArtistFallbackIcon;
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <DefaultArtistIcon />
                </div>
              )}
            </div>
          </div>
          <div className="md:w-2/3 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{artist.name}</h2>
              {(artist.genre || artist.collective) && (
                <p className="text-gray-600">
                  {artist.genre} • {artist.collective}
                </p>
              )}
            </div>
            <div className="prose max-w-none">
              {artist.description && <LinkifiedDescription description={artist.description} />}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">{artist.name} előadásai</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {artist.performances.map((performance) => (
              <PerformanceCard
                key={performance.id}
                performance={{
                  ...performance,
                  artist: {
                    name: artist.name,
                    collective: artist.collective,
                    description: artist.description,
                    genre: artist.genre,
                  },
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default ArtistPage;
