import fs from 'fs';

let code = fs.readFileSync('db/db.ts', 'utf8');

const oldSeparate = `export const separateMediaFromState = async (state: GameState, onProgress?: (progress: number, msg?: string) => void): Promise<any> => {
  const mediaToSave: MediaSave[] = [];
  let processCount = 0;

  const traverseAndReplace = async (obj: any, depth = 0): Promise<any> => {
    if (obj === null || typeof obj !== 'object') {
      if (typeof obj === 'string' && obj.startsWith('data:')) {
        let hash = 0;
        for (let i = 0; i < obj.length && i < 1000; i++) {
          hash = (Math.imul(31, hash) + obj.charCodeAt(i)) | 0;
        }
        const id = \`__media_\${hash}_\${obj.length}\`;
        mediaToSave.push({ id, data: obj });
        return id;
      }
      return obj;
    }
    
    processCount++;
    if (processCount % 500 === 0) {
        // Slow down processing to prevent crashes for massive saves
        await new Promise(r => setTimeout(r, 2));
        if (onProgress) onProgress(Math.min(45, Math.floor(processCount / 1000)), "Separating large media assets...");
    }

    if (Array.isArray(obj)) {
      const arr = [];
      for (const item of obj) {
          arr.push(await traverseAndReplace(item, depth + 1));
      }
      return arr;
    }
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = await traverseAndReplace(obj[key], depth + 1);
      }
    }
    return newObj;
  };
  
  if (onProgress) onProgress(0, "Analyzing state structure...");
  const newState = await traverseAndReplace(state);

  if (mediaToSave.length > 0) {
    if (onProgress) onProgress(50, "Saving unique media assets...");
    const uniqueMedia = Array.from(new Map(mediaToSave.map(item => [item.id, item])).values());
    
    const chunkSize = 50;
    for (let i = 0; i < uniqueMedia.length; i += chunkSize) {
        const chunk = uniqueMedia.slice(i, i + chunkSize);
        await db.media.bulkPut(chunk);
        if (onProgress) onProgress(50 + Math.floor((i / uniqueMedia.length) * 50), \`Saving media chunk \${i} / \${uniqueMedia.length}...\`);
        // Deliberate slowdown to prevent crash and show progress
        await new Promise(r => setTimeout(r, 10));
    }
  }
  
  if (onProgress) onProgress(100, "Done separating media!");
  return newState;
};`;

const newSeparate = `export const separateMediaFromState = async (state: GameState, onProgress?: (progress: number, msg?: string) => void): Promise<any> => {
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
        const id = \`__media_\${hash}_\${obj.length}\`;
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
        if (onProgress) onProgress(50 + Math.floor((i / uniqueMedia.length) * 50), \`Saving media chunk \${i} / \${uniqueMedia.length}...\`);
        await new Promise(r => setTimeout(r, 2));
    }
  }
  
  if (onProgress) onProgress(100, "Done separating media!");
  return newState;
};`;

code = code.replace(oldSeparate, newSeparate);


const oldInject = `export const injectMediaIntoState = async (state: any, onProgress?: (progress: number, msg?: string) => void): Promise<GameState> => {
  const mediaIds = new Set<string>();
  let collectCount = 0;
  
  const collectMediaIds = async (obj: any, depth = 0) => {
    if (obj === null || typeof obj !== 'object') {
      if (typeof obj === 'string' && obj.startsWith('__media_')) {
        mediaIds.add(obj);
      }
      return;
    }
    collectCount++;
    if (collectCount % 1000 === 0) {
      await new Promise(r => setTimeout(r, 2)); // yield and intentionally slow down
      if (onProgress) onProgress(Math.min(10, Math.floor(collectCount / 2000)), "Analyzing save file structure...");
    }
    
    if (Array.isArray(obj)) {
      for (const item of obj) {
          await collectMediaIds(item, depth + 1);
      }
      return;
    }
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        await collectMediaIds(obj[key], depth + 1);
      }
    }
  };
  
  if (onProgress) onProgress(0, "Analyzing save file structure...");
  await collectMediaIds(state);

  if (onProgress) onProgress(15, "Retrieving assets from local database...");
  const mediaIdArray = Array.from(mediaIds);
  const mediaMap = new Map<string, string>();
  
  const chunkSize = 50; // smaller chunks = more yields
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
          onProgress(pct, \`Loading assets (\${i} / \${mediaIdArray.length})...\`);
      }
      await new Promise(r => setTimeout(r, 10)); // artificially slow down so it doesn't crash
  }

  if (onProgress) onProgress(50, "Constructing game state...");
  
  let processCount = 0;
  const traverseAndInject = async (obj: any, depth = 0): Promise<any> => {
    if (obj === null || typeof obj !== 'object') {
      if (typeof obj === 'string' && obj.startsWith('__media_')) {
        return mediaMap.get(obj) || obj; 
      }
      return obj;
    }
    
    processCount++;
    if (processCount % 500 === 0) {
       await new Promise(r => setTimeout(r, 2)); // artificial delay scales with size
       if (onProgress) onProgress(Math.min(95, 50 + Math.floor(processCount / 2000)), "Linking assets to game world...");
    }
    
    if (Array.isArray(obj)) {
      const newArr = [];
      for (const item of obj) {
          newArr.push(await traverseAndInject(item, depth + 1));
      }
      return newArr;
    }
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = await traverseAndInject(obj[key], depth + 1);
      }
    }
    return newObj;
  };
  
  const finalState = await traverseAndInject(state);
  if (onProgress) onProgress(100, "Ready!");
  
  // A tiny extra delay to make sure UI can render 100%
  await new Promise(r => setTimeout(r, 200));
  
  return finalState as GameState;
};`;


const newInject = `export const injectMediaIntoState = async (state: any, onProgress?: (progress: number, msg?: string) => void): Promise<GameState> => {
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
          onProgress(pct, \`Loading assets (\${i} / \${mediaIdArray.length})...\`);
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
};`;

code = code.replace(oldInject, newInject);

fs.writeFileSync('db/db.ts', code);
