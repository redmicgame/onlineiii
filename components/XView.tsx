import React, { useState, useRef, useMemo, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { getGlobalPosts, publishGlobalPost, subscribeToGlobalPosts } from "../firebase";
import { ARTIST_GIFS } from "../data/artistGifs";
import XIcon from "./icons/XIcon";
import HomeIcon from "./icons/HomeIcon";
import SearchIcon from "./icons/SearchIcon";
import BellIcon from "./icons/BellIcon";
import EnvelopeIcon from "./icons/EnvelopeIcon";
import PlusIcon from "./icons/PlusIcon";
import { XPost, XUser, XTrend, XChat } from "../types";
import { formatNumber } from "../context/GameContext";
import CommentIcon from "./icons/CommentIcon";
import RetweetIcon from "./icons/RetweetIcon";
import HeartIcon from "./icons/HeartIcon";
import UserVerifiedBadge from "./icons/UserVerifiedBadge";
import ChartBarIcon from "./icons/ChartBarIcon";
import UserGroupIcon from "./icons/UserGroupIcon";
import ArrowLeftIcon from "./icons/ArrowLeftIcon";
import ImageIcon from "./icons/ImageIcon";
import ConfirmationModal from "./ConfirmationModal";
import XPremiumModal from "./XPremiumModal";
import { SpotifySnapshotCard } from "./SpotifySnapshotCard";

// Sub-component for the Year End Chart visualization
const resolveUser = (id: string, xUsersList: XUser[] = [], gameState?: any, activeArtist?: any): XUser => {
  if (!id) {
    const entityName = gameState?.group?.name || activeArtist?.name || "Artist";
    const cleanEntity = entityName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    return {
      id: "fallback_fan",
      name: `${entityName} Fan`,
      username: `stan_${cleanEntity}`,
      avatar: "https://i.imgur.com/3Y3j3jQ.png",
      isVerified: false,
    };
  }

  let found = xUsersList.find((u) => u.id === id);
  if (found) return found;

  if (gameState?.artistsData) {
    for (const aData of Object.values(gameState.artistsData) as any[]) {
      if (aData?.xUsers) {
        found = aData.xUsers.find((u: XUser) => u.id === id);
        if (found) return found;
      }
    }
  }

  const entityName = gameState?.group?.name || activeArtist?.name || "Artist";
  const cleanEntity = entityName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  if (id.startsWith("charts_")) {
    const mId = id.replace("charts_", "");
    const member = gameState?.group?.members?.find((m: any) => m.id === mId);
    const mName = member ? member.name : entityName;
    const mTag = mName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    return {
      id,
      name: `${mName} Charts`,
      username: `${mTag}charts`,
      avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0iIzFEQTFGMiIvPjxyZWN0IHg9IjE2IiB5PSIzMiIgd2lkdGg9IjgiIGhlaWdodD0iMTYiIGZpbGw9IndoaXRlIi8+PHJlY3QgeD0iMjgiIHk9IjI0IiB3aWR0aD0iOCIgaGVpZHRoPSIyNCIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSI0MCIgeT0iMTYiIHdpZHRoPSI4IiBoZWlnaHQ9IjMyIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==",
      isVerified: false,
    };
  }

  if (id.startsWith("addiction_fan_")) {
    const mId = id.replace("addiction_fan_", "");
    const member = gameState?.group?.members?.find((m: any) => m.id === mId);
    const mName = member ? member.name : entityName;
    const mTag = mName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    return {
      id,
      name: `addiction to ${mName}`,
      username: `addiction${mTag}`,
      avatar: member?.image || activeArtist?.image || "https://i.imgur.com/3Y3j3jQ.png",
      isVerified: false,
    };
  }

  if (id.startsWith("stats_")) {
    const mId = id.replace("stats_", "");
    const member = gameState?.group?.members?.find((m: any) => m.id === mId);
    const mName = member ? member.name : entityName;
    const mTag = mName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    return {
      id,
      name: `${mName} Stats`,
      username: `${mTag}stats`,
      avatar: "https://i.imgur.com/3Y3j3jQ.png",
      isVerified: false,
    };
  }

  if (id.includes("fan") || id.includes("stan") || id.startsWith("fan_") || id.startsWith("hater_")) {
    const cleanId = id.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    return {
      id,
      name: `${entityName} Fan`,
      username: `stan_${cleanEntity}_${cleanId.slice(-3) || "1"}`,
      avatar: "https://i.imgur.com/3Y3j3jQ.png",
      isVerified: false,
    };
  }

  return {
    id,
    name: `${entityName} Fan`,
    username: `stan_${cleanEntity}`,
    avatar: "https://i.imgur.com/3Y3j3jQ.png",
    isVerified: false,
  };
};

const YearEndChart: React.FC<{ dataString: string }> = ({ dataString }) => {
  try {
    const data = JSON.parse(dataString.replace("chart:", ""));
    const { year, items } = data as {
      year: number;
      items: { title: string; artist: string; cover: string; units: string }[];
    };

    // Find max units for scaling (parse '4.2M' or '500K' back to rough numbers if possible, or just linear scale since it's sorted)
    // Since items are sorted, index 0 is max. We'll just use relative height.

    return (
      <div className="w-full bg-white text-black rounded-xl overflow-hidden border border-zinc-300 mt-2 font-sans">
        <div className="p-4 bg-gradient-to-b from-blue-50 to-white relative min-h-[350px] flex flex-col">
          {/* Header */}
          <div className="text-center mb-6 z-10">
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              Best Selling Albums
            </h2>
            <div className="bg-black text-white px-3 py-0.5 text-sm font-bold inline-block transform -skew-x-12">
              <span className="block transform skew-x-12">OF {year}</span>
            </div>
          </div>

          {/* Chart Area */}
          <div className="flex-grow flex items-end justify-center gap-1 sm:gap-2 px-2 pb-8 relative z-10">
            {items.map((item, index) => {
              // Calculate height: logarithmic decay for visual appeal or linear based on index
              // Visual reference has #1 very tall, others stepping down.
              // Let's fake a nice curve.
              const heightPercentage = 100 - index * 10; // 100, 90, 80...
              const minHeight = 30;
              const finalHeight = Math.max(minHeight, heightPercentage);
              const zIndex = 10 - index;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center group relative"
                  style={{ width: "12%", zIndex }}
                >
                  {/* Units Label (Floating) */}
                  <div className="absolute -top-6 text-[10px] sm:text-xs font-bold text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-1 rounded shadow-sm">
                    {item.units}
                  </div>

                  {/* Bar */}
                  <div
                    className="w-full bg-gradient-to-b from-zinc-100 to-zinc-200 shadow-lg border border-zinc-300 rounded-t-lg relative overflow-hidden transition-all duration-500 ease-out hover:scale-105 origin-bottom"
                    style={{ height: `${finalHeight * 2.5}px` }}
                  >
                    {/* Rank Number */}
                    <div className="absolute bottom-1 w-full text-center text-2xl sm:text-4xl font-black text-zinc-300/50 select-none">
                      {index + 1}
                    </div>

                    {/* Image */}
                    <div className="p-1">
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-full aspect-square object-cover rounded-md shadow-sm border border-zinc-200"
                      />
                    </div>
                  </div>

                  {/* Metadata below bar */}
                  <div className="mt-2 text-center w-full">
                    <p className="font-bold text-[9px] sm:text-[10px] leading-tight truncate px-0.5 text-black">
                      {item.artist}
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-zinc-500 truncate px-0.5">
                      {item.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Watermark */}
          <div className="absolute bottom-2 right-3 flex items-center gap-1 opacity-50">
            <span className="text-[10px] font-bold tracking-widest text-zinc-400">
              @Red Mic
            </span>
          </div>
        </div>
      </div>
    );
  } catch (e) {
    return (
      <div className="bg-red-100 text-red-500 p-2 rounded text-xs">
        Error loading chart data.
      </div>
    );
  }
};

const renderContentWithHighlights = (text: string) => {
    return text.split(/(\$[a-zA-Z0-9]+)/g).map((part, i) => {
        if (part.startsWith('$')) {
            return <span key={i} className="text-purple-500 font-semibold">{part}</span>;
        }
        return part;
    });
};

export const Post: React.FC<{
  post: XPost;
  author: XUser | undefined;
  onQuote?: (post: XPost) => void;
  onQuoteHold?: (post: XPost) => void;
}> = ({ post, author, onQuote, onQuoteHold }) => {
  const { dispatch, activeArtistData, gameState, activeArtist } = useGame();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentImage, setCommentImage] = useState<string | null>(null);

  if (!author) return null;

  const isSuspended =
    activeArtistData!.xSuspensionStatus?.isSuspended &&
    activeArtistData!.xSuspensionStatus.accountId ===
      (activeArtistData!.selectedPlayerXUserId ||
        activeArtistData!.xUsers.find((u) => u.isPlayer)?.id);

  const timeAgo = (postDate: { week: number; year: number }) => {
    return `${postDate.week}w`;
  };

  const handleViewProfile = () => {
    if (
      author.isPlayer ||
      (!author.id.startsWith("hater_") &&
        !["popbase", "chartdata", "spotifysnapshot", "golden_globes"].includes(author.id))
    ) {
      dispatch({ type: "VIEW_X_PROFILE", payload: author.id });
    }
  };

  const handleReply = () => {
    if (!commentText && !commentImage) return;
    const playerUser = activeArtistData?.selectedPlayerXUserId
      ? activeArtistData.xUsers.find(
          (u) => u.id === activeArtistData.selectedPlayerXUserId,
        )
      : activeArtistData?.xUsers.find((u) => u.isPlayer);
    if (!playerUser) return;

    dispatch({
      type: "POST_ON_X",
      payload: {
        content: commentText,
        image: commentImage || undefined,
        postType: "normal",
        targetId: post.id, // Using quote functionality but maybe better logic later
      },
    });
    // Note: For a true reply, we would add to post.comments instead.
    // We'll update GameContext to handle `targetId` as a comment reply if needed,
    // or just let 'POST_ON_X' update it. Let's do a direct comment push for now to make it instant:
    if (activeArtistData) {
      dispatch({
        type: "REPLY_TO_X_POST",
        payload: {
          postId: post.id,
          content: commentText,
          image: commentImage || undefined,
          authorId: playerUser.id,
        },
      });
      setCommentText("");
      setCommentImage(null);
    }
  };

  const displayComments = React.useMemo(() => {
    if (post.comments && post.comments.length > 0) return post.comments;

    const count = Math.floor((post.likes * 0.05 + 1) % 4) + 1;
    const generated: import("../types").XComment[] = [];
    let seed = post.id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    const pickRandom = <T,>(arr: T[]): T =>
      arr[Math.floor(random() * arr.length)];

    const allUsers = activeArtistData?.xUsers || [];
    const potentialAuthors = allUsers.filter(
      (u) => u.id.includes("fan") || u.id.includes("hater"),
    );
    if (potentialAuthors.length === 0) return [];

    for (let i = 0; i < count; i++) {
      const commentAuthor = pickRandom(potentialAuthors);
      const isHater = commentAuthor.id.includes("hater");
      let content = "";
      let gif: string | undefined = undefined;

      const postText = post.content.toLowerCase();

      let mentionedArtist = Object.keys(ARTIST_GIFS).find((a) =>
        postText.includes(a.toLowerCase()),
      );
      if (!mentionedArtist) {
        if (postText.includes("nicki")) mentionedArtist = "Nicki Minaj";
        else if (postText.includes("cardi")) mentionedArtist = "Cardi B";
        else if (postText.includes("megan") || postText.includes("meg"))
          mentionedArtist = "Megan Thee Stallion";
        else if (postText.includes("chappell"))
          mentionedArtist = "Chappell Roan";
        else if (postText.includes("tate")) mentionedArtist = "Tate McRae";
        else if (postText.includes("gaga")) mentionedArtist = "Lady Gaga";
        else if (postText.includes("taylor")) mentionedArtist = "Taylor Swift";
        else if (postText.includes("ariana") || postText.includes("ari"))
          mentionedArtist = "Ariana Grande";
        else if (postText.includes("billie")) mentionedArtist = "Billie Eilish";
        else if (postText.includes("ice spice") || postText.includes("ice"))
          mentionedArtist = "Ice Spice";
        else if (postText.includes("flo milli")) mentionedArtist = "Flo Milli";
        else if (postText.includes("stunna") || postText.includes("sandy"))
          mentionedArtist = "Stunna Sandy";
        else if (postText.includes("kai") || postText.includes("cenat"))
          mentionedArtist = "Kai Cenat";
      }

      if (
        mentionedArtist &&
        ARTIST_GIFS[mentionedArtist] &&
        ARTIST_GIFS[mentionedArtist].length > 0
      ) {
        const gifs = ARTIST_GIFS[mentionedArtist];
        const stanPhrases = [
          `${mentionedArtist.toLowerCase()} ended u mind u`,
          `don't play with ${mentionedArtist.toLowerCase()}`,
          `${mentionedArtist.toLowerCase()} is mother`,
          `we love ${mentionedArtist.toLowerCase()}`,
          `${mentionedArtist.toLowerCase()} >>>>`,
          `stan ${mentionedArtist.toLowerCase()}`,
          `${mentionedArtist.toLowerCase()} cleared`,
          `leave ${mentionedArtist.toLowerCase()} alone`,
        ];
        content = pickRandom(stanPhrases);
        if (Math.random() > 0.3) gif = pickRandom(gifs);
      } else if (isHater) {
        content = pickRandom([
          `flop`,
          `we don't care`,
          `L`,
          `ratio`,
          `literally who asked`,
          `pack it up`,
          `retire`,
        ]);
        if (random() > 0.7)
          gif = pickRandom([
            "https://media4.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dWhlOGQ1ZjM4YnptcndqdGRkYzdkMXVjMzV6MHhhZjRrbXJ5bzJtYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xJw4d7AWwfFhofbh1A/giphy.gif",
            "https://media4.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dWhlOGQ1ZjM4YnptcndqdGRkYzdkMXVjMzV6MHhhZjRrbXJ5bzJtYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/9AtVphARiYAh9IJ6kF/giphy.gif",
            "https://media3.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dWhlOGQ1ZjM4YnptcndqdGRkYzdkMXVjMzV6MHhhZjRrbXJ5bzJtYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/QqxeXW5KNaDIphwQ2y/giphy.gif",
            "https://media4.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dWhlOGQ1ZjM4YnptcndqdGRkYzdkMXVjMzV6MHhhZjRrbXJ5bzJtYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/DHyBGsJDHLySO2NCV5/giphy.gif",
            "https://media4.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dWhlOGQ1ZjM4YnptcndqdGRkYzdkMXVjMzV6MHhhZjRrbXJ5bzJtYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Qcdmgy6lDnBxIKHDK7/giphy.gif",
          ]);
      } else {
        content = pickRandom([
          `omg exactly!!`,
          `spilled`,
          `ATE`,
          `mother`,
          `so true`,
          `screaming`,
          `period`,
        ]);
        if (random() > 0.7)
          gif = pickRandom([
            "https://media3.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Nm1iZjU3NGZxbGxmY3BrdXB3YTcxNGpsdnB2MXpqbW1wYmR5ejhwMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/PhmLpPVdZu69KCLp2m/giphy.gif",
            "https://media1.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Nm1iZjU3NGZxbGxmY3BrdXB3YTcxNGpsdnB2MXpqbW1wYmR5ejhwMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ehcOA2WtivMSBmZaH2/giphy.gif",
            "https://media4.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Nm1iZjU3NGZxbGxmY3BrdXB3YTcxNGpsdnB2MXpqbW1wYmR5ejhwMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/iH8zxeDtg7kftgGkjE/giphy.gif",
            "https://media2.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3aDlvaTZzNzZ1cTI0aGg5a2dha282MzlmeDl5dGs0enZncHYycm1pdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FZUEj5vJn1bMM9Xp6I/giphy.gif",
            "https://media0.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3aDlvaTZzNzZ1cTI0aGg5a2dha282MzlmeDl5dGs0enZncHYycm1pdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/YNOy0YQR8P45ejaiaE/giphy.gif",
            "https://media3.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3aDlvaTZzNzZ1cTI0aGg5a2dha282MzlmeDl5dGs0enZncHYycm1pdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/anmCO7MaRD6QunWAYj/giphy.gif",
          ]);
      }
      generated.push({
        id: `fake-${post.id}-${i}`,
        authorId: commentAuthor.id,
        content,
        gif,
        likes: Math.floor(random() * 500),
        comments: 0,
        date: post.date,
      });
    }
    return generated;
  }, [post.id, post.comments, activeArtistData?.xUsers, post.likes, post.date]);

  const isChartPost = post.image && post.image.startsWith("chart:");
  const isSnapshotPost = post.image && post.image.startsWith("snapshot:");
  const isLeaderboardPost = post.image && post.image.startsWith("leaderboard:");
  const isTmzPost = author.id === "tmz";

  return (
    <div className="flex gap-3 p-3 border-b border-zinc-700/70">
      <button onClick={handleViewProfile}>
        <img
          src={author.avatar}
          alt={author.name}
          className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
        />
      </button>
      <div className="w-full min-w-0">
        {" "}
        {/* min-w-0 ensures flex child shrinks properly */}
        <div className="flex items-center gap-1 text-sm">
          <button
            onClick={handleViewProfile}
            className="font-bold hover:underline cursor-pointer truncate"
          >
            {author.name}
          </button>
          <UserVerifiedBadge
            isVerified={author.isVerified}
            className="w-4 h-4 flex-shrink-0"
          />
          <span className="text-zinc-500 truncate">@{author.username}</span>
          <span className="text-zinc-500 flex-shrink-0">·</span>
          <span className="text-zinc-500 hover:underline cursor-pointer flex-shrink-0">
            {timeAgo(post.date)}
          </span>
        </div>
        <p className="text-white whitespace-pre-wrap break-words">
          {renderContentWithHighlights(post.content)}
        </p>

        {post.spotifySnapshotAlbums && post.spotifySnapshotAlbums.length > 0 && (
          <div className="bg-[#9bb2b9] rounded-xl overflow-hidden mt-3 shadow-md border border-white/10 text-white font-sans flex flex-col sm:flex-row">
            {/* Left Column - #1 */}
            <div className="w-full sm:w-[45%] p-4 flex flex-col relative bg-[#91a8af] justify-between">
              <div>
                <div className="font-bold text-lg sm:text-xl uppercase mb-4 tracking-tight drop-shadow-md">Weekly Top Albums</div>
                <img src={post.spotifySnapshotAlbums[0].coverArt} alt={post.spotifySnapshotAlbums[0].title} className="w-[80%] mx-auto aspect-square object-cover mb-4 shadow-[0_10px_20px_rgba(0,0,0,0.3)] rounded-sm" />
                <div className="flex flex-col items-center">
                   <div className="bg-[#a8bcc3] text-white font-bold px-4 py-1 text-lg mb-2 shadow-sm rounded-sm">#1</div>
                   <div className="text-center font-bold text-xl mb-3 leading-tight drop-shadow-sm px-2">{post.spotifySnapshotAlbums[0].title}</div>
                   <div className="bg-[#a8bcc3] w-full text-center py-2 font-bold text-xl mb-3 rounded-sm shadow-sm">{post.spotifySnapshotAlbums[0].streams > 0 ? `+${post.spotifySnapshotAlbums[0].streams.toLocaleString()}` : '0'}</div>
                   <div className="text-center font-bold text-lg drop-shadow-sm">{post.spotifySnapshotAlbums[0].percentChange > 0 ? `+${post.spotifySnapshotAlbums[0].percentChange}%` : `${post.spotifySnapshotAlbums[0].percentChange}%`}</div>
                </div>
              </div>
              
              <div className="mt-8 flex items-end justify-between opacity-90 pb-2">
                <div>
                  <div className="flex items-center gap-1 font-bold text-sm"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.56.3z"/></svg> SpotifySnapshot</div>
                  <div className="text-[10px]">Layout by: @socasuallygay</div>
                </div>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M21 2v10h-2V4.414L3.414 20 2 18.586 17.586 4H8V2h13z"/></svg>
              </div>
            </div>
            
            {/* Right Column - #2 to #15 */}
            <div className="w-full sm:w-[55%] p-3 sm:p-4 flex flex-col justify-between">
              <div className="text-right font-bold text-lg mb-4 drop-shadow-sm">Week {post.date.week}, {post.date.year}</div>
              <div className="space-y-[6px]">
                {post.spotifySnapshotAlbums.slice(1).map((album, idx) => {
                  const rank = album.rank;
                  const isUp = typeof album.move === 'string' && album.move.startsWith('+');
                  const isDown = typeof album.move === 'string' && album.move.startsWith('-') && album.move !== '-';
                  return (
                    <div key={rank} className="flex items-center gap-2">
                      <div className="w-7 sm:w-8 flex justify-center flex-shrink-0">
                         {isUp && <span className="bg-[#78b368] text-white text-[10px] sm:text-xs font-bold px-1 py-0.5 rounded-sm shadow-sm">{album.move}</span>}
                         {isDown && <span className="bg-[#e43838] text-white text-[10px] sm:text-xs font-bold px-1 py-0.5 rounded-sm shadow-sm">{album.move}</span>}
                         {album.move === 'NEW' && <span className="bg-[#4d9be2] text-white text-[9px] sm:text-[10px] font-bold px-1 py-0.5 rounded-sm shadow-sm uppercase">NEW</span>}
                         {album.move === '-' && <span className="text-gray-200 text-lg font-bold drop-shadow-sm">-</span>}
                      </div>
                      <div className="font-bold text-sm sm:text-base w-5 sm:w-6 text-center drop-shadow-sm flex-shrink-0">#{rank}</div>
                      <img src={album.coverArt} className="w-7 h-7 sm:w-9 sm:h-9 object-cover rounded-sm shadow-sm flex-shrink-0 bg-zinc-800" />
                      <div className="font-bold text-[11px] sm:text-xs truncate flex-1 leading-tight drop-shadow-sm pl-1">{album.title}</div>
                      <div className="font-bold text-[11px] sm:text-xs drop-shadow-sm flex-shrink-0 w-[70px] sm:w-[85px] text-right">+{album.streams.toLocaleString()}</div>
                      <div className="font-bold text-[10px] sm:text-[11px] w-[45px] sm:w-[50px] text-right drop-shadow-sm flex-shrink-0 opacity-90">{album.percentChange > 0 ? `+${album.percentChange}%` : `${album.percentChange}%`}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
        {post.isSpace && (
          <div
            className="mt-2 bg-[#7F56D9]/10 border border-[#7F56D9]/30 rounded-xl p-4 cursor-pointer hover:bg-[#7F56D9]/20 transition-colors"
            onClick={() =>
              !post.spaceInfo?.isEnded &&
              dispatch({ type: "CHANGE_VIEW", payload: "xActiveSpace" })
            }
          >
            {post.spaceInfo?.isEnded ? (
              <div className="flex items-center gap-2 mb-2 opacity-50">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M5.88 4.12L13.76 12l-7.88 7.88L8 22l10-10L8 2 5.88 4.12z" />
                </svg>
                <span className="text-zinc-500 font-bold text-xs">Ended</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#7F56D9] rounded-full animate-pulse"></div>
                <span className="text-[#7F56D9] font-bold text-xs">LIVE</span>
              </div>
            )}
            <h4
              className={`font-bold text-lg mb-1 ${post.spaceInfo?.isEnded ? "opacity-50" : ""}`}
            >
              {post.content.replace("Listening to ", "")}
            </h4>
            <div
              className={`flex items-center justify-between text-sm ${post.spaceInfo?.isEnded ? "opacity-50" : ""}`}
            >
              <div className="flex -space-x-2">
                <img
                  src={author.avatar}
                  className="w-6 h-6 rounded-full border border-black"
                />
                <div className="w-6 h-6 rounded-full bg-zinc-800 border border-black flex items-center justify-center text-[10px]">
                  +{post.spaceInfo?.listeners || 15}
                </div>
              </div>
              {post.spaceInfo?.isEnded ? (
                <button className="bg-transparent border border-zinc-700 text-white px-3 py-1 rounded-full font-bold text-xs">
                  Ended
                </button>
              ) : (
                <button className="bg-[#7F56D9] text-white px-3 py-1 rounded-full font-bold text-xs">
                  Join
                </button>
              )}
            </div>
          </div>
        )}
        {isChartPost ? (
          <YearEndChart dataString={post.image!} />
        ) : isSnapshotPost ? (
          <SpotifySnapshotCard dataString={post.image!} style={gameState.spotifySnapshotStyle} />
        ) : isLeaderboardPost ? (
          <LeaderboardGridCard dataString={post.image!} />
        ) : isTmzPost ? (
          <div
            onClick={() =>
              dispatch({ type: "SET_ACTIVE_TMZ_POST", payload: post })
            }
            className="mt-2 rounded-xl border border-zinc-700 overflow-hidden cursor-pointer hover:border-zinc-500 transition-colors bg-zinc-900"
          >
            <div className="relative">
              <img
                src={
                  post.image ||
                  author.avatar
                }
                alt="Article thumbnail"
                className="w-full aspect-[16/9] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 font-bold text-white text-lg leading-tight line-clamp-2 drop-shadow-md">
                {post.content}
              </div>
            </div>
            <div className="p-3 bg-zinc-800">
              <span className="text-zinc-400 text-sm">From tmz.com</span>
            </div>
          </div>
        ) : post.video ? (
          <video
            src={post.video}
            className="mt-2 rounded-xl border border-zinc-700 max-w-full h-auto w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : post.image && post.image2 ? (
          <div className="mt-2 flex border border-zinc-700 rounded-xl overflow-hidden max-w-full h-auto aspect-[2/1] bg-zinc-900">
            <img
              src={post.image}
              alt="Post image 1"
              className="w-1/2 h-full object-cover border-r border-zinc-700"
            />
            <img
              src={post.image2}
              alt="Post image 2"
              className="w-1/2 h-full object-cover"
            />
          </div>
        ) : post.image ? (
          post.image.includes('||') ? (
            <div className="mt-2 rounded-xl border border-zinc-700 overflow-hidden flex divide-x divide-zinc-700 h-64 bg-white/5">
              <img
                src={post.image.split('||')[0]}
                alt="Post image 1"
                className="w-1/2 h-full object-cover"
              />
              <div className="w-1/2 h-full flex items-center justify-center p-8 bg-zinc-900">
                <img
                  src={post.image.split('||')[1]}
                  alt="Post image 2"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          ) : (
            <img
              src={post.image}
              alt="Post image"
              className="mt-2 rounded-xl border border-zinc-700 max-w-full h-auto"
            />
          )
        ) : null}
        {post.poll && (
          <div className="mt-3 border border-zinc-800 rounded-xl overflow-hidden">
            {post.poll.options.map((opt) => {
              const percent =
                post.poll!.totalVotes > 0
                  ? Math.round((opt.votes / post.poll!.totalVotes) * 100)
                  : 0;
              return (
                <div
                  key={opt.id}
                  className="relative p-3 border-b border-zinc-800 last:border-b-0 cursor-pointer hover:bg-zinc-900 transition-colors"
                  onClick={() => {
                    // Make some interaction? If player hasn't voted.
                    // For now just visually, usually games don't do real voting unless requested
                  }}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-zinc-800"
                    style={{ width: `${percent}%` }}
                  ></div>
                  <div className="relative flex justify-between text-sm font-bold text-white z-10 px-2 mix-blend-difference">
                    <span>{opt.text}</span>
                    <span>{percent}%</span>
                  </div>
                </div>
              );
            })}
            <div className="p-2 text-xs text-zinc-500 font-semibold bg-zinc-900/50">
              {Intl.NumberFormat("en-US").format(post.poll.totalVotes)} votes •
              Final results
            </div>
          </div>
        )}
        {post.quoteOf && (() => {
          const qAuthor = resolveUser(post.quoteOf.authorId, activeArtistData?.xUsers || [], gameState, activeArtist);
          return (
            <div className="mt-2 border border-zinc-700 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-sm mb-1">
                <img
                  src={qAuthor.avatar}
                  alt="Avatar"
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="font-bold">
                  {qAuthor.name}
                </span>
                <span className="text-zinc-500">
                  @{qAuthor.username}
                </span>
                <span className="text-zinc-500 flex-shrink-0">·</span>
                <span className="text-zinc-500 flex-shrink-0">
                  {timeAgo(post.quoteOf.date)}
                </span>
              </div>
              <p className="text-sm text-white whitespace-pre-wrap">
                {post.quoteOf.content}
              </p>
              {post.quoteOf.video ? (
                <video
                  src={post.quoteOf.video}
                  className="mt-2 rounded-xl border border-zinc-700 max-w-full h-auto max-h-48 w-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : post.quoteOf.image &&
                !post.quoteOf.image.startsWith("chart:") ? (
                <img
                  src={post.quoteOf.image}
                  alt="Quoted image"
                  className="mt-2 rounded-xl border border-zinc-700 max-w-full h-auto max-h-48 object-cover"
                />
              ) : null}
            </div>
          );
        })()}
        <div className="flex justify-between items-center mt-3 text-zinc-500 max-w-sm">
          <div className="flex items-center gap-1 group">
            <button
              disabled={isSuspended}
              onClick={() => setShowComments(!showComments)}
              className="p-1.5 group-hover:bg-blue-500/10 rounded-full disabled:cursor-not-allowed"
            >
              <CommentIcon className="w-5 h-5 group-hover:text-blue-500" />
            </button>
            <span className="text-xs group-hover:text-blue-500">
              {post.comments?.length || Math.floor(post.likes * 0.05 + 1)}
            </span>
          </div>
          <div className="flex items-center gap-1 group">
            <button
              disabled={isSuspended}
              onClick={() => onQuote && onQuote(post)}
              onContextMenu={(e) => {
                e.preventDefault();
                onQuoteHold && onQuoteHold(post);
              }}
              className="p-1.5 group-hover:bg-green-500/10 rounded-full disabled:cursor-not-allowed"
            >
              <RetweetIcon className="w-5 h-5 group-hover:text-green-500" />
            </button>
            <span className="text-xs group-hover:text-green-500">
              {formatNumber(post.retweets)}
            </span>
          </div>
          <div className="flex items-center gap-1 group">
            <button
              disabled={isSuspended}
              className="p-1.5 group-hover:bg-pink-500/10 rounded-full disabled:cursor-not-allowed"
            >
              <HeartIcon className="w-5 h-5 group-hover:text-pink-500" />
            </button>
            <span className="text-xs group-hover:text-pink-500">
              {formatNumber(post.likes)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ChartBarIcon className="w-5 h-5" />
            <span className="text-xs">{formatNumber(post.views)}</span>
          </div>
        </div>
        {showComments && (
          <div className="mt-4 pt-3 border-t border-zinc-700/50">
            {/* Reply Input */}
            <div className="flex gap-2 mb-4">
              <img
                src={
                  activeArtistData?.xUsers.find(
                    (u) =>
                      u.id ===
                      (activeArtistData?.selectedPlayerXUserId ||
                        activeArtistData?.xUsers.find((p) => p.isPlayer)?.id),
                  )?.avatar || ""
                }
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Post your reply"
                  className="w-full bg-transparent border-b border-zinc-700 pb-1 text-sm outline-none focus:border-blue-500 transition-colors"
                  disabled={isSuspended}
                />
                {commentImage && (
                  <div className="relative mt-2 hover:opacity-90">
                    <img
                      src={commentImage}
                      className="rounded-xl w-32 h-32 object-cover"
                    />
                    <button
                      onClick={() => setCommentImage(null)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 text-xs font-bold leading-none w-5 h-5 flex items-center justify-center"
                    >
                      &times;
                    </button>
                  </div>
                )}
                <div className="flex justify-between mt-2 items-center">
                  <div className="flex gap-2">
                    <button
                      disabled={isSuspended}
                      onClick={() =>
                        setCommentImage(
                          "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=200&h=200&fit=crop",
                        )
                      }
                      className="text-blue-500 disabled:opacity-50"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      disabled={isSuspended}
                      onClick={() =>
                        setCommentImage(
                          "https://media1.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Nm1iZjU3NGZxbGxmY3BrdXB3YTcxNGpsdnB2MXpqbW1wYmR5ejhwMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ehcOA2WtivMSBmZaH2/giphy.gif",
                        )
                      }
                      className="text-blue-500 font-bold text-[10px] border border-blue-500 rounded px-1 disabled:opacity-50 leading-none py-[1px] mt-0.5"
                    >
                      GIF
                    </button>
                  </div>
                  <button
                    disabled={(!commentText && !commentImage) || isSuspended}
                    onClick={handleReply}
                    className="bg-blue-500 text-white px-3 py-1 text-xs font-bold rounded-full disabled:opacity-50"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>

            {/* List of comments */}
            <div className="space-y-4">
              {displayComments?.map((comment) => {
                const commentAuthor = activeArtistData?.xUsers.find(
                  (u) => u.id === comment.authorId,
                );
                if (!commentAuthor) return null;
                return (
                  <div
                    key={comment.id}
                    className="flex gap-2 text-sm mt-3 border-t border-zinc-800 pt-3"
                  >
                    <img
                      src={commentAuthor.avatar}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{commentAuthor.name}</span>
                        <UserVerifiedBadge
                          isVerified={commentAuthor.isVerified}
                          className="w-3 h-3 flex-shrink-0"
                        />
                        <span className="text-zinc-500">
                          @{commentAuthor.username}
                        </span>
                      </div>
                      <p className="mt-0.5">{comment.content}</p>
                      {comment.image && (
                        <img
                          src={comment.image}
                          className="mt-2 rounded-lg w-full max-w-sm max-h-48 object-cover"
                        />
                      )}
                      {comment.gif && (
                        <img
                          src={comment.gif}
                          className="mt-2 rounded-lg w-full max-w-sm max-h-48 object-cover"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FeedView: React.FC<{
  onQuote?: (post: XPost) => void;
  onQuoteHold?: (post: XPost) => void;
}> = ({ onQuote, onQuoteHold }) => {
  const { gameState, activeArtistData, activeArtist } = useGame();

  const [fetchedGlobalPosts, setFetchedGlobalPosts] = useState<any[]>([]);
  const [feedFilter, setFeedFilter] = useState<"all" | "online" | "regular">("all");

  useEffect(() => {
    const unsub = subscribeToGlobalPosts((posts) => {
      if (posts && posts.length > 0) {
        setFetchedGlobalPosts(posts);
      }
    });
    return () => unsub();
  }, []);

  // Track which post IDs are online player posts
  const onlinePostIds = new Set<string>();
  fetchedGlobalPosts.forEach((gp) => onlinePostIds.add(gp.id));

  // If playing as a member of a group, combine group and member posts
  let xPosts = [...(activeArtistData?.xPosts || [])];
  let xUsers = [...(activeArtistData?.xUsers || [])];

  if (fetchedGlobalPosts.length > 0) {
    const existingIds = new Set(xPosts.map((p) => p.id));
    fetchedGlobalPosts.forEach((gp) => {
      if (!existingIds.has(gp.id)) {
        const authorId = gp.authorId || gp.id;
        const authorHandle = gp.authorHandle ? gp.authorHandle.replace("@", "") : (gp.authorName || "player").toLowerCase().replace(/\s/g, "");
        const userObj: XUser = {
          id: authorId,
          name: gp.authorName || "Online Player",
          username: authorHandle,
          avatar: gp.authorAvatar || "https://i.imgur.com/3Y3j3jQ.png",
          isVerified: true,
          bio: `Online Player in Red Mic Online`
        };
        const postObj: XPost = {
          id: gp.id,
          authorId: authorId,
          content: gp.content,
          date: { year: gameState.date.year, week: gameState.date.week },
          likes: gp.likesCount || 42,
          retweets: gp.repostsCount || 12,
          views: 500,
          isOnlinePlayer: true,
        };
        xUsers.push(userObj);
        xPosts.unshift(postObj);
        existingIds.add(gp.id);
      }
    });
  }

  if (
    gameState.group &&
    gameState.group.members.some((m) => m.id === gameState.activeArtistId)
  ) {
    const groupData = gameState.artistsData[gameState.group.id];
    if (groupData) {
      const groupPostsIds = new Set(xPosts.map((p) => p.id));
      const groupUsersIds = new Set(xUsers.map((u) => u.id));

      groupData.xPosts.forEach((p) => {
        if (!groupPostsIds.has(p.id)) {
          xPosts.push(p);
          groupPostsIds.add(p.id);
        }
      });

      groupData.xUsers.forEach((u) => {
        if (!groupUsersIds.has(u.id)) {
          xUsers.push(u);
          groupUsersIds.add(u.id);
        }
      });
    }
  }

  const [displayCount, setDisplayCount] = useState(20);

  const SYSTEM_USERS_FALLBACK: Record<string, XUser> = {
    
    golden_globes: {
      id: "golden_globes",
      name: "Golden Globes",
      username: "goldenglobes",
      avatar: "https://upload.wikimedia.org/wikipedia/en/thumb/e/ef/Golden_Globe_Awards_logo.svg/1200px-Golden_Globe_Awards_logo.svg.png",
      isVerified: true,
      bio: "#GoldenGlobes — LIVE Sunday, January 10, 2027 on @CBS and @paramountplus hosted by @NikkiGlaser! 📍 Hollywood, California 🔗 goldenglobes.com",
      followersCount: 1900000,
      followingCount: 822,
    },
    spotifysnapshot: {
      id: "spotifysnapshot",
      name: "Spotify Snapshot",
      username: "SnapshotSpotify",
      avatar:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0iIzFkMWQxZCIvPjxwYXRoIGQ9Ik00Ni41MzIgNDYuNTMyQzQ2LjUzMiA0Ni41MzIgNDYuNTMy...IiBmaWxsPSIjMThEMzRFIi8+PC9zdmc+",
      isVerified: true,
      bio: "Real-time Spotify numbers for your favorite artists.",
      followersCount: 1100000,
      followingCount: 0,
    },
    chartdata: {
      id: "chartdata",
      name: "chart data",
      username: "chartdata",
      avatar:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNjQgMzJBNzIgNzIgMCAwMS04IDMyQTcyIDcyIDAgMDE2NCAzMnoiIGZpbGw9IiMxZDFkMWQiLz48cGF0aCBkPSJNMCAzMkE3MiA3MiAwIDAwNzIgMzJBNzIgNzIgMCAwMDAtMzJ6IiBmaWxsPSIjZmZmIi8+PC9zdmc+",
      isVerified: true,
      bio: "facts & stats",
      followersCount: 2300000,
      followingCount: 1,
    },
    talkofthecharts: {
      id: "talkofthecharts",
      name: "Talk of the Charts",
      username: "talkofthecharts",
      avatar: "https://ui-avatars.com/api/?name=Talk+Of+The+Charts&background=000&color=fff",
      isVerified: true,
      bio: "Predictions, charts, and news.",
      followersCount: 850000,
      followingCount: 0,
    },
  };

  const findUser = (id: string) =>
    resolveUser(id, xUsers, gameState, activeArtist);

  const [postsToShow, setPostsToShow] = useState(10);

  const sortedPosts = [...xPosts].sort((a, b) => {
    const dateA = a.date.year * 52 + a.date.week;
    const dateB = b.date.year * 52 + b.date.week;
    return dateB - dateA;
  });

  const filteredPosts = sortedPosts.filter((post) => {
    const isOnline = post.isOnlinePlayer || onlinePostIds.has(post.id);
    if (feedFilter === "online") return isOnline;
    if (feedFilter === "regular") return !isOnline;
    return true;
  });

  const displayedPosts = filteredPosts.slice(0, postsToShow);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Kept for backward compatibility if ever needed
  };

  // Dummy Stories
  const storyUsers = xUsers.filter((u) => u.isVerified).slice(0, 10);

  return (
    <div onScroll={handleScroll} className="h-full overflow-y-auto pb-32">
      <div className="flex gap-4 overflow-x-auto p-4 border-b border-zinc-800 scrollbar-hide">
        <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
          <div className="w-16 h-16 rounded-full border-2 border-zinc-700 flex items-center justify-center relative">
            <img
              src={xUsers.find((u) => u.isPlayer)?.avatar}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center border-2 border-black">
              <span className="text-white text-xs font-bold leading-none">
                +
              </span>
            </div>
          </div>
          <span className="text-xs text-zinc-400">Add Story</span>
        </div>
        {storyUsers.map((user) => (
          <div
            key={user.id}
            className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full border-2 border-blue-500 p-[2px]">
              <img
                src={user.avatar}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="text-xs text-zinc-300 w-16 truncate text-center">
              {user.name}
            </span>
          </div>
        ))}
      </div>

      {/* Feed Toggle Filter Bar */}
      <div className="flex gap-2 p-3 bg-zinc-950 border-b border-zinc-800 sticky top-0 z-10 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFeedFilter("all")}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap ${
            feedFilter === "all"
              ? "bg-white text-black shadow-md"
              : "bg-zinc-800/80 text-zinc-400 hover:text-white"
          }`}
        >
          🌐 All Tweets
        </button>
        <button
          onClick={() => setFeedFilter("online")}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-full flex items-center gap-1.5 transition-all whitespace-nowrap ${
            feedFilter === "online"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
              : "bg-zinc-800/80 text-zinc-400 hover:text-white"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          🎮 Online Players Tweets ({fetchedGlobalPosts.length})
        </button>
        <button
          onClick={() => setFeedFilter("regular")}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap ${
            feedFilter === "regular"
              ? "bg-white text-black shadow-md"
              : "bg-zinc-800/80 text-zinc-400 hover:text-white"
          }`}
        >
          📰 Regular Feed
        </button>
      </div>

      {displayedPosts.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 text-sm">
          No tweets found for this filter.
        </div>
      ) : (
        displayedPosts.map((post) => (
          <Post
            key={post.id}
            post={post}
            author={findUser(post.authorId)}
            onQuote={onQuote}
            onQuoteHold={onQuoteHold}
          />
        ))
      )}
      
      {postsToShow < filteredPosts.length && (
        <div className="p-4 flex justify-center border-t border-zinc-700/70">
           <button 
             onClick={() => setPostsToShow(p => p + 10)}
             className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full font-bold text-sm transition-colors"
           >
             Load More
           </button>
        </div>
      )}
    </div>
  );
};

const ExploreView: React.FC<{
  onQuote?: (post: XPost) => void;
  onQuoteHold?: (post: XPost) => void;
}> = ({ onQuote, onQuoteHold }) => {
  const { gameState, activeArtistData, dispatch, activeArtist } = useGame();

  // If playing as a member of a group, combine group and member posts
  let xPosts = [...(activeArtistData?.xPosts || [])];
  let xUsers = [...(activeArtistData?.xUsers || [])];
  let xTrends = [...(activeArtistData?.xTrends || [])];

  if (
    gameState.group &&
    gameState.group.members.some((m) => m.id === gameState.activeArtistId)
  ) {
    const groupData = gameState.artistsData[gameState.group.id];
    if (groupData) {
      const groupPostsIds = new Set(xPosts.map((p) => p.id));
      const groupUsersIds = new Set(xUsers.map((u) => u.id));

      groupData.xPosts.forEach((p) => {
        if (!groupPostsIds.has(p.id)) {
          xPosts.push(p);
          groupPostsIds.add(p.id);
        }
      });

      groupData.xUsers.forEach((u) => {
        if (!groupUsersIds.has(u.id)) {
          xUsers.push(u);
          groupUsersIds.add(u.id);
        }
      });
      // Trends don't have IDs but can just be merged (they are usually the same or similar)
      // But let's just use the group's trends as well to enrich the list. We'll take top 10 unique ones by title.
      const trendTitles = new Set(xTrends.map((t) => t.title));
      groupData.xTrends.forEach((t) => {
        if (!trendTitles.has(t.title)) {
          xTrends.push(t);
          trendTitles.add(t.title);
        }
      });
    }
  }
  xTrends = xTrends.sort((a, b) => b.postCount - a.postCount);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    users: XUser[];
    posts: XPost[];
  }>({ users: [], posts: [] });

  // Find latest posts from PopBase/TMZ for news
  const newsPosts = [...xPosts]
    .filter((p) =>
      ["popbase", "tmz", "chartdata", "spotifysnapshot", "talkofthecharts", "golden_globes"].includes(p.authorId),
    )
    .slice(0, 3);

  const SYSTEM_USERS_FALLBACK: Record<string, XUser> = {
    spotifysnapshot: {
      id: "spotifysnapshot",
      name: "Spotify Snapshot",
      username: "SnapshotSpotify",
      avatar:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0iIzFkMWQxZCIvPjxwYXRoIGQ9Ik00Ni41MzIgNDYuNTMyQzQ2LjUzMiA0Ni41MzIgNDYuNTMy...IiBmaWxsPSIjMThEMzRFIi8+PC9zdmc+",
      isVerified: true,
      bio: "Real-time Spotify numbers for your favorite artists.",
      followersCount: 1100000,
      followingCount: 0,
    },
    chartdata: {
      id: "chartdata",
      name: "chart data",
      username: "chartdata",
      avatar:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNjQgMzJBNzIgNzIgMCAwMS04IDMyQTcyIDcyIDAgMDE2NCAzMnoiIGZpbGw9IiMxZDFkMWQiLz48cGF0aCBkPSJNMCAzMkE3MiA3MiAwIDAwNzIgMzJBNzIgNzIgMCAwMDAtMzJ6IiBmaWxsPSIjZmZmIi8+PC9zdmc+",
      isVerified: true,
      bio: "facts & stats",
      followersCount: 2300000,
      followingCount: 1,
    },
    talkofthecharts: {
      id: "talkofthecharts",
      name: "Talk of the Charts",
      username: "talkofthecharts",
      avatar: "https://ui-avatars.com/api/?name=Talk+Of+The+Charts&background=000&color=fff",
      isVerified: true,
      bio: "Predictions, charts, and news.",
      followersCount: 850000,
      followingCount: 0,
    },
  };
  const findUser = (id: string) =>
    resolveUser(id, xUsers, gameState, activeArtist);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ users: [], posts: [] });
      return;
    }

    const q = searchQuery.toLowerCase();
    const users = xUsers
      .filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q),
      )
      .slice(0, 3);
    const posts = xPosts
      .filter((p) => p.content.toLowerCase().includes(q))
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 10);

    setSearchResults({ users, posts });
  }, [searchQuery, xUsers, xPosts]);

  return (
    <div>
      <div className="p-3 sticky top-0 bg-black/80 backdrop-blur z-10 border-b border-zinc-800">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-800 border border-transparent focus:border-blue-500 rounded-full px-4 py-2 text-sm focus:outline-none"
        />
      </div>

      {searchQuery.trim() ? (
        <div className="pb-32 h-full overflow-y-auto">
          {searchResults.users.length > 0 && (
            <div className="border-b border-zinc-800">
              <h3 className="font-bold p-3 text-lg">People</h3>
              {searchResults.users.map((u) => (
                <div
                  key={u.id}
                  className="flex gap-3 p-3 hover:bg-zinc-900 cursor-pointer"
                  onClick={() =>
                    dispatch({ type: "VIEW_X_PROFILE", payload: u.id })
                  }
                >
                  <img
                    src={u.avatar}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex gap-1 items-center">
                      <span className="font-bold truncate">{u.name}</span>
                      <UserVerifiedBadge
                        isVerified={u.isVerified}
                        className="w-4 h-4 flex-shrink-0"
                      />
                    </div>
                    <div className="text-sm text-zinc-500">@{u.username}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {searchResults.posts.length > 0 && (
            <div>
              <h3 className="font-bold p-3 text-lg">Posts</h3>
              {searchResults.posts.map((p) => (
                <Post
                  key={p.id}
                  post={p}
                  author={findUser(p.authorId)}
                  onQuote={onQuote}
                  onQuoteHold={onQuoteHold}
                />
              ))}
            </div>
          )}
          {searchResults.users.length === 0 &&
            searchResults.posts.length === 0 && (
              <div className="p-8 text-center text-zinc-500">
                No results for "{searchQuery}"
              </div>
            )}
        </div>
      ) : (
        <div className="p-3">
          <h2 className="text-xl font-black mb-4 px-1">Today's top news</h2>
          <div className="mb-6 space-y-4">
            {newsPosts.length > 0 ? (
              newsPosts.map((post, index) => {
                const author = xUsers.find((u) => u.id === post.authorId);
                return (
                  <div
                    key={post.id}
                    className="flex gap-3 items-center hover:bg-zinc-900 cursor-pointer p-2 rounded-xl"
                    onClick={() => onQuote && onQuote(post)}
                  >
                    <img
                      src={
                        post.image ||
                        author?.avatar ||
                        "https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?auto=format&fit=crop&q=80&w=150"
                      }
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-zinc-800"
                    />
                    <div>
                      <p className="text-xs text-zinc-400 mb-0.5">
                        {author?.name} · Today
                      </p>
                      <p className="font-bold text-sm leading-snug line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-zinc-500 text-sm px-1">No major news today.</p>
            )}
          </div>

          <h2 className="text-xl font-black mb-4 px-1">Trends for you</h2>
          <div className="space-y-0">
            {xTrends.map((trend, i) => (
              <div
                key={trend.id}
                className="py-2.5 px-1 hover:bg-zinc-900 cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-zinc-500 font-medium">
                      {i + 1} · {trend.category}
                    </p>
                    <p className="font-bold text-md mt-0.5">{trend.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {formatNumber(trend.postCount)} posts
                    </p>
                  </div>
                  <button className="text-zinc-500 hover:text-blue-500 p-1">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="w-5 h-5 fill-current"
                    >
                      <g>
                        <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MessagesView: React.FC = () => {
  const { dispatch, activeArtistData, gameState } = useGame();
  const { xChats } = activeArtistData!;

  const getLastMessage = (chat: XChat) => {
    if (chat.messages.length === 0)
      return { text: "No messages yet", time: "" };
    const lastMsg = chat.messages[chat.messages.length - 1];
    return {
      text: lastMsg.text,
      time: `${lastMsg.date.week}w`,
    };
  };

  return (
    <div className="text-white">
      <div className="p-3 border-b border-zinc-700">
        <h1 className="text-xl font-bold">Messages</h1>
      </div>
      <div className="p-3">
        <input
          type="text"
          placeholder="Search Direct Messages"
          className="w-full bg-zinc-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {xChats.map((chat) => {
        const lastMessage = getLastMessage(chat);
        return (
          <button
            key={chat.id}
            onClick={() => dispatch({ type: "VIEW_X_CHAT", payload: chat.id })}
            className="w-full flex gap-3 p-3 hover:bg-zinc-800/50 cursor-pointer"
          >
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
            />
            <div className="w-full overflow-hidden text-left">
              <div className="flex justify-between items-baseline">
                <p className="font-bold truncate">{chat.name}</p>
                <p className="text-xs text-zinc-500 flex-shrink-0">
                  {lastMessage.time}
                </p>
              </div>
              <p className="text-sm text-zinc-400 truncate">
                {lastMessage.text}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

const AccountsView: React.FC = () => {
  const { dispatch, activeArtistData, gameState } = useGame();
  if (!activeArtistData) return null;
  const { xUsers, selectedPlayerXUserId } = activeArtistData;

  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newAvatar, setNewAvatar] = useState(
    "https://ui-avatars.com/api/?background=random&name=New",
  );
  const [newBio, setNewBio] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [changingAvatarForAccountId, setChangingAvatarForAccountId] = useState<
    string | null
  >(null);

  const playerAccounts = xUsers.filter((u) => u.isPlayer);
  const activePlayerUser =
    playerAccounts.find((u) => u.id === selectedPlayerXUserId) ||
    playerAccounts[0];

  const handleCreateAccount = () => {
    if (!newName || !newUsername) return;
    dispatch({
      type: "CREATE_X_ACCOUNT",
      payload: {
        name: newName,
        username: newUsername,
        avatar: newAvatar,
        bio: newBio,
      },
    });
    setIsCreating(false);
    setNewName("");
    setNewUsername("");
    setNewBio("");
  };

  const handleAvatarClick = (e: React.MouseEvent, accountId: string) => {
    e.stopPropagation();
    setChangingAvatarForAccountId(accountId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && changingAvatarForAccountId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({
          type: "UPDATE_NPC_AVATAR",
          payload: {
            userId: changingAvatarForAccountId,
            newAvatar: reader.result as string,
          },
        });
        setChangingAvatarForAccountId(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="text-white p-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <h1 className="text-xl font-bold mb-4">Your X Accounts</h1>
      <div className="space-y-4">
        {playerAccounts.map((account) => (
          <div
            key={account.id}
            className={`flex items-center justify-between p-4 rounded-xl border ${activePlayerUser?.id === account.id ? "border-blue-500 bg-blue-500/10" : "border-zinc-700 bg-zinc-800"}`}
          >
            <div
              className="flex items-center gap-3 w-full"
              onClick={() =>
                dispatch({
                  type: "SELECT_X_ACCOUNT",
                  payload: { accountId: account.id },
                })
              }
              style={{ cursor: "pointer" }}
            >
              <div
                className="relative group flex-shrink-0"
                onClick={(e) => handleAvatarClick(e, account.id)}
              >
                <img
                  src={account.avatar}
                  alt={account.name}
                  className="w-12 h-12 rounded-full object-cover group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="font-bold flex items-center gap-1 truncate">
                  {account.name}{" "}
                  <UserVerifiedBadge
                    isVerified={account.isVerified}
                    className="w-4 h-4 flex-shrink-0"
                  />
                </h3>
                <p className="text-zinc-500 text-sm truncate">
                  @{account.username}
                </p>
              </div>
            </div>
            <div className="flex gap-2 ml-4 flex-shrink-0">
              {playerAccounts.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      confirm("Are you sure you want to delete this account?")
                    ) {
                      dispatch({
                        type: "DELETE_X_ACCOUNT",
                        payload: { accountId: account.id },
                      });
                    }
                  }}
                  className="text-red-400 hover:bg-red-500/20 px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              )}
              {activePlayerUser?.id !== account.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({
                      type: "SELECT_X_ACCOUNT",
                      payload: { accountId: account.id },
                    });
                  }}
                  className="bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded text-sm font-semibold"
                >
                  Switch
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {playerAccounts.length < 5 && !isCreating && (
        <button
          onClick={() => setIsCreating(true)}
          className="mt-4 w-full border-2 border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 py-4 rounded-xl font-bold transition-colors"
        >
          + Add New Account ({playerAccounts.length}/5)
        </button>
      )}

      {isCreating && (
        <div className="mt-6 bg-zinc-900 border border-zinc-700 p-4 rounded-xl">
          <h3 className="font-bold text-lg mb-4">Create New Account</h3>
          <div className="space-y-3">
            <input
              className="w-full bg-zinc-800 border-none rounded p-2 text-white placeholder-zinc-500"
              placeholder="Display Name"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setNewAvatar(
                  "https://ui-avatars.com/api/?background=random&name=" +
                    encodeURIComponent(e.target.value || "N"),
                );
              }}
            />
            <div className="flex bg-zinc-800 rounded overflow-hidden">
              <span className="p-2 text-zinc-500 pl-3">@</span>
              <input
                className="w-full bg-transparent border-none rounded-r p-2 text-white placeholder-zinc-500"
                placeholder="username"
                value={newUsername}
                onChange={(e) =>
                  setNewUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))
                }
              />
            </div>
            <textarea
              className="w-full bg-zinc-800 border-none rounded p-2 text-white placeholder-zinc-500"
              placeholder="Bio"
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              rows={2}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAccount}
                disabled={!newName || !newUsername}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded font-semibold text-sm text-white"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ComposeXPostModal: React.FC<{
  user: XUser;
  onClose: () => void;
  onPost: (payload: {
    content: string;
    image?: string;
    postType: "normal" | "fanWar" | "push" | "announce" | "endorse" | "market_crypto";
    targetId?: string;
    songId?: string;
    quoteOf?: XPost;
    announceItem?: any;
    poll?: {
      options: { id: string; text: string; votes: number }[];
      totalVotes: number;
    };
  }) => void;
  quotePost?: XPost;
}> = ({ user, onClose, onPost, quotePost }) => {
  const { gameState, activeArtistData, activeArtist } = useGame();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isPollVisible, setIsPollVisible] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [postType, setPostType] = useState<
    "normal" | "fanWar" | "push" | "announce" | "endorse" | "market_crypto"
  >("normal");
  const [targetId, setTargetId] = useState<string>("");
  const [songId, setSongId] = useState<string>("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const MAX_CHARS = 280;

  const npcArtists = useMemo(() => {
    const artistNames = new Set(
      gameState.npcs
        .map((npc) => npc.artist)
        .filter((name) => name !== user.name),
    );
    return Array.from(artistNames).sort();
  }, [gameState.npcs, user.name]);

  const playerSongs = useMemo(() => {
    return activeArtistData!.songs.filter((s) => s.isReleased);
  }, [activeArtistData]);

  const scheduledItems = useMemo(() => {
    const items: {
      type: "project" | "single";
      id: string;
      name: string;
      submissionId: string;
      songId?: string;
    }[] = [];
    activeArtistData?.labelSubmissions
      ?.filter((s) => s.status === "scheduled")
      .forEach((sub) => {
        if (sub.projectReleaseDate && !sub.isProjectAnnounced) {
          items.push({
            type: "project",
            id: `proj-${sub.id}`,
            name: sub.release.title,
            submissionId: sub.id,
          });
        }
        if (sub.singlesToRelease) {
          sub.singlesToRelease
            .filter((s) => !s.isAnnounced)
            .forEach((single) => {
              const song = activeArtistData.songs.find(
                (s) => s.id === single.songId,
              );
              if (song)
                items.push({
                  type: "single",
                  id: `single-${single.songId}`,
                  name: song.title,
                  submissionId: sub.id,
                  songId: song.id,
                });
            });
        }
      });
    return items;
  }, [activeArtistData]);

  const [announceItemId, setAnnounceItemId] = useState<string>("");

  useEffect(() => {
    setTargetId("");
    setSongId("");
    setAnnounceItemId("");

    if (postType === "fanWar" && npcArtists.length > 0) {
      setTargetId(npcArtists[0]);
      setContent(`My fans are better than ${npcArtists[0]}'s fans...`);
    } else if (postType === "push" && playerSongs.length > 0) {
      setSongId(playerSongs[0].id);
      setContent(`push ${playerSongs[0].title} to top 10 on iTunes`);
    } else if (postType === "announce" && scheduledItems.length > 0) {
      setAnnounceItemId(scheduledItems[0].id);
      setContent(
        `I am so excited to announce my new release ${scheduledItems[0].name} coming soon!`,
      );
    } else if (postType === "endorse") {
      setTargetId("democrat");
      setContent(
        `I am proud to endorse the Democratic candidate for President of the United States.`,
      );
    } else {
      setContent("");
    }
  }, [postType, npcArtists, playerSongs, scheduledItems]);

  const handlePost = () => {
    const validPollOptions = pollOptions.filter((o) => o.trim() !== "");
    const hasValidPoll = isPollVisible && validPollOptions.length >= 2;

    if (
      content.trim() ||
      image ||
      postType === "push" ||
      postType === "announce" ||
      postType === "endorse" ||
      postType === "market_crypto" ||
      quotePost ||
      hasValidPoll
    ) {
      let announceItemData = undefined;
      if (postType === "announce") {
        const item = scheduledItems.find((i) => i.id === announceItemId);
        if (item) {
          announceItemData = {
            type: item.type,
            submissionId: item.submissionId,
            songId: item.songId,
          };
        }
      }
      if (content.trim()) {
        publishGlobalPost({
          authorId: activeArtist?.id || 'player',
          authorName: activeArtist?.name || 'Player',
          authorHandle: `@${activeArtist?.name?.toLowerCase().replace(/\s/g, '') || 'artist'}`,
          authorAvatar: activeArtistData?.avatar,
          platform: 'X',
          content: content.trim()
        }).catch(e => console.error(e));
      }

      onPost({
        content: content.trim(),
        image: image || undefined,
        postType,
        targetId: postType === "fanWar" ? targetId : undefined,
        songId: postType === "push" ? songId : undefined,
        quoteOf: quotePost,
        announceItem: announceItemData,
        poll: hasValidPoll
          ? {
              options: validPollOptions.map((text, index) => ({
                id: `opt-${index}`,
                text,
                votes: 0,
              })),
              totalVotes: 0,
            }
          : undefined,
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isPushDisabled =
    activeArtistData?.lastPushToItunesWeek ===
    gameState.date.year * 52 + gameState.date.week;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-16"
      onClick={onClose}
    >
      <div
        className="bg-black rounded-2xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2 border-b border-zinc-700/70 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <button className="text-sm font-bold text-blue-400 hover:bg-blue-500/20 px-3 py-1 rounded-full">
            Drafts
          </button>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div className="flex gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="w-full">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What is happening?!"
                className="w-full bg-transparent text-xl focus:outline-none resize-none"
                rows={5}
                maxLength={MAX_CHARS}
              />
              {image && (
                <div className="relative mt-2">
                  <img src={image} className="rounded-xl w-full" />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 text-xl font-bold leading-none w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              )}
              {quotePost && (() => {
                const qAuthor = resolveUser(quotePost.authorId, activeArtistData?.xUsers || [], gameState, activeArtist);
                return (
                  <div className="mt-2 border border-zinc-700 rounded-xl p-3">
                    <div className="flex items-center gap-1 text-sm mb-1">
                      <span className="font-bold">
                        {qAuthor.name}
                      </span>
                      <span className="text-zinc-500">
                        @{qAuthor.username}
                      </span>
                    </div>
                    <p className="text-sm text-white whitespace-pre-wrap line-clamp-3">
                      {quotePost.content}
                    </p>
                  </div>
                );
              })()}
              {isPollVisible && (
                <div className="mt-2 border border-zinc-700 rounded-xl p-3 space-y-2">
                  {pollOptions.map((opt, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Choice ${index + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...pollOptions];
                          newOpts[index] = e.target.value;
                          setPollOptions(newOpts);
                        }}
                        className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-white focus:outline-none focus:border-blue-500"
                      />
                      {index > 1 && (
                        <button
                          onClick={() =>
                            setPollOptions(
                              pollOptions.filter((_, i) => i !== index),
                            )
                          }
                          className="text-zinc-500 hover:text-red-500 font-bold px-2"
                        >
                          X
                        </button>
                      )}
                    </div>
                  ))}
                  {pollOptions.length < 4 && (
                    <button
                      onClick={() => setPollOptions([...pollOptions, ""])}
                      className="text-blue-500 hover:text-blue-400 text-sm font-bold"
                    >
                      + Add choice
                    </button>
                  )}
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => {
                        setIsPollVisible(false);
                        setPollOptions(["", ""]);
                      }}
                      className="text-red-500 hover:text-red-400 text-sm font-bold bg-zinc-800 px-3 py-1 rounded"
                    >
                      Remove poll
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="grid grid-cols-5 gap-2 mb-2">
              <button
                onClick={() => setPostType("normal")}
                className={`py-2 text-xs font-semibold rounded-md ${postType === "normal" ? "bg-blue-500 text-white" : "bg-zinc-800"}`}
              >
                Normal
              </button>
              <button
                onClick={() => setPostType("fanWar")}
                className={`py-2 text-xs font-semibold rounded-md ${postType === "fanWar" ? "bg-red-500 text-white" : "bg-zinc-800"}`}
              >
                Start Fan War
              </button>
              <button
                onClick={() => setPostType("push")}
                disabled={isPushDisabled}
                className={`py-2 text-xs font-semibold rounded-md ${postType === "push" ? "bg-green-500 text-white" : "bg-zinc-800"} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Push iTunes
              </button>
              <button
                onClick={() => setPostType("announce")}
                disabled={scheduledItems.length === 0}
                className={`py-2 text-xs font-semibold rounded-md ${postType === "announce" ? "bg-purple-500 text-white" : "bg-zinc-800"} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Announce
              </button>
              {gameState.date.year % 4 === 0 && (
                <button
                  onClick={() => setPostType("endorse")}
                  className={`py-2 text-xs font-semibold rounded-md ${postType === "endorse" ? "bg-blue-700 text-white" : "bg-zinc-800"}`}
                >
                  Endorse
                </button>
              )}
              <button
                onClick={() => setPostType("market_crypto")}
                disabled={!activeArtistData.cryptoCoin}
                className={`py-2 px-1 text-xs font-semibold rounded-md ${postType === "market_crypto" ? "bg-amber-500 text-white" : "bg-zinc-800"} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Market Coin
              </button>
            </div>
            {isPushDisabled && postType === "push" && (
              <p className="text-xs text-zinc-500 text-center">
                You can only push one song per week.
              </p>
            )}

            {postType === "fanWar" && (
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full bg-zinc-800 p-2 rounded-md mt-2"
              >
                {npcArtists.map((artist) => (
                  <option key={artist} value={artist}>
                    Target: {artist}
                  </option>
                ))}
              </select>
            )}
            {postType === "endorse" && (
              <select
                value={targetId}
                onChange={(e) => {
                  setTargetId(e.target.value);
                  setContent(
                    `I am proud to endorse the ${e.target.value === "democrat" ? "Democratic" : "Republican"} candidate for President of the United States.`,
                  );
                }}
                className="w-full bg-zinc-800 p-2 rounded-md mt-2"
              >
                <option value="democrat">Democrat</option>
                <option value="republican">Republican</option>
              </select>
            )}
            {postType === "push" && !isPushDisabled && (
              <select
                value={songId}
                onChange={(e) => setSongId(e.target.value)}
                className="w-full bg-zinc-800 p-2 rounded-md mt-2"
              >
                {playerSongs.map((song) => (
                  <option key={song.id} value={song.id}>
                    Song: {song.title}
                  </option>
                ))}
              </select>
            )}
            {postType === "announce" && scheduledItems.length > 0 && (
              <select
                value={announceItemId}
                onChange={(e) => setAnnounceItemId(e.target.value)}
                className="w-full bg-zinc-800 p-2 rounded-md mt-2"
              >
                {scheduledItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.type === "project" ? "Project" : "Single"}:{" "}
                    {item.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div className="p-4 flex justify-between items-center border-t border-zinc-700/70">
          <div>
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={() => imageInputRef.current?.click()}
              className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-full"
              disabled={isPollVisible}
            >
              <ImageIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsPollVisible(true)}
              className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-full"
              disabled={!!image || isPollVisible}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-zinc-500 mr-4">
              {content.length}/{MAX_CHARS}
            </span>
            <button
              onClick={handlePost}
              disabled={!content.trim() && !image && postType === "normal"}
              className="bg-blue-500 text-white font-bold px-5 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

type XViewTab = "For you" | "Explore" | "Messages" | "Accounts";

const XView: React.FC = () => {
  const { dispatch, activeArtistData, gameState } = useGame();
  const [activeTab, setActiveTab] = useState<XViewTab>("For you");
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [quotePostTarget, setQuotePostTarget] = useState<XPost | null>(null);
  const [viewingQuotesForId, setViewingQuotesForId] = useState<string | null>(
    null,
  );
  const [showAppealConfirm, setShowAppealConfirm] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  if (!activeArtistData) return null;
  const { xUsers, xSuspensionStatus, selectedPlayerXUserId } = activeArtistData;
  const playerUser = selectedPlayerXUserId
    ? xUsers.find((u) => u.id === selectedPlayerXUserId)
    : xUsers.find((u) => u.isPlayer);

  // Only suspend the view if the currently selected user is the one suspended
  const isActiveUserSuspended =
    xSuspensionStatus?.isSuspended &&
    xSuspensionStatus.accountId === playerUser?.id;

  const handleAppealClick = () => {
    if (!xSuspensionStatus || xSuspensionStatus.appealSentDate) return;
    setShowAppealConfirm(true);
  };

  const handleConfirmAppeal = () => {
    dispatch({ type: "APPEAL_X_SUSPENSION" });
    setShowAppealConfirm(false);
  };

  const handleQuote = (post: XPost) => {
    setQuotePostTarget(post);
    setIsComposeModalOpen(true);
  };

  const handleQuoteHold = (post: XPost) => {
    setViewingQuotesForId(post.id);
  };

  const isAlreadyPremium =
    playerUser?.isVerified === true ||
    playerUser?.isVerified === "blue" ||
    playerUser?.isVerified === "gold";

  const renderContent = () => {
    if (viewingQuotesForId) {
      const allPosts = activeArtistData.xPosts;
      const quotePosts = allPosts
        .filter((p) => p.quoteOf?.id === viewingQuotesForId)
        .sort((a, b) => b.likes - a.likes);
      return (
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 bg-black/80 backdrop-blur z-10 border-b border-zinc-800 p-3 flex items-center gap-4">
            <button
              onClick={() => setViewingQuotesForId(null)}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-white" />
            </button>
            <h2 className="font-bold text-lg">Quotes</h2>
          </div>
          {quotePosts.length > 0 ? (
            quotePosts.map((post) => (
              <Post
                key={post.id}
                post={post}
                author={findUser(post.authorId)}
                onQuote={handleQuote}
                onQuoteHold={handleQuoteHold}
              />
            ))
          ) : (
            <div className="text-center p-8 text-zinc-500">No quotes yet.</div>
          )}
        </div>
      );
    }

    switch (activeTab) {
      case "For you":
        return <FeedView onQuote={handleQuote} onQuoteHold={handleQuoteHold} />;
      case "Explore":
        return (
          <ExploreView onQuote={handleQuote} onQuoteHold={handleQuoteHold} />
        );
      case "Messages":
        return <MessagesView />;
      case "Accounts":
        return <AccountsView />;
      default:
        return <FeedView onQuote={handleQuote} onQuoteHold={handleQuoteHold} />;
    }
  };

  return (
    <div className="bg-black text-white h-full flex flex-col pb-14">
      {showPremiumModal && (
        <XPremiumModal onClose={() => setShowPremiumModal(false)} />
      )}
      {isComposeModalOpen && playerUser && (
        <ComposeXPostModal
          user={playerUser}
          quotePost={quotePostTarget || undefined}
          onClose={() => {
            setIsComposeModalOpen(false);
            setQuotePostTarget(null);
          }}
          onPost={(payload) => {
            dispatch({ type: "POST_ON_X", payload });
            setIsComposeModalOpen(false);
            setQuotePostTarget(null);
          }}
        />
      )}
      <ConfirmationModal
        isOpen={showAppealConfirm}
        onClose={() => setShowAppealConfirm(false)}
        onConfirm={handleConfirmAppeal}
        title="Submit an appeal?"
        message="Are you sure you want to appeal your suspension? You can only submit one appeal per week."
        confirmText="Submit Appeal"
      />
      <header className="sticky top-0 bg-black/80 backdrop-blur-sm z-20 border-b border-zinc-700/70 p-3 flex items-center">
        <div className="w-1/3 flex justify-start">
          <button
            onClick={() => dispatch({ type: "CHANGE_VIEW", payload: "game" })}
            className="h-8 text-sm font-semibold text-zinc-300 border border-zinc-600 rounded-full px-4 flex items-center justify-center hover:bg-zinc-800 transition-colors"
          >
            Exit
          </button>
        </div>
        <div className="w-1/3 flex justify-center">
          <XIcon className="w-7 h-7" />
        </div>
        <div className="w-1/3 flex justify-end">
          {!isAlreadyPremium && !isActiveUserSuspended && playerUser && (
            <button
              onClick={() => setShowPremiumModal(true)}
              className="h-8 text-xs font-bold text-black bg-white rounded-full px-3 flex items-center justify-center hover:bg-zinc-200 transition-colors"
            >
              Premium
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden w-full relative">
        {isActiveUserSuspended && xSuspensionStatus && (
          <div className="bg-black p-4 border-b border-zinc-700">
            <h2 className="text-2xl font-bold text-white">
              Your account is suspended
            </h2>
            <p className="text-zinc-400 mt-2">
              After careful review, we determined your account broke the X
              Rules. Your account is permanently in read-only mode, which means
              you can’t post, Repost, or Like content. You won’t be able to
              create new accounts. If you think we got this wrong, you can{" "}
              {xSuspensionStatus.appealSentDate ? (
                <span className="text-zinc-500">appeal pending review.</span>
              ) : (
                <button
                  onClick={handleAppealClick}
                  className="text-blue-400 hover:underline"
                >
                  submit an appeal
                </button>
              )}
              .
            </p>
          </div>
        )}
        {renderContent()}
      </main>

      <div className="fixed bottom-20 right-4 z-30 flex flex-col gap-3">
        <button
          onClick={() =>
            dispatch({ type: "CHANGE_VIEW", payload: "xCreateSpace" })
          }
          disabled={isActiveUserSuspended || !playerUser}
          className="w-14 h-14 bg-[#7F56D9] rounded-full flex items-center justify-center shadow-lg hover:bg-[#6c48bd] transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed"
        >
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>
        <button
          onClick={() => setIsComposeModalOpen(true)}
          disabled={isActiveUserSuspended || !playerUser}
          className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-7 h-7" />
        </button>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 h-14 bg-black border-t border-zinc-800 flex justify-around items-center z-30 pb-safe">
        <button
          onClick={() => setActiveTab("For you")}
          className={`p-2 ${activeTab === "For you" ? "text-white" : "text-zinc-500"}`}
        >
          <HomeIcon className="w-7 h-7" />
        </button>
        <button
          onClick={() => setActiveTab("Explore")}
          className={`p-2 ${activeTab === "Explore" ? "text-white" : "text-zinc-500"}`}
        >
          <SearchIcon className="w-7 h-7" />
        </button>
        <button
          onClick={() => setActiveTab("Accounts")}
          className={`p-2 ${activeTab === "Accounts" ? "text-white" : "text-zinc-500"}`}
        >
          <UserGroupIcon className="w-7 h-7" />
        </button>
        <button
          onClick={() => setActiveTab("Messages")}
          className={`${activeTab === "Messages" ? "text-white" : "text-zinc-500"}`}
        >
          <EnvelopeIcon className="w-7 h-7" />
        </button>
      </footer>
    </div>
  );
};

export default XView;
