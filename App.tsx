import GoldenGlobesView from './components/GoldenGlobesView';
import SubmitForGoldenGlobesView from './components/SubmitForGoldenGlobesView';
import KaiStreamSetupView from "./components/KaiStreamSetupView";
import { ScreenshotOverlay } from './components/ScreenshotOverlay';


import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import StartScreen from './components/StartScreen';
import GameUI from './components/GameUI';
import EncounterModalView from './components/EncounterModalView';
import SpotifyView from './components/SpotifyView';
import StudioView from './components/StudioView';
import ReleaseView from './components/ReleaseView';
import PitchforkView from './components/PitchforkView';
import YouTubeView from './components/YouTubeView';
import YouTubeMusicView from './components/YouTubeMusicView';
import VevoView from './components/VevoView';
import MTVView from './components/MTVView';
import CreateMagazineInterviewView from './components/CreateMagazineInterviewView';
import CreateTvInterviewView from './components/CreateTvInterviewView';
import CreateVideoView from './components/CreateVideoView';
import YouTubeStoreView from './components/YouTubeStoreView';
import InboxView from './components/InboxView';
import CatalogView from './components/CatalogView';
import PromoteView from './components/PromoteView';
import BillboardView from './components/BillboardView';
import BillboardAlbumsView from './components/BillboardAlbumsView';
import SpotifyChartView from './components/SpotifyChartView';
import SpotifyVideoChartView from './components/SpotifyVideoChartView';
import YouTubeVideoDetailView from './components/YouTubeVideoDetailView';
import YouTubeStudioView from './components/YouTubeStudioView';
import GigsView from './components/GigsView';
import LabelReleasePlanView from './components/LabelReleasePlanView';
import CreateGeniusInterviewView from './components/CreateGeniusInterviewView';
import XView from './components/XView';
import XProfileView from './components/XProfileView';
import XChatView from './components/XChatView';
import XCreateSpaceView from './components/XCreateSpaceView';
import XActiveSpaceView from './components/XActiveSpaceView';
import XAnalyticsView from './components/XAnalyticsView';
import XCreatorStudioView from './components/XCreatorStudioView';
import ManagerPodcastsView from './components/ManagerPodcastsView';
import SpotifyPodcastsView from './components/SpotifyPodcastsView';
import SpotifyForCreatorsView from './components/SpotifyForCreatorsView';
import SpotifyForArtistsView from './components/SpotifyForArtistsView';
import AppleMusicForArtistsView from './components/AppleMusicForArtistsView';
import './utils/xContentGenerator';
import CreateFallonPerformanceView from './components/CreateFallonPerformanceView';
import CreateFallonInterviewView from './components/CreateFallonInterviewView';
import SpotifyAlbumCountdownView from './components/SpotifyAlbumCountdownView';
import CreateLabelView from './components/CreateLabelView';
import ManageLabelView from './components/ManageLabelView';
import AlbumPromoView from './components/AlbumPromoView';
import RadioDashView from './components/RadioDashView';
import LimeWireView from './components/LimeWireView';
import AscapView from './components/AscapView';
import PromoInterviewView from './components/PromoInterviewView';
import AchievementsView from './components/AchievementsView';
import RedMicProUnlockView from './components/RedMicProUnlockView';
import RedMicProDashboardView from './components/RedMicProDashboardView';
import WikipediaView from './components/WikipediaView';
import GrammysView from './components/GrammysView';
import SubmitForGrammysView from './components/SubmitForGrammysView';
import CreateGrammyPerformanceView from './components/CreateGrammyPerformanceView';
import GrammyRedCarpetView from './components/GrammyRedCarpetView';
import AmasView from './components/AmasView';
import SubmitForAmasView from './components/SubmitForAmasView';
import CreateAmaPerformanceView from './components/CreateAmaPerformanceView';
import AmaRedCarpetView from './components/AmaRedCarpetView';
import ContractRenewalView from './components/ContractRenewalView';
import ITunesView from './components/ITunesView';
import OnlyFansSetupView from './components/OnlyFansSetupView';
import OnlyFansView from './components/OnlyFansView';
import CreateOnlyFansPostView from './components/CreateOnlyFansPostView';
import ChartHistoryView from './components/ChartHistoryView';
import AlbumSalesChartView from './components/AlbumSalesChartView';
import LabelsView from './components/LabelsView';
import ReleaseHubView from './components/ReleaseHubView';
import CreateSoundtrackView from './components/CreateSoundtrackView';
import CreateFifaWorldCupView from './components/CreateFifaWorldCupView';
import SpotifySoundtrackDetailView from './components/SpotifySoundtrackDetailView';
import GameGuideView from './components/GameGuideView';
import ToursView from './components/ToursView';
import CreateTourView from './components/CreateTourView';
import TourDetailView from './components/TourDetailView';
import ManagementView from './components/ManagementView';
import SecurityView from './components/SecurityView';
import SpotifyTopSongsView from './components/SpotifyTopSongsView';
import SpotifyTopAlbumsView from './components/SpotifyTopAlbumsView';
import CreateVogueFeatureView from './components/CreateVogueFeatureView';
import SpotifyWrappedView from './components/SpotifyWrappedView';
import HotPopSongsView from './components/HotPopSongsView';
import HotRapRnbView from './components/HotRapRnbView';
import ElectronicChartView from './components/ElectronicChartView';
import CountryChartView from './components/CountryChartView';
import CreateFeatureView from './components/CreateFeatureView';
import { CreateFeatureVideoView } from './components/CreateFeatureVideoView';
import CreateOnTheRadarPerformanceView from './components/CreateOnTheRadarPerformanceView';
import CreateTrshdPerformanceView from './components/CreateTrshdPerformanceView';
import AppleMusicView from './components/AppleMusicView';
import OscarsView from './components/OscarsView';
import SubmitForOscarsView from './components/SubmitForOscarsView';
import CreateOscarPerformanceView from './components/CreateOscarPerformanceView';
import OscarRedCarpetView from './components/OscarRedCarpetView';
import MoviePremiereRedCarpetView from './components/MoviePremiereRedCarpetView';
import SwitchSaveView from './components/SwitchSaveView';
import LiveLeaderboardView from './components/LiveLeaderboardView';
import RedCarpetHistoryView from './components/RedCarpetHistoryView';
import DatingView from './components/DatingView';
import GoogleView from './components/GoogleView';
import RedditSiteView from './components/RedditSiteView';
import { VogueSiteView } from './components/VogueSiteView';
import { RollingStoneSiteView } from './components/RollingStoneSiteView';
import BillboardSiteView from './components/BillboardSiteView';

import TikTokView from './components/TikTokView';
import InstagramView from './components/InstagramView';
import TmzArticleView from './components/TmzArticleView';
import RiaaView from './components/RiaaView';
import AttendEventView from './components/AttendEventView';

import MySpaceView from './components/MySpaceView';
import CryptoView from './components/CryptoView';
import { ChartPredictionsView } from './components/ChartPredictionsView';
import KalshiView from './components/KalshiView';
import ImdbView from './components/ImdbView';
import AlbumPredictionsView from './components/AlbumPredictionsView';
import { getEraConfiguration } from './utils/eraUtils';
import UKChartView from './components/UKChartView';
import OnlineHubView from './components/OnlineHubView';

const AppContent: React.FC = () => {
    const { gameState, activeArtistData, dispatch } = useGame();
    const { careerMode, currentView } = gameState;
    const isGoldTheme = activeArtistData?.isGoldTheme ?? false;
    
    const eraConfig = getEraConfiguration(gameState.date.year);

    if (!careerMode) {
        return <StartScreen />;
    }

    const renderView = () => {
        switch (currentView) {
            case 'attendEvent':
                return <AttendEventView />;
            case 'instagram':
                return <InstagramView />;
            case 'tiktok':
                return <TikTokView />;
            
            case 'vogue':
                return <VogueSiteView onClose={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} />;
            case 'rollingstone':
                return <RollingStoneSiteView onClose={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} />;
            case 'billboard_news':
                return <BillboardSiteView initialArticle={{title: 'Music Industry Updates', content: 'Catch up on all the latest news, releases, and rumors across the industry.\n\nStay tuned as we update this section.'}} onClose={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} />;

            case 'reddit':
                return <RedditSiteView onClose={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} />;
            case 'google':
                return <GoogleView />;
            case 'spotify':
                return <SpotifyView />;
            case 'spotifyAlbumCountdown':
                return <SpotifyAlbumCountdownView />;
            case 'managerPodcasts':
                return <ManagerPodcastsView />;
            case 'spotifyPodcasts':
                return <SpotifyPodcastsView />;
            case 'spotifyForCreators':
                return <SpotifyForCreatorsView />;
            case 'spotifyForArtists':
                return <SpotifyForArtistsView />;
            case 'spotifyWrapped':
                return <SpotifyWrappedView />;
            case 'studio':
                return <StudioView />;
            case 'release':
                return <ReleaseView />;
            case 'releaseHub':
                return <ReleaseHubView />;
            case 'pitchfork':
                return <PitchforkView />;
            case 'youtube':
                return <YouTubeView />;
            case 'youtubeMusic':
                return <YouTubeMusicView />;
                case 'vevo':
                    return <VevoView />;
            case 'mtv':
                return <MTVView />;
            case 'youtubeVideoDetail':
                return <YouTubeVideoDetailView />;
            case 'createVideo':
                return <CreateVideoView />;
            case 'merchStore':
                return <YouTubeStoreView />;
            case 'youtubeStudio':
                return <YouTubeStudioView />;
            case 'inbox':
                return <InboxView />;
            case 'albumPredictions':
                return <AlbumPredictionsView />;
            case 'chartPredictions':
                return <ChartPredictionsView />;
            case 'catalog':
                return <CatalogView />;
            case 'promote':
                return <PromoteView />;
            case 'billboard':
                return <BillboardView />;
            case 'billboardAlbums':
                return <BillboardAlbumsView />;
            case 'spotifyChart':
                    return <SpotifyChartView />;
                case 'spotifyVideoChart':
                    return <SpotifyVideoChartView />;
            case 'ukChart':
                return <UKChartView />;
            case 'hotPopSongs':
                return <HotPopSongsView />;
            case 'hotRapRnb':
                return <HotRapRnbView />;
            case 'electronicChart':
                return <ElectronicChartView />;
            case 'countryChart':
                return <CountryChartView />;
            case 'spotifyTopSongs':
                return <SpotifyTopSongsView />;
            case 'spotifyTopAlbums':
                return <SpotifyTopAlbumsView />;
            case 'gigs':
                return <GigsView />;
            case 'tours':
                return <ToursView />;
            case 'createTour':
                return <CreateTourView />;
            case 'tourDetail':
                return <TourDetailView />;
            case 'labels':
                return <LabelsView />;
            case 'labelReleasePlan':
                return <LabelReleasePlanView />;
            case 'createLabel':
                return <CreateLabelView />;
            case 'manageLabel':
                return <ManageLabelView />;
            case 'albumPromo':
                return <AlbumPromoView />;
            case 'achievements':
                return <AchievementsView />;
            case 'chartHistory':
                return <ChartHistoryView />;
            case 'albumSalesChart':
                return <AlbumSalesChartView />;
            case 'radioDash':
                return <RadioDashView />;
            case 'limewire':
                return <LimeWireView />;
            case 'ascap':
                return <AscapView />;
            case 'promoInterview':
                return <PromoInterviewView />;
            case 'createGeniusInterview':
                return <CreateGeniusInterviewView />;
            case 'createOnTheRadarPerformance':
                return <CreateOnTheRadarPerformanceView />;
            case 'createTrshdPerformance':
                return <CreateTrshdPerformanceView />;
            case 'createFallonPerformance':
                return <CreateFallonPerformanceView />;
            case 'createFallonInterview':
                return <CreateFallonInterviewView />;
            case 'createFeature':
                return <CreateFeatureView />;
            case 'createFeatureVideo':
                return <CreateFeatureVideoView />;
            case 'myspace':
                return <MySpaceView />;
            case 'crypto':
                return <CryptoView />;
            case 'x':
                return <XView />;
            case 'xProfile':
                return <XProfileView />;
            case 'xCreateSpace':
                return <XCreateSpaceView />;
            case 'xActiveSpace':
                return <XActiveSpaceView />;
            case 'xAnalytics':
                return <XAnalyticsView />;
            case 'xCreatorStudio':
                return <XCreatorStudioView />;
            case 'xChatDetail':
                return <XChatView />;
            case 'redMicProUnlock':
                return <RedMicProUnlockView />;
            case 'redMicProDashboard':
                return <RedMicProDashboardView />;
            case 'wikipedia':
                return <WikipediaView />;
            case 'grammys':
                return <GrammysView />;
            case 'submitForGrammys':
                return <SubmitForGrammysView />;
            case 'createGrammyPerformance':
                return <CreateGrammyPerformanceView />;
            case 'grammyRedCarpet':
                return <GrammyRedCarpetView />;
            case 'amas':
                return <AmasView />;
            case 'submitForAmas':
                return <SubmitForAmasView />;
            case 'createAmaPerformance':
                return <CreateAmaPerformanceView />;
            case 'amaRedCarpet':
                return <AmaRedCarpetView />;
            case 'oscars':
                return <OscarsView />;
            case 'submitForOscars':
                return <SubmitForOscarsView />;
            case 'submit_for_golden_globes':
                return <SubmitForGoldenGlobesView />;
            case 'kaiStreamSetup':
                return <KaiStreamSetupView />;
            case 'createOscarPerformance':
                return <CreateOscarPerformanceView />;
            case 'oscarRedCarpet':
                return <OscarRedCarpetView />;
            case 'moviePremiereRedCarpet':
                return <MoviePremiereRedCarpetView />;
            case 'switchSave':
                return <SwitchSaveView />;
            case 'leaderboard':
                return <LiveLeaderboardView />;
            case 'redCarpetHistory':
                return <RedCarpetHistoryView />;
            case 'dating':
                return <DatingView />;
            case 'contractRenewal':
                return <ContractRenewalView />;
            case 'itunes':
                return <ITunesView />;
            case 'itunesDashboard':
                return <AppleMusicForArtistsView />;
            case 'appleMusic':
                return <AppleMusicView />;
            case 'imdb':
                return <ImdbView />;
            case 'onlyfansSetup':
                return <OnlyFansSetupView />;
            case 'onlyfans':
                return <OnlyFansView />;
            case 'createOnlyFansPost':
                return <CreateOnlyFansPostView />;
            case 'createSoundtrack':
                return <CreateSoundtrackView />;
            case 'createFifaWorldCup':
                return <CreateFifaWorldCupView />;
            case 'spotifySoundtrackDetail':
                return <SpotifySoundtrackDetailView />;
            case 'gameGuide':
                return <GameGuideView />;
            case 'management':
                return <ManagementView />;
            case 'security':
                return <SecurityView />;
            case 'createVogueFeature':
                return <CreateVogueFeatureView />;
            case 'tmzArticle':
                return <TmzArticleView />;
            case 'riaa':
                return <RiaaView />;
            case 'kalshi':
                return <KalshiView />;
            case 'onlineHub':
                return <OnlineHubView />;
            case 'game':
            default:
                return <GameUI />;
        }
    };

    return (
        <div className={`bg-black min-h-[100dvh] h-[100dvh] w-full flex items-center justify-center ${isGoldTheme ? 'gold-theme' : ''}`}>
             <div className="relative bg-zinc-900 text-white w-full h-full overflow-hidden">
                {renderView()}
                {gameState.activeEncounter && <EncounterModalView />}
             </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <GameProvider>
            <AppContent />
        </GameProvider>
    );
};

export default App;
