import React, { useState, useMemo, useRef } from "react";
import { useGame, formatNumber } from "../context/GameContext";
import { Release, Song, Artist, Group, GameDate } from "../types";
import { PLAYLIST_PITCH_COST, NPC_ARTIST_IMAGES } from "../constants";
import HomeIcon from "./icons/HomeIcon";
import MusicNoteIcon from "./icons/MusicNoteIcon";
import UserGroupIcon from "./icons/UserGroupIcon";
import UserCircleIcon from "./icons/UserCircleIcon";
import ChevronRightIcon from "./icons/ChevronRightIcon";
import ArrowLeftIcon from "./icons/ArrowLeftIcon";
import DotsHorizontalIcon from "./icons/DotsHorizontalIcon";
import BanknotesIcon from "./icons/BanknotesIcon";

type S4ATab = "Home" | "Music" | "Audience" | "Profile" | "Monetization";

// --- NEW UPCOMING RELEASE DETAIL VIEW ---
const S4AUpcomingReleaseDetailView: React.FC<{
  submissionId: string;
  onBack: () => void;
}> = ({ submissionId, onBack }) => {
  const { dispatch, activeArtistData } = useGame();
  const [tracklistImageUrl, setTracklistImageUrl] = useState("");
  const [countdownImageUrl, setCountdownImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tracklistInputRef = useRef<HTMLInputElement>(null);

  if (!activeArtistData) return null;

  const { labelSubmissions, money } = activeArtistData;
  const submission = labelSubmissions.find((s) => s.id === submissionId);

  if (!submission) {
    onBack();
    return null;
  }

  const release = submission.release;
  const isLaunched = submission.hasCountdownPage;
  const hasEnoughListeners = activeArtistData.monthlyListeners >= 10000;

  const handleLaunch = () => {
    if (hasEnoughListeners && !isLaunched) {
      dispatch({
        type: "LAUNCH_COUNTDOWN_PAGE",
        payload: { submissionId: submission.id, cost: 0 },
      });
    }
  };

  const handleRevealTracklist = () => {
    const tracktitles =
      submission.release.songIds.map((songId) => {
        const song = activeArtistData.songs.find((x) => x.id === songId);
        return song?.title || "Unknown Track";
      }) || [];
    dispatch({
      type: "REVEAL_TRACKLIST",
      payload: {
        submissionId: submission.id,
        tracklistImageUrl: tracklistImageUrl || undefined,
        tracklist: tracktitles,
      },
    });
  };

  const handleUploadCountdownImage = () => {
    if (countdownImageUrl) {
      dispatch({
        type: "UPLOAD_COUNTDOWN_IMAGE",
        payload: { submissionId: submission.id, imageUrl: countdownImageUrl },
      });
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setter(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-800 via-stone-900 to-black text-white h-full overflow-y-auto p-4 flex flex-col">
      <header className="flex justify-between items-center flex-shrink-0">
        <button onClick={onBack} className="p-2 -m-2">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <button className="p-2 -m-2">
          <DotsHorizontalIcon className="w-6 h-6" />
        </button>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
        <img
          src={release.coverArt}
          alt={release.title}
          className="w-64 h-64 rounded-lg shadow-2xl shadow-black/50"
        />
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            {release.title}
          </h1>
          <p className="text-zinc-400 mt-1">
            Releasing: W{submission.projectReleaseDate!.week},{" "}
            {submission.projectReleaseDate!.year}
          </p>
        </div>
        <div className="pt-8 w-full max-w-sm space-y-4 pb-20">
          <button
            onClick={handleLaunch}
            disabled={isLaunched || !hasEnoughListeners}
            className="w-full bg-blue-500 text-white font-bold p-4 rounded-lg disabled:bg-zinc-600 disabled:opacity-70 flex flex-col items-center"
          >
            <span>
              {isLaunched
                ? "Countdown Page Launched"
                : hasEnoughListeners
                  ? `Launch Countdown Page`
                  : "Requires 10K Monthly Listeners"}
            </span>
            {!isLaunched && hasEnoughListeners && (
              <span className="text-sm font-normal opacity-80">(Free)</span>
            )}
          </button>
          {!hasEnoughListeners && !isLaunched && (
            <p className="text-zinc-400 text-xs mt-2">
              Reach 10K monthly listeners to unlock countdown pages.
            </p>
          )}

          {isLaunched && (
            <div className="space-y-4 pt-4 border-t border-zinc-700 text-left">
              <div>
                <h3 className="font-bold text-lg mb-2">
                  Countdown Cover Image
                </h3>
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => handleImageUpload(e, setCountdownImageUrl)}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-zinc-700 px-4 py-2 rounded text-sm hover:bg-zinc-600 flex-1"
                  >
                    Choose File
                  </button>
                  {countdownImageUrl && (
                    <button
                      onClick={handleUploadCountdownImage}
                      className="bg-green-600 px-4 py-2 rounded font-bold text-sm hover:bg-green-500"
                    >
                      Upload
                    </button>
                  )}
                </div>
                {countdownImageUrl && (
                  <img
                    src={countdownImageUrl}
                    className="mt-2 w-16 h-16 object-cover rounded-md"
                  />
                )}
                {release.countdownImageUrl && (
                  <p className="text-xs text-green-400 mt-1">
                    Countdown image set.
                  </p>
                )}
              </div>
              {!release.isTracklistRevealed ? (
                <div>
                  <h3 className="font-bold text-lg mb-2">Reveal Tracklist</h3>
                  <input
                    type="file"
                    accept="image/*"
                    ref={tracklistInputRef}
                    onChange={(e) => handleImageUpload(e, setTracklistImageUrl)}
                    className="hidden"
                  />
                  <button
                    onClick={() => tracklistInputRef.current?.click()}
                    className="w-full bg-zinc-700 p-2 rounded mb-2 text-sm text-white focus:outline-none hover:bg-zinc-600"
                  >
                    {tracklistImageUrl
                      ? "Image Selected"
                      : "Upload Tracklist Image (Optional)"}
                  </button>
                  {tracklistImageUrl && (
                    <img
                      src={tracklistImageUrl}
                      className="mb-2 w-full h-24 object-cover rounded-md"
                    />
                  )}
                  <button
                    onClick={handleRevealTracklist}
                    className="w-full bg-green-600 font-bold p-2 rounded text-sm hover:bg-green-500"
                  >
                    Reveal Tracklist
                  </button>
                  <p className="text-xs text-zinc-400 mt-2">
                    Track names will be revealed on your launch page, and Pop
                    Base will post.
                  </p>
                </div>
              ) : (
                <p className="text-green-400 font-bold p-2 bg-green-900/30 rounded border border-green-500/50 text-center">
                  Tracklist Revealed!
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- SONG DETAIL VIEW ---
const S4ASongDetailView: React.FC<{ song: Song; onBack: () => void }> = ({
  song,
  onBack,
}) => {
  const { activeArtistData, gameState, dispatch } = useGame();
  const [isCanvasModalOpen, setIsCanvasModalOpen] = useState(false);
  const [canvasVideoUrl, setCanvasVideoUrl] = useState("");
  const [canvasHashtags, setCanvasHashtags] = useState("");

  if (!activeArtistData) return null;
  const { releases } = activeArtistData;

  const streamSources = useMemo(() => {
    if (!song || !song.id) return [];
    let hash = 0;
    for (let i = 0; i < song.id.length; i++) {
        hash = song.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const val = Math.abs(hash) % 100;
    const playlistingPercent = 15 + (val % 25);
    const artificialPercent = val % 15;
    const profilePercent = 100 - playlistingPercent - artificialPercent;

    return [
        { name: 'Profile', value: Math.floor(song.streams * (profilePercent / 100)), percent: profilePercent, color: '#1db954' },
        { name: 'Playlisting', value: Math.floor(song.streams * (playlistingPercent / 100)), percent: playlistingPercent, color: '#404040' },
        { name: 'Artificial (Payola)', value: Math.floor(song.streams * (artificialPercent / 100)), percent: artificialPercent, color: '#9ca3af' },
    ];
  }, [song.id, song.streams]);
  const release = releases.find((r) => r.id === song.releaseId);

  const releaseDateString = release
    ? new Date(
        release.releaseDate.year,
        0,
        (release.releaseDate.week - 1) * 7 + 1,
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown";

  const gross = song.revenue || 0;
  const net = song.netRevenue || 0;
  const labelCut = gross - net;

  const hasCombineableRemixes = useMemo(() => {
    const remixes = activeArtistData.songs.filter(
      (s) => s.remixOfSongId === song.id && s.isReleased,
    );
    return remixes.some((r) => {
      const remixRelease = releases.find((rel) => rel.id === r.releaseId);
      if (!remixRelease) return false;
      const weeksSinceRelease =
        gameState.date.year * 52 +
        gameState.date.week -
        (remixRelease.releaseDate.year * 52 + remixRelease.releaseDate.week);
      return weeksSinceRelease >= 4;
    });
  }, [activeArtistData.songs, song.id, releases, gameState.date]);

  const handleCombineRemixes = () => {
    dispatch({ type: "COMBINE_REMIXES", payload: { originalSongId: song.id } });
    onBack();
  };

  const handleUploadCanvas = () => {
    const hashtags = canvasHashtags
      .split(",")
      .map((h) => (h.trim().startsWith("#") ? h.trim() : `#${h.trim()}`))
      .filter((h) => h.length > 1)
      .slice(0, 3);
    dispatch({
      type: "UPLOAD_CANVAS",
      payload: { songId: song.id, videoUrl: canvasVideoUrl, hashtags },
    });
    setIsCanvasModalOpen(false);
    setCanvasVideoUrl("");
    setCanvasHashtags("");
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCanvasVideoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gradient-to-b from-amber-800 via-stone-900 to-black text-white h-full overflow-y-auto p-4 flex flex-col">
      <header className="flex justify-between items-center flex-shrink-0">
        <button onClick={onBack} className="p-2 -m-2">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <button className="p-2 -m-2">
          <DotsHorizontalIcon className="w-6 h-6" />
        </button>
      </header>
      <main className="flex-grow flex flex-col items-center justify-start text-center space-y-4 pt-4 pb-20">
        <img
          src={song.coverArt}
          alt={song.title}
          className="w-48 h-48 sm:w-64 sm:h-64 rounded-lg shadow-2xl shadow-black/50"
        />
        <div>
          <h1 className="text-3xl font-black tracking-tight">{song.title}</h1>
          <p className="text-zinc-400 mt-1">Released: {releaseDateString}</p>
        </div>
        <div className="pt-4  w-full max-w-sm">
          <div className="flex items-center gap-2 justify-center mb-6">
            <MusicNoteIcon className="w-5 h-5 text-zinc-400" />
            <p className="text-4xl font-bold">{formatNumber(song.streams)}</p>
            <span className="text-sm text-zinc-400 self-end mb-1">streams</span>
          </div>

          <div className="bg-zinc-900/60 rounded-xl p-4 border border-zinc-700/50 text-left space-y-3 mb-6">
            <h3 className="font-bold text-lg border-b border-zinc-700 pb-2 mb-2">
              Monetization Breakdown
            </h3>

            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Total Gross Generated</span>
              <span className="font-bold text-white">
                ${formatNumber(Math.floor(gross))}
              </span>
            </div>

            <div className="flex justify-between items-center text-red-400">
              <span>Label Cut</span>
              <span className="font-semibold">
                -${formatNumber(Math.floor(labelCut))}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-zinc-700/50">
              <span className="font-bold text-zinc-200">Your Net Earnings</span>
              <span className="font-bold text-green-400 text-lg">
                ${formatNumber(Math.floor(net))}
              </span>
            </div>
          </div>

          <div className="bg-zinc-900/60 rounded-xl p-4 border border-zinc-700/50 text-left space-y-3 mb-6">
            <h3 className="font-bold text-lg border-b border-zinc-700 pb-2 mb-2 flex justify-between items-center">
              <span>Regional Streams</span>
              <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">All-Time</span>
            </h3>
            
            {(song.regionalStreams && Object.keys(song.regionalStreams).length > 0) ? (
                <>
                {Object.entries(song.regionalStreams).map(([region, regionStreams]) => (
                    <div key={region} className="flex justify-between items-center">
                      <span className="text-zinc-300 font-medium">{region}</span>
                      <span className="font-bold text-white">
                        {formatNumber(regionStreams as number)}
                      </span>
                    </div>
                ))}
                </>
            ) : (
                <div className="text-zinc-500 text-sm italic text-center py-2">
                    Not enough data
                </div>
            )}
          </div>
          
          <div className="bg-zinc-900/60 rounded-xl p-4 border border-zinc-700/50 text-left space-y-3 mb-6">
            <h3 className="font-bold text-lg border-b border-zinc-700 pb-2 mb-2">
              Source of Streams
            </h3>
            <div className="flex justify-center items-center py-4">
              <div 
                className="w-32 h-32 rounded-full relative flex items-center justify-center"
                style={{
                  background: `conic-gradient(${
                    streamSources.reduce((acc, source, i) => {
                      const start = acc.angle;
                      const end = start + (source.percent / 100) * 360;
                      acc.gradients.push(`${source.color} ${start}deg ${end}deg`);
                      acc.angle = end;
                      return acc;
                    }, { angle: 0, gradients: [] as string[] }).gradients.join(', ')
                  })`
                }}
              >
                <div className="w-24 h-24 bg-zinc-900 rounded-full absolute inset-auto"></div>
              </div>
            </div>
            
            <div className="space-y-2 mt-4 border-t border-zinc-700/50 pt-4">
              {streamSources.map(source => (
                <div key={source.name} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }}></span>
                    <span className="text-zinc-300">{source.name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-white">{formatNumber(source.value)}</span>
                    <span className="text-xs text-zinc-500">{source.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsCanvasModalOpen(true)}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-colors mb-4 border border-zinc-700"
          >
            <span>
              {song.canvasVideo ? "Edit Canvas Studio" : "Add Canvas Video"}
            </span>
          </button>

          {hasCombineableRemixes && (
            <button
              onClick={handleCombineRemixes}
              className="w-full bg-blue-500 text-white font-bold p-4 rounded-lg flex justify-center mb-4"
            >
              Combine Remixes to Original
            </button>
          )}
        </div>
      </main>

      {isCanvasModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-black mb-4">Canvas Studio</h2>
            <p className="text-sm text-zinc-400 mb-6">
              Upload a short 3-8 second looping video (MP4) and add up to 3
              hashtags.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Canvas Video (optional)
                </label>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,image/gif"
                  onChange={handleVideoFileChange}
                  className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
                />
                {canvasVideoUrl && (
                  <div className="mt-2">
                    <video
                      className="w-24 h-40 object-cover rounded shadow"
                      src={canvasVideoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Hashtags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. baddie, pop, girly"
                  value={canvasHashtags}
                  onChange={(e) => setCanvasHashtags(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-white"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setIsCanvasModalOpen(false)}
                className="flex-1 bg-zinc-800 font-bold py-3 rounded-full hover:bg-zinc-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadCanvas}
                className="flex-1 bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 transition"
              >
                Save Canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- RELEASE DETAIL VIEW ---
const S4AReleaseDetailView: React.FC<{ release: Release; onBack: () => void }> = ({
  release,
  onBack,
}) => {
  const { activeArtistData, dispatch } = useGame();
  const [isCanvasModalOpen, setIsCanvasModalOpen] = useState(false);
  const [canvasVideoUrl, setCanvasVideoUrl] = useState("");
  const [canvasHashtags, setCanvasHashtags] = useState("");

  if (!activeArtistData) return null;

  const releaseDateString = new Date(
    release.releaseDate.year,
    0,
    (release.releaseDate.week - 1) * 7 + 1,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCanvasVideoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadCanvas = () => {
    dispatch({
      type: "UPLOAD_ALBUM_CANVAS",
      payload: { releaseId: release.id, videoUrl: canvasVideoUrl, hashtags: [] },
    });
    setIsCanvasModalOpen(false);
    setCanvasVideoUrl("");
  };

  const tracks = release.songIds.map(id => activeArtistData.songs.find(s => s.id === id)).filter(Boolean) as Song[];
  const totalStreams = tracks.reduce((sum, song) => sum + (song.streams || 0), 0);
  const hasAnyCanvas = tracks.some(t => t.canvasVideo);

  return (
    <div className="bg-gradient-to-b from-amber-800 via-stone-900 to-black text-white h-full overflow-y-auto p-4 flex flex-col relative pb-20">
      <header className="flex justify-between items-center flex-shrink-0">
        <button onClick={onBack} className="p-2 -m-2">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      </header>
      <main className="flex-grow flex flex-col items-center justify-start text-center space-y-4 pt-4">
        <img
          src={release.coverArt}
          alt={release.title}
          className="w-48 h-48 sm:w-64 sm:h-64 rounded-lg shadow-2xl shadow-black/50"
        />
        <div>
          <h1 className="text-3xl font-black tracking-tight">{release.title}</h1>
          <p className="text-zinc-400 mt-1 capitalize">{release.type} · Released: {releaseDateString}</p>
        </div>
        <div className="pt-4 w-full max-w-sm">
          <div className="flex items-center gap-2 justify-center mb-6">
            <MusicNoteIcon className="w-5 h-5 text-zinc-400" />
            <p className="text-4xl font-bold">{formatNumber(totalStreams)}</p>
            <span className="text-sm text-zinc-400 self-end mb-1">total streams</span>
          </div>

          <button
            onClick={() => setIsCanvasModalOpen(true)}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-colors mb-4 border border-zinc-700"
          >
            <span>
              {hasAnyCanvas ? "Edit Album Canvas (Applies to all tracks)" : "Add Album Canvas Video"}
            </span>
          </button>
          
          <div className="text-left mt-6">
            <h3 className="font-bold mb-3 border-b border-zinc-800 pb-2">Tracklist</h3>
            <div className="space-y-3">
              {tracks.map((track, idx) => (
                <div key={track.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 w-4">{idx + 1}</span>
                    <span className="font-semibold">{track.title}</span>
                  </div>
                  <span className="text-zinc-400">{formatNumber(track.streams)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Canvas Modal */}
      {isCanvasModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-sm border border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl">Album Canvas Studio</h3>
              <button
                onClick={() => setIsCanvasModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Upload Video for all tracks in {release.title}
                </label>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,image/gif"
                  onChange={handleVideoFileChange}
                  className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
                />
                {canvasVideoUrl && (
                  <div className="mt-2">
                    <video
                      className="w-24 h-40 object-cover rounded shadow"
                      src={canvasVideoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleUploadCanvas}
                disabled={!canvasVideoUrl}
                className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-3 rounded-full"
              >
                Apply to Album
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- HOME TAB ---
const S4AHome: React.FC = () => {
  const { activeArtistData, gameState, dispatch } = useGame();
  if (!activeArtistData) return null;

  const { releases, songs, listeningNow, monthlyListeners, followers } =
    activeArtistData;
  const showWrapped = gameState.date.week >= 50;

  const latestRelease = useMemo(() => {
    return [...releases].sort(
      (a, b) =>
        b.releaseDate.year * 52 +
        b.releaseDate.week -
        (a.releaseDate.year * 52 + a.releaseDate.week),
    )[0];
  }, [releases]);

  const latestReleaseStreams = useMemo(() => {
    if (!latestRelease) return 0;
    return latestRelease.songIds.reduce((sum, id) => {
      const song = songs.find((s) => s.id === id);
      return sum + (song?.streams || 0);
    }, 0);
  }, [latestRelease, songs]);

  const last7DaysStreams =
    (activeArtistData.lastFourWeeksStreams || [])[0] || 0;

  const topSongs = useMemo(() => {
    return [...songs]
      .filter((s) => s.isReleased)
      .sort((a, b) => b.streams - a.streams)
      .slice(0, 5);
  }, [songs]);

  return (
    <div className="bg-[#402000] text-white h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {latestRelease && (
          <div className="flex items-center gap-4">
            <img
              src={latestRelease.coverArt}
              alt={latestRelease.title}
              className="w-24 h-24 object-cover"
            />
            <div>
              <p className="text-xs font-bold tracking-widest opacity-80">
                LATEST RELEASE • {latestRelease.type.toUpperCase()}
              </p>
              <p className="text-2xl font-bold">{latestRelease.title}</p>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-5xl font-bold">
            {formatNumber(latestReleaseStreams)}
          </h2>
          <p className="opacity-80">all-time streams for this release</p>
          <hr className="my-3 border-white/20" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <p className="text-lg font-bold">
              {formatNumber(listeningNow)} people listening now
            </p>
          </div>

          <div className="mt-6">
            <p className="font-bold text-sm tracking-widest opacity-80 mb-2">
              LAST 7 DAYS
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">
                  {formatNumber(Math.floor(monthlyListeners * 0.25))}
                </p>
                <p className="text-xs opacity-80">listeners</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatNumber(last7DaysStreams)}
                </p>
                <p className="text-xs opacity-80">streams</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{formatNumber(followers)}</p>
                <p className="text-xs opacity-80">followers</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="font-bold text-sm tracking-widest opacity-80 mb-2">
            YOUR TOP SONGS
          </p>
          <div className="space-y-2">
            {topSongs.map((song) => (
              <div
                key={song.id}
                className="flex items-center gap-3 p-2 rounded-md bg-white/10"
              >
                <img
                  src={song.coverArt}
                  alt={song.title}
                  className="w-10 h-10 object-cover"
                />
                <p className="font-semibold flex-grow">{song.title}</p>
                <p className="font-bold text-lg">
                  {formatNumber(song.streams)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {showWrapped && (
          <div className="pt-4">
            <button
              onClick={() =>
                dispatch({ type: "CHANGE_VIEW", payload: "spotifyWrapped" })
              }
              className="w-full text-left bg-zinc-800/50 p-4 rounded-lg"
            >
              <p className="text-sm font-bold tracking-widest opacity-80">
                YOUR YEAR IN MUSIC
              </p>
              <h2 className="text-2xl font-bold mt-2">
                Your {gameState.date.year} Wrapped for Artists is here
              </h2>
              <p className="mt-2 text-zinc-300">
                Unwrap the highlights from your year in music and celebrate with
                your fans.
              </p>
              <div className="mt-4 font-bold text-zinc-200 flex items-center">
                GET YOURS <ChevronRightIcon className="w-5 h-5 ml-1" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MUSIC TAB ---
const S4AMusic: React.FC<{
  onSelectSong: (song: Song) => void;
  onSelectRelease: (release: Release) => void;
  onSelectUpcomingRelease: (submissionId: string) => void;
}> = ({ onSelectSong, onSelectRelease, onSelectUpcomingRelease }) => {
  const { activeArtistData, gameState, allPlayerArtists } = useGame();
  const [musicTab, setMusicTab] = useState<
    "Songs" | "Releases" | "Playlists" | "Upcoming"
  >("Upcoming");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null,
  );

  if (!activeArtistData) return null;
  const { songs, streamsHistory, playlistPlacements } = activeArtistData;

  const getPlaylistCover = (playlistId: string, fallbackCover: string) => {
    const p = gameState.spotifyPlaylists?.find((p) => p.id === playlistId);
    if (!p) return fallbackCover;
    let playlistCover = p.coverArt || fallbackCover;
    if (p.tracks && p.tracks.length > 0) {
      const topTrack = p.tracks[0];
      if (topTrack.artistId !== "unknown") {
        const topPlayerArtist = allPlayerArtists.find(
          (a) => a.id === topTrack.artistId,
        );
        if (topPlayerArtist && topPlayerArtist.image)
          playlistCover = topPlayerArtist.image;
      } else {
        playlistCover =
          NPC_ARTIST_IMAGES?.[topTrack.artistName] ||
          topTrack.coverArt ||
          p.coverArt ||
          fallbackCover;
      }
    }
    return playlistCover;
  };

  type SortPeriod = "all" | "12m" | "7d" | "24h";
  const [sortPeriod, setSortPeriod] = useState<SortPeriod>("12m");

  const sortedSongs = useMemo(() => {
    const releasedSongs = songs.filter((s) => s.isReleased);
    const totalStreamsAllSongs =
      songs.reduce((s, song) => s + (song.streams || 0), 0) || 1;

    switch (sortPeriod) {
      case "all":
        return [...releasedSongs]
          .map((s) => ({ ...s, calculatedStreams: s.streams }))
          .sort((a, b) => b.streams - a.streams);
      case "12m":
        return [...releasedSongs]
          .map((song) => {
            const streamsLast12Months = streamsHistory
              .slice(-52)
              .reduce((sum, week) => {
                const songShare = (song.streams || 0) / totalStreamsAllSongs;
                return sum + week.streams * songShare;
              }, 0);
            return { ...song, calculatedStreams: streamsLast12Months };
          })
          .sort((a, b) => b.calculatedStreams - a.calculatedStreams);
      case "7d":
        return [...releasedSongs]
          .map((song) => ({
            ...song,
            calculatedStreams:
              song.actualLastWeekStreams !== undefined
                ? song.actualLastWeekStreams
                : song.lastWeekStreams || 0,
          }))
          .sort((a, b) => b.calculatedStreams - a.calculatedStreams);
      case "24h":
        return [...releasedSongs]
          .map((song) => {
            const lastDayStreams = song.dailyStreams
              ? song.dailyStreams[song.dailyStreams.length - 1] || 0
              : 0;
            return { ...song, calculatedStreams: lastDayStreams };
          })
          .sort((a, b) => b.calculatedStreams - a.calculatedStreams);
      default:
        return [];
    }
  }, [songs, streamsHistory, sortPeriod]);

  const upcomingReleases = useMemo(() => {
    if (!activeArtistData) return [];

    const upcoming: {
      id: string;
      submissionId?: string;
      title: string;
      type: Release["type"];
      coverArt: string;
      releaseDate: GameDate;
    }[] = [];

    for (const sub of activeArtistData.labelSubmissions) {
      if (sub.status === "scheduled") {
        if (
          sub.projectReleaseDate &&
          sub.projectReleaseDate.year * 52 + sub.projectReleaseDate.week >
            gameState.date.year * 52 + gameState.date.week
        ) {
          upcoming.push({
            id: sub.release.id,
            submissionId: sub.id,
            title: sub.release.title,
            type: sub.release.type,
            coverArt: sub.release.coverArt,
            releaseDate: sub.projectReleaseDate,
          });
        }
        if (sub.singlesToRelease) {
          for (const single of sub.singlesToRelease) {
            if (
              single.releaseDate.year * 52 + single.releaseDate.week >
              gameState.date.year * 52 + gameState.date.week
            ) {
              const song = activeArtistData.songs.find(
                (s) => s.id === single.songId,
              );
              if (song) {
                upcoming.push({
                  id: song.id,
                  title: song.title,
                  type: "Single",
                  coverArt: song.coverArt,
                  releaseDate: single.releaseDate,
                });
              }
            }
          }
        }
      }
    }
    return upcoming.sort(
      (a, b) =>
        a.releaseDate.year * 52 +
        a.releaseDate.week -
        (b.releaseDate.year * 52 + b.releaseDate.week),
    );
  }, [activeArtistData, gameState.date]);

  const sortOptions: { id: SortPeriod; label: string }[] = [
    { id: "12m", label: "Last 12 months" },
    { id: "all", label: "All time" },
    { id: "7d", label: "Last 7 days" },
    { id: "24h", label: "Last 24 hours" },
  ];

  return (
    <div className="bg-white text-black h-full overflow-y-auto">
      <header className="p-4 border-b">
        <h1 className="text-3xl font-bold">Music</h1>
        <div className="flex gap-6 mt-4 text-sm font-semibold text-zinc-600 border-b">
          <button
            onClick={() => setMusicTab("Songs")}
            className={`py-2 ${musicTab === "Songs" ? "text-black border-b-2 border-black" : ""}`}
          >
            Songs
          </button>
          <button
            onClick={() => setMusicTab("Releases")}
            className={`py-2 ${musicTab === "Releases" ? "text-black border-b-2 border-black" : ""}`}
          >
            Releases
          </button>
          <button
            onClick={() => setMusicTab("Playlists")}
            className={`py-2 ${musicTab === "Playlists" ? "text-black border-b-2 border-black" : ""}`}
          >
            Playlists
          </button>
          <button
            onClick={() => setMusicTab("Upcoming")}
            className={`py-2 ${musicTab === "Upcoming" ? "text-black border-b-2 border-black" : ""}`}
          >
            Upcoming
          </button>
        </div>
      </header>

      {musicTab === "Songs" && (
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-2 overflow-x-auto">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortPeriod(option.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${sortPeriod === option.id ? "bg-black text-white" : "bg-zinc-200 text-black"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-zinc-500 flex-shrink-0 ml-2">
              STREAMS
            </p>
          </div>
          <div className="space-y-3">
            {sortedSongs.map((song) => (
              <button
                key={song.id}
                onClick={() => onSelectSong(song)}
                className="w-full text-left flex items-center gap-3 hover:bg-zinc-100 p-1 -m-1 rounded-md"
              >
                <img
                  src={song.coverArt}
                  alt={song.title}
                  className="w-12 h-12 object-cover"
                />
                <p className="font-semibold flex-grow truncate">{song.title}</p>
                <p className="font-bold">
                  {formatNumber(song.calculatedStreams)}
                </p>
                <ChevronRightIcon className="w-5 h-5 text-zinc-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {musicTab === "Releases" && (
        <div className="p-4 space-y-3">
          {activeArtistData.releases
            .filter((r) => {
              const rDate = r.releaseDate.year * 52 + r.releaseDate.week;
              const gDate = gameState.date.year * 52 + gameState.date.week;
              return rDate <= gDate;
            })
            .sort((a, b) => {
              const aDate = a.releaseDate.year * 52 + a.releaseDate.week;
              const bDate = b.releaseDate.year * 52 + b.releaseDate.week;
              return bDate - aDate;
            })
            .map((release) => (
              <button
                key={release.id}
                onClick={() => onSelectRelease(release)}
                className="w-full text-left flex items-center gap-3 hover:bg-zinc-100 p-2 -m-2 rounded-md transition-colors"
              >
                <img
                  src={release.coverArt}
                  alt={release.title}
                  className="w-16 h-16 object-cover rounded-md shadow-sm"
                />
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-lg truncate">{release.title}</p>
                  <p className="text-zinc-500 text-sm capitalize">{release.type}</p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-zinc-400 flex-shrink-0" />
              </button>
            ))}
        </div>
      )}
      {musicTab === "Playlists" && (
        <div className="p-4">
          {selectedPlaylistId ? (
            <div>
              <button
                onClick={() => setSelectedPlaylistId(null)}
                className="flex items-center gap-2 mb-4 text-sm font-semibold text-zinc-600 hover:text-black"
              >
                <ArrowLeftIcon className="w-5 h-5" /> Back to Playlists
              </button>
              {(() => {
                const playlist = playlistPlacements?.find(
                  (p) => p.playlistId === selectedPlaylistId,
                );
                if (!playlist) return null;
                const sortedSongsId = Object.keys(playlist.songStreams).sort(
                  (a, b) => playlist.songStreams[b] - playlist.songStreams[a],
                );
                return (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-4 mb-6 relative">
                      <img
                        src={getPlaylistCover(
                          playlist.playlistId,
                          playlist.coverArt,
                        )}
                        className="w-20 h-20 shadow-md rounded-md object-cover"
                      />
                      <div>
                        <h2 className="text-2xl font-bold">
                          {playlist.playlistName}
                        </h2>
                        <p className="text-zinc-500 font-semibold">
                          {formatNumber(playlist.totalStreams)} total streams
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {sortedSongsId.map((songId) => {
                        const song = songs.find((s) => s.id === songId);
                        if (!song) return null;
                        return (
                          <div key={songId} className="flex items-center gap-3">
                            <img
                              src={song.coverArt}
                              alt={song.title}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                            <p className="font-semibold flex-grow truncate">
                              {song.title}
                            </p>
                            <p className="font-bold flex-shrink-0">
                              {formatNumber(playlist.songStreams[songId])}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
                <span>Playlists</span>
                <span>Streams</span>
              </div>
              {playlistPlacements && playlistPlacements.length > 0 ? (
                <div className="space-y-4">
                  {[...playlistPlacements]
                    .sort((a, b) => b.totalStreams - a.totalStreams)
                    .map((playlist) => (
                      <button
                        key={playlist.playlistId}
                        onClick={() =>
                          setSelectedPlaylistId(playlist.playlistId)
                        }
                        className="w-full flex items-center gap-3 text-left hover:bg-zinc-100 p-2 -m-2 rounded-lg"
                      >
                        <img
                          src={getPlaylistCover(
                            playlist.playlistId,
                            playlist.coverArt,
                          )}
                          className="w-14 h-14 object-cover rounded-md"
                        />
                        <div className="flex-grow min-w-0">
                          <p className="font-bold text-black truncate">
                            {playlist.playlistName}
                          </p>
                          <p className="text-sm text-zinc-500">
                            {Object.keys(playlist.songStreams).length} track
                            {Object.keys(playlist.songStreams).length === 1
                              ? ""
                              : "s"}
                          </p>
                        </div>
                        <p className="font-bold flex-shrink-0 text-right">
                          {formatNumber(playlist.totalStreams)}
                        </p>
                      </button>
                    ))}
                </div>
              ) : (
                <div className="text-center text-zinc-500 py-10">
                  <p>
                    Your songs haven't been added to any major playlists yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {musicTab === "Upcoming" && (
        <div className="p-4">
          <div className="flex justify-between items-center text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
            <span>Releases</span>
            <span>Release date</span>
          </div>
          {upcomingReleases.length > 0 ? (
            <div className="space-y-4">
              {upcomingReleases.map((release) => {
                const isAlbumOrEP = release.type !== "Single";
                const Wrapper = isAlbumOrEP ? "button" : "div";
                const props = isAlbumOrEP
                  ? {
                      onClick: () =>
                        onSelectUpcomingRelease(release.submissionId!),
                    }
                  : {};

                return (
                  <Wrapper
                    key={release.id}
                    {...props}
                    className={`w-full flex justify-between items-center text-left ${isAlbumOrEP ? "hover:bg-zinc-100 p-2 -m-2 rounded-lg" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={release.coverArt}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-bold text-black">{release.title}</p>
                        <p className="text-sm text-zinc-500">
                          {release.type.replace(" (Deluxe)", "")}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-lg text-black">
                      {release.releaseDate.year}
                    </p>
                  </Wrapper>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-zinc-500">
              <p>No upcoming releases scheduled.</p>
              <p className="text-sm mt-1">
                Plan a release with your label to see it here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- AUDIENCE TAB ---
const S4AAudience: React.FC = () => {
  const { activeArtistData } = useGame();
  if (!activeArtistData) return null;

  const { streamsHistory, monthlyListeners, saves } = activeArtistData;
  const last12MonthsStreams = streamsHistory
    .slice(-52)
    .reduce((sum, h) => sum + h.streams, 0);

  const Chart = () => {
    const data = streamsHistory.slice(-12).map((h) => h.streams); // Last 12 weeks
    if (data.length < 2)
      return (
        <div className="h-40 bg-zinc-100 rounded-md flex items-center justify-center text-zinc-400">
          Not enough data for chart.
        </div>
      );

    const max = Math.max(...data);
    const points = data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (d / max) * 90; // 90 to leave some top padding
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg
        viewBox="0 0 100 100"
        className="w-full h-40"
        preserveAspectRatio="none"
      >
        <polyline
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="bg-white text-black h-full overflow-y-auto">
      <header className="p-4 border-b">
        <h1 className="text-3xl font-bold">Audience</h1>
      </header>
      <div className="p-4 space-y-6">
        <h2 className="font-bold">Streams</h2>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-blue-500 text-white p-3 rounded-md">
            <p className="text-sm">Streams</p>
            <p className="text-2xl font-bold">
              {formatNumber(last12MonthsStreams)}
            </p>
          </div>
          <div className="bg-zinc-100 p-3 rounded-md">
            <p className="text-sm">Listeners</p>
            <p className="text-2xl font-bold">
              {formatNumber(monthlyListeners)}
            </p>
          </div>
          <div className="bg-zinc-100 p-3 rounded-md">
            <p className="text-sm">Saves</p>
            <p className="text-2xl font-bold">{formatNumber(saves)}</p>
          </div>
        </div>
        <div className="border rounded-md p-2">
          <Chart />
        </div>
      </div>
    </div>
  );
};

// --- PROFILE TAB ---
const S4AProfile: React.FC = () => {
  const { dispatch, activeArtistData, gameState, activeArtist } = useGame();
  const [showArtistPickModal, setShowArtistPickModal] = useState(false);
  const [selectedPickItem, setSelectedPickItem] = useState<{
    id: string;
    type: "song" | "release";
  } | null>(null);
  const [pickMessage, setPickMessage] = useState("");
  const [showPitchModal, setShowPitchModal] = useState<Song | null>(null);
  const [showNameChangeModal, setShowNameChangeModal] = useState(false);
  const [newNameInput, setNewNameInput] = useState("");

  if (!activeArtistData || !activeArtist) return null;
  const { songs, releases, artistPick, money, promotions, contract } =
    activeArtistData;
  const { date } = gameState;

  const independentNameChanges = activeArtistData.independentNameChanges || 0;
  const canChangeName = !contract && independentNameChanges < 2;

  const handleNameChangeSubmit = () => {
    if (newNameInput.trim() && canChangeName) {
      dispatch({
        type: "CHANGE_STAGE_NAME",
        payload: { newName: newNameInput.trim() },
      });
      setShowNameChangeModal(false);
      setNewNameInput("");
    }
  };

  const handleConfirmPick = () => {
    if (selectedPickItem) {
      dispatch({
        type: "SET_ARTIST_PICK",
        payload: {
          itemId: selectedPickItem.id,
          itemType: selectedPickItem.type,
          message: pickMessage.trim(),
        },
      });
    }
    setShowArtistPickModal(false);
    setSelectedPickItem(null);
    setPickMessage("");
  };

  const handleSelectPickItem = (
    itemId: string,
    itemType: "song" | "release",
  ) => {
    setSelectedPickItem({ id: itemId, type: itemType });
  };

  const handlePitchSong = (songId: string) => {
    dispatch({ type: "PITCH_TO_PLAYLIST", payload: { songId } });
    setShowPitchModal(null);
  };

  const pitchedSongIds = useMemo(
    () => new Set(songs.filter(s => s.playlistBoostWeeks && s.playlistBoostWeeks > 0).map(s => s.id)),
    [songs]
  );

  const pitchableSongs = useMemo(() => {
    return songs.filter((s) => {
      const release = releases.find((r) => r.id === s.releaseId);
      if (pitchedSongIds.has(s.id)) return false;
      if (!release && !s.isFeatureToNpc) return false;
      const weeksSinceRelease =
        date.year * 52 +
        date.week -
        (release.releaseDate.year * 52 + release.releaseDate.week);
      return weeksSinceRelease <= 4; // Can pitch songs released in the last 4 weeks
    });
  }, [songs, releases, date, pitchedSongIds]);

  return (
    <div className="bg-white text-black h-full overflow-y-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>

      <div className="bg-zinc-100 p-4 rounded-lg space-y-3">
        <h2 className="font-bold">Artist Pick</h2>
        {artistPick ? (
          <p className="text-sm">
            Current Pick:{" "}
            {songs.find((s) => s.id === artistPick.itemId)?.title ||
              releases.find((r) => r.id === artistPick.itemId)?.title}
          </p>
        ) : (
          <p className="text-sm text-zinc-500">No artist pick selected.</p>
        )}
        <button
          onClick={() => {
            setShowArtistPickModal(true);
            setSelectedPickItem(null);
            setPickMessage("");
          }}
          className="bg-black text-white text-sm font-semibold px-4 py-2 rounded-full"
        >
          Change Pick
        </button>
      </div>

      <div className="bg-zinc-100 p-4 rounded-lg space-y-3">
        <h2 className="font-bold">Stage Name</h2>
        <p className="text-sm font-semibold">{activeArtist.name}</p>
        {!contract ? (
          <>
            <p className="text-xs text-zinc-500">
              You can change your stage name {2 - independentNameChanges} more
              time(s) as an independent artist.
            </p>
            <button
              onClick={() => setShowNameChangeModal(true)}
              disabled={!canChangeName}
              className="bg-black text-white text-sm font-semibold px-4 py-2 rounded-full disabled:bg-zinc-400"
            >
              Change Name
            </button>
          </>
        ) : (
          <p className="text-xs text-zinc-500">
            You cannot change your stage name while signed to a label unless
            requested by them.
          </p>
        )}
      </div>

      <div className="bg-zinc-100 p-4 rounded-lg space-y-3">
        <h2 className="font-bold flex items-center gap-1">
          Spotify Verification{" "}
          {activeArtistData.isSpotifyVerified && (
            <span className="text-blue-500 w-4 h-4 rounded-full flex items-center justify-center text-[10px] border border-blue-500">
              ✓
            </span>
          )}
        </h2>
        {activeArtistData.isSpotifyVerified ? (
          <p className="text-sm font-semibold text-green-600">
            You are verified on Spotify.
          </p>
        ) : (
          <>
            <p className="text-sm text-zinc-600">
              Get the blue checkmark. Requires at least 50k followers.
            </p>
            <button
              onClick={() => dispatch({ type: "REQUEST_SPOTIFY_VERIFICATION" })}
              disabled={activeArtistData.followers < 50000}
              className="bg-black text-white text-sm font-semibold px-4 py-2 rounded-full disabled:bg-zinc-400"
            >
              Request Verification
            </button>
          </>
        )}
      </div>

      <div className="bg-zinc-100 p-4 rounded-lg space-y-3">
        <h2 className="font-bold">About Section</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-1">
              Biography
            </label>
            <textarea
              className="w-full p-2 border border-zinc-300 rounded-lg text-sm bg-white"
              rows={4}
              placeholder="Write your bio..."
              value={activeArtistData.aboutBio || ""}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_ABOUT_PROFILE",
                  payload: {
                    bio: e.target.value,
                    images: activeArtistData.aboutImages || [],
                  },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">
              Image Gallery (Up to 2 images)
            </label>
            <div className="flex gap-2">
              {(activeArtistData.aboutImages || []).map((img, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 rounded-md overflow-hidden bg-zinc-200"
                >
                  <img src={img} className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      const newImages = [
                        ...(activeArtistData.aboutImages || []),
                      ];
                      newImages.splice(i, 1);
                      dispatch({
                        type: "UPDATE_ABOUT_PROFILE",
                        payload: {
                          bio: activeArtistData.aboutBio || "",
                          images: newImages,
                        },
                      });
                    }}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    x
                  </button>
                </div>
              ))}
              {(activeArtistData.aboutImages || []).length < 2 && (
                <button
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const newImages = [
                            ...(activeArtistData.aboutImages || []),
                            e.target?.result as string,
                          ];
                          dispatch({
                            type: "UPDATE_ABOUT_PROFILE",
                            payload: {
                              bio: activeArtistData.aboutBio || "",
                              images: newImages,
                            },
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }}
                  className="w-20 h-20 rounded-md border-2 border-dashed border-zinc-300 flex items-center justify-center text-2xl text-zinc-400 hover:bg-zinc-200"
                >
                  +
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-100 p-4 rounded-lg space-y-3">
        <h2 className="font-bold">Pitch a song to playlists</h2>
        <p className="text-sm text-zinc-600">
          Pitch a song from an upcoming or recent release to our playlist
          editors.
        </p>
        {pitchableSongs.length > 0 ? (
          <div className="space-y-2">
            {pitchableSongs.map((song) => (
              <button
                key={song.id}
                onClick={() => setShowPitchModal(song)}
                className="w-full text-left flex items-center gap-3 p-2 bg-white rounded-md hover:bg-zinc-200"
              >
                <img
                  src={song.coverArt}
                  className="w-10 h-10"
                  alt={song.title}
                />
                <p className="font-semibold">{song.title}</p>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">
            No songs eligible for pitching right now.
          </p>
        )}
      </div>

      {/* Modals */}
      {showNameChangeModal && canChangeName && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowNameChangeModal(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Change Stage Name</h2>
            <input
              type="text"
              className="w-full p-3 border border-zinc-300 rounded-lg text-black mb-4"
              placeholder="New Stage Name"
              value={newNameInput}
              onChange={(e) => setNewNameInput(e.target.value)}
              maxLength={30}
            />
            <div className="flex gap-4">
              <button
                onClick={() => setShowNameChangeModal(false)}
                className="w-full bg-zinc-200 py-2 rounded-full font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleNameChangeSubmit}
                disabled={!newNameInput.trim()}
                className="w-full bg-black text-white py-2 rounded-full font-semibold disabled:bg-zinc-400"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
      {showArtistPickModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowArtistPickModal(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-md p-4 max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {!selectedPickItem ? (
              <>
                <h2 className="text-xl font-bold mb-4">Select Artist Pick</h2>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {releases.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectPickItem(item.id, "release")}
                      className="w-full flex gap-3 items-center p-2 hover:bg-zinc-100 rounded-md"
                    >
                      <img src={item.coverArt} className="w-12 h-12" />
                      <div className="text-left">
                        <p className="font-bold">{item.title}</p>
                        <p className="text-xs text-zinc-500">{item.type}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">
                  Add a Message (Optional)
                </h2>
                <input
                  type="text"
                  maxLength={40}
                  placeholder="e.g. My new album out now!"
                  value={pickMessage}
                  onChange={(e) => setPickMessage(e.target.value)}
                  className="w-full p-2 border border-zinc-300 rounded mb-4"
                />
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedPickItem(null)}
                    className="w-full bg-zinc-200 py-2 rounded-full font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmPick}
                    className="w-full bg-black text-white py-2 rounded-full font-semibold"
                  >
                    Confirm Pick
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {showPitchModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPitchModal(null)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-md p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold">
              Pitch "{showPitchModal.title}"?
            </h2>
            <p className="text-zinc-600 my-4">
              This will cost{" "}
              <span className="font-bold">
                ${formatNumber(PLAYLIST_PITCH_COST)}
              </span>
              . Success is not guaranteed, but a successful pitch can
              significantly boost streams.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowPitchModal(null)}
                className="w-full bg-zinc-200 py-2 rounded-full font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePitchSong(showPitchModal.id)}
                disabled={money < PLAYLIST_PITCH_COST}
                className="w-full bg-black text-white py-2 rounded-full font-semibold disabled:bg-zinc-400"
              >
                Confirm Pitch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MONETIZATION TAB ---
const S4AMonetization: React.FC<{ onSelectSong: (song: Song) => void }> = ({
  onSelectSong,
}) => {
  const { activeArtistData } = useGame();
  if (!activeArtistData) return null;
  const { songs } = activeArtistData;

  const topEarningSongs = [...songs]
    .filter((s) => s.isReleased && (s.revenue || 0) > 0)
    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
    .slice(0, 50); // Show top 50

  return (
    <div className="bg-white text-black h-full overflow-y-auto">
      <header className="p-4 border-b">
        <h1 className="text-3xl font-bold">Monetization</h1>
        <p className="text-zinc-600 text-sm mt-1">
          Your top earning songs (All-Time)
        </p>
      </header>

      <div className="p-4">
        {topEarningSongs.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <BanknotesIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No revenue data available yet.</p>
            <p className="text-sm">
              Release music and gather streams to start earning.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {topEarningSongs.map((song, index) => (
              <div
                key={song.id}
                className="flex items-center gap-4 cursor-pointer hover:bg-zinc-50 p-2 rounded-lg transition-colors border border-zinc-100 shadow-sm"
                onClick={() => onSelectSong(song)}
              >
                <span className="text-xl font-bold text-zinc-400 w-6 text-right">
                  {index + 1}
                </span>
                <img
                  src={song.coverArt}
                  className="w-12 h-12 object-cover rounded-md shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate text-black">
                    {song.title}
                  </h3>
                  <p className="text-sm text-zinc-500">
                    {formatNumber(song.streams || 0)} streams
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    ${formatNumber(Math.floor(song.revenue || 0))}
                  </p>
                  <p className="text-xs text-zinc-400">Total Gross</p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-zinc-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN WRAPPER COMPONENT ---
const SpotifyForArtistsView: React.FC = () => {
  const { dispatch, activeArtist } = useGame();
  const [activeTab, setActiveTab] = useState<S4ATab>("Home");
  const [view, setView] = useState<
    "tabs" | "songDetail" | "upcomingReleaseDetail" | "releaseDetail"
  >("tabs");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    string | null
  >(null);

  if (!activeArtist) return null;

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    setView("songDetail");
  };

  const handleBackFromDetail = () => {
    setSelectedSong(null);
    setView("tabs");
  };

  const handleSelectUpcomingRelease = (submissionId: string) => {
    setSelectedSubmissionId(submissionId);
    setView("upcomingReleaseDetail");
  };

  const handleBackFromUpcoming = () => {
    setSelectedSubmissionId(null);
    setView("tabs");
  };

  const handleSelectRelease = (release: Release) => {
    setSelectedRelease(release);
    setView("releaseDetail");
  };

  const handleBackFromReleaseDetail = () => {
    setSelectedRelease(null);
    setView("tabs");
  };

  if (view === "songDetail" && selectedSong) {
    return (
      <S4ASongDetailView song={selectedSong} onBack={handleBackFromDetail} />
    );
  }

  if (view === "releaseDetail" && selectedRelease) {
    return (
      <S4AReleaseDetailView release={selectedRelease} onBack={handleBackFromReleaseDetail} />
    );
  }

  if (view === "upcomingReleaseDetail" && selectedSubmissionId) {
    return (
      <S4AUpcomingReleaseDetailView
        submissionId={selectedSubmissionId}
        onBack={handleBackFromUpcoming}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return <S4AHome />;
      case "Music":
        return (
          <S4AMusic
            onSelectSong={handleSelectSong}
            onSelectRelease={handleSelectRelease}
            onSelectUpcomingRelease={handleSelectUpcomingRelease}
          />
        );
      case "Audience":
        return <S4AAudience />;
      case "Profile":
        return <S4AProfile />;
      case "Monetization":
        return <S4AMonetization onSelectSong={handleSelectSong} />;
      default:
        return <S4AHome />;
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <header className="p-2 flex justify-between items-center bg-black text-white sticky top-0 z-20">
        <button
          onClick={() => dispatch({ type: "CHANGE_VIEW", payload: "game" })}
          className="font-bold text-lg text-red-400"
        >
          &lt; EXIT
        </button>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{activeArtist.name}</span>
          <img
            src={activeArtist.image}
            alt={activeArtist.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      </header>
      <main className="flex-grow overflow-y-auto">{renderContent()}</main>
      <footer className="h-20 bg-black border-t border-zinc-700 flex justify-around items-center sticky bottom-0 z-20">
        {(
          ["Home", "Music", "Audience", "Monetization", "Profile"] as S4ATab[]
        ).map((tab) => {
          const isActive = activeTab === tab;
          const icon = {
            Home: <HomeIcon className="w-6 h-6" />,
            Music: <MusicNoteIcon className="w-6 h-6" />,
            Audience: <UserGroupIcon className="w-6 h-6" />,
            Monetization: <BanknotesIcon className="w-6 h-6" />,
            Profile: <UserCircleIcon className="w-6 h-6" />,
          }[tab];
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center gap-1 ${isActive ? "text-white" : "text-zinc-500"}`}
            >
              {icon}
              <span className="text-xs font-bold">
                {tab === "Monetization" ? "Money" : tab}
              </span>
            </button>
          );
        })}
      </footer>
    </div>
  );
};

export default SpotifyForArtistsView;
