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
                    target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1894543e7fb%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%20%26quot%3BNoto%20Color%20Emoji%26quot%3B%20!important%3Bfont-size%3A10pt%20!important%3B %7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1894543e7fb%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23f3f4f6%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2272.5%22%20y%3D%22110.5%22%3EArtist%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    role="img"
                    aria-label="Default artist avatar"
                  >
                    <title>Default artist avatar</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
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
