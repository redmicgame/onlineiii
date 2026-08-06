import React, { useState, useMemo } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import { RedditPost as RedditPostType } from '../types';

const RedditPost = ({ post, isExpanded, onClick }: { post: any, isExpanded?: boolean, onClick?: () => void }) => {
    const [voteStatus, setVoteStatus] = useState<0 | 1 | -1>(0);
    
    const getUpvotes = () => {
        let base = typeof post.upvotes === 'number' ? post.upvotes : parseFloat(post.upvotes) * 1000 || 1500;
        return base + (voteStatus === 1 ? 1 : voteStatus === -1 ? -1 : 0);
    };

    const handleVote = (e: React.MouseEvent, val: 1 | -1) => {
        e.stopPropagation();
        setVoteStatus(prev => prev === val ? 0 : val);
    };

    const displayTitle = post.title.replace(/\[RUMOR\]|\(FRESH\)|\(CHART UPDATE\)/g, '').trim();
    let flair = post.title.includes('[RUMOR]') ? 'RUMOR' : post.title.includes('(FRESH)') ? 'FRESH' : post.title.includes('(CHART UPDATE)') ? 'CHART UPDATE' : post.flair || null;

    return (
        <div onClick={onClick} className={`bg-white sm:rounded-md border border-gray-300 flex overflow-hidden hover:border-gray-400 transition-colors ${onClick ? 'cursor-pointer mb-2' : ''}`}>
            {/* Vote column */}
            <div className="w-12 bg-gray-50 flex flex-col items-center py-2 border-r border-gray-100 hidden sm:flex flex-shrink-0">
                <button onClick={(e) => handleVote(e, 1)} className={`font-bold text-xl hover:bg-gray-200 rounded p-0.5 ${voteStatus === 1 ? 'text-orange-500' : 'text-gray-400'}`}>▲</button>
                <span className={`text-xs font-bold ${voteStatus === 1 ? 'text-orange-500' : voteStatus === -1 ? 'text-blue-500' : 'text-gray-900'}`}>
                    {getUpvotes() > 999 ? (getUpvotes() / 1000).toFixed(1) + 'k' : getUpvotes()}
                </span>
                <button onClick={(e) => handleVote(e, -1)} className={`font-bold text-xl hover:bg-gray-200 rounded p-0.5 ${voteStatus === -1 ? 'text-blue-500' : 'text-gray-400'}`}>▼</button>
            </div>
            
            {/* Content */}
            <div className="p-2 sm:p-3 flex-1 overflow-hidden">
                <div className="text-xs text-gray-500 mb-2 flex flex-wrap items-center gap-1">
                    {isExpanded && <div className="w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center text-[10px] text-white font-bold mr-1">r/</div>}
                    <span className="font-bold text-black hover:underline">r/{post.subreddit || 'popheads'}</span>
                    <span>•</span>
                    <span>Posted by u/{post.author}</span>
                    {post.userFlair && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-800 ml-1">{post.userFlair}</span>}
                    <span>{post.timeAgo || 'Just now'}</span>
                </div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {flair && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${flair === 'FRESH' ? 'bg-green-100 text-green-800' : flair === 'CHART UPDATE' ? 'bg-purple-100 text-purple-800' : flair === 'RUMOR' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {flair}
                    </span>}
                    <h2 className={`font-medium text-gray-900 leading-snug ${isExpanded ? 'text-xl' : 'text-lg'}`}>{displayTitle}</h2>
                </div>
                
                <p className={`text-sm text-gray-800 mb-2 whitespace-pre-wrap ${!isExpanded && 'line-clamp-3'}`}>{post.content}</p>
                
                {post.image && (
                    <div className="max-h-[500px] overflow-hidden rounded-md border border-gray-200 mt-2 mb-2 bg-black flex items-center justify-center">
                        <img src={post.image} className="max-w-full max-h-[500px] object-contain" alt="Post thumbnail" />
                    </div>
                )}
                
                {/* Action bar */}
                <div className="flex items-center gap-1 text-xs font-bold text-gray-500 mt-2">
                    <div className="flex items-center gap-1 hover:bg-gray-100 p-1.5 rounded text-gray-800 sm:hidden">
                        <button onClick={(e) => handleVote(e, 1)} className={`${voteStatus === 1 ? 'text-orange-500' : ''}`}>▲</button>
                        {getUpvotes() > 999 ? (getUpvotes() / 1000).toFixed(1) + 'k' : getUpvotes()}
                        <button onClick={(e) => handleVote(e, -1)} className={`${voteStatus === -1 ? 'text-blue-500' : ''}`}>▼</button>
                    </div>
                    <div className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded cursor-pointer transition-colors">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-4 4v-4H2a2 2 0 01-2-2V3c0-1.1.9-2 2-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-8z"/></svg>
                        {typeof post.commentCount === 'number' ? formatNumber(post.commentCount) : post.commentCount || 0} Comments
                    </div>
                </div>
            </div>
        </div>
    );
};

const CommentThread = ({ comment }: { comment: any }) => {
    const [voteStatus, setVoteStatus] = useState<0 | 1 | -1>(0);
    const [collapsed, setCollapsed] = useState(false);
    
    const getUpvotes = () => {
        let base = typeof comment.upvotes === 'number' ? comment.upvotes : parseFloat(comment.upvotes) * 1000 || 500;
        return base + (voteStatus === 1 ? 1 : voteStatus === -1 ? -1 : 0);
    };

    if (collapsed) {
        return (
            <div className="flex gap-2 mb-2 items-center text-xs text-gray-500">
                <button onClick={() => setCollapsed(false)} className="hover:bg-gray-200 rounded p-1 w-6 h-6 flex items-center justify-center font-bold text-gray-700">+</button>
                <span className="font-bold">{comment.author}</span>
                <span>•</span>
                <span>{comment.timeAgo || 'Just now'}</span>
                <span>({comment.replies ? comment.replies.length + 1 : 1} children)</span>
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 object-cover flex-shrink-0 relative overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author}`} className="w-full h-full" alt="avatar" />
                </div>
                <div className="w-0.5 h-full bg-gray-200 mt-2 hover:bg-blue-500 transition-colors cursor-pointer" onClick={() => setCollapsed(true)}></div>
            </div>
            <div className="flex-1 pb-4">
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900">{comment.author}</span>
                    {comment.isOp && <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded font-bold">OP</span>}
                    {comment.userFlair && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-800">{comment.userFlair}</span>}
                    <span>•</span>
                    <span>{comment.timeAgo || 'Just now'}</span>
                </div>
                <p className="text-sm text-gray-800 mb-2">{comment.text}</p>
                <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                    <div className="flex items-center gap-1">
                        <button onClick={() => setVoteStatus(prev => prev === 1 ? 0 : 1)} className={`hover:text-orange-500 ${voteStatus === 1 ? 'text-orange-500' : ''}`}>▲</button>
                        <span className={voteStatus === 1 ? 'text-orange-500' : voteStatus === -1 ? 'text-blue-500' : ''}>{getUpvotes() > 999 ? (getUpvotes() / 1000).toFixed(1) + 'k' : getUpvotes()}</span>
                        <button onClick={() => setVoteStatus(prev => prev === -1 ? 0 : -1)} className={`hover:text-blue-500 ${voteStatus === -1 ? 'text-blue-500' : ''}`}>▼</button>
                    </div>
                    <div className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded cursor-pointer transition-colors"><svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-4 4v-4H2a2 2 0 01-2-2V3c0-1.1.9-2 2-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-8z"/></svg> Reply</div>
                </div>
                {comment.replies && comment.replies.map((reply: any, j: number) => (
                    <div className="mt-4" key={j}>
                        <CommentThread comment={reply} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export const RedditSiteView: React.FC<{ initialPost?: any, onClose: () => void }> = ({ initialPost, onClose }) => {
    const { gameState, activeArtistData, allPlayerArtists } = useGame();
    const [currentView, setCurrentView] = useState<'home' | 'post'>(initialPost ? 'post' : 'home');
    const [selectedPost, setSelectedPost] = useState<any>(initialPost || null);
    const [joinState, setJoinState] = useState(false);
    const [activeSort, setActiveSort] = useState<'Hot' | 'New' | 'Top'>('Hot');
    const [bannerImageIndex, setBannerImageIndex] = useState(0);
    const [iconImageIndex, setIconImageIndex] = useState(1);
    
    // Posting & Flairs
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [userFlair, setUserFlair] = useState<string>('');
    const [showFlairModal, setShowFlairModal] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const [localPosts, setLocalPosts] = useState<any[]>([]);

    const artistProfile = allPlayerArtists.find(a => a.id === gameState.activeArtistId);
    if (!artistProfile || !activeArtistData) return <div className="bg-gray-100 h-full flex flex-col items-center justify-center"><div className="text-gray-500 mb-4">Failed to load Reddit data.</div><button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded-full">Go Back</button></div>;

    const subredditName = artistProfile.name.replace(/\s+/g, '');

    // Dynamically generate unique usernames based on artist
    const uniqueUsernames = useMemo(() => {
        const names = [
            `${artistProfile.name.replace(/\s+/g, '')}Stan`,
            `${artistProfile.name.split(' ')[0]}Fan13`,
            `Real${artistProfile.name.replace(/\s+/g, '')}`,
            `${artistProfile.name.split(' ')[0]}IsMother`,
            `Protect${artistProfile.name.split(' ')[0]}AtAllCosts`
        ];
        activeArtistData.releases.forEach(r => {
            const cleanTitle = r.title.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
            names.push(`${cleanTitle}Defender`);
            names.push(`${cleanTitle}Era`);
            names.push(`JusticeFor${cleanTitle}`);
            names.push(`${cleanTitle}Supremacy`);
            names.push(`Stream${cleanTitle}`);
        });
        return Array.from(new Set(names));
    }, [artistProfile, activeArtistData.releases]);

    const getRandomUsername = () => uniqueUsernames[Math.floor(Math.random() * uniqueUsernames.length)];
    
    const getWeightedRandomFlair = () => {
        const baseFlairs = [
            { text: artistProfile.name, weight: 50 },
            { text: "Discussion", weight: 20 },
            { text: "Rumor", weight: 10 },
            { text: "News", weight: 20 }
        ];
        
        const releaseFlairs = activeArtistData.releases.map(r => ({
            text: r.title,
            // Weight based on album sales/popularity (using copies sold as proxy)
            weight: 10 + (Math.log10((r.copiesSold || 0) + 1) * 5)
        }));
        
        const allFlairs = [...baseFlairs, ...releaseFlairs];
        const totalWeight = allFlairs.reduce((sum, f) => sum + f.weight, 0);
        
        let random = Math.random() * totalWeight;
        for (const flair of allFlairs) {
            random -= flair.weight;
            if (random <= 0) return flair.text;
        }
        return artistProfile.name;
    };
    
    const getRandomFlair = () => getWeightedRandomFlair();

    // Generate Community Highlights based on recent events
    const highlights = useMemo(() => {
        const h = [];
        h.push({ title: 'General Discussion Thread', subtitle: 'Megathread' });
        
        const recentRelease = activeArtistData.releases.find(r => (gameState.date.year * 52 + gameState.date.week) - (r.releaseDate.year * 52 + r.releaseDate.week) < 12);
        if (recentRelease) h.unshift({ title: `${recentRelease.title} Release Megathread`, subtitle: 'Megathread' });
        
        const married = activeArtistData.relationships?.find(r => r.status === 'married' && r.startYear === gameState.date.year && Math.abs(gameState.date.week - (r.startWeek || 0)) < 12);
        if (married) h.unshift({ title: `The Royal Wedding Megathread`, subtitle: 'Megathread' });
        
        const divorced = activeArtistData.relationships?.find(r => r.status === 'ex' && r.endYear === gameState.date.year && Math.abs(gameState.date.week - (r.endWeek || 0)) < 12);
        if (divorced) h.unshift({ title: `Divorce / Breakup Megathread`, subtitle: 'Megathread' });
        
        const kid = activeArtistData.kids?.find(k => k.birthDate.year === gameState.date.year && Math.abs(gameState.date.week - k.birthDate.week) < 12);
        if (kid) h.unshift({ title: `Baby Arrival Megathread 👶`, subtitle: 'Megathread' });

        return h;
    }, [activeArtistData, gameState.date]);

    // Generate more varied mock posts based on artist's catalog and events
    const mockPosts = useMemo(() => {
        const posts = [
            {
                id: 1, author: getRandomUsername(), timeAgo: '2h ago',
                title: `(FRESH) ${artistProfile.name} - Latest Single`,
                content: `I'm obsessed with this new sound! The production is insane. What does everyone else think? I genuinely feel like this might be one of their best tracks in years. The vocals are so crisp and the beat just hits different.`,
                upvotes: 12500, commentCount: '3.2k', flair: 'FRESH', userFlair: getRandomFlair()
            },
            {
                id: 2, author: getRandomUsername(), timeAgo: '5h ago',
                title: `[RUMOR] Spotted: ${artistProfile.name} out in LA last night`,
                content: `Looks like someone is taking a break from the studio! Wonder if they were meeting with producers? Or maybe just relaxing. Either way they looked incredible as always.`,
                upvotes: 24200, commentCount: '5.6k', flair: 'RUMOR', userFlair: getRandomFlair(),
                image: activeArtistData?.artistImages?.[0] || null
            },
            {
                id: 4, author: getRandomUsername(), timeAgo: '6h ago',
                title: `Unpopular Opinion: The second album was their peak`,
                content: `Please don't downvote me into oblivion, but I've been relistening to the discography and I honestly think their sophomore album had the best cohesive theme and songwriting. Everything since has been great, but that era was just magic. Agree or disagree?`,
                upvotes: 8400, commentCount: '1.2k', flair: 'Discussion', userFlair: getRandomFlair()
            },
            {
                id: 5, author: getRandomUsername(), timeAgo: '12h ago',
                title: `Tour concept ideas for the next era?`,
                content: `If they go on tour next year, what kind of stage design are we hoping for? I'd love a more intimate, acoustic set for the slower songs, maybe a B-stage moment.`,
                upvotes: 5600, commentCount: '890', flair: 'Tour', userFlair: getRandomFlair()
            },
            {
                id: 6, author: getRandomUsername(), timeAgo: '18h ago',
                title: `Did anyone else notice this easter egg in the last music video?`,
                content: `At the 2:14 mark you can clearly see a sign that says "soon" with a 🦋 emoji. Could this be the theme for the next project??`,
                upvotes: 15300, commentCount: '2.1k', flair: 'Theory', userFlair: getRandomFlair()
            },
            {
                id: 7, author: getRandomUsername(), timeAgo: '22h ago',
                title: `Vocal analysis: ${artistProfile.name}'s evolution over the years`,
                content: `I'm a vocal coach and I just wanted to share some thoughts on how much their technique has improved. The breath control on the recent live performances is lightyears ahead of where they started.`,
                upvotes: 11200, commentCount: '950', flair: 'Analysis', userFlair: getRandomFlair()
            }
        ];
        
        const randomRelease = activeArtistData.releases[Math.floor(Math.random() * activeArtistData.releases.length)];
        if (randomRelease) {
            posts.push({
                id: 3, author: getRandomUsername(), timeAgo: '1d ago',
                title: `${artistProfile.name} released ${randomRelease.title} exactly 1 year ago today!`,
                content: `Time flies! What is your favorite track from this era? I can't believe it's already been a year since this dropped. It feels like yesterday we were all staying up until midnight for the release.`,
                upvotes: 15500, commentCount: '1.4k', flair: 'Discussion', userFlair: getRandomFlair()
            });
        }
        
        return posts.sort(() => 0.5 - Math.random());
    }, [artistProfile, activeArtistData]);

    const actualPosts = activeArtistData?.redditPosts || mockPosts;
    const allPosts = [...localPosts, ...actualPosts];

    const sortedPosts = [...allPosts].map(p => ({...p, subreddit: p.subreddit || subredditName})).sort((a: any, b: any) => {
        if (activeSort === 'Hot') return typeof b.id === 'string' ? -1 : b.id - a.id;
        if (activeSort === 'Top') {
            const upa = typeof a.upvotes === 'string' ? parseFloat(a.upvotes) : a.upvotes;
            const upb = typeof b.upvotes === 'string' ? parseFloat(b.upvotes) : b.upvotes;
            return upb - upa;
        }
        return -1; // New
    });

    const mockComments = [
        { author: getRandomUsername(), upvotes: 5200, text: `Honestly I just hope the next album has the same energy as the early stuff. I miss the raw acoustics.`, timeAgo: '4h ago', userFlair: getRandomFlair(), replies: [
            { author: getRandomUsername(), upvotes: 1200, text: `Yes!! The debut was literally perfection. No skips. But I don't think we'll ever get that exact sound back, artists have to evolve.`, timeAgo: '3h ago', userFlair: getRandomFlair(), replies: [
                { author: getRandomUsername(), upvotes: 450, text: `I agree they need to evolve, but a girl can dream right? 😂`, timeAgo: '2h ago', userFlair: getRandomFlair() },
                { author: getRandomUsername(), upvotes: 320, text: `Idk, I personally love the pop direction they went in later.`, timeAgo: '1h ago', userFlair: getRandomFlair() }
            ] }
        ] },
        { author: getRandomUsername(), upvotes: 2100, text: `If they release on a Friday they'll easily grab the #1 spot, no contest. The charts are super weak rn.`, timeAgo: '3h ago', userFlair: getRandomFlair(), replies: [
            { author: getRandomUsername(), upvotes: 800, text: `Exactly, the competition is weak right now. Though we shouldn't underestimate the K-pop groups mass buying.`, timeAgo: '2h ago', userFlair: getRandomFlair(), replies: [
                { author: getRandomUsername(), upvotes: 600, text: `Fair point, physical sales are king nowadays.`, timeAgo: '1h ago', userFlair: getRandomFlair() },
                { author: getRandomUsername(), upvotes: 210, text: `But the streaming numbers for ${artistProfile.name} are insane, they can carry it.`, timeAgo: '30m ago', userFlair: getRandomFlair() }
            ]}
        ]},
        { author: getRandomUsername(), upvotes: 1500, text: `I can't stop listening. This has been on repeat all day.`, timeAgo: '5h ago', userFlair: getRandomFlair(), replies: [
            { author: getRandomUsername(), upvotes: 340, text: `Same! My Spotify wrapped is going to be ruined just by this one track lol`, timeAgo: '4h ago', userFlair: getRandomFlair() },
            { author: getRandomUsername(), upvotes: 190, text: `It's already my most played song of the month.`, timeAgo: '2h ago', userFlair: getRandomFlair() }
        ]},
        { author: getRandomUsername(), upvotes: 950, text: `The bridge is the best part. I ascend every time.`, timeAgo: '6h ago', userFlair: getRandomFlair(), replies: [
            { author: getRandomUsername(), upvotes: 120, text: `THE BRIDGE IS INSANE!!`, timeAgo: '2h ago', userFlair: getRandomFlair() },
            { author: getRandomUsername(), upvotes: 95, text: `Producer went crazy on that transition.`, timeAgo: '1h ago', userFlair: getRandomFlair(), replies: [
                { author: getRandomUsername(), upvotes: 40, text: `Does anyone know who produced it?`, timeAgo: '45m ago', userFlair: getRandomFlair() }
            ] }
        ]}
    ];

    const visitors = Math.floor(1000000 + (activeArtistData.popularity * 20000));
    const contributions = Math.min(Math.floor((activeArtistData.hype / 100) * 30000) + 1000, visitors - 5000);

    const handleCreatePost = () => {
        if (!newPostTitle.trim()) return;
        const newPost = {
            id: 'local_' + Date.now(),
            author: 'You',
            timeAgo: 'Just now',
            title: newPostTitle,
            content: newPostContent,
            upvotes: 1,
            commentCount: 0,
            subreddit: subredditName,
            flair: userFlair,
            userFlair: userFlair,
            comments: []
        };
        setLocalPosts([newPost, ...localPosts]);
        setIsCreatingPost(false);
        setNewPostTitle('');
        setNewPostContent('');
    };

    const handleComment = () => {
        if (!commentInput.trim()) return;
        const newComment = {
            author: 'You',
            upvotes: 1,
            text: commentInput,
            timeAgo: 'Just now',
            userFlair: userFlair,
            isOp: selectedPost?.author === 'You'
        };
        setSelectedPost({...selectedPost, comments: [newComment, ...(selectedPost.comments || mockComments)]});
        setCommentInput('');
    };

    return (
        <div className="bg-[#DAE0E6] text-[#1c1c1c] h-full overflow-y-auto font-sans relative">
            <header className="bg-white border-b border-gray-300 sticky top-0 z-20 w-full flex items-center px-4 py-2 shadow-sm h-12">
                <button onClick={() => currentView === 'post' ? setCurrentView('home') : onClose()} className="p-1.5 mr-2 text-gray-500 hover:text-black rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <div className="text-orange-500 mr-4 cursor-pointer" onClick={() => setCurrentView('home')}>
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="#FF4500"/><path d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.85-1.23L11.1,4.27,13.02,4.7a1.56,1.56,0,1,0,2-1.4,1.59,1.59,0,0,0-1.7,1.05l-2.12-.46a.32.32,0,0,0-.37.24L10,7.71a7.14,7.14,0,0,0-3.9,1.23A1.46,1.46,0,1,0,4.2,11.33a2.87,2.87,0,0,0,0,.44c0,2.24,2.61,4.06,5.83,4.06s5.83-1.82,5.83-4.06a2.87,2.87,0,0,0,0-.44A1.46,1.46,0,1,0,16.67,10Zm-8.15,3.26c-1,0-1.8-.62-1.8-1.38s.8-1.38,1.8-1.38,1.8.62,1.8,1.38S9.52,13.26,8.52,13.26Zm4,0c-1,0-1.8-.62-1.8-1.38s.8-1.38,1.8-1.38,1.8.62,1.8,1.38S13.52,13.26,12.52,13.26Zm1.43,2A5.15,5.15,0,0,1,10,16a5.15,5.15,0,0,1-3.95-.73.28.28,0,0,1,.13-.5.29.29,0,0,1,.15.05A4.54,4.54,0,0,0,10,15.43a4.54,4.54,0,0,0,3.62-.61.29.29,0,0,1,.15-.05A.28.28,0,0,1,14,14.22a.28.28,0,0,1-.05.1Zm-4-3.56a.71.71,0,1,1,.71-.71A.71.71,0,0,1,10,11.71Z" fill="#FFF"/></svg>
                </div>
                <div className="flex-1 max-w-2xl bg-gray-100 hover:bg-white hover:border-blue-500 rounded-md border border-transparent flex items-center px-3 py-1.5 transition-colors cursor-text">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input type="text" placeholder="Search Reddit" className="bg-transparent outline-none flex-1 text-sm text-gray-900" />
                </div>
            </header>

            {currentView === 'home' && (
                <div className="bg-white mb-4 shadow-sm border-b border-gray-300">
                    <div className="h-24 sm:h-36 bg-blue-500 overflow-hidden relative group cursor-pointer" onClick={() => activeArtistData?.artistImages?.length && setBannerImageIndex((bannerImageIndex + 1) % activeArtistData.artistImages.length)}>
                        {activeArtistData?.artistImages?.[bannerImageIndex] && (
                            <>
                                <img src={activeArtistData.artistImages[bannerImageIndex]} className="w-full h-full object-cover opacity-80" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </>
                        )}
                    </div>
                    <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-end -mt-8 sm:-mt-10 relative z-10">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white bg-white flex items-center justify-center text-2xl font-bold text-white shadow-sm overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => activeArtistData?.artistImages?.length && setIconImageIndex((iconImageIndex + 1) % activeArtistData.artistImages.length)}>
                            {activeArtistData?.artistImages?.[iconImageIndex] ? (
                                <img src={activeArtistData.artistImages[iconImageIndex]} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-orange-600 flex items-center justify-center text-2xl font-bold text-white">r/</div>
                            )}
                        </div>
                        <div className="flex-1 sm:ml-4 mt-2 sm:mt-0 pb-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">r/{subredditName}</h1>
                            <p className="text-sm text-gray-500 font-medium">
                                {(visitors/1000000).toFixed(1)}m visitors and {(contributions/1000).toFixed(1)}k contributions per week
                            </p>
                        </div>
                        <button onClick={() => setJoinState(!joinState)} className={`font-bold px-8 py-1.5 rounded-full mt-2 sm:mt-0 transition-colors ${joinState ? 'border border-blue-600 text-blue-600 hover:bg-blue-50' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                            {joinState ? 'Joined' : 'Join'}
                        </button>
                    </div>
                    
                    {/* Community Highlights */}
                    <div className="max-w-4xl mx-auto px-4 py-4 border-t border-gray-200">
                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z"></path></svg>
                            Community highlights
                        </h3>
                        <div className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-hide">
                            {highlights.map((h, i) => (
                                <div key={i} className="min-w-[200px] w-64 h-32 rounded-xl bg-gray-900 text-white p-4 flex flex-col justify-between flex-shrink-0 snap-start relative overflow-hidden group cursor-pointer">
                                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                                    {activeArtistData?.artistImages?.[i % activeArtistData.artistImages.length] && (
                                        <img src={activeArtistData.artistImages[i % activeArtistData.artistImages.length]} className="absolute inset-0 w-full h-full object-cover" />
                                    )}
                                    <h4 className="font-bold text-lg leading-tight z-20 relative">{h.title}</h4>
                                    <div className="text-xs font-bold text-gray-300 z-20 relative flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                        {h.subtitle}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-4xl mx-auto px-0 sm:px-4 py-4 flex gap-6">
                <div className="flex-1 w-full relative">
                    {currentView === 'home' ? (
                        <>
                            {/* Create Post Bar */}
                            <div className="bg-white sm:rounded-md border border-gray-300 p-3 mb-4 flex flex-col gap-2">
                                {!isCreatingPost ? (
                                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsCreatingPost(true)}>
                                        <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=You`} className="w-full h-full" alt="avatar" />
                                        </div>
                                        <input type="text" placeholder="Create Post" readOnly className="bg-gray-50 border border-gray-200 rounded-md flex-1 px-4 py-2 outline-none transition-colors text-sm cursor-pointer hover:border-blue-500 hover:bg-white" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=You`} className="w-full h-full" alt="avatar" />
                                            </div>
                                            <span className="font-bold text-sm">You</span>
                                            {userFlair && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-200 text-gray-800">{userFlair}</span>}
                                        </div>
                                        <input autoFocus type="text" placeholder="Title" value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 font-medium focus:border-blue-500 outline-none" />
                                        <textarea placeholder="Text (optional)" value={newPostContent} onChange={e => setNewPostContent(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 min-h-[100px] focus:border-blue-500 outline-none resize-y"></textarea>
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setIsCreatingPost(false)} className="px-4 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-full">Cancel</button>
                                            <button onClick={handleCreatePost} disabled={!newPostTitle.trim()} className="px-4 py-1.5 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-full">Post</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sort Bar */}
                            <div className="bg-white sm:rounded-md border border-gray-300 p-2 mb-4 flex gap-2">
                                {(['Hot', 'New', 'Top'] as const).map(sort => (
                                    <button 
                                        key={sort} 
                                        onClick={() => setActiveSort(sort)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${activeSort === sort ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                                    >
                                        {sort}
                                    </button>
                                ))}
                            </div>

                            {/* Posts */}
                            <div className="space-y-0 sm:space-y-4 pb-12">
                                {sortedPosts.map((post: any, i: number) => (
                                    <RedditPost key={i} post={post} onClick={() => { setSelectedPost(post); setCurrentView('post'); window.scrollTo(0, 0); }} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="bg-white sm:rounded-md border border-gray-300 flex flex-col relative pb-8 mb-8 shadow-sm">
                            <button onClick={() => setCurrentView('home')} className="absolute -top-12 left-0 text-white font-bold flex items-center gap-1 bg-black/50 px-3 py-1 rounded-full text-sm hover:bg-black/70 z-30 transition-colors">
                                <ArrowLeftIcon className="w-4 h-4" /> Back to Feed
                            </button>
                            
                            <RedditPost post={selectedPost} isExpanded={true} />
                            
                            {/* Comment Input */}
                            <div className="px-4 py-4 sm:px-12 sm:pl-12 border-t border-gray-200">
                                <div className="text-sm mb-2 flex items-center gap-2">
                                    Comment as <span className="text-blue-600 font-bold">You</span>
                                    {userFlair && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-800">{userFlair}</span>}
                                </div>
                                <div className="border border-gray-300 rounded-md overflow-hidden focus-within:border-black transition-colors">
                                    <textarea 
                                        className="w-full p-2 outline-none resize-y min-h-[100px] text-sm" 
                                        placeholder="What are your thoughts?"
                                        value={commentInput}
                                        onChange={e => setCommentInput(e.target.value)}
                                    ></textarea>
                                    <div className="bg-gray-50 p-2 flex justify-end">
                                        <button onClick={handleComment} className={`font-bold px-4 py-1 rounded-full text-sm ${commentInput.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>Comment</button>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 sm:px-12">
                                <div className="mb-6 pb-2 border-b border-gray-200 flex items-center gap-2 text-sm text-gray-500 font-bold">
                                    Sort by: <span className="text-blue-600 flex items-center cursor-pointer uppercase hover:underline">Best <ChevronDownIcon className="w-4 h-4 ml-1" /></span>
                                </div>
                                <div className="space-y-6">
                                    {(selectedPost.comments || mockComments).map((comment: any, i: number) => (
                                        <CommentThread key={i} comment={{...comment, isOp: comment.author === selectedPost.author}} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-80 hidden lg:block flex-shrink-0 space-y-4">
                    <div className="bg-white border border-gray-300 rounded-md p-3 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="font-bold text-gray-900">About Community</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-4 pb-4 border-b border-gray-200">
                            The official subreddit to discuss everything about {artistProfile?.name}, their music, tours, charting, and pop culture impact. 
                        </p>
                        <div className="flex gap-4 mb-4">
                            <div>
                                <div className="font-bold text-gray-900 text-xl">{(visitors/1000000).toFixed(1)}m</div>
                                <div className="text-xs text-gray-500 font-medium">Members</div>
                            </div>
                            <div>
                                <div className="font-bold text-gray-900 text-xl flex items-center before:content-[''] before:w-2 before:h-2 before:bg-green-500 before:rounded-full before:mr-2">{(contributions/1000).toFixed(1)}k</div>
                                <div className="text-xs text-gray-500 font-medium">Online</div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 pt-4 mb-4">
                            <div className="text-sm font-bold text-gray-900 mb-2">USER FLAIR PREVIEW</div>
                            <div onClick={() => setShowFlairModal(true)} className="flex items-center justify-between hover:bg-gray-100 p-1.5 rounded cursor-pointer group">
                                <div className="flex items-center gap-2 text-sm">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" className="w-6 h-6 rounded-full bg-gray-200" />
                                    <div className="flex flex-col">
                                        <span className="font-bold">You</span>
                                        {userFlair && <span className="text-[10px] bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded font-bold w-max">{userFlair}</span>}
                                    </div>
                                </div>
                                <svg className="w-5 h-5 fill-current text-blue-600 group-hover:bg-blue-100 p-0.5 rounded-full transition-colors" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
                            </div>
                        </div>
                        <button onClick={() => { setCurrentView('home'); setIsCreatingPost(true); window.scrollTo(0,0); }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded-full transition-colors mb-2">
                            Create Post
                        </button>
                    </div>
                </div>
            </main>

            {/* Flair Selection Modal */}
            {showFlairModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg">Select your community flair</h3>
                            <button onClick={() => setShowFlairModal(false)} className="text-gray-500 hover:text-black">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1 space-y-2">
                            <div 
                                onClick={() => setUserFlair('')} 
                                className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${userFlair === '' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${userFlair === '' ? 'border-blue-600' : 'border-gray-400'}`}>
                                    {userFlair === '' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                                </div>
                                <span className="font-medium text-gray-500 italic">None</span>
                            </div>
                            
                            {availableFlairs.map((flair, i) => {
                                const colors = ['bg-blue-500', 'bg-purple-500', 'bg-red-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];
                                const color = colors[i % colors.length];
                                
                                return (
                                    <div 
                                        key={i} 
                                        onClick={() => setUserFlair(flair)} 
                                        className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${userFlair === flair ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${userFlair === flair ? 'border-blue-600' : 'border-gray-400'}`}>
                                            {userFlair === flair && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                                        </div>
                                        <span className={`${color} text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm`}>
                                            {activeArtistData?.artistImages?.[0] && <img src={activeArtistData.artistImages[0]} className="w-4 h-4 rounded-full object-cover mr-1"/>}
                                            {flair}
                                            <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                            <button onClick={() => setShowFlairModal(false)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default RedditSiteView;
