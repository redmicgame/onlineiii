sed -i '738 i \
export interface VideoChartEntry {\n  rank: number;\n  lastWeek: number | null;\n  peak: number;\n  weeksOnChart: number;\n  title: string;\n  artist: string;\n  thumbnail: string;\n  isPlayerVideo: boolean;\n  videoId?: string;\n  uniqueId: string;\n  weeklyViews: number;\n}\n' types.ts
