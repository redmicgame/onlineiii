

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import SpotifyIcon from './icons/SpotifyIcon';
import YouTubeIcon from './icons/YouTubeIcon';
import XIcon from './icons/XIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';
import BuildingOfficeIcon from './icons/BuildingOfficeIcon';
import ShoppingBagIcon from './icons/ShoppingBagIcon';
import MegaphoneIcon from './icons/MegaphoneIcon';
import DollarIcon from './icons/DollarIcon';
import ITunesIcon from './icons/ITunesIcon';
import TrophyIcon from './icons/TrophyIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import ArrowUpOnBoxIcon from './icons/ArrowUpOnBoxIcon';
import { GameView } from '../types';
import TicketIcon from './icons/TicketIcon';
import AppleMusicIcon from './icons/AppleMusicIcon';
import OscarAwardIcon from './icons/OscarAwardIcon';
import GoogleIcon from './icons/GoogleIcon';
import RedditIcon from './icons/RedditIcon';
import VogueIcon from './icons/VogueIcon';
import BillboardIcon from './icons/BillboardIcon';
import RollingStoneIcon from './icons/RollingStoneIcon';

import TikTokIcon from './icons/TikTokIcon';
import RiaaIcon from './icons/RiaaIcon';
import { getEraConfiguration } from '../utils/eraUtils';

import GlobeAltIcon from './icons/GlobeAltIcon';

interface AppInfo {
    name: string;
    description: string;
    icon: React.ReactNode;
    view: GameView;
    bgColor?: string;
    iconColor?: string;
}

interface AppCategory {
    title: string;
    apps: AppInfo[];
}

const appCategories: AppCategory[] = [
    {
        title: '🌐 Global Online World',
        apps: [
            { name: 'Online World', description: 'Real players, global market & live charts', icon: <GlobeAltIcon className="w-8 h-8 text-white animate-pulse" />, view: 'onlineHub', bgColor: '#DC2626' },
            { name: 'Leaderboard', description: 'Worldwide Player Rankings', icon: <TrophyIcon className="w-8 h-8"/>, view: 'leaderboard', bgColor: '#B91C1C' },
        ]
    },
    {
        title: 'Music & Audio',
        apps: [
            { name: 'Spotify', description: 'Stream your music', icon: <SpotifyIcon className="w-8 h-8"/>, view: 'spotify', bgColor: '#1DB954' },
            { name: 'Apple Music', description: 'Explore your catalog', icon: <AppleMusicIcon className="w-8 h-8"/>, view: 'appleMusic' },
            { name: 'Studio', description: 'Record your next hit song', icon: <MicrophoneIcon className="w-8 h-8"/>, view: 'studio', bgColor: '#ef4444' },
            { name: 'Release Hub', description: 'Release unreleased music', icon: <ArrowUpOnBoxIcon className="w-8 h-8"/>, view: 'releaseHub', bgColor: '#6366f1' },
            { name: 'iTunes', description: 'Climb the download charts', icon: <ITunesIcon className="w-8 h-8"/>, view: 'itunes' },
            { name: 'Pitchfork', description: 'Get your music reviewed', icon: <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 fill-current"><title>Pitchfork</title><path d="M19.505 15.867v-3.32c0-1.74-1.29-2.31-2.07-2.31-.69 0-1.12.3-1.12.72 0 .54.495.69 1.125.84l2.19.495c2.31.525 3.51 1.74 3.51 4.155v3.375c0 3.315-2.73 4.155-5.61 4.155-2.715 0-5.415-.81-5.415-4.155v-3.375c0-1.74-1.29-2.31-2.07-2.31-.69 0-1.12.3-1.12.72 0 .54.495.69 1.125.84l2.19.495c2.31.525 3.51 1.74 3.51 4.155v3.32c0 2.22-1.26 3.75-4.59 3.75-2.925 0-4.2-1.2-4.2-3.75V.012h4.59v12.42c0 1.74 1.29 2.31 2.07 2.31.69 0 1.12-.3 1.12-.72 0-.54-.495-.69-1.125-.84l-2.19-.495c-2.31-.525-3.51-1.74-3.51-4.155V.012h4.59v12.42c0 1.74 1.29 2.31 2.07 2.31.69 0 1.12-.3 1.12-.72 0-.54-.495-.69-1.125-.84l-2.19-.495c-2.31-.525-3.51-1.74-3.51-4.155V.012h4.59v12.42c0 2.22 1.26 3.75 4.59 3.75 2.925 0 4.2-1.2 4.2-3.75V.012h-4.59v12.51c0 1.74-1.29 2.31-2.07 2.31-.69 0-1.12.3-1.12.72 0 .54.495.69 1.125.84l2.19.495c2.31.525 3.51 1.74 3.51 4.155z"></path></svg>, view: 'pitchfork', bgColor: '#000000' },
        ]
    },
    {
        title: 'Social & Video',
        apps: [
            { name: 'MySpace', description: 'A place for friends', icon: <span className="font-bold text-xl text-[#003399]">My</span>, view: 'myspace', bgColor: '#e9e9e9' },
            { name: 'IMDb', description: 'Movies, TV and Celebrities', icon: <span className="font-bold text-xl text-black">IMDb</span>, view: 'imdb', bgColor: '#f5c518' },
            { name: 'TikTok', description: 'Make short videos', icon: <TikTokIcon className="w-8 h-8"/>, view: 'tiktok', bgColor: '#000000', iconColor: '#25F4EE' },
            { name: 'Instagram', description: 'Share photos visually', icon: <span className="font-bold text-2xl font-serif text-white">Ig</span>, view: 'instagram', bgColor: '#E1306C' },
            { name: 'Google', description: 'Search the web', icon: <GoogleIcon className="w-8 h-8"/>, view: 'google', bgColor: '#FFFFFF', iconColor: '#000000' },
            { name: 'Reddit', description: 'Read popheads', icon: <RedditIcon className="w-8 h-8"/>, view: 'reddit', bgColor: '#FF4500', iconColor: '#FFFFFF' },

            { name: 'Vogue', description: 'Fashion & Style', icon: <VogueIcon className="w-8 h-8"/>, view: 'vogue', bgColor: '#FFFFFF', iconColor: '#000000' },
            { name: 'Billboard', description: 'Music News', icon: <BillboardIcon className="w-8 h-8"/>, view: 'billboard_news', bgColor: '#000000', iconColor: '#FFFFFF' },
            { name: 'Rolling Stone', description: 'Culture & Music', icon: <RollingStoneIcon className="w-8 h-8"/>, view: 'rollingstone', bgColor: '#DC2626', iconColor: '#FFFFFF' },


            { name: 'X', description: 'Connect with fans worldwide', icon: <XIcon className="w-7 h-7"/>, view: 'x', bgColor: '#000000' },
            { name: 'MTV', description: 'Music Television', icon: <span className="font-black text-2xl italic">MTV</span>, view: 'mtv', bgColor: '#000000' },
            { name: 'YouTube', description: 'Watch and share videos', icon: <YouTubeIcon className="w-8 h-8"/>, view: 'youtube', bgColor: '#FF0000' },
            { name: 'Vevo', description: 'Distribute your music videos', icon: <span className="font-black text-2xl italic">vevo</span>, view: 'vevo', bgColor: '#FF0000' },
            { name: 'YT Studio', description: 'Analyze your channel performance', icon: <YouTubeIcon className="w-8 h-8"/>, view: 'youtubeStudio', bgColor: '#282828'},
            { name: 'YT Music', description: 'Stream ad-free music', icon: <YouTubeIcon className="w-8 h-8"/>, view: 'youtubeMusic', bgColor: '#000000' },
            { name: 'OnlyFans', description: 'Monetize exclusive content', icon: <span className="font-bold text-2xl">OF</span>, view: 'onlyfansSetup', bgColor: '#00AFF0' },
        ]
    },
    {
        title: 'Business & Promotion',
        apps: [
            { name: 'Hits Radio', description: 'Manage radio airplay', icon: <span className="font-black italic text-xl pr-1">HITS</span>, view: 'radioDash', bgColor: '#000000' },
            { name: 'Labels', description: 'Sign a record deal', icon: <BuildingOfficeIcon className="w-8 h-8"/>, view: 'labels', bgColor: '#4b5563' },
            { name: 'Ticketmaster', description: 'Plan and manage your tours', icon: <TicketIcon className="w-8 h-8"/>, view: 'tours', bgColor: '#026cdf' },
            { name: 'ASCAP', description: 'Digital streaming distribution rights', icon: <span className="font-bold text-xl text-white italic">ASCAP</span>, view: 'ascap', bgColor: '#183b5e' },
            { name: 'Piracy', description: 'Monitor illegal downloads', icon: <span className="font-bold text-xl text-white">LW</span>, view: 'limewire', bgColor: '#2B8B3B' },
            { name: 'Payola', description: 'Influence the industry', icon: <MegaphoneIcon className="w-8 h-8"/>, view: 'promote', bgColor: '#ef4444' },
            { name: 'Gigs', description: 'Perform live shows', icon: <MicrophoneIcon className="w-8 h-8"/>, view: 'gigs', bgColor: '#a855f7' },
            { name: 'Merch Store', description: 'Sell vinyls, CDs, and more', icon: <ShoppingBagIcon className="w-8 h-8"/>, view: 'merchStore', bgColor: '#ec4899' },
            { name: 'Catalog', description: 'Manage your assets', icon: <DollarIcon className="w-8 h-8"/>, view: 'catalog', bgColor: '#22c55e' },
            { name: 'Crypto', description: 'Make and manage your own cryptocurrency', icon: <span className="font-bold text-xl text-white">₿</span>, view: 'crypto', bgColor: '#f59e0b' },
        ]
    },
    {
        title: 'Charts & Career',
        apps: [
            { name: 'Official UK Charts', description: 'Official Singles Chart', icon: <span className="font-bold text-xl text-white">UK</span>, view: 'ukChart', bgColor: '#0024f0' },
            { name: 'Spotify Charts', description: 'Top 50 Global', icon: <SpotifyIcon className="w-8 h-8"/>, view: 'spotifyChart', bgColor: '#1DB954', iconColor: '#000000' },
            { name: 'Apple Music for Artists', description: 'Artist Dashboard', icon: <ITunesIcon className="w-8 h-8"/>, view: 'itunesDashboard', bgColor: '#ffffff', textColor: '#fa243c' as any },
                        { name: 'Spotify Podcasts', description: 'Top podcasts', icon: <SpotifyIcon className="w-8 h-8 text-[#a970ff]"/>, view: 'spotifyPodcasts', bgColor: '#000000' },
            { name: 'Spotify for Creators', description: 'Manage podcasts', icon: <SpotifyIcon className="w-8 h-8 text-[#a970ff]"/>, view: 'spotifyForCreators', bgColor: '#000000' },
            { name: 'Spotify for Artists', description: 'Manage your artist profile', icon: <SpotifyIcon className="w-8 h-8"/>, view: 'spotifyForArtists', bgColor: '#000000' },
            { name: 'HITS Daily Double', description: 'Album Sales Predictions', icon: <ChartBarIcon className="w-8 h-8"/>, view: 'albumPredictions', bgColor: '#DC2626', textColor: '#ffffff' as any },
            { name: 'Talk of the Charts', description: 'Early Hot 100 Predictions', icon: <ChartBarIcon className="w-8 h-8"/>, view: 'chartPredictions', bgColor: '#d99aff' },
            { name: 'Kalshi', description: 'Prediction Markets', icon: <span className="font-bold text-xl text-white">Kalshi</span>, view: 'kalshi', bgColor: '#00D182' },
            { name: 'GRAMMYs', description: 'Your awards history', icon: <TrophyIcon className="w-8 h-8"/>, view: 'grammys', bgColor: '#f59e0b' },
            { name: 'Oscars', description: 'Your film awards history', icon: <OscarAwardIcon className="w-8 h-8" />, view: 'oscars', bgColor: '#c7a34a' },
            { name: 'Golden Globes', description: 'Your TV & film awards history', icon: <TrophyIcon className="w-8 h-8" />, view: 'goldenGlobes', bgColor: '#d97706' },
            { name: 'Achievements', description: 'View career milestones', icon: <TrophyIcon className="w-8 h-8"/>, view: 'achievements', bgColor: '#ca8a04' },
            { name: 'Chart History', description: 'Your all-time chart stats', icon: <ChartBarIcon className="w-8 h-8"/>, view: 'chartHistory', bgColor: '#0ea5e9' },
            { name: 'RIAA', description: 'Gold & Platinum Awards', icon: <RiaaIcon className="w-8 h-8"/>, view: 'riaa', bgColor: '#333333', iconColor: '#E5E4E2' },
        ]
    }
];

// removed essentialApps


const AppItem: React.FC<{ app: AppInfo, onMoveUp?: () => void, onMoveDown?: () => void, isEditing?: boolean }> = ({ app, onMoveUp, onMoveDown, isEditing }) => {
    const { dispatch, activeArtistData } = useGame();
    const handleClick = () => {
        if (isEditing) return;
        if (app.view === 'onlyfansSetup' && activeArtistData?.onlyfans) {
            dispatch({ type: 'CHANGE_VIEW', payload: 'onlyfans' });
        } else {
            dispatch({ type: 'CHANGE_VIEW', payload: app.view });
        }
    }
    return (
        <div className="flex items-center">
            {isEditing && (
                <div className="flex flex-col mr-2 shrink-0">
                    <button onClick={onMoveUp} className="p-1 hover:bg-zinc-800 rounded text-zinc-400">▲</button>
                    <button onClick={onMoveDown} className="p-1 hover:bg-zinc-800 rounded text-zinc-400">▼</button>
                </div>
            )}
            <div className="w-16 h-16 rounded-xl flex items-center justify-center p-2 flex-shrink-0" style={{ backgroundColor: app.bgColor || '#3f3f46' }}>
                <div style={{ color: app.iconColor || '#ffffff' }}>
                    {app.icon}
                </div>
            </div>
            <div className="ml-4 flex-grow">
                <h3 className="font-bold text-lg">{app.name}</h3>
                <p className="text-sm text-zinc-400">{app.description}</p>
            </div>
            {!isEditing && (
                <button onClick={handleClick} className="bg-red-600 text-white font-bold text-sm px-6 py-2 rounded-full hover:bg-red-700 transition-colors flex-shrink-0">
                    OPEN
                </button>
            )}
        </div>
    );
};

const AppsTab: React.FC = () => {
    const { gameState, dispatch, activeArtist } = useGame();
    const [isEditing, setIsEditing] = useState(false);
    const eraConfig = getEraConfiguration(gameState.date.year);
    const activeArtistData = gameState.artistsData[activeArtist?.id || ''];

    const isAppAvailable = (appName: string) => {
        if (appName === 'Spotify' || appName === 'Spotify for Artists' || appName === 'Spotify Charts' || appName === 'Apple Music' || appName === 'Apple Music for Artists') return eraConfig.streamingActive;
        if (appName === 'iTunes') return eraConfig.digitalSalesActive;
        if (appName === 'X') return eraConfig.xAvailable;
        if (appName === 'Spotify Podcasts' || appName === 'Spotify for Creators') return gameState.date.year >= 2020;
        if (appName === 'Instagram') return eraConfig.instagramAvailable;
        if (appName === 'TikTok') return eraConfig.tiktokAvailable;
        if (appName === 'MySpace') return eraConfig.myspaceAvailable;
        if (appName === 'YouTube' || appName === 'YT Studio') return eraConfig.youtubeAvailable;
        if (appName === 'YT Music') return eraConfig.youtubeAvailable && gameState.date.year >= 2015;
        if (appName === 'MTV') return gameState.date.year >= 1975 && gameState.date.year <= 2007;
        if (appName === 'OnlyFans') return eraConfig.onlyfansAvailable;
        if (appName === 'Reddit') return gameState.date.year >= 2012;
        if (appName === 'Piracy') return gameState.date.year >= 1999 && gameState.date.year <= 2008;
        if (appName === 'ASCAP') return gameState.date.year >= 2008;
        if (appName === 'Merch Store' && gameState.date.year >= 2005) {
            return (activeArtistData?.youtubeSubscribers || 0) >= 100;
        }
        return true;
    };

    const essentialAppNames = ['Spotify', 'Spotify for Artists', 'Spotify Charts', 'Catalog', 'X'].filter(isAppAvailable);
    const essentialApps = appCategories.flatMap(cat => cat.apps).filter(app => essentialAppNames.includes(app.name));

    const customOrder = activeArtistData?.redMicPro?.appOrder || [];
    const hasRedMicPro = activeArtistData?.redMicPro?.unlocked;

    const moveApp = (list: AppInfo[], index: number, direction: -1 | 1) => {
        if (index + direction < 0 || index + direction >= list.length) return;
        const appA = list[index].name;
        const appB = list[index + direction].name;

        let newOrder = [...customOrder];
        if (newOrder.length === 0) {
            newOrder = Array.from(new Set([
                ...essentialApps.map(a => a.name),
                ...appCategories.flatMap(c => c.apps.map(a => a.name))
            ]));
        }

        const posA = newOrder.indexOf(appA);
        const posB = newOrder.indexOf(appB);

        if (posA !== -1 && posB !== -1) {
            newOrder[posA] = appB;
            newOrder[posB] = appA;
        } else if (posA !== -1) {
            newOrder.splice(posA + direction, 0, appB);
        } else if (posB !== -1) {
            newOrder.splice(posB - direction, 0, appA);
        }

        dispatch({ type: 'SET_APP_ORDER', payload: { appOrder: newOrder } });
    };

    const renderList = (title: string, list: AppInfo[]) => {
        if (list.length === 0) return null;
        let sortedList = [...list];
        if (customOrder.length > 0) {
            sortedList.sort((a, b) => {
                const indexA = customOrder.indexOf(a.name);
                const indexB = customOrder.indexOf(b.name);
                if (indexA === -1 && indexB === -1) return 0;
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
            });
        }

        return (
            <div className="mb-8" key={title}>
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <div className="space-y-6">
                    {sortedList.map((app, index) => (
                        <AppItem 
                            key={`${title}-${app.name}`} 
                            app={app} 
                            isEditing={isEditing} 
                            onMoveUp={() => moveApp(sortedList, index, -1)} 
                            onMoveDown={() => moveApp(sortedList, index, 1)} 
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-[#121212] h-full overflow-y-auto p-4 text-white pb-24">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-bold">Apps</h1>
                    <p className="text-zinc-400">Discover the best apps</p>
                </div>
                {hasRedMicPro && (
                    <button onClick={() => setIsEditing(!isEditing)} className={`text-xs px-3 py-1.5 rounded-full font-bold ${isEditing ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-300'}`}>
                        {isEditing ? 'DONE EDITING' : 'REARRANGE APPS'}
                    </button>
                )}
            </div>

            {renderList('Essential Apps', essentialApps)}
            
            <div className="space-y-8">
                {appCategories.map(category => {
                    const catApps = category.apps.filter(app => isAppAvailable(app.name));
                    return renderList(category.title, catApps);
                })}
            </div>
        </div>
    );
};
export default AppsTab;
