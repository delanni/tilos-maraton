import artists from "../../programme/artists.json";
import days from "../../programme/days.json";
import performances from "../../programme/performances.json";
import stages from "../../programme/stages.json";
import festivalInfo from "../../programme/festivalInfo.json";
import type { Artist, Day, Stage, Performance, FestivalInfo } from "../types";

// Helper function to find related data
export const getArtistById = (id: string): Artist | undefined =>
  (artists as Artist[]).find((artist) => artist.id === id);

export const getDayById = (id: string): Day | undefined =>
  (days as Day[]).find((day) => day.id === id);

export const getStageById = (id: string): Stage | undefined =>
  (stages as Stage[]).find((stage) => stage.id === id);

export const getPerformancesByDayId = (dayId: string): Performance[] =>
  (performances as Performance[]).filter((performance) => performance.dayId === dayId);

export const getPerformancesByArtistId = (artistId: string): Performance[] =>
  (performances as Performance[]).filter((performance) => performance.artistId === artistId);

export const getPerformancesByStageId = (stageId: string): Performance[] =>
  (performances as Performance[]).filter((performance) => performance.stageId === stageId);

// Enhanced data access functions
export const getEventMeta = (): FestivalInfo => festivalInfo;

export const getAllDays = (): Day[] => days as Day[];

export const getAllArtists = (): Artist[] => artists as Artist[];
export const getAllStages = (): Stage[] => stages as Stage[];

export const getPerformanceById = (id: string): Performance | undefined =>
  (performances as Performance[]).find((performance) => performance.id === id);

export const getAllPerformances = () => performances as Performance[];
