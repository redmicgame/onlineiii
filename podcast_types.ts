export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  duration: number;
  releaseDate: { year: number; week: number };
  plays: number;
  revenue: number;
  hasVideo: boolean;
  guestId?: string;
  guestName?: string;
}

export interface Podcast {
  id: string;
  name: string;
  host: string;
  description: string;
  topics: string[];
  coverArt: string | null;
  followers: number;
  episodes: PodcastEpisode[];
  totalPlays: number;
  imdbRating: number;
  isNpc: boolean;
  requiredPopularity?: number; // for guest appearances
}

export interface PodcastPitchOffer {
  id: string;
  podcastId: string;
  type: "podcast_pitch";
  status: "pending" | "accepted" | "rejected";
  releaseIdToPromote: string;
  date: { year: number; week: number };
}
