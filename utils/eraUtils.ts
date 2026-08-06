export const getEraConfiguration = (year: number) => {
    return {
        // Formats
        physicalSalesActive: year < 2018, // After 2018 physical sales don't die completely but become niche/vinyl
        digitalSalesActive: year >= 2003, // iTunes era begins around 2003
        streamingActive: year >= 2008,   // Spotify launched in 2008
        
        // Platforms
        printMediaActive: year < 2015,
        myspaceAvailable: year >= 2003 && year < 2012,
        xAvailable: year >= 2008,        // Twitter founded in 2006, mainstream ~2008
        instagramAvailable: year >= 2012,// Instagram mainstream ~2012
        tiktokAvailable: year >= 2018,   // Musical.ly merged to TikTok
        youtubeAvailable: year >= 2005,  // YouTube founded in 2005
        onlyfansAvailable: year >= 2016,

        // UI Era
        uiMode: getUIMode(year),
        
        // Market Multipliers
        // How much of the total reach converts to each type depends on the year
        marketShare: {
            physical: getPhysicalShare(year),
            digital: getDigitalShare(year),
            streaming: getStreamingShare(year),
            radio: getRadioShare(year)
        }
    };
};

const getUIMode = (year: number) => {
    if (year < 2004) return 'webPortal';
    if (year < 2010) return 'flipPhone';
    return 'smartphone';
};

const getPhysicalShare = (year: number) => {
    if (year < 2000) return 0.9;
    if (year < 2003) return 0.8;
    if (year < 2010) return 0.6;
    if (year < 2014) return 0.3;
    if (year < 2020) return 0.1;
    return 0.05; // Vinyl resurgence
};

const getDigitalShare = (year: number) => {
    if (year < 2003) return 0.0;
    if (year < 2010) return 0.3;
    if (year < 2014) return 0.5;
    if (year < 2020) return 0.2;
    return 0.05;
};

const getStreamingShare = (year: number) => {
    if (year < 2008) return 0.0;
    if (year < 2014) return 0.1; // early Spotify
    if (year < 2020) return 0.6;
    return 0.85;
};

const getRadioShare = (year: number) => {
    if (year < 2000) return 1.0;
    if (year < 2010) return 0.8;
    if (year < 2020) return 0.5;
    return 0.3;
};
