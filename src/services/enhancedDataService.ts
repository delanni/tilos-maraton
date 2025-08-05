import type { Artist, Day, Stage, Performance, FestivalInfo } from "../types";

// Data version management
const DATA_VERSION = "v1.0.0";
const DATA_CACHE_KEY = `tilos-maraton-data-${DATA_VERSION}`;

interface DataCache {
  version: string;
  timestamp: number;
  artists: Artist[];
  days: Day[];
  stages: Stage[];
  performances: Performance[];
  festivalInfo: FestivalInfo;
}

class DataService {
  private cache: DataCache | null = null;
  private readonly maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  private async loadStaticData(): Promise<DataCache> {
    // Dynamic imports to ensure fresh data loading
    const [
      { default: artists },
      { default: days },
      { default: stages },
      { default: performances },
      { default: festivalInfo },
    ] = await Promise.all([
      import("../../programme/artists.json"),
      import("../../programme/days.json"),
      import("../../programme/stages.json"),
      import("../../programme/performances.json"),
      import("../../programme/festivalInfo.json"),
    ]);

    return {
      version: DATA_VERSION,
      timestamp: Date.now(),
      artists: artists as Artist[],
      days: days as Day[],
      stages: stages as Stage[],
      performances: performances as Performance[],
      festivalInfo: festivalInfo as FestivalInfo,
    };
  }

  private async getCachedData(): Promise<DataCache | null> {
    try {
      const cached = localStorage.getItem(DATA_CACHE_KEY);
      if (!cached) return null;

      const data: DataCache = JSON.parse(cached);
      
      // Check if data is too old or version mismatch
      if (
        data.version !== DATA_VERSION ||
        Date.now() - data.timestamp > this.maxAge
      ) {
        localStorage.removeItem(DATA_CACHE_KEY);
        return null;
      }

      return data;
    } catch {
      localStorage.removeItem(DATA_CACHE_KEY);
      return null;
    }
  }

  private setCachedData(data: DataCache): void {
    try {
      localStorage.setItem(DATA_CACHE_KEY, JSON.stringify(data));
    } catch {
      // Storage might be full, ignore
    }
  }

  async refreshData(): Promise<void> {
    this.cache = null;
    localStorage.removeItem(DATA_CACHE_KEY);
    await this.loadData();
  }

  private async loadData(): Promise<DataCache> {
    if (this.cache) return this.cache;

    // Try to get from cache first
    const cached = await this.getCachedData();
    if (cached) {
      this.cache = cached;
      return cached;
    }

    // Load fresh data
    const freshData = await this.loadStaticData();
    this.cache = freshData;
    this.setCachedData(freshData);
    
    return freshData;
  }

  async getArtistById(id: string): Promise<Artist | undefined> {
    const data = await this.loadData();
    return data.artists.find((artist) => artist.id === id);
  }

  async getDayById(id: string): Promise<Day | undefined> {
    const data = await this.loadData();
    return data.days.find((day) => day.id === id);
  }

  async getStageById(id: string): Promise<Stage | undefined> {
    const data = await this.loadData();
    return data.stages.find((stage) => stage.id === id);
  }

  async getPerformancesByDayId(dayId: string): Promise<Performance[]> {
    const data = await this.loadData();
    return data.performances.filter((performance) => performance.dayId === dayId);
  }

  async getPerformancesByArtistId(artistId: string): Promise<Performance[]> {
    const data = await this.loadData();
    return data.performances.filter((performance) => performance.artistId === artistId);
  }

  async getPerformancesByStageId(stageId: string): Promise<Performance[]> {
    const data = await this.loadData();
    return data.performances.filter((performance) => performance.stageId === stageId);
  }

  async getEventMeta(): Promise<FestivalInfo> {
    const data = await this.loadData();
    return data.festivalInfo;
  }

  async getAllDays(): Promise<Day[]> {
    const data = await this.loadData();
    return data.days;
  }

  async getAllArtists(): Promise<Artist[]> {
    const data = await this.loadData();
    return data.artists;
  }

  async getAllStages(): Promise<Stage[]> {
    const data = await this.loadData();
    return data.stages;
  }

  async getPerformanceById(id: string): Promise<Performance | undefined> {
    const data = await this.loadData();
    return data.performances.find((performance) => performance.id === id);
  }

  async getAllPerformances(): Promise<Performance[]> {
    const data = await this.loadData();
    return data.performances;
  }

  getDataVersion(): string {
    return DATA_VERSION;
  }

  getCacheInfo(): { version: string; timestamp: number | null } {
    try {
      const cached = localStorage.getItem(DATA_CACHE_KEY);
      if (!cached) return { version: DATA_VERSION, timestamp: null };
      
      const data: DataCache = JSON.parse(cached);
      return { version: data.version, timestamp: data.timestamp };
    } catch {
      return { version: DATA_VERSION, timestamp: null };
    }
  }
}

// Export singleton instance
export const dataService = new DataService();

// Legacy exports for backward compatibility
export const getArtistById = (id: string) => dataService.getArtistById(id);
export const getDayById = (id: string) => dataService.getDayById(id);
export const getStageById = (id: string) => dataService.getStageById(id);
export const getPerformancesByDayId = (dayId: string) => dataService.getPerformancesByDayId(dayId);
export const getPerformancesByArtistId = (artistId: string) => dataService.getPerformancesByArtistId(artistId);
export const getPerformancesByStageId = (stageId: string) => dataService.getPerformancesByStageId(stageId);
export const getEventMeta = () => dataService.getEventMeta();
export const getAllDays = () => dataService.getAllDays();
export const getAllArtists = () => dataService.getAllArtists();
export const getAllStages = () => dataService.getAllStages();
export const getPerformanceById = (id: string) => dataService.getPerformanceById(id);
export const getAllPerformances = () => dataService.getAllPerformances();