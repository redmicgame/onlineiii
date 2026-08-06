import fs from 'fs';
let code = fs.readFileSync('types.ts', 'utf8');

const target = `  presaleCollectionQueue?: { weeksRemaining: number; amount: number }[];
  presaleDemand?: number; // Estimated demand
  isSetlistMissingHits?: boolean; // Flag to apply -50% penalty
}`;

const repl = `  presaleCollectionQueue?: { weeksRemaining: number; amount: number }[];
  presaleDemand?: number; // Estimated demand
  isSetlistMissingHits?: boolean; // Flag to apply -50% penalty
  merchItems?: MerchItem[];
  openerId?: string;
  guestIds?: string[];
  bookingCostsPaid?: number;
}`;

code = code.replace(target, repl);
fs.writeFileSync('types.ts', code);
