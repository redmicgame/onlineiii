import { getArtistImage } from "../constants";
import React from 'react';
import { useGame } from '../context/GameContext';
import ChevronRightIcon from './icons/ChevronRightIcon';
import SpotifyIcon from './icons/SpotifyIcon';

const ChartItemPreview: React.FC<{
    rank: number;
    coverArt: string;
    title: string;
    artist: string;
}> = ({ rank, coverArt, title, artist }) => (
    <div className="flex items-center gap-4">
        <div className="text-2xl font-bold w-8 text-center text-zinc-400">{rank}</div>
        <img src={coverArt} alt={title} className="w-14 h-14 rounded-md object-cover"/>
        <div className="flex-grow min-w-0">
            <p className="font-bold truncate">{title}</p>
            <p className="text-sm text-zinc-400 truncate">{artist}</p>
        </div>
    </div>
);

const ChartsTab: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const { billboardHot100, spotifyGlobal = [], billboardTopAlbums, hotPopSongs, hotRapRnb, electronicChart, countryChart, ukSinglesChart = [] } = gameState;

    const billboardTop3 = billboardHot100.slice(0, 3);
    const spotifyTop3 = spotifyGlobal.slice(0, 3);
    const billboardAlbumsTop3 = billboardTopAlbums.slice(0, 3);
    const hotPopTop3 = hotPopSongs.slice(0, 3);
    const hotRapRnbTop3 = hotRapRnb.slice(0, 3);
    const electronicTop3 = electronicChart.slice(0, 3);
    const countryTop3 = countryChart.slice(0, 3);
    const ukTop3 = ukSinglesChart.slice(0, 3);

    return (
        <div className="p-4 space-y-6">
            <h2 className="text-3xl font-bold text-red-500">Charts</h2>
            <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Billboard Hot 100</h3>
                    <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'billboard' })} className="text-sm text-red-400 flex items-center gap-1">
                        View Chart <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
                {billboardTop3.length > 0 ? (
                    <div className="space-y-4">
                        {billboardTop3.map(song => (
                            <ChartItemPreview key={song.uniqueId} rank={song.rank} coverArt={song.coverArt || getArtistImage(song.artist)} title={song.title} artist={song.artist} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-zinc-400">The chart is empty.</p>
                        <p className="text-zinc-500 text-sm">Release music and wait a week for the chart to update.</p>
                    </div>
                )}
            </div>

            <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Billboard 200</h3>
                    <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'billboardAlbums' })} className="text-sm text-red-400 flex items-center gap-1">
                        View Chart <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
                {billboardAlbumsTop3.length > 0 ? (
                    <div className="space-y-4">
                        {billboardAlbumsTop3.map(album => (
                            <ChartItemPreview key={album.uniqueId} rank={album.rank} coverArt={album.coverArt || getArtistImage(album.artistName || album.artist)} title={album.title} artist={album.artist} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-zinc-400">The chart is empty.</p>
                        <p className="text-zinc-500 text-sm">Release an EP or Album and wait a week for the chart to update.</p>
                    </div>
                )}
            </div>
            
             <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <SpotifyIcon className="w-6 h-6"/>
                        <h3 className="font-bold text-lg">Spotify Charts</h3>
                    </div>
                    <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'spotifyChart' })} className="text-sm text-red-400 flex items-center gap-1">
                        View Chart <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
                {spotifyTop3.length > 0 ? (
                    <div className="space-y-4">
                        {spotifyTop3.map(song => (
                            <ChartItemPreview key={song.uniqueId} rank={song.rank} coverArt={song.coverArt || getArtistImage(song.artist)} title={song.title} artist={song.artist} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-zinc-400">The chart is empty.</p>
                         <p className="text-zinc-500 text-sm">Release music and wait a week for the chart to update.</p>
                    </div>
                )}
            </div>

            <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Hot Pop Songs</h3>
                    <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'hotPopSongs' })} className="text-sm text-red-400 flex items-center gap-1">
                        View Chart <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
                {hotPopTop3.length > 0 ? (
                    <div className="space-y-4">
                        {hotPopTop3.map(song => (
                            <ChartItemPreview key={song.uniqueId} rank={song.rank} coverArt={song.coverArt || getArtistImage(song.artist)} title={song.title} artist={song.artist} />
                        ))}
                    </div>
                ) : ( <div className="text-center py-6 text-zinc-400">Chart is empty.</div> )}
            </div>

            <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Hot Rap/R&B Songs</h3>
                    <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'hotRapRnb' })} className="text-sm text-red-400 flex items-center gap-1">
                        View Chart <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
                {hotRapRnbTop3.length > 0 ? (
                    <div className="space-y-4">
                        {hotRapRnbTop3.map(song => (
                            <ChartItemPreview key={song.uniqueId} rank={song.rank} coverArt={song.coverArt || getArtistImage(song.artist)} title={song.title} artist={song.artist} />
                        ))}
                    </div>
                ) : ( <div className="text-center py-6 text-zinc-400">Chart is empty.</div> )}
            </div>

            <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Electronic Chart</h3>
                    <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'electronicChart' })} className="text-sm text-red-400 flex items-center gap-1">
                        View Chart <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
                {electronicTop3.length > 0 ? (
                    <div className="space-y-4">
                        {electronicTop3.map(song => (
                            <ChartItemPreview key={song.uniqueId} rank={song.rank} coverArt={song.coverArt || getArtistImage(song.artist)} title={song.title} artist={song.artist} />
                        ))}
                    </div>
                ) : ( <div className="text-center py-6 text-zinc-400">Chart is empty.</div> )}
            </div>

            <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Country Chart</h3>
                    <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'countryChart' })} className="text-sm text-red-400 flex items-center gap-1">
                        View Chart <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
                {countryTop3.length > 0 ? (
                    <div className="space-y-4">
                        {countryTop3.map(song => (
                            <ChartItemPreview key={song.uniqueId} rank={song.rank} coverArt={song.coverArt || getArtistImage(song.artist)} title={song.title} artist={song.artist} />
                        ))}
                    </div>
                ) : ( <div className="text-center py-6 text-zinc-400">Chart is empty.</div> )}
            </div>
        </div>
    );
};

export default ChartsTab;