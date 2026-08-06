import React, { useState } from "react";
import { useGame, formatNumber } from "../context/GameContext";
import { Song } from "../types";
import ArrowLeftIcon from "./icons/ArrowLeftIcon";
import ChevronRightIcon from "./icons/ChevronRightIcon";
import ChartBarIcon from "./icons/ChartBarIcon";
import DownloadIconSimple from "./icons/DownloadIconSimple";
import ConfirmationModal from "./ConfirmationModal";

const QualityBadge: React.FC<{ quality: number; showNumber: boolean }> = ({
  quality,
  showNumber,
}) => {
  const getQualityColor = () => {
    if (quality < 50) return "bg-red-500 text-white";
    if (quality < 70) return "bg-yellow-500 text-black";
    if (quality < 96) return "bg-green-400 text-black";
    return "bg-green-600 text-white";
  };
  return (
    <div
      className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold text-lg ${getQualityColor()}`}
    >
      {showNumber ? quality : ""}
    </div>
  );
};

const UnreleasedSongItem: React.FC<{
  song: Song;
  showQuality: boolean;
  onDelete?: (songId: string) => void;
  onToggleVault?: (songId: string) => void;
}> = ({ song, showQuality, onDelete, onToggleVault }) => (
  <div
    className={`bg-zinc-800 p-3 rounded-lg flex items-center gap-4 ${song.isVaulted ? "opacity-70 grayscale border-zinc-600 border" : ""}`}
  >
    <img
      src={song.coverArt}
      alt={song.title}
      className="w-16 h-16 rounded-md object-cover"
    />
    <div className="flex-grow">
      <p className="font-bold">
        {song.title}{" "}
        {song.isVaulted && (
          <span className="text-xs bg-zinc-700 text-zinc-300 px-1 py-0.5 rounded ml-2 uppercase">
            Vaulted
          </span>
        )}
      </p>
      <p className="text-sm text-zinc-400">{song.genre}</p>
      {song.leakInfo && (
        <div className="mt-1 text-xs font-semibold flex items-center gap-3">
          <span className="bg-yellow-900/50 px-2 py-0.5 rounded-full text-yellow-300">
            LEAKED
          </span>
          <div className="flex items-center gap-1 text-yellow-400">
            <ChartBarIcon className="w-4 h-4" />
            <span>{formatNumber(song.leakInfo.illegalStreams)}</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-400">
            <DownloadIconSimple className="w-4 h-4" />
            <span>{formatNumber(song.leakInfo.illegalDownloads)}</span>
          </div>
        </div>
      )}
    </div>
    <div className="flex flex-col items-center">
        <QualityBadge quality={song.quality} showNumber={showQuality} />
        {showQuality && (song as any).trait && (
            <span className="text-[9px] text-zinc-400 mt-1 uppercase font-bold text-center leading-tight max-w-[60px]">{(song as any).trait}</span>
        )}
    </div>
    {onToggleVault && (
      <button
        onClick={() => onToggleVault(song.id)}
        className="p-2 ml-2 bg-zinc-600 rounded-md text-white font-bold text-xs hover:bg-zinc-500"
      >
        {song.isVaulted ? "Unvault" : "Vault"}
      </button>
    )}
    {onDelete && (
      <button
        onClick={() => onDelete(song.id)}
        className="p-2 ml-1 bg-red-600 rounded-md text-white font-bold text-xs hover:bg-red-500"
      >
        Delete
      </button>
    )}
  </div>
);

const ReleaseHubView: React.FC = () => {
  const { dispatch, activeArtistData } = useGame();
  const [deleteSongId, setDeleteSongId] = useState<string | null>(null);

  if (!activeArtistData) return null;

  const { songs, contract, redMicPro } = activeArtistData;

  const unreleasedSongs = songs.filter((s) => !s.isReleased && !s.releaseId);

  const hasUnreleased = unreleasedSongs.length > 0;

  const handleDeleteClick = (songId: string) => {
    setDeleteSongId(songId);
  };

  const confirmDelete = () => {
    if (deleteSongId) {
      dispatch({ type: "DELETE_SONG", payload: { songId: deleteSongId } });
      setDeleteSongId(null);
    }
  };

  return (
    <div className="h-full w-full bg-zinc-900 overflow-y-auto">
      <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
        <button
          onClick={() => dispatch({ type: "CHANGE_VIEW", payload: "game" })}
          className="p-2 rounded-full hover:bg-white/10"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Release Hub</h1>
      </header>
      <main className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Unreleased Songs</h2>
          {hasUnreleased && (
            <button
              onClick={() =>
                dispatch({ type: "CHANGE_VIEW", payload: "release" })
              }
              className="flex items-center gap-1 text-red-500 hover:text-red-400 font-semibold"
            >
              {contract ? "Submit to Label" : "Release Music"}{" "}
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          )}
        </div>
        {hasUnreleased ? (
          <div className="space-y-3">
            {unreleasedSongs.map((song) => (
              <UnreleasedSongItem
                key={song.id}
                song={song}
                showQuality={redMicPro.unlocked}
                onToggleVault={(id) =>
                  dispatch({
                    type: "TOGGLE_VAULT_SONG",
                    payload: { songId: id },
                  })
                }
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-zinc-800 rounded-lg">
            <p className="text-zinc-400">No unreleased songs.</p>
            <p className="text-zinc-500 text-sm">
              Go to the "Studio" app to record something new!
            </p>
          </div>
        )}
      </main>
      <ConfirmationModal
        isOpen={!!deleteSongId}
        title="Delete Song"
        message="Are you sure you want to delete this unreleased song? This action cannot be undone."
        onConfirm={confirmDelete}
        onClose={() => setDeleteSongId(null)}
        confirmText="Delete"
      />
    </div>
  );
};

export default ReleaseHubView;
