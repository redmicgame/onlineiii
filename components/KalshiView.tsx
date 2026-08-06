import React from "react";
import { useGame } from "../context/GameContext";

const KalshiView: React.FC = () => {
  const { gameState, dispatch } = useGame();

  const albumChance = Math.min(
    99,
    Math.floor(gameState.kalshiAlbumChance || 10),
  );

  const renderCategory = (
    title: string,
    nominees: {
      name: string;
      artistName: string;
      score: number;
      coverArt?: string;
    }[],
    tieScore: number = 2,
  ) => {
    // Add noise to score based on week
    const noise = Math.sin(gameState.date.week * 1.5) * 0.2; // +/- 20%
    let total =
      nominees.reduce(
        (sum, n) =>
          sum + Math.max(0, n.score * (1 + Math.random() * 0.1 + noise)),
        0,
      ) + tieScore;

    // Convert to percentages
    let withPercents = nominees
      .map((n) => {
        const noisyScore = Math.max(
          0,
          n.score * (1 + Math.random() * 0.1 + noise),
        );
        return {
          ...n,
          percent: Math.round((noisyScore / total) * 100),
        };
      })
      .sort((a, b) => b.percent - a.percent);

    const totalPercent = withPercents.reduce((sum, n) => sum + n.percent, 0);
    const tiePercent = Math.max(0, 100 - totalPercent);

    return (
      <div
        key={title}
        className="bg-white rounded-xl p-4 shadow-lg text-black mb-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-900 rounded-lg overflow-hidden flex items-center justify-center text-white font-bold">
            🏆
          </div>
          <h2 className="text-lg font-bold flex-1">{title}</h2>
          <span className="text-xl font-bold text-[#00D182]">Kalshi</span>
        </div>

        <div className="space-y-4">
          {withPercents.map((opt, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded object-cover overflow-hidden flex-shrink-0">
                {opt.coverArt ? (
                  <img
                    src={opt.coverArt}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-800 truncate block mr-2">
                    {opt.name}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Just fake some arrows based on percent size for visual effect */}
                    {i === 0 && (
                      <span className="text-xs font-bold text-[#00D182]">
                        ▲
                      </span>
                    )}
                    {i > 0 && i < 3 && (
                      <span className="text-xs font-bold text-red-500">▼</span>
                    )}
                    <span className="font-bold">{opt.percent}%</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00D182]"
                    style={{ width: `${opt.percent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#00D182]/20 flex items-center justify-center rounded text-xl flex-shrink-0">
              🤝
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-800 truncate block mr-2">
                  Tie
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-bold">{tiePercent}%</span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00D182]"
                  style={{ width: `${tiePercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const hasNominations =
    !!gameState.grammyCurrentYearNominations ||
    !!gameState.amaCurrentYearNominations ||
    !!gameState.oscarCurrentYearNominations;

  const getSeededChance = (seedString: string) => {
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = (hash << 5) - hash + seedString.charCodeAt(i);
      hash |= 0;
    }
    const base = Math.abs(Math.sin(hash)) * 50;
    const volatility = Math.sin(gameState.date.week * 0.4 + hash) * 25;
    const chance = Math.floor(base + volatility + 25);
    return Math.max(1, Math.min(99, chance));
  };

  const renderYesNoMarket = (title: string, chance: number, icon: string) => {
    return (
      <div
        key={title}
        className="bg-white rounded-xl p-4 shadow-lg text-black mb-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 text-2xl">
            {icon}
          </div>
          <h2 className="text-lg font-bold flex-1">{title}</h2>
          <span className="text-xl font-bold text-[#00D182] flex-shrink-0">
            {chance}% chance
          </span>
        </div>
        <div className="flex justify-between items-center text-sm font-medium text-gray-500 mb-2">
          <span>Yes</span>
          <span>{chance}¢</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-[#00D182]"
            style={{ width: `${chance}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-sm font-medium text-gray-500 mb-2">
          <span>No</span>
          <span>{100 - chance}¢</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500"
            style={{ width: `${100 - chance}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const activeData = gameState.activeArtistId
    ? gameState.artistsData[gameState.activeArtistId]
    : null;

  const artistProfile = [
    gameState.soloArtist,
    ...(gameState.group?.members || []),
    gameState.group,
    ...(gameState.extraPlayableArtists || []),
  ].find((a) => a?.id === gameState.activeArtistId);
  const artistName =
    artistProfile?.name || gameState.soloArtist?.name || "the artist";

  let relationshipTitle = `Will ${artistName} be in a relationship this year?`;
  const activeRelationship = activeData?.relationships?.find(
    (r) => r.status === "dating" || r.status === "engaged",
  );
  if (activeRelationship) {
    if (activeRelationship.status === "dating") {
      relationshipTitle = `Will ${artistName} and ${activeRelationship.partnerName} get engaged this year?`;
    } else if (activeRelationship.status === "engaged") {
      relationshipTitle = `Will ${artistName} and ${activeRelationship.partnerName} get married this year?`;
    }
  }

  return (
    <div className="bg-[#00D182] h-full overflow-y-auto p-4 text-white pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kalshi</h1>
        <button
          onClick={() => dispatch({ type: "CHANGE_VIEW", payload: "game" })}
          className="p-2 bg-black/20 rounded-full hover:bg-black/30 flex-shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-4 shadow-lg text-black">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
              {gameState.soloArtist?.image ? (
                <img
                  src={gameState.soloArtist.image}
                  alt="Artist"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-bold text-gray-400">?</span>
              )}
            </div>
            <h2 className="text-lg font-bold flex-1">
              New original album announced this year?
            </h2>
            <span className="text-xl font-bold text-[#00D182] flex-shrink-0">
              {albumChance}% chance
            </span>
          </div>

          <div className="relative h-24 mt-4 mb-2">
            {/* A very fake sparkline to represent the graph */}
            <div className="absolute inset-0 flex items-end">
              <div className="w-full h-px bg-gray-200 absolute bottom-4"></div>
              <svg
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <polyline
                  points={`0,35 20,35 40,36 60,34 80,35 90,${35 - (albumChance / 100) * 30} 100,${40 - (albumChance / 100) * 40}`}
                  fill="none"
                  stroke="#00D182"
                  strokeWidth="2"
                />
                <circle
                  cx="100"
                  cy={40 - (albumChance / 100) * 40}
                  r="2"
                  fill="#00D182"
                />
              </svg>
            </div>
          </div>
        </div>

        {renderYesNoMarket(
          relationshipTitle,
          getSeededChance(`${gameState.date.year}-rel`),
          "❤️",
        )}

        {renderYesNoMarket(
          `Will ${artistName} announce a pregnancy this year?`,
          getSeededChance(`${gameState.date.year}-preg`),
          "👶",
        )}

        {renderYesNoMarket(
          `Will ${artistName} come out as a Republican?`,
          activeData?.endorsedParty === "republican"
            ? 99 + Math.floor(Math.random() * 2)
            : activeData?.endorsedParty === "democrat"
              ? Math.floor(Math.random() * 2)
              : getSeededChance(`${gameState.date.year}-rep`),
          "🐘",
        )}

        {renderYesNoMarket(
          `Will ${artistName} come out as a Democrat?`,
          activeData?.endorsedParty === "democrat"
            ? 99 + Math.floor(Math.random() * 2)
            : activeData?.endorsedParty === "republican"
              ? Math.floor(Math.random() * 2)
              : getSeededChance(`${gameState.date.year}-dem`),
          "🐴",
        )}

        {gameState.grammyCurrentYearNominations?.map((cat) =>
          renderCategory(cat.name, cat.nominees),
        )}

        {gameState.amaCurrentYearNominations?.map((cat) =>
          renderCategory(
            cat.name,
            cat.nominees.map((n) => ({
              ...n,
              name: n.itemName,
              coverArt: undefined,
            })),
          ),
        )}

        {gameState.oscarCurrentYearNominations?.map((cat) =>
          renderCategory(cat.name, cat.nominees),
        )}

        {!hasNominations && (
          <div className="bg-white rounded-xl p-4 shadow-lg text-black text-center font-medium">
            No active award show markets at this time. Wait for nominations to
            be announced!
          </div>
        )}
      </div>
    </div>
  );
};

export default KalshiView;
