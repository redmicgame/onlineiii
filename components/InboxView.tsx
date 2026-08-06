

import React, { useEffect, useMemo, useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { Email, GeniusOffer, FallonOffer, PopBaseOffer } from '../types';
import CoachellaSetlistModal from './CoachellaSetlistModal';
import MenuIcon from './icons/MenuIcon';
import StarIcon from './icons/StarIcon';
import SpotifyIcon from './icons/SpotifyIcon';
import YouTubeIcon from './icons/YouTubeIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import BuildingOfficeIcon from './icons/BuildingOfficeIcon';
import GeniusIcon from './icons/GeniusIcon';
import TonightShowIcon from './icons/TonightShowIcon';
import TrophyIcon from './icons/TrophyIcon';
import MusicNoteIcon from './icons/MusicNoteIcon';
import ConfirmationModal from './ConfirmationModal';
import VogueIcon from './icons/VogueIcon';
import UserIcon from './icons/UserIcon';
import OnTheRadarIcon from './icons/OnTheRadarIcon';
import TrshdIcon from './icons/TrshdIcon';
import OscarAwardIcon from './icons/OscarAwardIcon';
import AmaAwardIcon from './icons/AmaAwardIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

const SenderAvatar: React.FC<{ email: Email }> = ({ email }) => {
    const { sender, senderIcon } = email;

    if (senderIcon === 'popbase') {
        return (
            <div className="w-10 h-10 rounded-full bg-[#728dfa] flex items-center justify-center p-1">
                <svg fill="#ffffff" viewBox="0 0 32 32" className="w-full h-full"><path d="M16 4c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12-5.4-12-12-12zm-3.2 21.2c-.8.8-2 .8-2.8 0l-1.2-1.2c-.8-.8-.8-2 0-2.8l7.6-7.6c.8-.8 2-.8 2.8 0l1.2 1.2c.8.8.8 2 0 2.8L12.8 25.2zm8-13.6c-.8-.8-2-.8-2.8 0l-1.2 1.2c-.8.8-.8 2 0 2.8l7.6 7.6c.8.8 2 .8 2.8 0l1.2-1.2c.8-.8.8-2 0-2.8L20.8 11.6z"></path></svg>
            </div>
        )
    }
    if (senderIcon === 'spotify') {
        return <SpotifyIcon className="w-10 h-10" />;
    }
    if (senderIcon === 'youtube') {
        return (
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                <YouTubeIcon className="w-6 h-6 text-white" />
            </div>
        )
    }
    if (senderIcon === 'label') {
        return (
             <div className="w-10 h-10 rounded-full bg-zinc-600 flex items-center justify-center">
                <BuildingOfficeIcon className="w-6 h-6 text-white" />
            </div>
        )
    }
    if (senderIcon === 'genius') {
        return (
            <div className="w-10 h-10 rounded-full bg-yellow-300 flex items-center justify-center p-1">
                <GeniusIcon className="w-full h-full text-black" />
            </div>
        )
    }
    if (senderIcon === 'ontheradar') {
        return (
            <div className="w-10 h-10 rounded-full bg-black border border-green-500 flex items-center justify-center p-1">
                <OnTheRadarIcon className="w-full h-full text-green-400" />
            </div>
        )
    }
    if (senderIcon === 'trshd') {
        return (
            <div className="w-10 h-10 rounded-full bg-[#FFC700] flex items-center justify-center p-1">
                <TrshdIcon className="w-full h-full text-black" />
            </div>
        )
    }
    if (senderIcon === 'fallon') {
        return (
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center p-1">
                <TonightShowIcon className="w-full h-full text-white" />
            </div>
        )
    }
    if (senderIcon === 'grammys') {
        return (
            <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-black" />
            </div>
        )
    }
    if (senderIcon === 'amas') {
        return (
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                <AmaAwardIcon className="w-6 h-6 text-white" />
            </div>
        )
    }
    if (senderIcon === 'oscars') {
        return (
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <OscarAwardIcon className="w-6 h-6 text-amber-400" />
            </div>
        )
    }
    if (senderIcon === 'soundtrack') {
        return (
             <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                <MusicNoteIcon className="w-6 h-6 text-white" />
            </div>
        )
    }
    if (senderIcon === 'onlyfans') {
        return (
             <div className="w-10 h-10 rounded-full bg-[#00aff0] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-8.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-2.5 4c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/></svg>
            </div>
        )
    }
    if (senderIcon === 'vogue') {
        return (
            <div className="w-10 h-10 rounded-full bg-black border border-zinc-500 flex items-center justify-center p-1">
                <VogueIcon className="w-full h-full text-white" />
            </div>
        )
    }
    if (senderIcon === 'feature') {
        return (
            <div className="w-10 h-10 rounded-full bg-zinc-600 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
            </div>
        )
    }


    const safeSender = sender || 'Unknown';
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-teal-500'];
    const color = colors[safeSender.charCodeAt(0) % colors.length];

    return (
        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
            <span className="text-white font-bold text-xl">{safeSender.charAt(0)}</span>
        </div>
    );
}

const EmailItem: React.FC<{ email: Email; onClick: () => void }> = ({ email, onClick }) => {
    const formattedDate = useMemo(() => {
        if (!email.date) return 'Unknown Date';
        const date = new Date(email.date.year || 2024, 0, ((email.date.week || 1) - 1) * 7 + 1);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }, [email.date]);

    return (
        <button onClick={onClick} className="w-full text-left flex items-start gap-4 p-4 hover:bg-zinc-700/50 transition-colors">
            <SenderAvatar email={email} />
            <div className="flex-grow overflow-hidden">
                <p className={`font-semibold truncate ${!email.isRead ? 'text-white' : 'text-zinc-400'}`}>{email.sender}</p>
                <p className={`font-semibold truncate ${!email.isRead ? 'text-white' : 'text-zinc-400'}`}>{email.subject}</p>
                <p className="text-zinc-500 truncate">{(email.body || email.content || '').replace(/\n/g, ' ')}</p>
            </div>
            <div className="flex flex-col items-end gap-2 text-zinc-500 flex-shrink-0">
                <span className="text-xs font-semibold">{formattedDate}</span>
                <StarIcon className="w-6 h-6" />
            </div>
        </button>
    );
};

const EmailDetailView: React.FC<{ email: Email; onBack: () => void }> = ({ email, onBack }) => {
    const { dispatch } = useGame();
    const [reply, setReply] = useState('');
    const [showSoundtrackConfirm, setShowSoundtrackConfirm] = useState(false);
    const [billionsClubPreviewUrl, setBillionsClubPreviewUrl] = useState<string | null>(null);
    const [isCoachellaModalOpen, setIsCoachellaModalOpen] = useState(false);

    const formattedDate = useMemo(() => {
        if (!email.date) return 'Unknown Date';
        const date = new Date(email.date.year || 2024, 0, ((email.date.week || 1) - 1) * 7 + 1);
        return date.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' });
    }, [email.date]);

    const handleAcceptOffer = () => {
        if (!email.offer) return;
        switch(email.offer.type) {
            case 'actingPremiere':
                dispatch({ type: 'ATTEND_ACTING_PREMIERE', payload: { roleId: email.offer.roleId } });
                break;
            case 'geniusInterview':
                 dispatch({ type: 'ACCEPT_GENIUS_OFFER', payload: { songId: email.offer.songId, emailId: email.id } });
                 break;
            case 'onTheRadarOffer':
                dispatch({ type: 'ACCEPT_ONTHERADAR_OFFER', payload: { songId: email.offer.songId, emailId: email.id } });
                break;
            case 'trshdOffer':
                dispatch({ type: 'ACCEPT_TRSHD_OFFER', payload: { songId: email.offer.songId, emailId: email.id } });
                break;
            case 'fallonOffer':
                dispatch({ type: 'ACCEPT_FALLON_OFFER', payload: { releaseId: email.offer.releaseId, offerType: email.offer.offerType, emailId: email.id } });
                break;
            case 'grammySubmission':
                dispatch({ type: 'GO_TO_GRAMMY_SUBMISSIONS', payload: { emailId: email.id } });
                break;
            case 'grammyNominations':
                if (email.offer.hasPerformanceOffer) {
                    dispatch({ type: 'ACCEPT_GRAMMY_PERFORMANCE', payload: { emailId: email.id } });
                }
                break;
            case 'vmaRedCarpet':
                dispatch({ type: 'ACCEPT_VMA_RED_CARPET', payload: { emailId: email.id, lookUrl: '' } });
                break;
            case 'oscarRedCarpet':
                dispatch({ type: 'ACCEPT_OSCAR_RED_CARPET', payload: { emailId: email.id, lookUrl: '' } });
                break;
            case 'grammyRedCarpet':
                dispatch({ type: 'ACCEPT_GRAMMY_RED_CARPET', payload: { emailId: email.id, lookUrl: '' } }); // Will be handled by the view
                break;
            case 'amaSubmission':
                dispatch({ type: 'GO_TO_AMA_SUBMISSIONS', payload: { emailId: email.id } });
                break;
            case 'amaNominations':
                if (email.offer.hasPerformanceOffer) {
                    dispatch({ type: 'ACCEPT_AMA_PERFORMANCE', payload: { emailId: email.id } });
                }
                break;
            case 'amaRedCarpet':
                dispatch({ type: 'ACCEPT_AMA_RED_CARPET', payload: { emailId: email.id, lookUrl: '' } }); 
                break;
            case 'goldenGlobeNominations':
                dispatch({ type: 'ACCEPT_GOLDEN_GLOBE_INVITE', payload: { emailId: email.id } });
                break;

            case 'goldenGlobeSubmission':
                dispatch({ type: 'GO_TO_GOLDEN_GLOBE_SUBMISSIONS', payload: { emailId: email.id } });
                break;
            case 'oscarSubmission':
                dispatch({ type: 'GO_TO_OSCAR_SUBMISSIONS', payload: { emailId: email.id } });
                break;
            case 'kaiStreamSetup':
                dispatch({ type: 'GO_TO_KAI_STREAM_SETUP', payload: { emailId: email.id } });
                break;
            case 'oscarNominations':
                if (email.offer.hasPerformanceOffer) {
                    dispatch({ type: 'ACCEPT_OSCAR_PERFORMANCE', payload: { emailId: email.id } });
                }
                break;
            case 'onlyfansRequest':
                dispatch({ type: 'ACCEPT_ONLYFANS_REQUEST', payload: { emailId: email.id, payout: email.offer.payout } });
                break;
            case 'soundtrackOffer':
                setShowSoundtrackConfirm(true);
                break;
            case 'fifaWorldCupOffer':
                dispatch({ type: 'ACCEPT_FIFA_OFFER', payload: { emailId: email.id, collabs: email.offer.collabs }});
                break;
            case 'eventInvitation':
                dispatch({ type: 'ACCEPT_EVENT_INVITATION', payload: { emailId: email.id, eventName: email.offer.eventName, hostName: email.offer.hostName, associatedSoundtrack: email.offer.associatedSoundtrack, eventType: email.offer.eventType }});
                break;
            case 'vogueOffer':
                dispatch({ type: 'ACCEPT_VOGUE_OFFER', payload: { magazine: email.offer.magazine, emailId: email.id }});
                break;
            case 'npcContractRenewal':
                dispatch({ type: 'CHANGE_VIEW', payload: 'manageLabel'});
                break;
            case 'featureOffer':
                dispatch({ type: 'ACCEPT_FEATURE_OFFER', payload: email.offer });
                break;
            case 'featureVideoOffer':
                dispatch({ type: 'ACCEPT_FEATURE_VIDEO_OFFER', payload: { ...email.offer, emailId: email.id } });
                break;
            case 'promoInterview':
                dispatch({ type: 'ACCEPT_PROMO_INTERVIEW', payload: { emailId: email.id, source: email.offer.source } });
                break;
            case 'coachellaOffer':
                dispatch({ type: 'SUBMIT_COACHELLA', payload: { emailId: email.id } });
                break;
            case 'coachellaSelection':
                setIsCoachellaModalOpen(true);
                break;
        }
    };
    
    const handlePopBaseReply = () => {
        if (reply.trim() && email.offer?.type.startsWith('popBase')) {
            dispatch({ type: 'ANSWER_POPBASE_QUESTION', payload: { emailId: email.id, answer: reply.trim() } });
        }
    }

    const renderOffer = () => {
        if (!email.offer) return null;

        if (email.offer.type === 'billionsClub') {
            const offer = email.offer;
            return (
                <div className="mt-6 pt-4 border-t border-zinc-700">
                    {!offer.hasUploadedImage ? (
                        <div className="space-y-4 text-center p-6 bg-zinc-800 rounded-xl border border-zinc-700">
                            {billionsClubPreviewUrl ? (
                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg text-white">Preview Image</h3>
                                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-green-500">
                                        <img src={billionsClubPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex gap-2 justify-center">
                                        <button 
                                            onClick={() => setBillionsClubPreviewUrl(null)}
                                            className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                        >
                                            Change Image
                                        </button>
                                        <button 
                                            onClick={() => {
                                                dispatch({ type: 'UPLOAD_BILLIONS_CLUB_IMAGE', payload: { emailId: email.id, songId: offer.songId, imageUrl: billionsClubPreviewUrl }});
                                            }}
                                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                        >
                                            Submit Photo
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
                                        <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.44-.539.18-1.08-.12-1.26-.66-.18-.54.12-1.08.66-1.26 4.32-1.26 9.72-.6 13.5 1.74.48.3.66.84.36 1.32zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.66.18-1.32-.18-1.5-.84-.18-.66.18-1.32.84-1.5 4.08-1.26 11.16-1.02 16.02 1.92.6.36.78 1.14.42 1.74-.36.6-1.14.78-1.74.42z"/>
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-lg text-white">Upload Plaque Photo</h3>
                                    <p className="text-sm text-zinc-400">Select an image to be featured on your Spotify Billions Club plaque and official playlist cover.</p>
                                    <label className="block w-full cursor-pointer bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                                        Choose Image
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    const file = e.target.files[0];
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        if (reader.result) {
                                                            setBillionsClubPreviewUrl(reader.result as string);
                                                        }
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="text-center font-semibold p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <CheckCircleIcon className="w-6 h-6" />
                                <span>Image Uploaded Successfully!</span>
                            </div>
                            <p className="text-xs text-green-500/70">Your plaque is being generated.</p>
                        </div>
                    )}
                </div>
            )
        }

        if (email.offer.type === 'popBaseInterview' || email.offer.type === 'popBaseClarification') {
            const offer = email.offer;
            return (
                <div className="mt-6 pt-4 border-t border-zinc-700">
                    {!offer.isAnswered ? (
                        <div className="space-y-3">
                            <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write your reply..." className="w-full bg-zinc-700 p-3 rounded-md focus:ring-blue-500 focus:border-blue-500" rows={3} />
                            <button onClick={handlePopBaseReply} disabled={!reply.trim()} className="w-full h-12 font-bold py-2 px-4 rounded-lg transition-colors shadow-lg bg-blue-500 hover:bg-blue-600 text-white disabled:bg-zinc-600">Send Reply to Pop Base</button>
                        </div>
                    ) : (<div className="text-center font-semibold p-3 bg-zinc-700/50 rounded-lg">You have replied to this interview.</div>)}
                </div>
            )
        }
        
        if (email.offer.type === 'giveBirth') {
            const offer = email.offer;
            return (
                <div className="mt-6 pt-4 border-t border-zinc-700">
                    {!offer.isAnswered ? (
                        <div className="space-y-3">
                            <input type="text" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Enter child's name..." className="w-full bg-zinc-700 p-3 rounded-md focus:ring-pink-500 focus:border-pink-500 text-white" />
                            <button onClick={() => {
                                if (reply.trim()) {
                                    dispatch({ type: 'GIVE_BIRTH', payload: { childName: reply.trim() } });
                                    dispatch({ type: 'MARK_EMAIL_OFFER_ANSWERED', payload: { emailId: email.id } });
                                }
                            }} disabled={!reply.trim()} className="w-full h-12 font-bold py-2 px-4 rounded-lg transition-colors shadow-lg bg-pink-500 hover:bg-pink-600 text-white disabled:bg-zinc-600">Name Child</button>
                        </div>
                    ) : (<div className="text-center font-semibold p-3 bg-zinc-700/50 rounded-lg">Welcome to the world!</div>)}
                </div>
            )
        }

        if (email.offer.type === 'actingTrailerUpload') {
            const offer = email.offer;
            return (
                <div className="mt-6 pt-4 border-t border-zinc-700">
                    {!(offer as any).isAnswered ? (
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-zinc-300">Upload a thumbnail or trailer cover for "{offer.roleTitle}":</p>
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            const result = event.target?.result as string;
                                            dispatch({ type: 'SET_ACTING_TRAILER_URL', payload: { roleId: offer.roleId, trailerUrl: result } });
                                            (offer as any).isAnswered = true; // Local optimistic update
                                            dispatch({ type: 'MARK_EMAIL_OFFER_ANSWERED', payload: { emailId: email.id } });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} 
                                className="w-full bg-zinc-700 p-3 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f5c518] file:text-black hover:file:bg-[#f5c518]/90" 
                            />
                        </div>
                    ) : (<div className="text-center font-semibold p-3 bg-zinc-700/50 rounded-lg">Thumbnail Submitted!</div>)}
                </div>
            )
        }

        if (email.offer.type === 'actingCoverUpload') {
            const offer = email.offer;
            return (
                <div className="mt-6 pt-4 border-t border-zinc-700">
                    {!(offer as any).isAnswered ? (
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-zinc-300">Upload a cover image for "{offer.roleTitle}":</p>
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            const result = event.target?.result as string;
                                            dispatch({ type: 'SET_ACTING_COVER_URL', payload: { roleId: offer.roleId, coverUrl: result } });
                                            (offer as any).isAnswered = true; // Local optimistic update
                                            dispatch({ type: 'MARK_EMAIL_OFFER_ANSWERED', payload: { emailId: email.id } });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} 
                                className="w-full bg-zinc-700 p-3 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f5c518] file:text-black hover:file:bg-[#f5c518]/90" 
                            />
                        </div>
                    ) : (<div className="text-center font-semibold p-3 bg-zinc-700/50 rounded-lg">Cover Image Submitted!</div>)}
                </div>
            )
        }

        if (email.offer.type === 'cheatingScandal') {
            const offer = email.offer;
            return (
                <div className="mt-6 pt-4 border-t border-zinc-700">
                    {!offer.isAnswered ? (
                        <div className="space-y-3">
                            <button onClick={() => {
                                dispatch({ type: 'RESPOND_TO_CHEATING', payload: { response: 'break_up', relationshipId: offer.relationshipId } });
                                dispatch({ type: 'MARK_EMAIL_OFFER_ANSWERED', payload: { emailId: email.id } });
                            }} className="w-full h-12 font-bold py-2 px-4 rounded-lg transition-colors shadow-lg bg-red-600 hover:bg-red-700 text-white">Break Up</button>
                            <button onClick={() => {
                                dispatch({ type: 'RESPOND_TO_CHEATING', payload: { response: 'forgive', relationshipId: offer.relationshipId } });
                                dispatch({ type: 'MARK_EMAIL_OFFER_ANSWERED', payload: { emailId: email.id } });
                            }} className="w-full h-12 font-bold py-2 px-4 rounded-lg transition-colors shadow-lg bg-green-500 hover:bg-green-600 text-white">Forgive Them</button>
                            <button onClick={() => {
                                dispatch({ type: 'RESPOND_TO_CHEATING', payload: { response: 'ignore', relationshipId: offer.relationshipId } });
                                dispatch({ type: 'MARK_EMAIL_OFFER_ANSWERED', payload: { emailId: email.id } });
                            }} className="w-full h-12 font-bold py-2 px-4 rounded-lg transition-colors shadow-lg bg-zinc-600 hover:bg-zinc-700 text-white">Ignore the Rumors</button>
                        </div>
                    ) : (<div className="text-center font-semibold p-3 bg-zinc-700/50 rounded-lg">Scandal Handled</div>)}
                </div>
            )
        }

        if (email.offer.type === 'featureRelease') return null;

        let buttonText = '';
        let buttonClass = '';
        let acceptedText = '';
        let isAccepted = false;
        let isActionable = true;

        switch(email.offer.type) {
            case 'geniusInterview':
                buttonText = "Accept & Create 'Verified' Video";
                buttonClass = "bg-yellow-400 hover:bg-yellow-500 text-black shadow-yellow-400/20";
                acceptedText = "Genius Offer Accepted";
                isAccepted = email.offer.isAccepted;
                break;
            case 'onTheRadarOffer':
                buttonText = "Accept On The Radar Performance";
                buttonClass = "bg-green-500 hover:bg-green-600 text-white shadow-green-500/20";
                acceptedText = "On The Radar Offer Accepted";
                isAccepted = email.offer.isAccepted;
                break;
            case 'trshdOffer':
                buttonText = "Accept TRSH'D Performance";
                buttonClass = "bg-[#FFC700] hover:bg-yellow-500 text-black shadow-yellow-400/20";
                acceptedText = "TRSH'D Offer Accepted";
                isAccepted = email.offer.isAccepted;
                break;
            case 'fallonOffer':
                buttonText = `Accept ${email.offer.offerType} on The Tonight Show`;
                buttonClass = "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20";
                acceptedText = "Tonight Show Offer Accepted";
                isAccepted = email.offer.isAccepted;
                break;
            case 'grammySubmission':
                buttonText = "Submit For GRAMMYs";
                buttonClass = "bg-amber-400 hover:bg-amber-500 text-black shadow-amber-400/20";
                acceptedText = "Submissions Sent";
                isAccepted = email.offer.isSubmitted;
                break;
            case 'grammyNominations':
                if (email.offer.hasPerformanceOffer) {
                    buttonText = "Accept GRAMMYs Performance";
                    buttonClass = "bg-amber-400 hover:bg-amber-500 text-black shadow-amber-400/20";
                    acceptedText = "Performance Accepted";
                    isAccepted = !!email.offer.isPerformanceAccepted;
                } else {
                    isActionable = false;
                }
                break;
            case 'vmaRedCarpet':
                buttonText = "Attend Red Carpet";
                buttonClass = "bg-zinc-800 hover:bg-zinc-700 text-white shadow-zinc-800/20";
                acceptedText = "You are attending the VMAs";
                isAccepted = !!email.offer.isAttending;
                break;
            case 'grammyRedCarpet':
                buttonText = "Attend Red Carpet";
                buttonClass = "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20";
                acceptedText = "You are attending the GRAMMYs";
                isAccepted = !!email.offer.isAttending;
                break;
            case 'oscarRedCarpet':
                buttonText = "Attend Red Carpet";
                buttonClass = "bg-yellow-500 hover:bg-yellow-600 text-black shadow-yellow-500/20";
                acceptedText = "You are attending the Oscars";
                isAccepted = !!email.offer.isAttending;
                break;
            case 'amaSubmission':
                buttonText = "Submit For AMAs";
                buttonClass = "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20";
                acceptedText = "Submissions Sent";
                isAccepted = email.offer.isSubmitted;
                break;
            case 'amaNominations':
                if (email.offer.hasPerformanceOffer) {
                    buttonText = "Accept AMAs Performance";
                    buttonClass = "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20";
                    acceptedText = "Performance Accepted";
                    isAccepted = !!email.offer.isPerformanceAccepted;
                } else {
                    isActionable = false;
                }
                break;
            case 'amaRedCarpet':
                buttonText = "Attend Red Carpet";
                buttonClass = "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20";
                acceptedText = "You are attending the AMAs";
                isAccepted = !!email.offer.isAttending;
                break;
            case 'goldenGlobeNominations':
                buttonText = "Attend Ceremony";
                buttonClass = "bg-amber-400 hover:bg-amber-500 text-black shadow-amber-400/20";
                acceptedText = "Attending Ceremony";
                isAccepted = !!email.offer.isAttending;
                break;
            case 'goldenGlobeSubmission':
                buttonText = "Submit For Golden Globes";
                buttonClass = "bg-amber-400 hover:bg-amber-500 text-black shadow-amber-400/20";
                acceptedText = "Submissions Sent";
                isAccepted = email.offer.isSubmitted;
                break;
            case 'oscarSubmission':
                buttonText = "Submit For Oscars";
                buttonClass = "bg-amber-400 hover:bg-amber-500 text-black shadow-amber-400/20";
            case 'kaiStreamSetup':
                buttonText = "Setup Twitch Stream";
                buttonClass = "bg-[#9146FF] hover:bg-[#7d5bbe] text-white shadow-[#9146FF]/20";
                acceptedText = "Stream Setup Completed";
                isAccepted = email.offer.isSubmitted;
                break;
                acceptedText = "Submissions Sent";
                isAccepted = email.offer.isSubmitted;
                break;
            case 'oscarNominations':
                if (email.offer.hasPerformanceOffer) {
                    buttonText = "Accept Oscars Performance";
                    buttonClass = "bg-amber-400 hover:bg-amber-500 text-black shadow-amber-400/20";
                    acceptedText = "Performance Accepted";
                    isAccepted = !!email.offer.isPerformanceAccepted;
                } else {
                    isActionable = false;
                }
                break;
            case 'onlyfansRequest':
                buttonText = `Accept Request ($${formatNumber(email.offer.payout)})`;
                buttonClass = "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20";
                acceptedText = "Request Fulfilled";
                isAccepted = email.offer.isFulfilled;
                break;
            case 'fifaWorldCupOffer':
                buttonText = 'Accept FIFA Offer';
                buttonClass = 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20';
                acceptedText = 'Offer Accepted';
                isAccepted = email.offer.isAccepted;
                break;
            case 'soundtrackOffer':
                buttonText = `Contribute to "${email.offer.albumTitle}"`;
                buttonClass = "bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/20";
                acceptedText = "Soundtrack Contribution Accepted";
                isAccepted = email.offer.isAccepted;
                break;
            case 'eventInvitation':
                buttonText = `Attend ${email.offer.eventName}`;
                buttonClass = "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20";
                acceptedText = "Attending Event";
                isAccepted = email.offer.isAccepted;
                break;
            case 'vogueOffer':
                buttonText = `Accept ${email.offer.magazine} Cover`;
                buttonClass = "bg-zinc-200 hover:bg-zinc-300 text-black";
                acceptedText = "Vogue Offer Accepted";
                isAccepted = email.offer.isAccepted;
                break;
            case 'npcContractRenewal':
                buttonText = `Manage Label Roster`;
                buttonClass = "bg-red-600 hover:bg-red-500 text-white shadow-red-500/20";
                acceptedText = "";
                isAccepted = false; // Always jump to ManageLabel
                canAfford = true;
                break;
            case 'featureOffer':
                buttonText = `Accept Feature`;
                buttonClass = "bg-green-500 hover:bg-green-600 text-white shadow-green-500/20";
                acceptedText = "Feature Accepted";
                isAccepted = email.offer.isAccepted;
                break;
            case 'featureVideoOffer':
                buttonText = `Shoot Music Video`;
                buttonClass = "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20";
                acceptedText = "Shooting Scheduled";
                isAccepted = email.offer.isAccepted;
                break;
            case 'promoInterview':
                buttonText = `Schedule Interview`;
                buttonClass = "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20";
                acceptedText = "Interview Scheduled";
                isAccepted = email.offer.isAccepted;
                break;
            case 'actingPremiere':
                buttonText = "Attend Premiere";
                buttonClass = "bg-[#f5c518] hover:bg-[#f5c518]/90 text-black shadow-[#f5c518]/20";
                acceptedText = "You attended the premiere!";
                isAccepted = !!email.offer.isAccepted;
                break;
            case 'coachellaOffer':
                buttonText = "Submit for Coachella";
                buttonClass = "bg-[#ff8a65] hover:bg-[#ff7043] text-black shadow-orange-500/20";
                acceptedText = "Submission Sent";
                isAccepted = email.offer.isSubmitted;
                break;
            case 'coachellaSelection':
                buttonText = email.offer.isSetlistSelected ? "Update Setlist" : "Select Setlist";
                buttonClass = "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black shadow-orange-500/20";
                acceptedText = "Setlist Confirmed";
                isAccepted = false;
                break;
        }

        if (!isActionable) return null;
        
        return (
            <div className="mt-6 pt-4 border-t border-zinc-700">
                {!isAccepted ? (
                    <button onClick={handleAcceptOffer} className={`w-full h-12 font-bold py-2 px-4 rounded-lg transition-colors shadow-lg ${buttonClass}`}>{buttonText}</button>
                ) : (
                    <div className="text-center font-semibold p-3 bg-zinc-700/50 rounded-lg">{acceptedText}</div>
                )}
            </div>
        )
    }

    return (
        <div className="h-full w-full bg-[#1c1c1e] text-white flex flex-col">
            {email.offer?.type === 'soundtrackOffer' && (
                <ConfirmationModal
                    isOpen={showSoundtrackConfirm}
                    onClose={() => setShowSoundtrackConfirm(false)}
                    onConfirm={() => {
                        if (email.offer?.type === 'soundtrackOffer') {
                            dispatch({ type: 'ACCEPT_SOUNDTRACK_OFFER', payload: { albumTitle: email.offer.albumTitle, emailId: email.id } });
                            setShowSoundtrackConfirm(false);
                        }
                    }}
                    title="Accept Soundtrack Offer?"
                    message={`Are you sure you want to contribute to the "${email.offer.albumTitle}" soundtrack? This will take you to the contribution screen.`}
                    confirmText="Yes"
                    cancelText="No"
                />
            )}
             <header className="p-4 flex items-center gap-4 sticky top-0 bg-[#1c1c1e]/80 backdrop-blur-sm z-10 border-b border-white/10">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold truncate">{email.subject}</h1>
            </header>
            <main className="flex-grow overflow-y-auto p-4 space-y-4">
                <div className="flex items-center gap-4">
                    <SenderAvatar email={email} />
                    <div className="flex-grow">
                        <p className="font-semibold text-white">{email.sender}</p>
                        <p className="text-sm text-zinc-400">to me</p>
                    </div>
                    <p className="text-xs text-zinc-500 text-right">{formattedDate}</p>
                </div>
                <div className="whitespace-pre-wrap text-zinc-300 leading-relaxed pt-4 border-t border-zinc-700 mt-4">
                    {email.body || email.content}
                </div>
                {renderOffer()}
                {email.offer?.type === 'coachellaSelection' && (
                    <CoachellaSetlistModal
                        isOpen={isCoachellaModalOpen}
                        onClose={() => setIsCoachellaModalOpen(false)}
                        slot={email.offer.slot}
                        stage={email.offer.stage}
                        emailId={email.id}
                    />
                )}
            </main>
        </div>
    );
};


const InboxView: React.FC = () => {
    const { dispatch, activeArtist, activeArtistData } = useGame();
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    if (!activeArtist || !activeArtistData) return null;
    const { inbox } = activeArtistData;

    useEffect(() => {
        if (!selectedEmail) {
            dispatch({ type: 'MARK_INBOX_READ' });
        }
    }, [dispatch, selectedEmail]);

    const filteredInbox = useMemo(() => {
        const query = searchQuery.toLowerCase();
        let list = inbox.filter(e => e != null);
        if (query) {
            list = list.filter(e => 
                e.subject?.toLowerCase().includes(query) || 
                e.sender?.toLowerCase().includes(query) || 
                e.body?.toLowerCase().includes(query) ||
                e.content?.toLowerCase().includes(query)
            );
        }
        return list.sort((a, b) => {
            const dateA = a.date || { year: 1, week: 1 };
            const dateB = b.date || { year: 1, week: 1 };
            return (dateB.year * 52 + dateB.week) - (dateA.year * 52 + dateA.week);
        });
    }, [inbox, searchQuery]);

    if (selectedEmail) {
        const currentEmail = inbox.find(e => e.id === selectedEmail.id) || selectedEmail;
        return <EmailDetailView email={currentEmail} onBack={() => setSelectedEmail(null)} />;
    }

    return (
        <div className="h-full w-full bg-[#1c1c1e] text-white flex flex-col">
            <header className="p-4 sticky top-0 bg-[#1c1c1e]/80 backdrop-blur-sm z-10 space-y-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="p-2 rounded-full hover:bg-white/10">
                        <MenuIcon className="w-6 h-6" />
                    </button>
                    <div className="flex-grow bg-zinc-700/80 rounded-full h-12 flex items-center px-4">
                        <input
                            type="text"
                            placeholder="Search in mail"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent text-white outline-none w-full placeholder:text-zinc-400"
                        />
                    </div>
                    <img src={activeArtist.image} alt={activeArtist.name} className="w-10 h-10 rounded-full object-cover" />
                </div>
            </header>
            <main className="flex-grow overflow-y-auto">
                <h1 className="px-4 py-2 text-xs font-semibold uppercase text-zinc-400">Primary</h1>
                {filteredInbox.length > 0 ? (
                    <div>
                        {filteredInbox.map(email => <EmailItem key={email.id} email={email} onClick={() => setSelectedEmail(email)} />)}
                    </div>
                ) : (
                    <p className="text-center text-zinc-500 p-8">
                        {searchQuery ? 'No emails match your search.' : 'Your inbox is empty.'}
                    </p>
                )}
            </main>
        </div>
    );
};

export default InboxView;
