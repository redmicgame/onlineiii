// Shared Global Clock Engine
// Universal Anchor Epoch: August 5, 2026 00:00:00 UTC = Year 2026, Week 1, Day 1
export const GLOBAL_ANCHOR_EPOCH = new Date('2026-08-05T00:00:00Z').getTime();
export const MS_PER_WEEK = 15 * 60 * 1000; // 15 minutes per in-game week (900,000 ms)
export const MS_PER_DAY = MS_PER_WEEK / 7; // ~128,571 ms per in-game day

export interface GlobalClockData {
    year: number;
    week: number;
    day: number;
    elapsedWeeks: number;
    nextTickInSeconds: number;
    formattedTimer: string;
}

export function getGlobalGameTime(nowMs: number = Date.now()): GlobalClockData {
    const elapsedMs = Math.max(0, nowMs - GLOBAL_ANCHOR_EPOCH);
    const elapsedWeeks = Math.floor(elapsedMs / MS_PER_WEEK);
    
    const startYear = 2026;
    const startWeek = 1;
    
    const totalWeeks = (startWeek - 1) + elapsedWeeks;
    const year = startYear + Math.floor(totalWeeks / 52);
    const week = (totalWeeks % 52) + 1;
    
    const weekMs = elapsedMs % MS_PER_WEEK;
    const day = Math.min(7, Math.floor(weekMs / MS_PER_DAY) + 1);
    
    const nextTickMs = MS_PER_WEEK - weekMs;
    const nextTickInSeconds = Math.max(1, Math.ceil(nextTickMs / 1000));
    
    const minutes = Math.floor(nextTickInSeconds / 60);
    const seconds = nextTickInSeconds % 60;
    const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    return {
        year,
        week,
        day,
        elapsedWeeks,
        nextTickInSeconds,
        formattedTimer
    };
}
