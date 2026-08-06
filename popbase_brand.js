import fs from 'fs';

let code = fs.readFileSync('utils/xContentGenerator.ts', 'utf8');

const targetStatsPost = `  // (artist name) Stats post`;

const replBrandPost = `  // PopBase Brand Ambassador Deal Post
  if (artistData.activeBrandDeals && artistData.activeBrandDeals.length > 0) {
      // Find a deal that hasn't been announced yet? Or just announce randomly? Let's assume we announce deals signed this week.
      // A simple way is to check if we haven't posted about this deal. We can use a property or just random chance if a deal exists.
      // But we probably want to trigger this when SIGN_BRAND_DEAL happens. It's better to add the post directly in the SIGN_BRAND_DEAL reducer.
  }

  // (artist name) Stats post`;

code = code.replace(targetStatsPost, replBrandPost);
fs.writeFileSync('utils/xContentGenerator.ts', code);
