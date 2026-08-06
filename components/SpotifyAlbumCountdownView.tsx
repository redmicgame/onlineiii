import React, { useState, useEffect, useMemo } from "react";
import { useGame } from "../context/GameContext";
import { LABELS } from "../constants";
import type { Song, GameDate } from "../types";
import ChevronLeftIcon from "./icons/ChevronLeftIcon";
import PlusIcon from "./icons/PlusIcon";
import DotsHorizontalIcon from "./icons/DotsHorizontalIcon";
import ArrowUpTrayIcon from "./icons/ArrowUpTrayIcon";

const formatReleaseDateString = (gameDate: GameDate): string => {
  const date = new Date(gameDate.year, 0, 1);
  date.setDate(date.getDate() + (gameDate.week - 1) * 7);
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const gameDateToFutureDate = (
  gameDate: GameDate,
  currentRealDate: Date,
  currentGameDate: GameDate,
): Date => {
  const weeksInFuture =
    gameDate.year * 52 +
    gameDate.week -
    (currentGameDate.year * 52 + currentGameDate.week);
  const futureDate = new Date(currentRealDate);
  futureDate.setDate(futureDate.getDate() + weeksInFuture * 7);
  return futureDate;
};

const CountdownUnit: React.FC<{ value: number; label: string }> = ({
  value,
  label,
}) => (
  <div className="text-center w-16">
    <p className="text-3xl font-bold">{String(value).padStart(2, "0")}</p>
    <p className="text-[10px] uppercase tracking-widest text-zinc-400">
      {label}
    </p>
  </div>
);

const SpotifyAlbumCountdownView: React.FC = () => {
  const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
  const [timeLeft, setTimeLeft] = useState({
    days: 33,
    hours: 18,
    minutes: 18,
    seconds: 46,
  });

  const { selectedReleaseId, date: gameDate } = gameState;

  const { labelSubmissions, songs } = activeArtistData!;
  const submission = useMemo(
    () => labelSubmissions.find((sub) => sub.release.id === selectedReleaseId),
    [labelSubmissions, selectedReleaseId],
  );
  const release = submission?.release;
  const releaseSongs = useMemo(() => {
    if (!release) return [];
    return release.songIds
      .map((id) => songs.find((s) => s.id === id))
      .filter(Boolean) as Song[];
  }, [release, songs]);

  useEffect(() => {
    if (!submission?.projectReleaseDate) return;

    const targetDate = gameDateToFutureDate(
      submission.projectReleaseDate,
      new Date(),
      gameDate,
    );

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [submission, gameDate]);

  if (!submission || !release || !activeArtist) {
    dispatch({ type: "CHANGE_VIEW", payload: "spotify" });
    return null;
  }

  const tracklist = releaseSongs;

  let distroString = "";
  if (release.releasingLabel) {
    const customLabel = activeArtistData.customLabels.find(
      (l) => l.id === release.releasingLabel!.id,
    );
    if (customLabel) {
      if (customLabel.exclusiveLicenseId) {
        const major = LABELS.find(
          (l) => l.id === customLabel.exclusiveLicenseId,
        );
        if (major) distroString = `Exclusive License to ${major.name}`;
      } else if (customLabel.dealWithMajorId) {
        const major = LABELS.find((l) => l.id === customLabel.dealWithMajorId);
        if (major) distroString = `A ${major.name} Release`;
      }
    }
  }

  return (
    <div className="h-full w-full bg-black text-white overflow-y-auto pb-20">
      <header className="px-4 py-3 sticky top-0 bg-black/80 backdrop-blur-md z-10 flex items-center gap-4 border-b border-zinc-900 shadow-xl">
        <button
          onClick={() => dispatch({ type: "CHANGE_VIEW", payload: "spotify" })}
          className="p-2 -m-2 opacity-80 hover:opacity-100"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <div className="font-bold tracking-tight text-lg truncate">
          Countdown
        </div>
      </header>
      <main className="p-4 space-y-8">
        <img
          src={release.countdownImageUrl || release.coverArt}
          alt={release.title}
          className="w-full aspect-square object-cover rounded-xl shadow-2xl shadow-black/80 ring-1 ring-white/10"
        />

        <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl backdrop-blur-sm shadow-xl">
          <img
            src={release.coverArt}
            alt={release.title}
            className="w-14 h-14 rounded-md object-cover shadow-md"
          />
          <div className="flex-grow flex justify-around items-center">
            <CountdownUnit value={timeLeft.days} label="Days" />
            <div className="border-l border-zinc-700 h-8"></div>
            <CountdownUnit value={timeLeft.hours} label="Hrs" />
            <div className="border-l border-zinc-700 h-8"></div>
            <CountdownUnit value={timeLeft.minutes} label="Mins" />
            <div className="border-l border-zinc-700 h-8"></div>
            <CountdownUnit value={timeLeft.seconds} label="Secs" />
          </div>
        </div>

        <div className="px-1 space-y-1">
          {distroString && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
              {distroString}
            </p>
          )}
          <h1 className="text-3xl font-black tracking-tighter truncate">
            {release.title}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <img
              src={activeArtist.image}
              className="w-6 h-6 rounded-full object-cover shadow-sm bg-zinc-800"
            />
            <p className="font-bold text-lg">{activeArtist.name}</p>
          </div>
          <p className="text-zinc-400 text-sm font-medium pt-1">
            Album • Releases on{" "}
            {formatReleaseDateString(submission.projectReleaseDate!)}
          </p>
        </div>

        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-6 text-zinc-400">
            <button className="hover:text-white hover:scale-110 active:scale-95 transition-transform">
              <PlusIcon className="w-7 h-7" />
            </button>
            <button className="hover:text-white hover:scale-110 active:scale-95 transition-transform">
              <ArrowUpTrayIcon className="w-7 h-7" />
            </button>
            <button className="hover:text-white hover:scale-110 active:scale-95 transition-transform">
              <DotsHorizontalIcon className="w-7 h-7" />
            </button>
          </div>
          <button className="flex items-center justify-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] active:scale-95 transition-all text-black font-extrabold px-8 py-3 rounded-full text-sm tracking-wide">
            Pre-save
          </button>
        </div>

        <div className="pt-6 border-t border-zinc-800 px-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl text-white/90">Tracklist</h2>
            {!release.isTracklistRevealed && (
              <button
                onClick={() =>
                  dispatch({
                    type: "REVEAL_TRACKLIST",
                    payload: { submissionId: submission.id },
                  })
                }
                className="bg-zinc-800 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-zinc-700"
              >
                Reveal All
              </button>
            )}
          </div>

          {release.isTracklistRevealed && release.tracklistImageUrl && (
            <img
              src={release.tracklistImageUrl}
              className="w-full rounded-xl mb-6 shadow-xl border border-zinc-800"
            />
          )}

          <div className="space-y-1">
            {tracklist.map((song, idx) => {
              const isRevealed =
                release.isTracklistRevealed ||
                release.revealedTrackIds?.includes(song.id) ||
                submission.singlesToRelease?.some((s) => s.songId === song.id);
              const title = isRevealed
                ? song.title.replace(/\s*\(feat\..*\)/, "")
                : `Track ${idx + 1}`;
              return (
                <div
                  key={song.id}
                  className="flex justify-between items-center py-2 px-2 hover:bg-zinc-800/50 rounded-lg group transition-colors"
                >
                  <div className="flex gap-4 items-center overflow-hidden flex-grow">
                    <p className="text-zinc-500 font-bold w-4 text-right tabular-nums">
                      {idx + 1}
                    </p>
                    <div className="truncate">
                      <p
                        className={`font-bold text-base truncate ${!isRevealed ? "text-zinc-500" : "text-white"}`}
                      >
                        {title}
                      </p>
                      <div className="flex items-center gap-2 text-zinc-400 text-sm mt-0.5">
                        {isRevealed && song.explicit && (
                          <span className="w-4 h-4 bg-zinc-600 text-zinc-300 text-[10px] font-bold rounded-sm flex items-center justify-center -translate-y-[1px]">
                            E
                          </span>
                        )}
                        {isRevealed && (
                          <p className="truncate">{activeArtist.name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {!isRevealed ? (
                    <button
                      onClick={() =>
                        dispatch({
                          type: "REVEAL_SINGLE_TRACK_COUNTDOWN",
                          payload: {
                            submissionId: submission.id,
                            songId: song.id,
                          },
                        })
                      }
                      className="opacity-0 group-hover:opacity-100 bg-zinc-700 text-xs px-2 py-1 rounded hover:bg-zinc-600 transition-opacity whitespace-nowrap"
                    >
                      Reveal
                    </button>
                  ) : (
                    <DotsHorizontalIcon className="w-5 h-5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {activeArtistData.merch.filter((m) => m.releaseId === release.id)
          .length > 0 && (
          <div className="pt-8 px-2 space-y-4">
            <h2 className="font-bold text-xl text-white/90">Merch</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
              {activeArtistData.merch
                .filter((m) => m.releaseId === release.id)
                .map((merchItem) => (
                  <div
                    key={merchItem.id}
                    className="flex-shrink-0 w-40 snap-start"
                  >
                    <div className="w-40 h-40 bg-zinc-900 rounded-lg mb-2 flex items-center justify-center p-2 border border-zinc-800 object-cover shadow-md">
                      <img
                        src={release.coverArt}
                        className="w-full h-full object-cover shadow-sm"
                      />
                    </div>
                    <p className="font-bold text-sm truncate">
                      {merchItem.name}
                    </p>
                    <p className="text-zinc-400 text-sm">
                      ${merchItem.price.toFixed(2)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="px-2 pb-6 space-y-1">
          <p className="text-zinc-500 text-[11px] font-medium tracking-tight">
            © {submission.projectReleaseDate?.year} {activeArtist.name} under
            exclusive license to{" "}
            {release.releasingLabel?.name ||
              LABELS.find((l) => l.id === activeArtistData.contract?.labelId)
                ?.name ||
              activeArtist.name}
          </p>
          <p className="text-zinc-500 text-[11px] font-medium tracking-tight">
            ℗ {submission.projectReleaseDate?.year} {activeArtist.name} under
            exclusive license to{" "}
            {release.releasingLabel?.name ||
              LABELS.find((l) => l.id === activeArtistData.contract?.labelId)
                ?.name ||
              activeArtist.name}
          </p>
        </div>
      </main>
    </div>
  );
};

export default SpotifyAlbumCountdownView;
