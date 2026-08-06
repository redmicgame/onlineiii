export interface ActingRole {
  id: string;
  title: string;
  type: 'Movie' | 'TV Show' | 'Voice Acting' | 'Tour Documentary';
  roleName: string;
  roleType?: 'Leading Role' | 'Supporting Role' | 'Extra';
  year: number;
  status: 'Filming' | 'Completed' | 'Released';
  trailerUrl?: string;
  coverUrl?: string;
  rating?: number;
  season?: number;
}

export interface TalentAgency {
  id: string;
  name: string;
  feePercent: number;
  minPopularity: number;
  perks: string[];
}

export interface ActingOffer {
  id: string;
  title: string;
  type: 'Movie' | 'TV Show' | 'Voice Acting' | 'Tour Documentary';
  roleName: string;
  roleType?: 'Leading Role' | 'Supporting Role';
  pay: number;
  durationWeeks: number;
  status: 'Pending' | 'Accepted' | 'Declined';
}

export interface ImdbProfile {
  bio?: string;
  headerImage?: string;
  birthDate?: string;
}

export interface Artist {
  id: string;
  name: string;
  age: number;
  country: string;
  image: string;
  pronouns: "he/him" | "she/her" | "they/them";
  fandomName: string;
}

export interface Group {
  id: string;
  name: string;
  image: string;
  members: Artist[];
  fandomName: string;
}

export interface ITunesVersion {
  id: string;
  title: string;
  coverArt: string;
  releaseDate: GameDate;
  isScheduled?: boolean;
  sales: number;
  weeklySales?: number;
  price: number;
}

export interface Song {
  id: string;
  title: string;
  genre: string;
  subgenre?: string;
  quality: number;
  coverArt: string;
  isReleased: boolean;
  isVaulted?: boolean;
  releaseId?: string;
  streams: number;
  lastWeekStreams: number;
  prevWeekStreams: number;
  actualLastWeekStreams?: number;
  actualPrevWeekStreams?: number;
  pitchforkBoost?: boolean;
  interviewBoost?: boolean;
  duration: number; // in seconds
  explicit: boolean;
  artistId: string;
  isPreReleaseSingle?: boolean;
  isInterlude?: boolean;
  singleType?: 'lead' | 'standalone' | 'interlude';
  firstWeekStreams?: number;
  firstWeekSales?: number;
  removedStreams?: number;
  playlistBoostWeeks?: number;
  appleMusicPlaylistBoostWeeks?: number;
  purchasedPlaylists?: {
    playlistId: string;
    position: number;
    weeksRemaining: number;
  }[];
  tourBoostWeeks?: number;
  promoBoostWeeks?: number;
  itunesVersions?: ITunesVersion[];
  peakWeeklyStreams?: number;
  remixOfSongId?: string;
  trait?: "Smash Hit" | "TikTok Hit" | "Slow Burner" | "Flop" | "Radio Hit" | "Normal";
  traitGenerated?: boolean;
  isAvailableOnStreaming?: boolean;
  sales?: number;
  leakInfo?: {
    illegalStreams: number;
    illegalDownloads: number;
  };
  dailyStreams?: number[];
  soundtrackTitle?:
    | "F1 The Album"
    | "Wicked"
    | "Breaking Bad"
    | "Dune: Part Two"
    | "Deadpool & Wolverine"
    | "Barbie"
    | "Spider-Man: Beyond the Spider-Verse"
    | "James Bond"
    | "The Hunger Games"
    | "Pitch Perfect"
    | "The Great Gatsby"
    | "Mamma Mia"
    | "Twilight"
    | string;
  collaboration?: {
    artistName: string;
    cost: number;
    qualityBoost: number;
  };
  lastCertification?: string;
  certifications?: { level: string; date: GameDate }[];
  isTakenDown?: boolean;
  isFeatureToNpc?: boolean;
  features?: string[];
  npcArtistName?: string;
  releaseDate?: GameDate;
  reRecordingOf?: string; // ID of the original song
  revenue?: number;
  netRevenue?: number;
  rightsSoldOriginalValue?: number;
  rightsSoldPercent?: number;
  rightsOwnerLabelId?: string;
  itunesPrice?: string;
  canvasVideo?: string;
  canvasHashtags?: string[];
  producers?: string[];
  songwriters?: string[];
  engineers?: string[];
  anr?: string[];
  contributorCutsTotal?: number;
  controversialContributors?: string[];
  aboutText?: string;
  samples?: {
    songTitle: string;
    artistName: string;
    type: "Sample" | "Interpolation";
    coverArt: string;
  }[];
  isOnRadio?: boolean;
  radioPlays?: number;
  radioImpressions?: number;
  lastWeekRadioPlays?: number;
  weeksOnRadio?: number;
  radioFormat?: string;
  pendingRadioPromoSpins?: number;
  hasRadioPromo?: boolean;
  
  isOnUkRadio?: boolean;
  ukRadioPlays?: number;
  lastWeekUkRadioPlays?: number;
  ukWeeksOnRadio?: number;
  ukRadioFormat?: string;
  pendingUkRadioPromoSpins?: number;
  hasUkRadioPromo?: boolean;
  hasTweetedBillionStreams?: boolean;
  hasBillionsClubEmail?: boolean;
  hasBillionsClubPerformance?: boolean;
  regionalStreams?: {
    "US": number;
    "Canada": number;
    "UK": number;
    "Latin America": number;
    "Asia": number;
    "Africa": number;
  };
  lastWeekRegionalStreams?: {
    "US": number;
    "Canada": number;
    "UK": number;
    "Latin America": number;
    "Asia": number;
    "Africa": number;
  };
}

export type ReleaseType =
  "Single" | "EP" | "Album" | "Album (Deluxe)" | "Compilation" | "Live Album";

export interface Review {
  publication: "Pitchfork";
  score: number;
  text: string;
  reviewer: string;
}

export interface Release {
  id: string;
  title: string;
  type: ReleaseType;
  coverArt: string;
  songIds: string[];
  releaseDate: GameDate;
  isScheduled?: boolean;
  review?: Review;
  artistId: string;
  countdownVideoUrl?: string; // For upcoming albums
  countdownImageUrl?: string;
  snapshotBanner?: string;
  isTracklistRevealed?: boolean;
  revealedTrackIds?: string[];
  tracklistImageUrl?: string;
  standardEditionId?: string;
  isAppleMusicExpandedCover?: boolean;
  preReleaseStreams?: number;
  preReleaseSales?: number;
  sales?: number;
  isAppleMusicEssential?: boolean;
  appleMusicEssentialReview?: string;
  releasingLabel?: {
    name: string;
    dealWithMajor?: string;
    exclusiveLicenseTo?: string;
  } | null;
  firstWeekStreams?: number;
  firstWeekSales?: number;
  wikipediaSummary?: string;
  soundtrackInfo?: { albumTitle: string };
  isFeatureToNpc?: boolean;
  features?: string[];
  npcArtistName?: string;
  lastCertification?: string;
  certifications?: { level: string; date: GameDate }[];
  isTakenDown?: boolean;
  rightsSoldOriginalValue?: number;
  rightsSoldPercent?: number;
  rightsOwnerLabelId?: string;
  isAnnounced?: boolean;
  preorderSales?: number;
  peakWeeklyStreams?: number;
}

export interface Video {
  id: string;
  songId: string;
  title: string;
  type:
    | "Music Video"
    | "Lyric Video"
    | "Visualizer"
    | "Genius Verified"
    | "Live Performance"
    | "Interview"
    | "Custom";
  views: number;
  thumbnail: string;
  releaseDate: GameDate;
  isScheduled?: boolean;
  artistId: string;
  channelId: string; // The active youtube channel
  firstWeekViews?: number;
  description?: string;
  mentionedNpcs?: string[];
  isOnSpotify?: boolean;
  spotifyViews?: number;
  spotifyDailyViews?: number[];
  isFeatureVideo?: boolean;
  isMtv?: boolean;
}

export interface MerchProduct {
  id: string;
  releaseId: string; // From an EP or Album or song
  name: string;
  type: "Vinyl" | "CD" | "Ringtone" | "Cassette" | "T-Shirt" | "Hoodie" | "Tour Exclusive Merch";
  price: number;
  color?: string;
  stock: number;
  unitsSold?: number;
  _actualWeeklySales?: number;
  isPreorder?: boolean;
  image: string;
  artistId: string;
}

export interface GeniusOffer {
  type: "geniusInterview";
  songId: string;
  isAccepted: boolean;
  emailId: string;
}

export interface OnTheRadarOffer {
  type: "onTheRadarOffer";
  songId: string;
  isAccepted: boolean;
  emailId: string;
}

export interface TrshdOffer {
  type: "trshdOffer";
  songId: string;
  isAccepted: boolean;
  emailId: string;
}

export interface FallonOffer {
  type: "fallonOffer";
  releaseId: string;
  offerType: "performance" | "interview" | "both";
  isAccepted: boolean;
  emailId: string;
}

export interface PopBaseOffer {
  type: "popBaseInterview" | "popBaseClarification";
  emailId: string;
  isAnswered: boolean;
  question?: string;
  originalPostContent?: string;
  isControversial?: boolean;
}

export interface BillionsClubOffer {
  type: "billionsClub";
  emailId: string;
  songId: string;
  hasUploadedImage: boolean;
  image?: string;
}

export interface AmaSubmissionOffer {
  type: "amaSubmission";
  emailId: string;
  isSubmitted: boolean;
}

export interface AmaNominationOffer {
  type: "amaNominations";
  emailId: string;
  hasPerformanceOffer: boolean;
  isPerformanceAccepted?: boolean;
}

export interface AmaRedCarpetOffer {
  type: "amaRedCarpet";
  emailId: string;
  isAttending?: boolean;
}

export interface EventInvitationOffer {
  type: "eventInvitation";
  eventName: string;
  eventType: "metGala" | "nyfw" | "afterParty" | "soundtrackPremiere";
  emailId: string;
  isAccepted?: boolean;
  hostName?: string;
  associatedSoundtrack?: string;
}

export interface GrammySubmissionOffer {
  type: "grammySubmission";
  emailId: string;
  isSubmitted: boolean;
}

export interface GrammyNominationOffer {
  type: "grammyNominations";
  emailId: string;
  hasPerformanceOffer: boolean;
  isPerformanceAccepted?: boolean;
}

export interface GrammyRedCarpetOffer {
  type: "grammyRedCarpet";
  emailId: string;
  isAttending?: boolean;
}

export interface OscarsSubmissionOffer {
  type: "oscarSubmission";
  emailId: string;
  isSubmitted: boolean;
}

export interface OscarRedCarpetOffer {
  type: "oscarRedCarpet";
  emailId: string;
  isAttending?: boolean;
}

export interface OscarsNominationOffer {
  type: "oscarNominations";
  emailId: string;
  hasPerformanceOffer: boolean;
  isPerformanceAccepted?: boolean;
}

export interface LeakNotification {
  type: "leak";
  songId: string;
}

export interface XSuspensionEmail {
  type: "xSuspension";
  isSuspended: boolean; // true for suspension, false for reinstatement
}

export interface XAppealResultEmail {
  type: "xAppealResult";
  isSuccessful: boolean;
}

export interface OnlyFansOffer {
  type: "onlyfansRequest";
  requestType: "image" | "video";
  payout: number;
  isFulfilled: boolean;
  emailId: string;
  senderUsername: string;
}

export interface FeatureVideoOffer {
  type: "featureVideoOffer";
  songId: string;
  npcArtistName: string;
  isAccepted?: boolean;
}

export interface FifaWorldCupOffer {
  type: "fifaWorldCupOffer";
  emailId: string;
  isAccepted: boolean;
  collabs: string[];
}

export interface SoundtrackOffer {
  type: "soundtrackOffer";
  albumTitle:
    | "F1 The Album"
    | "Wicked"
    | "Breaking Bad"
    | "Dune: Part Two"
    | "Deadpool & Wolverine"
    | "Barbie"
    | "Spider-Man: Beyond the Spider-Verse"
    | "James Bond"
    | "The Hunger Games"
    | "Pitch Perfect"
    | "The Great Gatsby"
    | "Mamma Mia"
    | "Twilight";
  isAccepted: boolean;
  emailId: string;
}

export interface TouringDataUpdate {
  type: "touringDataUpdate";
  tourId: string;
  venueIndex: number;
}

export interface VogueOffer {
  type: "vogueOffer";
  magazine: "Vogue" | "Vogue Korea" | "Vogue Italy";
  isAccepted: boolean;
  emailId: string;
}

export interface SpotifyPlaylistTrack {
  songId: string;
  artistName: string;
  artistId: string;
  title: string;
  coverArt: string;
  position: number;
  addedDate: GameDate;
  explicit?: boolean;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  followers: number;
  coverArt: string;
  type: "global" | "genre" | "viral" | "new" | "this_is";
  genre?: string;
  tracks: SpotifyPlaylistTrack[];
  bannedTrackIds?: string[];
}

export interface FeatureOffer {
  type: "featureOffer";
  npcArtistName: string;
  payout: number;
  songQuality: number;
  promotion?: {
    name: string;
    durationWeeks: number;
  };
  isAccepted: boolean;
  emailId: string;
}

export interface FeatureReleaseNotification {
  type: "featureRelease";
  songTitle: string;
  npcArtistName: string;
}

export interface CoachellaOffer {
  type: "coachellaOffer";
  emailId: string;
  isSubmitted: boolean;
}

export interface CoachellaSelectionOffer {
  type: "coachellaSelection";
  emailId: string;
  slot: "headliner" | "mid" | "small" | "opener";
  stage: string;
  isSetlistSelected?: boolean;
}

export interface CheatingScandalEmail {
  type: "cheatingScandal";
  relationshipId: string;
  isAnswered?: boolean;
}

export interface GiveBirthEmail {
  type: "giveBirth";
  isAnswered?: boolean;
}

export interface NpcContractRenewalOffer {
  type: "npcContractRenewal";
  npcName: string;
  isAccepted: boolean;
  emailId: string;
}

export type PromoInterviewSource =
  | "Call Her Daddy"
  | "Apple Music"
  | "Snack Wars"
  | "Rolling Stone"
  | "Etalk"
  | "Therapuss"
  | "KISS FM";

export interface ActingTrailerUploadOffer {
  type: "actingTrailerUpload";
  roleId: string;
  roleTitle: string;
}

export interface ActingCoverUploadOffer {
  type: "actingCoverUpload";
  roleId: string;
  roleTitle: string;
}

export interface ActingPremiereOffer {
  type: "actingPremiere";
  roleId: string;
  roleTitle: string;
  isAccepted?: boolean;
}

export interface PromoInterviewOffer {
  type: "promoInterview";
  source: PromoInterviewSource;
}

export interface Email {
  id: string;
  sender: string;
  senderIcon?:
    | "spotify"
    | "youtube"
  | "mtv"
    | "default"
    | "label"
    | "genius"
    | "fallon"
    | "popbase"
    | "grammys"
    | "x"
    | "onlyfans"
    | "soundtrack"
    | "touringdata"
    | "business"
    | "vogue"
    | "feature"
    | "ontheradar"
    | "trshd"
    | "oscars"
  | "goldenGlobes"
  | "submit_for_golden_globes"
    | "coachella"
    | "amas"
    | "imdb"
  | "spotifyPodcasts"
  | "spotifyForCreators"
  | "managerPodcasts"
    | "event";
  subject: string;
  body?: string;
  content?: string;
  date: GameDate;
  isRead: boolean;
  offer?:
    | GeniusOffer
    | FallonOffer
    | PopBaseOffer
    | BillionsClubOffer
    | GrammySubmissionOffer
    | GrammyNominationOffer
    | GrammyRedCarpetOffer
    | LeakNotification
    | XSuspensionEmail
    | XAppealResultEmail
    | OnlyFansOffer
    | SoundtrackOffer
    | FifaWorldCupOffer
    | TouringDataUpdate
    | VogueOffer
    | FeatureOffer
    | FeatureReleaseNotification
    | FeatureVideoOffer
    | OnTheRadarOffer
    | TrshdOffer
    | OscarsSubmissionOffer
    | OscarsNominationOffer
    | OscarRedCarpetOffer
    | CoachellaOffer
    | CoachellaSelectionOffer
    | AmaSubmissionOffer
    | AmaNominationOffer
    | AmaRedCarpetOffer
    | CheatingScandalEmail
    | GiveBirthEmail
    | EventInvitationOffer
    | NpcContractRenewalOffer
    | PromoInterviewOffer
    | ActingTrailerUploadOffer
    | ActingCoverUploadOffer
    | ActingPremiereOffer;
}

export interface GameDate {
  day?: number;
  week: number;
  year: number;
}

export interface Promotion {
  id: string;
  itemId: string; // songId, releaseId, or videoId
  itemType: "song" | "release" | "video";
  promoType: string; // e.g., 'Playlist Push', 'Nostalgia Campaign'
  promoQuality: "high" | "medium" | "low";
  region?: "Global" | "US" | "Canada" | "UK" | "Latin America" | "Asia" | "Africa";
  weeklyCost: number;
  boostMultiplier: number;
  artistId: string;
}

export interface NpcSong {
  uniqueId: string;
  title: string;
  artist: string;
  genre: string;
  basePopularity: number; // A value to derive weekly streams from
  featuring?: string; // Player artist name
  isPlayerFeature?: boolean;
  coverArt?: string;
  isReleased?: boolean;
  releaseDate?: GameDate;
  promotion?: { name: string; boost: number };
  promoWeeksLeft?: number;
  isOnRadio?: boolean;
  radioPlays?: number;
  radioImpressions?: number;
  lastWeekRadioPlays?: number;
  weeksOnRadio?: number;
  radioFormat?: string;
  pendingRadioPromoSpins?: number;
  hasRadioPromo?: boolean;
  
  isOnUkRadio?: boolean;
  ukRadioPlays?: number;
  lastWeekUkRadioPlays?: number;
  ukWeeksOnRadio?: number;
  ukRadioFormat?: string;
  pendingUkRadioPromoSpins?: number;
  hasUkRadioPromo?: boolean;
}

export interface NpcAlbum {
  uniqueId: string;
  title: string;
  artist: string;
  label: "UMG" | "Republic" | "RCA" | "Island";
  coverArt: string;
  songIds: string[]; // uniqueId of NpcSong
  salesPotential: number;
}

export interface ChartEntry {
  rank: number;
  lastWeek: number | null;
  peak: number;
  weeksOnChart: number;
  title: string;
  artist: string;
  coverArt: string;
  isPlayerSong: boolean;
  songId?: string;
  uniqueId: string;
  weeklyStreams: number;
  itunesPrice?: string;
  radioPlays?: number;
  radioImpressions?: number;
  digitalSales?: number;
  isItunesVersion?: boolean;
  itunesSales?: number;
  itunesPriceString?: string;
  itunesDuration?: number;
  itunesExplicit?: boolean;
  regionalStreams?: Record<string, number>;
}

export interface VideoChartEntry {
  rank: number;
  lastWeek: number | null;
  peak: number;
  weeksOnChart: number;
  title: string;
  artist: string;
  thumbnail: string;
  isPlayerVideo: boolean;
  videoId?: string;
  uniqueId: string;
  weeklyViews: number;
}

export interface AlbumChartEntry {
  rank: number;
  lastWeek: number | null;
  peak: number;
  weeksOnChart: number;
  title: string;
  artist: string;
  label: string;
  coverArt: string;
  isPlayerAlbum: boolean;
  albumId?: string;
  uniqueId: string;
  weeklyActivity: number;
  weeklySales: number;
  weeklySES?: number;
  weeklyPureSales?: number;
}

export interface ChartHistory {
  [uniqueId: string]: {
    peak: number;
    weeksOnChart: number;
    lastRank: number | null;
    weeksAtNo1?: number;
    chartRun?: number[];
    firstEntered?: { year: number; week: number };
  };
}

export interface Label {
  id:
    | "umg"
    | "republic"
    | "rca"
    | "island"
    | "interscope"
    | "columbia"
    | "atlantic"
    | "epic"
    | "quality_control"
    | "tde"
    | "roc_nation"
    | "def_jam"
    | "bad_boy"
    | "polydor"
    | "nice_life"
    | "sony"
    | "capitol"
    | "motown"
    | "geffen"
    | "empire"
    | "virgin"
    | string;
  name: string;
  // FIX: Corrected typo 'Mid-High' to 'Mid-high' to match usage.
  tier: "Top" | "Mid-high" | "Mid-Low" | "Low";
  logo: string;
  promotionMultiplier: number;
  creativeControl: number; // 0-100, lower is less freedom for player
  minQuality: number;
  streamRequirement: number;
  activeFromYear?: number;
  activeUntilYear?: number;
  isDistributionOnly?: boolean;
  youtubeChannel?: {
    name: string;
    handle: string;
    subscribers: number;
    banner: string;
  };
  contractType?: "standard" | "petty";
}

export interface SignedNpc {
  id: string;
  name: string;
  contract: {
    advance: number;
    royaltyRate: number;
    durationWeeks: number;
    startDate: { week: number; year: number };
  };
  revenueGenerated: number;
  expenses: number;
  status: "active" | "negotiating" | "expired";
}

export interface CustomLabel {
  id: string;
  name: string;
  logo: string;
  artistOwnerId: string;
  dealWithMajorId?: Label["id"];
  exclusiveLicenseId?: Label["id"];
  tier: "Indie" | "Mid" | "High";
  promotionMultiplier: number;
  signedNpcs?: SignedNpc[];
}

export interface Contract {
  labelId: string;
  isCustom?: boolean;
  artistId: string;
  startDate: GameDate;
  albumsReleased: number;

  // Core terms
  durationWeeks: number;
  albumQuota: number;
  advance: number;
  royaltyPercent: number;

  // Ownership & Rights
  mastersOwnership: "Label" | "Artist" | "Split";
  mastersSplitPercent: number; // Artist's share if Split
  publishingRights: "Label" | "Artist" | "Split";
  publishingSplitPercent: number; // Artist's share if Split
  reversionClause: boolean; // Ownership reverts to artist after contract

  // Financials
  tourSupport: number;
  marketingBudget: number;
  merchPercent: number; // Artist's share
  streamingSplitArtist: number;
  sponsorshipSplitArtist: number;
  recoupmentTerms: string; // '100%', '50%', 'None'
  successBonus: number;
  chartIncentives: string; // e.g. '$10K per #1'
  revenueAuditRights: boolean;
  producerSplitsLabelPaid: boolean;

  // Operations & Control
  creativeControl: "High" | "Medium" | "Low";
  releaseDeadlines: boolean;
  exclusivity: boolean;
  collabPermissions: "Any" | "Label Approval" | "Strict";
  socialMediaObligations: "None" | "Moderate" | "Heavy";
  brandingApproval: "Artist" | "Label";
  performanceRequirements: string;
  independentRestrictions: boolean;
  distributionRegions: string; // 'Worldwide', 'US Only', 'North America'
  licensingRights: "Label" | "Artist" | "Split";

  // Legal
  renewalOptions: boolean;
  earlyTermination: boolean;
  penaltyAmount: number;
  nda: boolean;
  disputeTerms: string;
}

export interface LabelSubmission {
  id: string;
  release: Release;
  submittedDate: GameDate;
  status: "pending" | "awaiting_player_input" | "rejected" | "scheduled";
  decisionDate?: GameDate;
  projectReleaseDate?: GameDate;
  projectSingleType?: 'lead' | 'standalone' | 'interlude';
  projectEraImages?: string[];
  isProjectAnnounced?: boolean;
  feedback?: string;
  singlesToRelease?: {
    songId: string;
    releaseDate: GameDate;
    isScheduled?: boolean;
    isAnnounced?: boolean;
    singleType?: 'lead' | 'standalone' | 'interlude';
    eraImages?: string[];
  }[];
  promoBudget?: number;
  promoBudgetSpent?: number;
  hasCountdownPage?: boolean;
  geniusInterviewRequestedForSongId?: string;
  fallonPerformanceRequestedForSongId?: string;
  magazineInterviewRequestedForSongId?: string;
  newspaperInterviewRequestedForSongId?: string;
  tvInterviewRequestedForSongId?: string;
  recommendedSingles?: { songId: string; reason: string }[];
  preorderSales?: number;
}

export interface XUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isVerified: boolean | "blue" | "gold";
  verifiedSince?: number; // year
  country?: string;
  isPlayer?: boolean;
  bio?: string;
  headerImage?: string;
  followersCount: number;
  followingCount: number;
  xMonetization?: {
    subscriptions: {
      isActive: boolean;
      perks: string[];
      price: number;
      subscribers: number;
    };
    revenueSharing: {
      isActive: boolean;
      eligibleViewsThisMonth: number;
      lifetimeEarnings: number;
    };
  };
}

export interface XPollOption {
  id: string;
  text: string;
  votes: number;
}

export interface TikTokVideo {
  id: string;
  authorId: string;
  content: string;
  songId?: string;
  thumbnail?: string;
  views: number;
  likes: number;
  comments: number;
  createdAt: GameDate;
}

export interface TikTokPromoteOrder {
  id: string;
  goal: 'likes' | 'views' | 'followers' | 'profile_views';
  goalTypeCategory?: 'boost_account' | 'get_sales' | 'get_leads';
  targetType: 'video' | 'account';
  videoId?: string;
  videoThumbnail?: string;
  videoTitle?: string;
  status: 'active' | 'completed' | 'under_review' | 'pending';
  adCost: number;
  currencySymbol: string;
  originalCurrencyCost: number;
  estimatedResultsMin: number;
  estimatedResultsMax: number;
  viewsGained: number;
  likesGained: number;
  commentsGained: number;
  followersGained: number;
  profileViewsGained: number;
  targetViews: number;
  targetLikes: number;
  targetFollowers: number;
  targetProfileViews: number;
  durationDays: number;
  remainingDays: number;
  startDate: string;
  createdAtDate: GameDate;
}

export interface InstagramPost {
  id: string;
  imageUrls: string[];
  caption: string;
  likes: number;
  comments: number;
  date: GameDate;
}

export interface InstagramStory {
  id: string;
  imageUrl: string;
  date: GameDate;
}

export interface InstagramReel {
  id: string;
  videoUrl: string;
  caption: string;
  views: number;
  likes: number;
  comments: number;
  date: GameDate;
}

export interface XComment {
  id: string;
  authorId: string;
  content?: string;
  image?: string;
  gif?: string;
  likes: number;
  date: GameDate;
}

export interface XPost {
  id: string;
  authorId: string;
  content: string;
  image?: string;
  image2?: string;
  video?: string;
  poll?: {
    options: XPollOption[];
    totalVotes: number;
  };
  likes: number;
  retweets: number;
  views: number;
  quoteOf?: XPost;
  date: GameDate;
  comments?: XComment[];
  isSpace?: boolean;
  spaceInfo?: {
    listeners: number;
    songIdPromoted?: string;
    isEnded?: boolean;
  };
  billionsClubSongTitle?: string;
  spotifySnapshotAlbums?: { rank: number; title: string; streams: number; coverArt: string; move: number | string; percentChange: number }[];
}

export interface XMessage {
  id: string;
  senderId: string; // 'player' or a userId
  text: string;
  image?: string;
  date: GameDate;
}

export interface XChat {
  id: string;
  name: string;
  avatar: string;
  isGroup: boolean;
  participants: string[]; // array of userIds, 'player' is one of them
  messages: XMessage[];
  isRead: boolean;
}

export interface XTrend {
  id: string;
  category: string;
  title: string;
  postCount: number;
}

export type PaparazziPhotoCategory =
  "Spotted" | "Scandal" | "Fashion" | "Candid" | "TikTok Fan";

export interface XMedia {
  id: string;
  url: string;
  year: number;
}

export interface PaparazziPhoto {
  id: string;
  image: string;
  category: PaparazziPhotoCategory;
  year?: number;
}

export interface GrammyAward {
  year: number;
  category:
    | "Best New Artist"
    | "Album of the Year"
    | "Record of the Year"
    | "Song of the Year"
    | "Best Pop Song"
    | "Best Rap Song"
    | "Best R&B Song"
    | "Pop Album"
    | "Rap Album"
    | "R&B Album";
  itemId: string; // releaseId, songId, or artistId
  itemName: string;
  artistName: string;
  isWinner: boolean;
}

export type AmaCategoryName =
  | "Artist of the Year"
  | "New Artist of the Year"
  | "Album of the Year"
  | "Song of the Year"
  | "Music Video of the Year"
  | "Favorite Pop Artist"
  | "Favorite Pop Album"
  | "Favorite Pop Song"
  | "Favorite Hip-Hop Artist"
  | "Favorite Hip-Hop Album"
  | "Favorite Hip-Hop Song"
  | "Favorite R&B Artist"
  | "Favorite R&B Album"
  | "Favorite R&B Song"
  | "Favorite Latin Artist"
  | "Favorite Latin Album"
  | "Favorite Latin Song"
  | "Favorite Country Artist"
  | "Favorite Country Album"
  | "Favorite Country Song"
  | "Favorite Rock Artist"
  | "Favorite Rock Album"
  | "Favorite Rock Song"
  | "Favorite Dance/Electronic Artist";

export interface AmaAward {
  year: number;
  category: AmaCategoryName;
  itemId: string; // releaseId, songId, or artistId
  itemName: string;
  artistName: string;
  isWinner: boolean;
}

export interface OscarAward {
  year: number;
  category: "Best Original Song" | "Best Actor/Actress (Leading Role)" | "Best Supporting Actor/Actress (Supporting Role)";
  itemId: string; // songId or roleId
  itemName: string;
  artistName: string;
  isWinner: boolean;
}


export interface GoldenGlobeAward {
  year: number;
  category: "Best Actor/Actress" | "Best Supporting Actor/Actress" | "Best Voice Acting" | "Best TV Show" | "Best Movie" | "Best Soundtrack" | "Best Original Song";
  itemId: string;
  itemName: string;
  artistName: string;
  isWinner: boolean;
}

export interface GoldenGlobeContender {
  id: string;
  name: string;
  artistName: string;
  isPlayer: boolean;
  score: number;
  coverArt?: string;
}

export interface GoldenGlobeCategory {
  name: GoldenGlobeAward["category"];
  nominees: GoldenGlobeContender[];
  winner?: GoldenGlobeContender;
}

export interface GrammyContender {
  id: string;
  name: string;
  artistName: string;
  isPlayer: boolean;
  score: number;
  coverArt?: string;
}

export interface OscarContender {
  id: string;
  name: string;
  artistName: string;
  isPlayer: boolean;
  score: number;
  coverArt?: string;
}

export interface GrammyCategory {
  name:
    | "Best New Artist"
    | "Record of the Year"
    | "Song of the Year"
    | "Album of the Year"
    | "Best Pop Song"
    | "Best Rap Song"
    | "Best R&B Song"
    | "Pop Album"
    | "Rap Album"
    | "R&B Album";
  nominees: GrammyContender[];
  winner?: GrammyContender;
}

export interface AmaContender {
  artistId: string;
  artistName: string;
  itemId: string; // releaseId, songId, or artistId
  itemName: string;
  score: number;
}

export interface AmaCategory {
  name: AmaCategoryName;
  nominees: AmaContender[];
  winner?: AmaContender;
}

export interface OscarCategory {
  name: "Best Original Song" | "Best Actor/Actress" | "Best Supporting Actor/Actress" | "Best Voice Actor/Actress";
  nominees: OscarContender[];
  winner?: OscarContender;
}

export type GameView =
  | "crypto"
  | "imdb"
  | "spotifyPodcasts"
  | "spotifyForCreators"
  | "managerPodcasts"
  | "game"
  | "myspace"
  | "spotify"
  | "studio"
  | "release"
  | "pitchfork"
  | "youtube"
  | "createVideo"
  | "merchStore"
  | "inbox"
  | "catalog"
  | "promote"
  | "billboard"
  | "spotifyChart"
  | "youtubeVideoDetail"
  | "youtubeStudio"
  | "youtubeMusic"
  | "gigs"
  | "labelReleasePlan"
  | "createGeniusInterview"
  | "x"
  | "xProfile"
  | "xChatDetail"
  | "xCreateSpace"
  | "xActiveSpace"
  | "xAnalytics"
  | "xCreatorStudio"
  | "spotifyForArtists"
  | "createFallonPerformance"
  | "createFallonInterview"
  | "createMagazineInterview"
  | "createTvInterview"
  | "spotifyAlbumCountdown"
  | "createLabel"
  | "manageLabel"
  | "albumPromo"
  | "billboardAlbums"
  | "achievements"
  | "redMicProUnlock"
  | "redMicProDashboard"
  | "wikipedia"
  | "grammys"
  | "submitForGrammys"
  | "mtv"
  | "createGrammyPerformance"
  | "grammyRedCarpet"
  | "contractRenewal"
  | "itunes"
  | "onlyfansSetup"
  | "onlyfans"
  | "createOnlyFansPost"
  | "chartHistory"
  | "albumSalesChart"
  | "labels"
  | "releaseHub"
  | "createSoundtrack"
  | "createFifaWorldCup"
  | "spotifySoundtrackDetail"
  | "gameGuide"
  | "tours"
  | "createTour"
  | "tourDetail"
  | "management"
  | "security"
  | "spotifyTopSongs"
  | "spotifyTopAlbums"
  | "createVogueFeature"
  | "spotifyWrapped"
  | "hotPopSongs"
  | "hotRapRnb"
  | "electronicChart"
  | "countryChart"
  | "createFeature"
  | "createFeatureVideo"
  | "createOnTheRadarPerformance"
  | "createTrshdPerformance"
  | "appleMusic"
  | "oscars"
  | "submitForOscars"
  | "createOscarPerformance"
  | "oscarRedCarpet"
  | "switchSave"
  | "redCarpetHistory"
  | "amas"
  | "submitForAmas"
  | "createAmaPerformance"
  | "amaRedCarpet"
  | "dating"
  | "moviePremiereRedCarpet"
  | "goldenGlobeRedCarpet"
  | "google"
  | "tiktok"
  | "instagram"
  | "tmzArticle"
  | "riaa"
  | "attendEvent"
  | "radioDash"
  | "radioCharts"
  | "promoInterview"
  | "chartPredictions"
  | "albumPredictions"
  | "limewire"
  | "ascap"
  | "kalshi"
  | "onlineHub"
  | "ukChart";

export type Tab = "Home" | "Apps" | "Charts" | "Misc" | "Business";

export interface RedMicProState {
  unlocked: boolean;
  subscriptionType: "yearly" | "lifetime" | "code" | null;
  subscriptionEndDate?: GameDate;
  hypeMode?: "locked" | "manual";
  appOrder?: string[];
}

export interface OnlyFansPost {
  id: string;
  date: GameDate;
  caption: string;
  image: string;
  price: number;
  likes: number;
  comments: number;
  tips: number;
}

export interface OnlyFansProfile {
  username: string;
  displayName: string;
  bio: string;
  profilePicture: string;
  bannerPicture: string;
  subscriptionPrice: number;
  subscribers: number;
  posts: OnlyFansPost[];
  likes: number;
  totalGross: number;
  totalNet: number;
  earningsByMonth: { [yearMonth: string]: { gross: number; net: number } };
}

export interface XSuspensionStatus {
  isSuspended: boolean;
  reason: "fan_war_reports" | "random";
  appealSentDate?: GameDate;
  suspendedDate?: GameDate;
  accountId?: string; // tie suspension to a specific account
}

export interface SoundtrackTrack {
  isPlayerSong: boolean;
  songId: string; // Player Song ID or NPC uniqueId
  title: string;
  artist: string;
  streams: number;
  lastWeekStreams: number;
  prevWeekStreams: number;
  duration: number;
  explicit: boolean;
}

export interface SoundtrackAlbum {
  id: string;
  title:
    | "F1 The Album"
    | "Wicked"
    | "Breaking Bad"
    | "Dune: Part Two"
    | "Deadpool & Wolverine"
    | "Barbie"
    | "Spider-Man: Beyond the Spider-Verse"
    | "James Bond"
    | "The Hunger Games"
    | "Pitch Perfect"
    | "The Great Gatsby"
    | "Mamma Mia"
    | "Twilight";
  coverArt: string;
  tracks: SoundtrackTrack[];
  releaseDate: GameDate;
  isScheduled?: boolean;
  label: string;
  artistId: string; // The player who contributed
  isReleased: boolean;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  capacity: number;
  region?: string;
  ticketPrice: number;
  soldOut: boolean;
  revenue: number;
  ticketsSold: number;
}

export interface Tour {
  id: string;
  artistId: string;
  name: string;
  bannerImage: string;
  venues: Venue[];
  setlist: string[];
  status: "planning" | "presale" | "active" | "finished" | "cancelled";
  currentVenueIndex: number;
  totalRevenue: number;
  ticketsSold: number;
  useDynamicPricing?: boolean;
  useVipPackages?: boolean;
  presalePercentage?: number;
  presaleCollectedPercentage?: number;
  presaleCollectionQueue?: { weeksRemaining: number; amount: number }[];
  presaleDemand?: number; // Estimated demand
  isSetlistMissingHits?: boolean; // Flag to apply -50% penalty
  merchItems?: MerchProduct[];
  openerId?: string;
  guestIds?: string[];
  bookingCostsPaid?: number;
}

export interface Manager {
  id: string;
  name: string;
  bio: string;
  yearlyCost: number;
  popularityBoost: number;
  autoGigsPerWeek: number;
  unlocksTier: number;
}

export interface SecurityTeam {
  id: string;
  name: string;
  weeklyCost: number;
  leakProtection: number;
}

export interface VoguePhotoshoot {
  id: string;
  magazine: "Vogue" | "Vogue Korea" | "Vogue Italy";
  coverImage: string;
  photoshootImages: string[];
  interviewAnswers: { question: string; answer: string }[];
  date: GameDate;
}

export interface Relationship {
  id: string;
  partnerName: string;
  partnerType: "npc" | "custom";
  startYear: number;
  startWeek?: number;
  endYear: number | null;
  endWeek?: number;
  status: "dating" | "engaged" | "married" | "ex";
  isPublic: boolean;
  image?: string;
}

export interface Kid {
  id: string;
  name: string;
  birthDate: GameDate;
  isArtist: boolean;
  parentName?: string;
}

export interface Pregnancy {
  partnerName: string;
  conceptionDate: GameDate;
  revealed: boolean;
}

export interface RedditComment {
  id: string;
  author: string;
  text: string;
  upvotes: number;
  timeAgo: string;
  replies?: RedditComment[];
}

export interface RedditPost {
  id: string;
  author: string;
  timeAgo: string;
  title: string;
  content: string;
  upvotes: number;
  commentCount: number;
  image: string | null;
  comments?: RedditComment[];
}


export interface CryptoCoin {
  id: string;
  name: string;
  ticker: string;
  logo: string;
  launchPrice: number;
  currentPrice: number;
  totalSupply: number;
  playerOwnedCoins: number;
  marketCap: number;
  priceHistory: number[];
  holders: number;
  tradingVolume: number; // 24h
  reputation: {
    hype: number;
    trust: number;
    utility: number;
  };
  isRugpulled?: boolean;
  utilityEnabled: {
    merch: boolean;
    tickets: boolean;
    fanClub: boolean;
    voting: boolean;
  };
  launchedDate: GameDate;
}

export interface ArtistData {
  cryptoCoin?: CryptoCoin;
  aboutBio?: string;
  aboutImages?: string[];
  careerStage?: 'neutral' | 'flop' | 'smash';
  flopEraLock?: boolean;
  isBlacklistedByLabel?: boolean;
  money: number;
  location?: "US" | "Canada" | "UK" | "Asia" | "Latin America";
  lastMoveDate?: GameDate;
  yearlyIncome?: number;
  hype: number;
  peakHype?: number;
  numberOneDebuts?: number;
  hasTweetedBillionTotalStreams?: boolean;
  publicImage: number;
  popularity: number;
  regionalPopularity?: {
    "US": number;
    "Canada": number;
    "UK": number;
    "Latin America": number;
    "Asia": number;
    "Africa": number;
  };
  endorsedParty?: "democrat" | "republican";
  endorsementCountThisYear?: number;
  lastEndorsementYear?: number;
  songs: Song[];
  releases: Release[];
  podcastPitchOffers?: PodcastPitchOffer[];
  monthlyListeners: number;
  peakMonthlyListeners?: number;
  lastFourWeeksStreams: number[];
  lastFourWeeksViews: number[];
  youtubeSubscribers: number;
  youtubePartnerProgram?: {
    isActive: boolean;
    eligibleViewsThisQuarter: number;
    lifetimeEarnings: number;
  };
  tiktokFollowers: number;
  isHiatus?: boolean;
  hiatusStartWeek?: number;
  hiatusStartYear?: number;
  hiatusAnnounced?: boolean;
  comebackAnticipation?: number;
  tiktokVideos: TikTokVideo[];
  tiktokPromotes?: TikTokPromoteOrder[];
  instagramFollowers?: number;
  instagramBio?: string;
  instagramLink?: string;
  instagramCommunityName?: string;
  instagramCommunityMembers?: number;
  instagramPosts?: InstagramPost[];
  instagramStories?: InstagramStory[];
  instagramReels?: InstagramReel[];
  instagramVerified?: boolean;
  instagramNpcFollowers?: string[];
  instagramFollowing?: string[];
  instagramFollowedBackEvents?: string[];
  spotifyFollowers?: number;
  videos: Video[];
  youtubeStoreUnlocked: boolean;
  recurringExpenses?: { id: string; name: string; cost: number; type: "monthly" | "weekly" }[];
  merch: MerchProduct[];
  merchStoreBanner: string | null;
  independentNameChanges?: number;
  relationships?: Relationship[];
  grammyBanner?: string;
  oscarBanner?: string;
  goldenGlobeBanner?: string;
  inbox: Email[];
  redditPosts?: RedditPost[];
  streamsThisMonth: number;
  viewsThisQuarter: number;
  subsThisQuarter: number;
  promotions: Promotion[];
  performedGigThisWeek: boolean;
  contract: Contract | null;
  contractHistory: Contract[];
  labelSubmissions: LabelSubmission[];
  customLabels: CustomLabel[];
  artistImages: any[]; // legacy string[], now XMedia[]
  coachella?: {
    year: number;
    status:
      | "none"
      | "invited"
      | "submitted"
      | "headliner"
      | "mid"
      | "small"
      | "opener";
    openingFor?: string;
    payoutSize?: number;
    stage?: string;
    setlist?: string[];
  };
  artistVideoThumbnails: any[]; // legacy string[], now XMedia[]
  paparazziPhotos: PaparazziPhoto[];
  tourPhotos: string[];
  tours: Tour[];
  pastRedCarpetLooks: RedCarpetLook[];
  streamsRemovedThisWeek?: number;
  manager: {
    id: string;
    contractEndDate: GameDate;
    autoDistributeAscap?: boolean;
    autoSubmitAwards?: boolean;
    autoSubmitCoachella?: boolean;
    autoMakeOfficialAudio?: boolean;
    autoDistributeFreeSongsToAscap?: boolean;
    autoGigRegion?: "Random" | "US" | "Canada" | "UK" | "Latin America" | "Asia" | "Africa";
  } | null;
  requestedPromoInterview?: boolean;
  lastPushToItunesWeek?: number;
  lastPushedSongId?: string;
  mySpaceData?: {
    profileSongId?: string;
    blogPosts: { title: string; content: string; year: number; week: number }[];
    bulletins: { content: string; year: number; week: number }[];
    mood?: string;
    generalInterests?: string;
    musicInterests?: string;
    profileViews?: number;
    top8Friends?: { id: string; name: string; image: string }[];
  };
  securityTeamId: string | null;
  xUsers: XUser[];
  selectedPlayerXUserId?: string;
  xPosts: XPost[];
  xUnreadMentions?: any;
  xChats: XChat[];
  xTrends: XTrend[];
  xFollowingIds: string[];
  xSuspensionStatus: XSuspensionStatus | null;
  // Spotify for Artists Stats
  followers: number;
  isSpotifyVerified?: boolean;
  saves: number;
  artistPick: {
    itemId: string;
    itemType: "song" | "release";
    message: string;
  } | null;
  listeningNow: number;
  streamsHistory: { date: GameDate; streams: number }[];
  firstChartEntry?: { songTitle: string; rank: number; date: GameDate } | null;
  playlistPlacements?: {
    playlistId: string;
    playlistName: string;
    coverArt: string;
    totalStreams: number;
    songStreams: Record<string, number>;
  }[];
  // Red Mic Pro
  redMicPro: RedMicProState;
  customContributorImages?: Record<string, string>;
  chartPredictionsSubscription?: boolean;
  albumPredictionsUnlocked?: boolean;
  salesBoost: number; // percentage
  isGoldTheme: boolean;
  // AMAs
  amaHistory: AmaAward[];
  hasSubmittedForAmaNewArtist: boolean;
  // GRAMMYs
  grammyHistory: GrammyAward[];
  hasSubmittedForBestNewArtist: boolean;
  // Oscars
  oscarHistory: OscarAward[];
  goldenGlobeHistory: GoldenGlobeAward[];
  // OnlyFans
  onlyfans: OnlyFansProfile | null;
  fanWarStatus: { targetArtistName: string; weeksRemaining: number } | null;
  // Soundtracks
  soundtrackOfferCount: number;
  offeredSoundtracks: Array<string>;
  weeksUntilNextSoundtrackOffer?: number;
  lastVogueOfferYear?: number;
  voguePhotoshoots?: VoguePhotoshoot[];
  weeksUntilNextFeatureOffer?: number;
  signedBrandDeals?: string[];
  activeBrandDeals?: { id: string; name: string; hashtag: string; brandImage: string; lastPostedWeek?: number }[];
  brandDealViolations?: number;
  signedVideoGames?: string[];
  kids?: Kid[];
  pregnancy?: Pregnancy | null;
  // Acting & IMDb
  talentAgencyId?: string;
  imdbProfile?: ImdbProfile;
  actingRoles?: ActingRole[];
  yearlyIncomeForTax?: number;
  taxPaidYear?: number;
  activeActingOffer?: ActingOffer | null;
  filmingGig?: (ActingRole & { remainingWeeks: number }) | null;
}

export interface RedCarpetLook {
  id: string;
  awardShow: string;
  year: number;
  imageUrl: string;
}

export interface GameState {
  timeMode?: "weekly" | "daily";
  disableEncounters?: boolean;
  disableLoadingScreens?: boolean;
  spotifySnapshotStyle?: "normal" | "ugly";
  activeEncounter?: ActiveEncounter | null;
  activeTmzPost?: XPost | null;
  cloudSaveId?: string;
  offlineMode?: boolean;
  difficultyMode?: "easy" | "original" | "normal" | "hard" | "extreme";
  careerMode: "solo" | "group" | null;
  soloArtist: Artist | null;
  group: Group | null;
  activeArtistId: string | null;
  extraPlayableArtists?: Artist[];
  kalshiAlbumChance?: number;

  artistsData: {
    [artistId: string]: ArtistData;
  };
  spotifyPlaylists: SpotifyPlaylist[];
  podcasts?: Podcast[];

  date: GameDate;
  currentView: GameView;
  activeTab: Tab;
  activeYoutubeChannel: "artist" | "label";

  npcs: NpcSong[];
  npcAlbums: NpcAlbum[];
  npcImages?: Record<string, string>;
  soundtrackAlbums: SoundtrackAlbum[];
  billboardHot100: ChartEntry[];
  billboardBubblingUnder25?: ChartEntry[];
  bubblingUnderHistory?: { [uniqueId: string]: number };
  billboardTopAlbums: AlbumChartEntry[];
  albumChartHistory: ChartHistory;
  chartHistory: ChartHistory;
  videoChartHistory: ChartHistory;
  spotifyGlobal: ChartEntry[];
  prevItunesChart?: { uniqueId: string; rank: number }[];
  spotifyGlobalMusicVideos: VideoChartEntry[];
  spotifyUS?: ChartEntry[];
  spotifyCanada?: ChartEntry[];
  spotifyUK?: ChartEntry[];
  spotifyLatin?: ChartEntry[];
  spotifyAsia?: ChartEntry[];
  spotifyAfrica?: ChartEntry[];
  hotPopSongs: ChartEntry[];
  biggestSalesWeekByYear?: {
    [year: number]: {
      artist: string;
      album: string;
      sales: number;
      coverArt: string;
    };
  };
  mostNumberOneDebutsRecord?: { artist: string; count: number; image: string };
  npcNumberOneDebuts?: Record<string, number>;
  hotRapRnb: ChartEntry[];
  electronicChart: ChartEntry[];
  countryChart: ChartEntry[];
  hotPopSongsHistory: ChartHistory;
  hotRapRnbHistory: ChartHistory;
  electronicChartHistory: ChartHistory;
  countryChartHistory: ChartHistory;
  radioOverallChart?: ChartEntry[];
  radioUrbanChart?: ChartEntry[];
  radioPopChart?: ChartEntry[];
  radioRhythmicChart?: ChartEntry[];
  radioCountryChart?: ChartEntry[];
  radioChristmasChart?: ChartEntry[];
  ukSinglesChart?: ChartEntry[];
  ukSinglesChartHistory?: ChartHistory;
  spotifyNewEntries: number;
  podcastCharts?: Podcast[];
  selectedVideoId: string | null;
  selectedReleaseId: string | null;
  selectedSoundtrackId: string | null;
  activeSubmissionId: string | null;
  activeGeniusOffer: { songId: string; emailId: string } | null;
  activeOnTheRadarOffer: { songId: string; emailId: string } | null;
  activeTrshdOffer: { songId: string; emailId: string } | null;
  activeEventInvitation: {
    emailId: string;
    eventName: string;
    eventType: string;
    hostName?: string;
    associatedSoundtrack?: string;
  } | null;
  activeInterviewOffer?: {
    releaseId: string;
    interviewType: "magazine" | "newspaper" | "tv";
    outletName: string;
    emailId: string;
  } | null;
  activeFallonOffer: {
    releaseId: string;
    offerType: "performance" | "interview" | "both";
    emailId: string;
    step?: "performance" | "interview";
  } | null;
  activeSoundtrackOffer: { albumTitle: string; emailId: string } | null;
  activeFifaOffer: { emailId: string; collabs: string[] } | null;
  fifaSingleScheduled?: { week: number; year: number; title: string; coverArt: string; collabs: string[] };
  activeFeatureOffer: {
    npcArtistName: string;
    payout: number;
    songQuality: number;
    promotion?: { name: string; durationWeeks: number };
    emailId: string;
  } | null;
  activeFeatureVideoOffer: {
    songId: string;
    npcArtistName: string;
    emailId: string;
  } | null;
  selectedXUserId: string | null;
  selectedXChatId: string | null;
  contractRenewalOffer: {
    labelId: string;
    isCustom?: boolean;
    artistId: string;
  } | null;
  activeTourId: string | null;
  viewingPastLabelId: string | null;
  activeVogueOffer: {
    magazine: "Vogue" | "Vogue Korea" | "Vogue Italy";
    emailId: string;
  } | null;
  // VMAs
  vmaSubmissions?: {
    artistId: string;
    category: string;
    itemId: string;
    itemName: string;
  }[];
  vmaCurrentYearNominations?: any[] | null;
  activeVmaRedCarpetOffer?: { emailId: string } | null;
  activeVmaPerformanceOffer?: { emailId: string } | null;
  // AMAs
  amaSubmissions: {
    artistId: string;
    category: AmaCategoryName;
    itemId: string;
    itemName: string;
  }[];
  amaCurrentYearNominations: AmaCategory[] | null;
  activeAmaPerformanceOffer: { emailId: string } | null;
  activeAmaRedCarpetOffer: { emailId: string } | null;
  activePromoInterviewOffer: {
    emailId: string;
    source: PromoInterviewSource;
  } | null;
  // Custom Award Show
  customAwardShow?: {
    name: string;
    submissionWeek: number;
    nominationWeek: number;
    ceremonyWeek: number;
    categories: {
      id: string;
      name: string;
      eligibility: "album" | "song" | "artist";
      genreFilter?: string;
    }[];
  };
  customAwardSubmissions?: {
    artistId: string;
    categoryId: string;
    itemId: string;
    itemName: string;
  }[];
  customAwardNominations?: {
    categoryId: string;
    nominees: { itemId: string; itemName: string; artistName: string; isWinner?: boolean; points?: number; }[];
  }[] | null;
  // GRAMMYs
  grammySubmissions: {
    artistId: string;
    category: GrammyAward["category"];
    itemId: string;
    itemName: string;
  }[];
  grammyCurrentYearNominations: GrammyCategory[] | null;
  activeGrammyPerformanceOffer: { emailId: string } | null;
  activeGrammyRedCarpetOffer: { emailId: string } | null;
  // Oscars
  
  goldenGlobeSubmissions: {
    artistId: string;
    category: GoldenGlobeAward["category"];
    itemId: string;
    itemName: string;
  }[];
  goldenGlobeCurrentYearNominations: GoldenGlobeCategory[] | null;

  oscarSubmissions: {
    artistId: string;
    category: "Best Original Song" | "Best Actor/Actress" | "Best Supporting Actor/Actress" | "Best Voice Actor/Actress";
    itemId: string;
    itemName: string;
  }[];
  oscarCurrentYearNominations: OscarCategory[] | null;
  activeOscarPerformanceOffer: { emailId: string } | null;
  activeOscarRedCarpetOffer: { emailId: string } | null;
  activeMoviePremiereOffer: { roleId: string; roleTitle: string; } | null;
  activeGoldenGlobeRedCarpetOffer: { emailId: string } | null;
}

export interface EncounterChoice {
  label: string;
  tweetTemplate?: string;
  authorName?: string;
  isTMZ?: boolean;
  publicImageEffect: number;
  hypeEffect: number;
  popularityEffect?: number;
  moneyEffect?: number;
  tourAction?: { action: "CANCEL"; tourId: string };
}

export interface ActiveEncounter {
  id: string;
  text: string;
  requiresImage: boolean;
  choices: EncounterChoice[];
}

export type GameAction =
  | { type: "SYNC_SERVER_DATE"; payload: { year: number; week: number; day?: number } }
  | { type: "UPDATE_ARTIST_FUNDS"; payload: number }
  | { type: "UPDATE_VIDEO"; payload: { id: string; updates: Partial<Video> } }
  | { type: "LAUNCH_CRYPTO_COIN"; payload: { name: string; ticker: string; logo: string; launchPrice: number; totalSupply: number; cost: number; playerPercent?: number } }
  | { type: "BUY_CRYPTO"; payload: { amount: number; cost: number } }
  | { type: "SELL_CRYPTO"; payload: { amount: number; revenue: number } }
  | { type: "BURN_CRYPTO"; payload: { amount: number } }
  | { type: "MARKET_CRYPTO"; payload: { cost: number; platform: "x" } }
  | { type: "TOGGLE_CRYPTO_UTILITY"; payload: { utility: "merch" | "tickets" | "fanClub" | "voting" } }
  | { type: "RUGPULL_CRYPTO" }
  | { type: "UPDATE_CUSTOM_IMAGES"; payload: Record<string, string> }
  | { type: "UPDATE_RELEASE_REVIEW_SCORE"; payload: { releaseId: string; score: number } }
  | { type: "SHRED_CONTRACT" }
  | { type: "SET_CAREER_STAGE"; payload: { stage: 'neutral' | 'flop' | 'smash' } }
  | { type: "TOGGLE_FLOP_ERA_LOCK" }
  | { type: "CREATE_CUSTOM_AWARD_SHOW"; payload: { customAwardShow: NonNullable<GameState['customAwardShow']> } }
  | { type: "ADD_CUSTOM_FEATURE"; payload: { name: string; cost: number } }
  | { type: "REMOVE_CUSTOM_FEATURE"; payload: { name: string } }
  | { type: "EDIT_X_PROFILE"; payload: { userId: string; name: string; bio: string; headerImage?: string; avatar?: string } }
  | { type: "SUBMIT_CUSTOM_AWARDS"; payload: { submissions: NonNullable<GameState['customAwardSubmissions']> } }
  | { type: "JUDGE_CUSTOM_AWARDS"; payload: { nominations: NonNullable<GameState['customAwardNominations']> } }
  | { type: "SET_ACTIVE_TMZ_POST"; payload: XPost | null }
  | {
      type: "RESOLVE_ENCOUNTER";
      payload: { choice: EncounterChoice; imageUrl: string };
    }
  | { type: "TOGGLE_ENCOUNTERS" }
  | { type: "TOGGLE_LOADING_SCREENS" }
  | { type: "TOGGLE_SPOTIFY_SNAPSHOT_STYLE"; payload: "normal" | "ugly" }
  | {
      type: "START_SOLO_GAME";
      payload: {
        artist: Artist;
        startYear: number;
        difficultyMode?: "easy" | "original" | "normal" | "hard" | "extreme";
        timeMode?: "weekly" | "daily";
      };
    }
  | {
      type: "START_GROUP_GAME";
      payload: {
        group: Group;
        startYear: number;
        difficultyMode?: "easy" | "original" | "normal" | "hard" | "extreme";
        timeMode?: "weekly" | "daily";
      };
    }
  | { type: "SUBSCRIBE_CHART_PREDICTIONS"; payload: { cost: number } }
  | { type: "UNLOCK_ALBUM_PREDICTIONS"; payload: { cost: number } }
  | {
      type: "RELEASE_ITUNES_VERSION";
      payload: { songId: string; title: string; coverArt: string };
    }
  | { type: "CHANGE_VIEW"; payload: GameView }
  | { type: "SUBMIT_COACHELLA"; payload: { emailId: string } }
  | { type: "SET_COACHELLA_SETLIST"; payload: { songIds: string[]; emailId?: string } }
  | { type: "CHANGE_TAB"; payload: Tab }
  | { type: "SWITCH_YOUTUBE_CHANNEL"; payload: "artist" | "label" }
  | { type: "APPLY_YOUTUBE_PARTNER" }
  | { type: "CHANGE_ACTIVE_ARTIST"; payload: string }
  | {
      type: "TRANSFER_MONEY";
      payload: { fromId: string; toId: string; amount: number };
    }
  | { type: "PROGRESS_WEEK" }
  | { type: "RECORD_SONG"; payload: { song: Song; cost: number } }
  | { type: "CREATE_REMIX_PACK"; payload: { songs: Song[]; cost: number } }
  | { type: "RELEASE_PROJECT"; payload: { release: Release } }
  | { type: "CREATE_LIVE_ALBUM"; payload: { tourId: string, coverArt: string } }
  | { type: "RELEASE_TOUR_DOCUMENTARY"; payload: { tourId: string, coverUrl: string } }
  | {
      type: "ADD_REVIEW";
      payload: {
        releaseId: string;
        review: Review;
        cost: number;
        artistId: string;
      };
    }
  | { type: "CREATE_VIDEO"; payload: { video: Video; cost: number } }
  | { type: "ADD_MERCH"; payload: { item: MerchProduct; cost?: number } }
  | {
      type: "RESTOCK_MERCH";
      payload: { id: string; amount: number; cost?: number };
    }
  | { type: "UPDATE_MERCH_PRICE"; payload: { id: string; price: number } }
  | { type: "REMOVE_MERCH"; payload: { id: string } }
  | { type: "UPDATE_MERCH_BANNER"; payload: string }
  | { type: "UPDATE_SNAPSHOT_BANNER"; payload: { releaseId: string; bannerUrl: string } }
  | { type: "UPDATE_GRAMMY_BANNER"; payload: string }
  | { type: "UPDATE_OSCAR_BANNER"; payload: string }
  | { type: "MARK_INBOX_READ" }
  | { type: "TAKE_DOWN_SONG"; payload: { songId: string } }
  | { type: "TAKE_DOWN_RELEASE"; payload: { releaseId: string } }
  | { type: "UPDATE_IMDB_PROFILE"; payload: { bio: string; birthDate: string } }
  | { type: "REQUEST_ACTING_GIG"; payload: { type: "Movie" | "TV Show" | "Voice Acting" } }
  | { type: "ACCEPT_ACTING_OFFER"; payload: { offerId: string } }
  | { type: "DECLINE_ACTING_OFFER"; payload: { offerId: string } }
  | { type: "SET_ACTING_TRAILER_URL"; payload: { roleId: string; trailerUrl: string } }
  | { type: "SET_ACTING_COVER_URL"; payload: { roleId: string; coverUrl: string } }
  | { type: "ATTEND_ACTING_PREMIERE"; payload: { roleId: string } }
  | { type: "DECLINE_ACTING_PREMIERE"; payload: { roleId: string } }
  | { type: "ACCEPT_MOVIE_PREMIERE_RED_CARPET"; payload: { emailId: string, lookUrl: string, location?: string } }
  | { type: "SIGN_TALENT_AGENCY"; payload: { agencyId: string } }
  | { type: "LEAVE_TALENT_AGENCY" }
  | {
      type: "TOGGLE_APPLE_MUSIC_EXPANDED_COVER";
      payload: { releaseId: string; enabled: boolean };
    }
  | {
      type: "MARK_APPLE_MUSIC_ESSENTIAL";
      payload: { releaseId: string; reviewText: string };
    }
  | {
      type: "UPDATE_ITUNES_PRICE";
      payload: { songId: string; newPriceStr: string };
    }
  | { type: "BUY_BACK_SONG"; payload: { songId: string; cost: number } }
  | { type: "BUY_BACK_RELEASE"; payload: { releaseId: string; cost: number } }
  | { type: "UPLOAD_TO_STREAMING"; payload: { songId: string; cost: number } }
  | { type: "REMASTER_SONG"; payload: { songId: string; qualityBoost: number; cost: number } }
  | {
      type: "SELL_RIGHTS";
      payload: {
        itemType: "song" | "release";
        id: string;
        percent: number;
        labelId: string;
        value: number;
      };
    }
  | {
      type: "BUY_RIGHTS";
      payload: {
        itemType: "song" | "release";
        id: string;
        percentToBuy: number;
        cost: number;
      };
    }
  | { type: "START_PROMOTION"; payload: { promotion: Promotion } }
  | { type: "CANCEL_PROMOTION"; payload: { promotionId: string } }
  | { type: "SELECT_VIDEO"; payload: string | null }
  | { type: "SELECT_RELEASE"; payload: string | null }
  | { type: "PERFORM_GIG"; payload: { cash: number; hype: number } }
  | { type: "SIGN_CONTRACT"; payload: { contract: Contract } }
  | { type: "END_CONTRACT" }
  | {
      type: "SIGN_NPC_TO_LABEL";
      payload: {
        npcName: string;
        advance: number;
        royaltyRate: number;
        durationWeeks: number;
      };
    }
  | { type: "RELEASE_NPC_FROM_LABEL"; payload: { npcName: string } }
  | { type: "SUBMIT_TO_LABEL"; payload: { submission: LabelSubmission } }
  | {
      type: "EDIT_SUBMISSION_DATE";
      payload: { submissionId: string; newDate: GameDate };
    }
  | { type: "GO_TO_LABEL_PLAN"; payload: { submissionId: string } }
  | {
      type: "PLAN_LABEL_RELEASE";
      payload: {
        submissionId: string;
        singles: { songId: string; releaseDate: GameDate; singleType?: 'lead' | 'standalone' | 'interlude'; eraImages?: string[]; }[];
        projectReleaseDate: GameDate;
        projectSingleType?: 'lead' | 'standalone' | 'interlude';
        projectEraImages?: string[];
      };
    }
  | {
      type: "UPLOAD_BILLIONS_CLUB_IMAGE";
      payload: { emailId: string; songId: string; imageUrl: string };
    }
  | {
      type: "ACCEPT_GENIUS_OFFER";
      payload: { songId: string; emailId: string };
    }
  | { type: "CREATE_GENIUS_INTERVIEW"; payload: { video: Video } }
  | { type: "CANCEL_GENIUS_OFFER" }
  | {
      type: "ACCEPT_ONTHERADAR_OFFER";
      payload: { songId: string; emailId: string };
    }
  | { type: "CREATE_ONTHERADAR_PERFORMANCE"; payload: { video: Video } }
  | { type: "CANCEL_ONTHERADAR_OFFER" }
  | { type: "ACCEPT_TRSHD_OFFER"; payload: { songId: string; emailId: string } }
  | { type: "CREATE_TRSHD_PERFORMANCE"; payload: { video: Video } }
  | { type: "CANCEL_TRSHD_OFFER" }
  | {
      type: "ACCEPT_FALLON_OFFER";
      payload: {
        releaseId: string;
        offerType: "performance" | "interview" | "both";
        emailId: string;
      };
    }
  | { type: "CREATE_FALLON_VIDEO"; payload: { video: Video; songId?: string } }
  | { type: "CANCEL_FALLON_OFFER" }
  | { type: "ADD_ARTIST_IMAGE"; payload: string }
  | { type: "DELETE_ARTIST_IMAGE"; payload: string }
  | { type: "DELETE_INSTAGRAM_POST"; payload: { postId: string } }
  | { type: "DELETE_INSTAGRAM_REEL"; payload: { reelId: string } }
  | { type: "DELETE_TIKTOK_VIDEO"; payload: { videoId: string } }
  | { type: "SET_APP_ORDER"; payload: { appOrder: string[] } }
  | { type: "ADD_ARTIST_VIDEO"; payload: string }
  | { type: "DELETE_ARTIST_VIDEO"; payload: string }
  | { type: "ADD_PAPARAZZI_PHOTO"; payload: { photo: PaparazziPhoto } }
  | { type: "DELETE_PAPARAZZI_PHOTO"; payload: string }
  | {
      type: "ANSWER_POPBASE_QUESTION";
      payload: { emailId: string; answer: string };
    }
  | { type: "COMBINE_REMIXES"; payload: { originalSongId: string } }
  | {
      type: "CHANGE_STAGE_NAME";
      payload: { newName: string; cost?: number; contractId?: string };
    }
  | {
      type: "POST_ON_X";
      payload: {
        content: string;
        image?: string;
        postType: "normal" | "fanWar" | "push" | "announce" | "endorse";
        targetId?: string;
        songId?: string;
        quoteOf?: XPost;
        announceItem?: {
          type: "project" | "single";
          submissionId: string;
          songId?: string;
        };
      };
    }
  | {
      type: "POST_ON_MYSPACE";
      payload: {
        type: "bulletin" | "blog" | "profile_song" | "push";
        content?: string;
        songId?: string;
      };
    }
  | {
      type: "UPDATE_MYSPACE_PROFILE";
      payload: {
        mood?: string;
        generalInterests?: string;
        musicInterests?: string;
        top8Friends?: { id: string; name: string; image: string }[];
      };
    }
  | {
      type: "REPLY_TO_X_POST";
      payload: {
        postId: string;
        content: string;
        image?: string;
        authorId: string;
      };
    }
  | { type: "VIEW_X_PROFILE"; payload: string }
  | {
      type: "CREATE_X_ACCOUNT";
      payload: { username: string; name: string; avatar: string; bio?: string };
    }
  | {
      type: "BUY_X_VERIFICATION";
      payload: { accountId: string; tier: "blue" | "gold"; cost: number };
    }
  | { type: "REQUEST_SPOTIFY_VERIFICATION" }
  | {
      type: "REVEAL_SINGLE_TRACK_COUNTDOWN";
      payload: { submissionId: string; songId: string };
    }
  | {
      type: "REVEAL_TRACKLIST";
      payload: {
        submissionId: string;
        tracklistImageUrl?: string;
        tracklist?: string[];
      };
    }
  | {
      type: "UPLOAD_COUNTDOWN_IMAGE";
      payload: { submissionId: string; imageUrl: string };
    }
  | {
      type: "START_X_SPACE";
      payload: { topic: string; recordSpace: boolean; enableVideo: boolean };
    }
  | { type: "END_X_SPACE"; payload: undefined }
  | {
      type: "PROMOTE_SONG_ON_X_SPACE";
      payload: { songId: string; listeners: number };
    }
  | { type: "DELETE_X_ACCOUNT"; payload: { accountId: string } }
  | { type: "SELECT_X_ACCOUNT"; payload: { accountId: string } }
  | { type: "VIEW_X_CHAT"; payload: string }
  | { type: "FOLLOW_X_USER"; payload: string }
  | { type: "UNFOLLOW_X_USER"; payload: string }
  | { type: "SEND_X_MESSAGE"; payload: { chatId: string; message: XMessage } }
  | { type: "APPEAL_X_SUSPENSION" }
  | {
      type: "ENABLE_X_SUBSCRIPTIONS";
      payload: { price: number; perks: string[] };
    }
  | { type: "ENABLE_X_REVENUE_SHARING" }
  | {
      type: "SET_ARTIST_PICK";
      payload: {
        itemId: string;
        itemType: "song" | "release";
        message: string;
      };
    }
  | { type: "PITCH_TO_PLAYLIST"; payload: { songId: string } }
  | { type: "PITCH_TO_APPLE_MUSIC_PLAYLIST"; payload: { songId: string } }
  | {
      type: "CREATE_CUSTOM_LABEL";
      payload: { label: CustomLabel; cost: number; membersToSign: string[] };
    }
  | {
      type: "SET_EXCLUSIVE_LICENSE";
      payload: {
        customLabelId: string;
        exclusiveLicenseId: Label["id"] | undefined;
      };
    }
  | { type: "DELETE_SONG"; payload: { songId: string } }
  | { type: "TOGGLE_VAULT_SONG"; payload: { songId: string } }
  | { type: "CANCEL_SCHEDULED_RELEASE"; payload: { submissionId: string } }
  | { type: "GO_TO_ALBUM_PROMO"; payload: { submissionId: string } }
  | {
      type: "LAUNCH_COUNTDOWN_PAGE";
      payload: { submissionId: string; cost: number };
    }
  | {
      type: "REQUEST_GENIUS_PROMO";
      payload: { submissionId: string; songId: string; cost: number };
    }
  | {
      type: "REQUEST_FALLON_PROMO";
      payload: { submissionId: string; songId: string; cost: number };
    }
  | { type: "START_HIATUS" }
  | { type: "ANNOUNCE_HIATUS" }
  | { type: "END_HIATUS_COMEBACK"; payload?: { isGood: boolean } }
  | { type: "RESET_GAME" }
  | { type: "LOAD_GAME"; payload: GameState }
  | {
      type: "UNLOCK_RED_MIC_PRO";
      payload: { type: "yearly" | "lifetime" | "code"; cost: number };
    }
  | {
      type: "UPDATE_SONG_QUALITY";
      payload: { songId: string; newQuality: number };
    }
  | {
      type: "UPDATE_SONG_TRAIT";
      payload: { songId: string; newTrait: any };
    }
  | { type: "SET_MONEY"; payload: { newAmount: number } }
  | { type: "TOGGLE_GOLD_THEME"; payload: { enabled: boolean } }
  | { type: "SET_SALES_BOOST"; payload: { newBoost: number } }
  | {
      type: "UPDATE_ABOUT_SONG_TEXT";
      payload: { songId: string; text: string };
    }
  | {
      type: "UPDATE_WIKIPEDIA_SUMMARY";
      payload: { releaseId: string; summary: string };
    }
  | { type: "TOGGLE_OFFLINE_MODE" }
  | { type: "CHANGE_LOCATION"; payload: { location: "US" | "Canada" | "UK" | "Asia" | "Latin America" } }
  | { type: "PRO_SIGN_LABEL"; payload: { labelId: Label["id"] } }
  | { type: "GO_TO_GRAMMY_SUBMISSIONS"; payload: { emailId: string } }
  | {
      type: "SUBMIT_FOR_GRAMMYS";
      payload: { submissions: GameState["grammySubmissions"]; emailId: string };
    }
  | { type: "ACCEPT_GRAMMY_PERFORMANCE"; payload: { emailId: string } }
  | { type: "CREATE_GRAMMY_PERFORMANCE"; payload: { video: Video } }
  | { type: "DECLINE_GRAMMY_PERFORMANCE"; payload: { emailId: string } }
  | {
      type: "ACCEPT_GRAMMY_RED_CARPET";
      payload: { emailId: string; lookUrl: string };
    }
  | { type: "DECLINE_GRAMMY_RED_CARPET"; payload: { emailId: string } }
  | { type: "GO_TO_AMA_SUBMISSIONS"; payload: { emailId: string } }
  | {
      type: "SUBMIT_FOR_AMAS";
      payload: { submissions: GameState["amaSubmissions"]; emailId: string };
    }
  | { type: "ACCEPT_AMA_PERFORMANCE"; payload: { emailId: string } }
  | { type: "CREATE_AMA_PERFORMANCE"; payload: { video: Video } }
  | { type: "DECLINE_AMA_PERFORMANCE"; payload: { emailId: string } }
  | {
      type: "ACCEPT_AMA_RED_CARPET";
      payload: { emailId: string; lookUrl: string };
    }
  | { type: "DECLINE_AMA_RED_CARPET"; payload: { emailId: string } }
  | {
      type: "ACCEPT_VMA_RED_CARPET";
      payload: { emailId: string; lookUrl: string };
    }
  | { type: "DECLINE_VMA_RED_CARPET"; payload: { emailId: string } }
  | { type: "GO_TO_OSCAR_SUBMISSIONS"; payload: { emailId: string } }
  | {
      type: "SUBMIT_FOR_OSCARS";
      payload: { submissions: GameState["oscarSubmissions"]; emailId: string };
    }
  | { type: "ACCEPT_OSCAR_PERFORMANCE"; payload: { emailId: string } }
  | { type: "CREATE_OSCAR_PERFORMANCE"; payload: { video: Video } }
  | { type: "DECLINE_OSCAR_PERFORMANCE"; payload: { emailId: string } }
  | {
      type: "ACCEPT_OSCAR_RED_CARPET";
      payload: { emailId: string; lookUrl: string };
    }
  | { type: "DECLINE_OSCAR_RED_CARPET"; payload: { emailId: string } }
  | { type: "RENEW_CONTRACT" }
  | { type: "GO_INDEPENDENT" }
  | {
      type: "UPDATE_ARTIST_IMAGE";
      payload: { artistId: string; newImage: string };
    }
  | { type: "UPDATE_ABOUT_PROFILE"; payload: { bio: string; images: string[] } }
  | { type: "CREATE_ONLYFANS_PROFILE"; payload: { profile: OnlyFansProfile } }
  | { type: "UPDATE_ONLYFANS_SETTINGS"; payload: { price: number } }
  | {
      type: "CREATE_INSTAGRAM_POST";
      payload: { imageUrls: string[]; caption: string };
    }
  | {
      type: "CREATE_INSTAGRAM_STORY";
      payload: { imageUrl: string };
    }
  | {
      type: "CREATE_INSTAGRAM_REEL";
      payload: { videoUrl: string; caption: string };
    }
  | {
      type: "EDIT_INSTAGRAM_PROFILE";
      payload: { bio: string; link: string };
    }
  | {
      type: "CREATE_INSTAGRAM_COMMUNITY";
      payload: { name: string };
    }
  | { type: "FOLLOW_INSTAGRAM_NPC"; payload: { npcName: string } }
  | { type: "UNFOLLOW_INSTAGRAM_NPC"; payload: { npcName: string } }
  | { type: "CREATE_ONLYFANS_POST"; payload: { post: OnlyFansPost } }
  | {
      type: "ACCEPT_ONLYFANS_REQUEST";
      payload: { emailId: string; payout: number };
    }
  | {
      type: "ACCEPT_FEATURE_VIDEO_OFFER";
      payload: { songId: string; emailId: string; npcArtistName: string };
    }
  | { type: "CANCEL_FEATURE_VIDEO_OFFER" }
  | { type: "CREATE_FEATURE_VIDEO"; payload: { thumbnail: string } }
  | { type: "SET_PRO_HYPE_MODE"; payload: "locked" | "manual" }
  | { type: "SET_HYPE"; payload: number }
  | { type: "SET_PUBLIC_IMAGE"; payload: number }
  | { type: "SIGN_BRAND_DEAL"; payload: { id: string; cash: number; name?: string; hashtag?: string; brandImage?: string } }
  | { type: "SIGN_VIDEO_GAME_DEAL"; payload: { id: string; cash: number } }
  | { type: "SET_POPULARITY"; payload: number }
  | { type: "SET_REGIONAL_POPULARITY"; payload: { region: string, popularity: number } }
  | {
      type: "UPDATE_RELEASE_COVER_ART";
      payload: { releaseId: string; newCoverArt: string };
    }
  | {
      type: "ACCEPT_SOUNDTRACK_OFFER";
      payload: { albumTitle: string; emailId: string };
    }
  | {
      type: "CREATE_SOUNDTRACK_CONTRIBUTION";
      payload: { albumTitle: string; coverArt: string; songIds: string[] };
    }
  | { type: "CANCEL_SOUNDTRACK_OFFER" }
  | { type: "ACCEPT_FEATURE_OFFER"; payload: FeatureOffer }
  | { type: "CANCEL_FEATURE_OFFER" }
  | {
      type: "CREATE_FEATURE_SONG";
      payload: { songTitle: string; coverArt: string; releaseDate: GameDate };
    }
  | { type: "CREATE_TOUR"; payload: Tour }
  | { type: "START_TOUR"; payload: { tourId: string } }
  | { type: "CANCEL_TOUR"; payload: { tourId: string } }
  | { type: "EDIT_TOUR_SETLIST"; payload: { tourId: string; newSetlist: string[]; addedSongs: string[]; removedSongs: string[] } }
  | { type: "COLLECT_PRESALE"; payload: { tourId: string } }
  | {
      type: "ADD_PRESALE_ALLOCATION";
      payload: { tourId: string; percentage: number };
    }
  | { type: "ADD_TOUR_LEG"; payload: { tourId: string; venues: Venue[] } }
  | { type: "UPLOAD_TOUR_PHOTO"; payload: string }
  | { type: "SELECT_SOUNDTRACK"; payload: string | null }
  | { type: "SELECT_TOUR"; payload: string | null }
  | {
      type: "HIRE_MANAGER";
      payload: { managerId: string; contractYears: number };
    }
  | {
      type: "TOGGLE_MANAGER_SETTING";
      payload: {
        setting:
          | "autoDistributeAscap"
          | "autoSubmitAwards"
          | "autoSubmitCoachella"
          | "autoMakeOfficialAudio"
          | "autoDistributeFreeSongsToAscap";
      };
    }
  | {
      type: "SET_MANAGER_GIG_REGION";
      payload: "Random" | "US" | "Canada" | "UK" | "Latin America" | "Asia" | "Africa";
    }
  | {
      type: "BUY_PLAYLIST_ENTRY";
      payload: {
        songId: string;
        playlistId: string;
        position: number;
        cost: number;
      };
    }
  | { type: "FIRE_MANAGER" }
  | { type: "HIRE_SECURITY"; payload: { teamId: string } }
  | { type: "FIRE_SECURITY" }
  | {
      type: "UPDATE_NPC_X_USER";
      payload: { userId: string; newName: string; newUsername: string };
    }
  | { type: "VIEW_PAST_LABEL_CHANNEL"; payload: string }
  | {
      type: "ACCEPT_EVENT_INVITATION";
      payload: {
        emailId: string;
        eventName: string;
        eventType: string;
        hostName?: string;
        associatedSoundtrack?: string;
      };
    }
  | { type: "CONFIRM_EVENT_ATTENDANCE"; payload: { imageUrl: string } }
  | { type: "DECLINE_EVENT_INVITATION"; payload: { emailId: string } }
  | {
      type: "UPDATE_NPC_AVATAR";
      payload: { userId: string; newAvatar: string };
    }
  | {
      type: "UPDATE_NPC_COVER";
      payload: { artistName: string; newCover: string };
    }
  | {
      type: "ACCEPT_VOGUE_OFFER";
      payload: {
        magazine: "Vogue" | "Vogue Korea" | "Vogue Italy";
        emailId: string;
      };
    }
  | { type: "CANCEL_VOGUE_OFFER" }
  | { type: "SET_CLOUD_SAVE_ID"; payload: string }
  | { type: "CREATE_VOGUE_FEATURE"; payload: { photoshoot: VoguePhotoshoot } }
  | {
      type: "START_DATING";
      payload: { partnerName: string; partnerType: "npc" | "custom" };
    }
  | {
      type: "REVEAL_RELATIONSHIP";
      payload: { relationshipId: string; outlet: "popbase" | "tmz" };
    }
  | {
      type: "ADVANCE_RELATIONSHIP";
      payload: { relationshipId: string; newStatus: "engaged" | "married" };
    }
  | { type: "BREAK_UP"; payload: { relationshipId: string } }
  | { type: "GET_BACK_WITH_EX"; payload: { relationshipId: string } }
  | {
      type: "UPDATE_RELATIONSHIP_IMAGE";
      payload: { relationshipId: string; image: string };
    }
  | { type: "START_PREGNANCY"; payload: { partnerName: string } }
  | { type: "REVEAL_PREGNANCY" }
  | { type: "GIVE_BIRTH"; payload: { childName: string } }
  | { type: "START_KID_CAREER"; payload: { kidId: string } }
  | { type: "REQUEST_PROMO_INTERVIEW" }
  | {
      type: "ACCEPT_PROMO_INTERVIEW";
      payload: { emailId: string; source: PromoInterviewSource };
    }
  | { type: "DECLINE_PROMO_INTERVIEW"; payload: { emailId: string } }
  | {
      type: "SUBMIT_PROMO_INTERVIEW";
      payload: { songId: string; thumbnail: string; topics: string[] };
    }
  | { type: "MARK_EMAIL_OFFER_ANSWERED"; payload: { emailId: string } }
  | {
      type: "RESPOND_TO_CHEATING";
      payload: {
        response: "break_up" | "forgive" | "ignore";
        relationshipId: string;
      };
    }
  | {
      type: "CREATE_TIKTOK";
      payload: { content: string; songId?: string; thumbnail?: string };
    }
  | {
      type: "UPLOAD_CANVAS";
      payload: { songId: string; videoUrl: string; hashtags: string[] };
    }
  | {
      type: "UPLOAD_ALBUM_CANVAS";
      payload: { releaseId: string; videoUrl: string; hashtags: string[] };
    }
  | { type: "SUBMIT_TO_RADIO"; payload: { songId: string; format: string; region?: "US" | "UK" } }
  | {
      type: "WITHDRAW_FROM_RADIO";
      payload: { songId: string; format: string; region?: "US" | "UK" };
    }
  | {
      type: "PROMOTE_RADIO";
      payload: { songId: string; format: string; amount: number; source: "personal" | "label" };
    };
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

export type StreamLocation = 'Disneyworld' | 'Normal Stream' | 'LA Pop Up' | 'Petting Zoo';

export interface TwitchStreamSchedule {
    id: string;
    streamer: string;
    location: StreamLocation;
    songId: string;
    promoBanner: string;
    ytThumbnail: string;
    scheduledDate: GameDate;
    announceDate: GameDate;
    hasAnnounced: boolean;
    hasStreamed: boolean;
}
