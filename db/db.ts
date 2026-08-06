import Dexie, { type Table } from 'dexie';
import type { GameState } from '../types';

export interface GameSave {
  id?: number;
  state: any; // Stored state with media separated
}

export interface MediaSave {
  id: string;
  data: string;
}

class RedMicDexie extends Dexie {
  saves!: Table<GameSave, number>; 
  media!: Table<MediaSave, string>;

  constructor() {
    super('red-mic-game');
    this.version(2).stores({
      saves: '++id', 
      media: 'id'
    });
  }
}

export const db = new RedMicDexie();

export const getActiveSaveId = (): number => {
    const stored = localStorage.getItem('redmic_active_save_id');
    return stored ? parseInt(stored, 10) : 1;
};

export const setActiveSaveId = (id: number): void => {
    localStorage.setItem('redmic_active_save_id', id.toString());
};

export const separateMediaFromState = async (state: GameState, onProgress?: (progress: number, msg?: string) => void): Promise<any> => {
  const mediaToSave: MediaSave[] = [];
  
  if (onProgress) onProgress(0, "Analyzing state structure...");
  
  // Synchronous traversal to avoid Promise memory overhead
  const traverseAndReplace = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
      if (typeof obj === 'string' && obj.startsWith('data:')) {
        let hash = 0;
        for (let i = 0; i < obj.length && i < 1000; i++) {
          hash = (Math.imul(31, hash) + obj.charCodeAt(i)) | 0;
        }
        const id = `__media_${hash}_${obj.length}`;
        mediaToSave.push({ id, data: obj });
        return id;
      }
      return obj;
    }
    
    if (Array.isArray(obj)) {
      const arr = new Array(obj.length);
      for (let i = 0; i < obj.length; i++) {
          arr[i] = traverseAndReplace(obj[i]);
      }
      return arr;
    }
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = traverseAndReplace(obj[key]);
      }
    }
    return newObj;
  };
  
  const newState = traverseAndReplace(state);

  if (mediaToSave.length > 0) {
    if (onProgress) onProgress(50, "Saving unique media assets...");
    const uniqueMedia = Array.from(new Map(mediaToSave.map(item => [item.id, item])).values());
    
    const chunkSize = 100;
    for (let i = 0; i < uniqueMedia.length; i += chunkSize) {
        const chunk = uniqueMedia.slice(i, i + chunkSize);
        await db.media.bulkPut(chunk);
        if (onProgress) onProgress(50 + Math.floor((i / uniqueMedia.length) * 50), `Saving media chunk ${i} / ${uniqueMedia.length}...`);
        await new Promise(r => setTimeout(r, 2));
    }
  }
  
  if (onProgress) onProgress(100, "Done separating media!");
  return newState;
};

export const injectMediaIntoState = async (state: any, onProgress?: (progress: number, msg?: string) => void): Promise<GameState> => {
  const mediaIds = new Set<string>();
  
  if (onProgress) onProgress(0, "Analyzing save file structure...");
  
  // Synchronous collection
  const collectMediaIds = (obj: any) => {
    if (obj === null || typeof obj !== 'object') {
      if (typeof obj === 'string' && obj.startsWith('__media_')) {
        mediaIds.add(obj);
      }
      return;
    }
    
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
          collectMediaIds(obj[i]);
      }
      return;
    }
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        collectMediaIds(obj[key]);
      }
    }
  };
  
  collectMediaIds(state);

  if (onProgress) onProgress(15, "Retrieving assets from local database...");
  const mediaIdArray = Array.from(mediaIds);
  const mediaMap = new Map<string, string>();
  
  const chunkSize = 100;
  for (let i = 0; i < mediaIdArray.length; i += chunkSize) {
      const chunk = mediaIdArray.slice(i, i + chunkSize);
      const records = await db.media.bulkGet(chunk);
      chunk.forEach((id, index) => {
          if (records[index]) {
              mediaMap.set(id, records[index]!.data);
          }
      });
      if (onProgress) {
          const pct = Math.floor(15 + ((i / mediaIdArray.length) * 35));
          onProgress(pct, `Loading assets (${i} / ${mediaIdArray.length})...`);
      }
      await new Promise(r => setTimeout(r, 2)); 
  }

  if (onProgress) onProgress(50, "Constructing game state...");
  
  // Synchronous injection
  const traverseAndInject = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
      if (typeof obj === 'string' && obj.startsWith('__media_')) {
        return mediaMap.get(obj) || obj; 
      }
      return obj;
    }
    
    if (Array.isArray(obj)) {
      const newArr = new Array(obj.length);
      for (let i = 0; i < obj.length; i++) {
          newArr[i] = traverseAndInject(obj[i]);
      }
      return newArr;
    }
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = traverseAndInject(obj[key]);
      }
    }
    return newObj;
  };
  
  const finalState = traverseAndInject(state);
  if (onProgress) onProgress(100, "Ready!");
  
  // A tiny extra delay to make sure UI can render 100%
  await new Promise(r => setTimeout(r, 100));
  
  return finalState as GameState;
};
