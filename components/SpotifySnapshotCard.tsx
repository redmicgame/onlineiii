import React from "react";
import { useGame } from "../context/GameContext";

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

export const SpotifySnapshotCard: React.FC<{ dataString: string; style?: 'normal' | 'ugly' }> = ({
  style,
  dataString,
}) => {
  let gameState: any;
  try {
    const game = useGame();
    gameState = game?.gameState;
  } catch (e) {
    // Fallback if rendered outside context
  }

  const effectiveStyle = style || gameState?.spotifySnapshotStyle || 'normal';
  try {
    const jsonStr = dataString.replace("snapshot:", "");
    const data = JSON.parse(jsonStr);

    if (data.type === "presave") {
      return (
        <div className="mt-2 rounded-xl bg-[#c57d77] border border-[#a1615c] p-5 text-white font-sans max-w-full overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-bold tracking-widest uppercase opacity-80">
              Presave
            </div>
            <div className="text-xs font-bold opacity-80">
              {data.date?.year || 2026}
            </div>
          </div>
          <div className="flex gap-4 items-start mb-6">
            <img
              src={data.coverArt}
              className="w-24 h-24 rounded-lg shadow-xl object-cover"
            />
            <div>
              <h2 className="text-2xl font-black leading-tight mb-1">
                {data.albumName}
              </h2>
              <p className="text-sm font-semibold opacity-90 mb-1">
                {data.artistName}
              </p>
              <p className="text-xs opacity-75">
                Releases Week {data.releaseDate?.week}, {data.releaseDate?.year}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 border border-white/20 rounded-xl p-3 bg-white/5">
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">
                Total Presaves
              </div>
              <div className="text-xl font-black">
                {data.preSaves.toLocaleString()}
              </div>
            </div>
            <div className="flex-1 border border-white/20 rounded-xl p-3 bg-white/5 flex flex-col justify-center">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">
                    Daily
                  </div>
                  <div className="text-lg font-bold">
                    +{data.d3.toLocaleString()}
                  </div>
                </div>
                <div className="text-green-300 font-bold text-xs bg-green-500/20 px-2 py-1 rounded">
                  ▲ {data.surge.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    
    if (data.type === "weekly_top_albums") {
      const top1 = data.topAlbums[0];
      const rest = data.topAlbums.slice(1, 15);
      
      const getMonthName = (week: number) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months[Math.floor(week / 4.33) % 12];
      };
      const day = Math.floor(Math.random() * 28) + 1; // mock day

      return (
        <div className="mt-2 rounded-xl bg-[#98A8AA] border border-zinc-600 p-0 text-white font-sans max-w-full overflow-hidden flex flex-col relative w-full" style={{aspectRatio: '16/9'}}>
          <div className="flex w-full h-full p-4 gap-4">
            
            {/* LEFT SIDE - #1 ALBUM */}
            <div className="w-[45%] flex flex-col justify-between">
              <div>
                <h2 className="text-[1.1rem] sm:text-[1.3rem] font-bold uppercase tracking-tight text-white drop-shadow-md mb-2 flex flex-col leading-none">
                  <span className="text-transparent font-outline-2 font-outline-white text-stroke text-stroke-white text-fill-transparent tracking-widest text-lg sm:text-xl">Weekly Top</span> 
                  <span className="font-black">ALBUMS</span>
                </h2>
                
                <div className="relative mt-2 w-[85%] aspect-square shadow-2xl mx-auto rounded-sm overflow-hidden border border-white/20">
                   <img src={top1.coverArt || "https://images.unsplash.com/photo-1614680376593-902f74a7cecb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" />
                   <div className="absolute top-2 right-2 bg-white text-black text-[6px] font-bold px-1 py-0.5 rounded-sm">
                     PARENTAL<br/>ADVISORY<br/>EXPLICIT CONTENT
                   </div>
                </div>
              </div>

              <div className="flex flex-col items-center mt-4">
                <div className="bg-[#98A8AA] text-white font-bold text-lg sm:text-xl px-4 py-1.5 shadow-md -mt-8 relative z-10 border border-white/20" style={{backgroundColor: 'rgba(255,255,255,0.3)'}}>
                  #1
                </div>
                
                <div className="mt-4 text-center w-full">
                  <div className="text-white font-bold text-lg sm:text-xl leading-tight truncate px-2">{top1.albumName}</div>
                  <div className="text-white/90 text-sm font-semibold truncate px-2">{top1.artistName}</div>
                </div>

                <div className="mt-3 w-[80%] bg-white/30 text-white font-bold text-lg sm:text-xl text-center py-1 rounded-sm shadow-inner">
                  +{top1.weeklyStreams.toLocaleString()}
                </div>
                
                <div className="mt-2 font-bold text-white text-base sm:text-lg">
                  {top1.changePct > 0 ? "+" : ""}{top1.changePct.toFixed(2)}%
                </div>
              </div>
              
              <div className="flex justify-between items-end mt-4 pt-2">
                <div className="flex items-center gap-1.5 opacity-90">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                  <div className="flex flex-col leading-none">
                     <span className="text-xs font-bold">SpotifySnapshot</span>
                     <span className="text-[8px] font-semibold opacity-70">Layout by: @socasuallygay</span>
                  </div>
                </div>
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </div>
            </div>

            {/* RIGHT SIDE - LIST */}
            <div className="w-[55%] flex flex-col h-full bg-[#879698] rounded-md shadow-xl overflow-hidden relative">
               <div className="absolute top-2 right-3 text-white font-bold text-sm sm:text-base z-10 drop-shadow-md">
                 {getMonthName(data.date?.week || 1)} {day}, {data.date?.year || 2026}
               </div>
               
               <div className="flex-1 flex flex-col w-full h-full pt-10 pb-2 overflow-y-auto scrollbar-hide">
                  {rest.map((album: any, i: number) => {
                     const isUp = album.previousRank > album.rank;
                     const isDown = album.previousRank < album.rank;
                     return (
                        <div key={i} className="flex items-center w-full h-1/14 text-white text-xs sm:text-sm px-1 my-[1px]">
                           {/* Change indicator */}
                           <div className="w-6 sm:w-8 flex justify-center">
                              {isUp ? (
                                <div className="bg-[#4CAF50] text-white font-bold text-[10px] sm:text-xs w-full h-full py-0.5 text-center flex items-center justify-center">
                                   +{album.previousRank - album.rank}
                                </div>
                              ) : isDown ? (
                                <div className="bg-[#D32F2F] text-white font-bold text-[10px] sm:text-xs w-full h-full py-0.5 text-center flex items-center justify-center">
                                   -{album.rank - album.previousRank}
                                </div>
                              ) : null}
                           </div>

                           {/* Rank */}
                           <div className="w-6 sm:w-8 text-center font-bold text-[11px] sm:text-sm opacity-90 shrink-0">
                             #{album.rank}
                           </div>
                           
                           {/* Cover */}
                           <div className="w-7 h-7 sm:w-9 sm:h-9 shrink-0 mx-1 border border-white/20 shadow-sm overflow-hidden bg-black">
                              <img src={album.coverArt || "https://images.unsplash.com/photo-1614680376593-902f74a7cecb?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" />
                           </div>

                           {/* Title */}
                           <div className="flex-1 min-w-0 font-bold text-[10px] sm:text-sm truncate px-1">
                             {album.albumName}
                           </div>

                           {/* Streams */}
                           <div className="font-bold text-[10px] sm:text-sm text-right min-w-[70px] sm:min-w-[90px] pr-1">
                             +{album.weeklyStreams.toLocaleString()}
                           </div>
                           
                           {/* Change Pct */}
                           <div className="font-semibold text-[9px] sm:text-xs text-right min-w-[45px] sm:min-w-[55px] opacity-90 pr-1">
                             {album.changePct > 0 ? "+" : ""}{album.changePct.toFixed(2)}%
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>
          </div>
          
          <style dangerouslySetInnerHTML={{__html: `
            .text-stroke { -webkit-text-stroke: 1px white; color: transparent; }
          `}} />
        </div>
      );
    }

    if (data.type === "prerelease_streams") {
      return (
        <div className="mt-2 rounded-xl bg-[#87a5a8] border border-[#6b8587] p-4 pb-0 text-white font-sans max-w-full overflow-hidden">
          <div className="flex gap-4 items-center mb-6">
            <img
              src={data.coverArt}
              className="w-24 h-24 rounded shadow-xl object-cover"
            />
            <div>
              <div className="text-xs font-bold opacity-80 mb-1">
                Pre-Release
              </div>
              <h2 className="text-xl font-black leading-tight mb-1">
                {data.songName}
              </h2>
              <p className="text-sm font-semibold opacity-90">
                {data.artistName} • Week {data.date?.week}
              </p>
            </div>
          </div>

          <div className="w-[calc(100%+2rem)] -ml-4 bg-white/10 text-xs mt-4">
            <div className="grid grid-cols-4 p-2 opacity-80 border-b border-white/20 font-semibold uppercase text-[10px] tracking-wider text-right">
              <div className="text-center">Song</div>
              <div>Total Streams</div>
              <div>Weekly Streams</div>
              <div>Change</div>
            </div>
            {data.tracks.map((t: any, i: number) => {
              const isTarget = t.title === data.songName;
              return (
                <div
                  key={i}
                  className={`grid grid-cols-4 p-2 items-center text-right ${isTarget ? "bg-white/20 font-bold" : ""}`}
                >
                  <div className="text-left font-bold line-clamp-1 truncate">
                    {t.title}
                  </div>
                  <div>{t.streams.toLocaleString()}</div>
                  <div>+{t.weekly.toLocaleString()}</div>
                  <div className="text-green-300">
                    +{(Math.random() * 40 + 5).toFixed(2)}%
                  </div>
                </div>
              );
            })}
            <div className="grid grid-cols-4 p-2 items-center text-right bg-white/20 font-bold border-t border-white/20">
              <div className="text-left text-black/50 text-[10px]">
                @SnapshotSpotify
              </div>
              <div>
                {data.tracks
                  .reduce((sum: number, t: any) => sum + t.streams, 0)
                  .toLocaleString()}
              </div>
              <div>
                +
                {data.tracks
                  .reduce((sum: number, t: any) => sum + t.weekly, 0)
                  .toLocaleString()}
              </div>
              <div className="text-green-300">
                +{(Math.random() * 40 + 5).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (
      data.type === "album_weekly" ||
      data.type === "album" ||
      data.type === "popular_tracks" ||
      data.type === "song"
    ) {


      if (effectiveStyle === 'ugly') {
          const displayTracks = (data.tracks && data.tracks.length > 0)
            ? data.tracks
            : [{
                title: data.songName || data.title || "Track 1",
                weekly: data.streams || 0,
                dailyStreams: Math.floor((data.streams || 0) / 7),
                streams: data.totalStreams || data.streams || 0,
                changeVal: data.changeVal || 0,
                changePct: data.changePct || 0,
              }];

          const overallChangeVal = displayTracks.reduce((acc: number, t: any) => acc + (t.changeVal || 0), 0) || 0;
          const overallPrev = displayTracks.reduce((acc: number, t: any) => acc + ((t.weekly !== undefined ? t.weekly : (t.dailyStreams || 0)) - (t.changeVal || 0)), 0) || 0;
          const overallPct = overallPrev > 0 ? (overallChangeVal / overallPrev) * 100 : 0;
          const pctStr = (overallPct >= 0 ? "↑ " : "↓ ") + Math.abs(overallPct).toFixed(2) + "%";
          const isOverallPos = overallChangeVal >= 0;
          
          const yearNum = data.date?.year || gameState?.date?.year || 2026;
          const weekNum = data.date?.week || gameState?.date?.week || 1;
          const dayVal = data.date?.day !== undefined ? data.date.day : (gameState?.date?.day !== undefined ? gameState.date.day : 7);
          const dateObj = new Date(yearNum, 0, (weekNum - 1) * 7 + dayVal);
          const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
          const day = dateObj.getDate();
          const weekdayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

          const albumTitle = (data.songName || data.albumName || data.title || "RELEASE").toUpperCase();
          const artistName = (data.artistName || "ARTIST").toUpperCase();
          const totalStreams = data.totalStreams || data.streams || 0;
          const weeklyStreams = data.streams || 0;

          return (
              <div className="mt-2 bg-[#0d0e0f] p-5 sm:p-7 text-white font-mono max-w-full shadow-2xl border border-zinc-800/80 rounded-2xl">
                
                {/* Header Section */}
                <div className="flex gap-5 sm:gap-7 items-start mb-6 border-b border-zinc-800/60 pb-6">
                  {/* Left Column - Cover Art */}
                  <div className="w-[30%] sm:w-[26%] flex flex-col items-center shrink-0">
                    <div className="relative w-full aspect-square shadow-[0_0_25px_rgba(0,0,0,0.9)] border border-zinc-800 rounded-sm overflow-hidden">
                      <img src={data.coverArt} className="w-full h-full object-cover" alt="Cover" />
                    </div>
                    <div className="text-zinc-300 font-sans font-bold text-xs sm:text-sm mt-3 uppercase tracking-wider text-center truncate w-full">
                      {artistName}
                    </div>
                  </div>

                  {/* Right Column - Stats */}
                  <div className="w-[70%] sm:w-[74%] flex flex-col justify-between min-h-[140px] pl-1">
                    <div>
                      <h2 className="text-2xl sm:text-4xl font-sans font-extrabold text-white leading-tight tracking-tight uppercase mb-2 truncate">
                        {albumTitle}
                      </h2>
                      <div className="text-zinc-400 text-xs sm:text-sm flex items-center gap-2 uppercase font-mono tracking-wider mb-4">
                        <span className="text-xs sm:text-sm">📅</span> {monthName} {day}, {yearNum} | {weekdayName}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 sm:gap-4 my-2 flex-wrap">
                      <span className="text-zinc-400 text-xl font-bold font-mono">↗</span>
                      <div className="text-3xl sm:text-5xl font-mono font-black text-white tracking-tight">
                        {weeklyStreams.toLocaleString()}
                      </div>
                      <div className={`${isOverallPos ? "bg-[#16a34a]" : "bg-[#dc2626]"} text-white text-xs sm:text-sm font-extrabold font-mono px-2.5 py-1 rounded flex items-center gap-1`}>
                        {pctStr}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-sm font-mono uppercase tracking-wider pt-2 border-t border-zinc-800/40">
                      <span className="text-xs sm:text-sm">☑</span>
                      <span className="text-white font-bold">{totalStreams.toLocaleString()}</span>
                      <span className="text-zinc-500 font-normal">| TOTAL STREAMS</span>
                    </div>
                  </div>
                </div>

                {/* Table Section */}
                {displayTracks && displayTracks.length > 0 && (
                  <div className="w-full">
                    <div className="grid grid-cols-[1.8rem_1fr_6.5rem_5.5rem_5rem_6.5rem] sm:grid-cols-[2.2rem_1fr_8rem_6.5rem_6rem_8rem] gap-2 pb-2 text-[11px] sm:text-xs font-bold text-[#22c55e] border-b border-zinc-800 font-mono uppercase tracking-wider">
                      <div className="col-span-2">TRACK</div>
                      <div className="text-right">DAILY STREAMS</div>
                      <div className="text-right">CHANGE</div>
                      <div className="text-right">%CHANGE</div>
                      <div className="text-right">TOTAL</div>
                    </div>
                    
                    <div className="py-1">
                      {displayTracks.map((t: any, i: number) => {
                         const cVal = t.changeVal !== undefined ? t.changeVal : 0;
                         const pct = t.changePct !== undefined ? t.changePct : 0;
                         const streamCount = t.dailyStreams !== undefined ? t.dailyStreams : (t.weekly !== undefined ? t.weekly : 0);
                         const totalCount = t.streams !== undefined ? t.streams : (t.totalStreams || 0);
                         const isPos = cVal >= 0;
                         
                         return (
                        <div
                          key={i}
                          className="grid grid-cols-[1.8rem_1fr_6.5rem_5.5rem_5rem_6.5rem] sm:grid-cols-[2.2rem_1fr_8rem_6.5rem_6rem_8rem] gap-2 py-1.5 text-[11px] sm:text-xs items-center hover:bg-zinc-800/40 transition-colors border-b border-zinc-900/40"
                        >
                          <div className="flex items-center gap-2 col-span-2 min-w-0">
                            <span className="text-[#22c55e] font-mono font-bold text-xs shrink-0 w-4">
                              {i + 1}
                            </span>
                            <span className="truncate font-sans font-medium text-white text-xs sm:text-sm">
                              {t.title}
                            </span>
                          </div>
                          <div className="text-right text-white font-mono text-[11px] sm:text-xs">
                            {streamCount.toLocaleString()}
                          </div>
                          <div className={`text-right font-mono text-[11px] sm:text-xs ${isPos ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                            {cVal > 0 ? "+" : ""}{cVal.toLocaleString()}
                          </div>
                          <div className={`text-right font-mono text-[11px] sm:text-xs ${isPos ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                            {isPos ? "↑ " : "↓ "}{Math.abs(pct).toFixed(2)}%
                          </div>
                          <div className="text-right text-white font-mono text-[11px] sm:text-xs">
                            {totalCount.toLocaleString()}
                          </div>
                        </div>
                      )})}
                    </div>

                    {/* Footer Section */}
                    <div className="grid grid-cols-[1.8rem_1fr_6.5rem_5.5rem_5rem_6.5rem] sm:grid-cols-[2.2rem_1fr_8rem_6.5rem_6rem_8rem] gap-2 pt-3 border-t border-zinc-800 text-xs sm:text-sm font-bold items-center font-mono">
                      <div className="col-span-2 flex items-center">
                        <span className="bg-[#22c55e] text-black text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-xs font-mono uppercase">
                          TOTAL
                        </span>
                      </div>
                      <div className="text-right text-white font-mono">
                        {weeklyStreams.toLocaleString()}
                      </div>
                      <div className={`text-right font-mono ${isOverallPos ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                        {overallChangeVal > 0 ? "+" : ""}{overallChangeVal.toLocaleString()}
                      </div>
                      <div className={`text-right font-mono ${isOverallPos ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                        {overallPct.toFixed(2)}%
                      </div>
                      <div className="text-right text-white font-mono">
                        {totalStreams.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
          );
      }

      // Shared generic style for spotify data (like drake style)
      return (
        <div className="mt-2 rounded-xl bg-[#2a2a2a] border border-[#1a1a1a] p-5 text-[#dcdcdc] font-mono max-w-full overflow-hidden">
          {data.type === "popular_tracks" ? (
            <div>
              <h2 className="text-2xl font-sans font-bold text-white mb-4">
                Popular
              </h2>
              <div className="space-y-3">
                {data.tracks.map((t: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-4 text-right text-zinc-500 font-sans font-bold">
                      {i + 1}
                    </div>
                    <img
                      src={t.coverArt}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 font-sans">
                      <div className="font-bold text-white text-sm">
                        {t.title}
                      </div>
                      <div className="text-[10px] bg-zinc-700 text-zinc-300 px-1 rounded w-max mt-1">
                        E
                      </div>
                    </div>
                    <div className="text-sm font-sans">
                      {t.streams.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex gap-4 items-start mb-4">
                <img src={data.coverArt} className="w-24 h-24 object-cover" />
                <div className="flex-1 font-sans">
                  <h2 className="text-2xl font-black text-white leading-none tracking-tight uppercase">
                    {data.albumName}
                  </h2>
                  <p className="text-xl text-zinc-300 mb-2">
                    {data.artistName}
                  </p>
                  <div className="flex justify-between items-end">
                    <p className="text-xs text-zinc-500">
                      Week {data.date?.week}, {data.date?.year}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Day {(data.date?.week || 1) * 7}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-stretch mb-2">
                <div className="bg-[#bda58d] text-white text-2xl font-sans font-black flex-1 p-2 text-center">
                  {data.streams.toLocaleString()}
                </div>
                <div className={`${(data.tracks?.reduce((acc, t) => acc + (t.changeVal || 0), 0) || 0) >= 0 ? "bg-[#55aa55]" : "bg-[#cc5555]"} text-white text-lg font-sans font-bold p-2 flex items-center`}>
                  {(() => {
                      const overallChangeVal = data.tracks?.reduce((acc: number, t: any) => acc + (t.changeVal || 0), 0) || 0;
                      const overallPrev = data.tracks?.reduce((acc: number, t: any) => acc + (t.weekly - (t.changeVal || 0)), 0) || 0;
                      const overallPct = overallPrev > 0 ? (overallChangeVal / overallPrev) * 100 : 0;
                      return (overallPct >= 0 ? "+" : "") + overallPct.toFixed(2) + "%";
                  })()}
                </div>
              </div>
              <div className="text-center text-zinc-400 text-xs uppercase tracking-widest mb-4 font-sans font-bold">
                Total Streams: {data.totalStreams.toLocaleString()}
              </div>
              <div className="w-[calc(100%+2rem)] -ml-4 border-t border-zinc-700/50">
                <div className="grid grid-cols-[1rem_1fr_4rem_4rem_3rem_4.5rem] gap-2 p-2 text-[10px] font-bold text-zinc-500 border-b border-zinc-700/50">
                  <div></div>
                  <div>Track</div>
                  <div className="text-right">Weekly Streams</div>
                  <div className="text-right">Change</div>
                  <div className="text-right">%</div>
                  <div className="text-right">Total</div>
                </div>
                <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
                  {data.tracks.map((t: any, i: number) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1rem_1fr_4rem_4rem_3rem_4.5rem] gap-2 px-2 py-1.5 text-xs items-center border-b border-zinc-800/30"
                    >
                      <div className="text-[10px] text-zinc-500 text-right">
                        {i + 1}
                      </div>
                      <div className="truncate font-sans font-semibold text-zinc-200">
                        {t.title}
                      </div>
                      <div className="text-right">
                        {t.weekly
                          ? t.weekly.toLocaleString()
                          : t.dailyStreams
                            ? t.dailyStreams.toLocaleString()
                            : 0}
                      </div>
                      <div className={`text-right ${t.changeVal >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {t.changeVal !== undefined ? (t.changeVal > 0 ? "+" : "") + t.changeVal.toLocaleString() : "-"}
                      </div>
                      <div className={`text-right ${t.changePct >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {t.changePct !== undefined ? (t.changePct > 0 ? "+" : "") + t.changePct.toFixed(2) + "%" : "-"}
                      </div>
                      <div className="text-right text-zinc-400">
                        {t.streams
                          ? t.streams.toLocaleString()
                          : t.totalStreams
                            ? t.totalStreams.toLocaleString()
                            : 0}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-[1rem_1fr_4rem_4rem_3rem_4.5rem] gap-2 p-2 text-xs font-bold items-center bg-[#bda58d]/20 text-[#bda58d]">
                  <div></div>
                  <div>Total</div>
                  <div className="text-right">
                    {data.streams.toLocaleString()}
                  </div>
                  <div className="text-right">
                    {data.tracks.reduce((acc: number, t: any) => acc + (t.changeVal || 0), 0) > 0 ? "+" : ""}{data.tracks.reduce((acc: number, t: any) => acc + (t.changeVal || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-right">
                    {data.tracks.reduce((acc: number, t: any) => acc + (t.changeVal || 0), 0) > 0 ? "+" : ""}{data.tracks.reduce((acc: number, t: any) => acc + (t.weekly - (t.changeVal || 0)), 0) > 0 ? (data.tracks.reduce((acc: number, t: any) => acc + (t.changeVal || 0), 0) / data.tracks.reduce((acc: number, t: any) => acc + (t.weekly - (t.changeVal || 0)), 0) * 100).toFixed(2) + "%" : "0.00%"}
                  </div>
                  <div className="text-right">
                    {data.totalStreams.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Default fallback to old style
    return (
      <div className="mt-2 rounded-xl bg-zinc-900 border border-zinc-800 p-4 text-white font-sans max-w-full overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-24 h-24 text-[#1DB954]"
          >
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        </div>
        <div className="flex gap-4 items-center mb-4 z-10 relative">
          <img
            src={data.coverArt}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-md shadow-lg object-cover flex-shrink-0"
          />
          <div className="min-w-0 overflow-hidden">
            <p
              className="text-lg sm:text-xl font-bold leading-tight line-clamp-2"
              title={data.type === "album" ? data.albumName : data.songName}
            >
              {data.type === "album" ? data.albumName : data.songName}
            </p>
            <p
              className="text-zinc-400 text-sm truncate"
              title={data.artistName}
            >
              {data.artistName}
            </p>
            <p className="text-[#1DB954] text-xs sm:text-sm mt-1 font-bold">
              BEST WEEK EVER
            </p>
          </div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-3 z-10 relative mb-4">
          <div className="text-xs text-zinc-400 mb-1 uppercase tracking-wider">
            Weekly Streams
          </div>
          <div className="text-2xl font-black">
            {data.streams.toLocaleString()}
          </div>
        </div>
        {data.type === "song" && data.dailyStreams && (
          <div className="space-y-1.5 z-10 relative text-sm sm:text-base font-mono">
            {data.dailyStreams.map((steams: number, i: number) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              const dateStr = `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
              const prev =
                i === 0 ? data.dailyStreams[0] : data.dailyStreams[i - 1];
              const diff = steams - prev;
              const percent = prev > 0 ? (diff / prev) * 100 : 0;
              const percentStr =
                percent > 0
                  ? `[+${percent.toFixed(2)}%]`
                  : percent < 0
                    ? `[${percent.toFixed(2)}%]`
                    : "[+0.00%]";
              return (
                <div
                  key={i}
                  className="flex justify-between items-center bg-black/20 px-3 py-1.5 rounded"
                >
                  <span className="text-zinc-400">{dateStr}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{steams.toLocaleString()}</span>
                    <span
                      className={
                        percent > 0
                          ? "text-green-400 text-xs sm:text-sm min-w-[65px] text-right"
                          : percent < 0
                            ? "text-red-400 text-xs sm:text-sm min-w-[65px] text-right"
                            : "text-zinc-500 text-xs sm:text-sm min-w-[65px] text-right"
                      }
                    >
                      {percentStr}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  } catch (e) {
    return null;
  }
};
