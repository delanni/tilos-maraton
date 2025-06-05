export interface Artist {
  id: string;
  name: string;
  collective: string | null;
  description: string;
  genre: string | null;
  image: string | null;
}

export interface Day {
  id: string;
  date: string;
  name: string;
  description: string;
  facebookEvent: string;
  themeColors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

export interface Stage {
  id: string;
  name: string;
  description: string;
  icon: string;
  offsetX: number;
  offsetY: number;
  hidden?: boolean;
}

export interface Performance {
  id: string;
  artistId: string;
  dayId: string;
  description: string;
  stageId: string;
  startTime: string;
  endTime: string;
}

export interface FestivalInfo {
  location: string;
  dates: string;
  eventName: string;
  tagline: string;
  contact: string;
  address: string;
  year: number;
  timezone: string;
  description: string[];
  generalDirectives: string[];
  faq: Array<{ question: string; answer: string }>;
  contacts: Array<{
    name: string;
    role: string;
    email: string;
    phone: string;
  }>;
  links: Record<string, { name: string; url: string }>;
}
