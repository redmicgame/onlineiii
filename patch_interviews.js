import fs from 'fs';
let code = fs.readFileSync('context/GameContext.tsx', 'utf8');

const tvBlock = `      const emailId = crypto.randomUUID();
      const newEmail = {
          id: emailId,
          sender: "60 Minutes",
          subject: \`60 Minutes Interview Request\`,
          body: \`We received your request. We would like to sit down for a prime-time interview regarding your new music.

Let us know if you accept.\`,
          date: state.date,
          isRead: false,
          senderIcon: "tv",
          offer: {
            type: "interviewOffer",
            releaseId: submission.release.id,
            interviewType: "tv",
            outletName: "60 Minutes",
            emailId: emailId,
          }
      };`;

const tvBlockNew = `      const emailId = crypto.randomUUID();
      const year = state.date.year;
      let outletName = "60 Minutes";
      if (year < 1980) outletName = "The Tonight Show Starring Johnny Carson";
      else if (year < 1990) outletName = "Late Night with David Letterman";
      else if (year < 2000) outletName = "The Tonight Show with Jay Leno";
      else if (year < 2010) outletName = "Total Request Live";
      else if (year < 2020) outletName = "The Tonight Show Starring Jimmy Fallon";
      else outletName = "Hot Ones";
      
      const newEmail = {
          id: emailId,
          sender: outletName,
          subject: \`\${outletName} Interview Request\`,
          body: \`We received your request. We would like to sit down for a prime-time interview regarding your new music.\\n\\nLet us know if you accept.\`,
          date: state.date,
          isRead: false,
          senderIcon: "tv",
          offer: {
            type: "interviewOffer",
            releaseId: submission.release.id,
            interviewType: "tv",
            outletName: outletName,
            emailId: emailId,
          }
      };`;

code = code.replace(tvBlock, tvBlockNew);


const magBlock = `      const emailId = crypto.randomUUID();
      const newEmail = {
          id: emailId,
          sender: "Rolling Stone",
          subject: \`Rolling Stone Cover Story\`,
          body: \`We received your request. We'd love to feature you for a cover story regarding your new album.

Let us know if you accept.\`,
          date: state.date,
          isRead: false,
          senderIcon: "news",
          offer: {
            type: "interviewOffer",
            releaseId: submission.release.id,
            interviewType: "magazine",
            outletName: "Rolling Stone",
            emailId: emailId,
          }
      };`;

const magBlockNew = `      const emailId = crypto.randomUUID();
      const year = state.date.year;
      let outletName = "Rolling Stone";
      if (year < 1980) outletName = "Creem Magazine";
      else if (year < 1990) outletName = "Smash Hits";
      else if (year < 2000) outletName = "The Source";
      else if (year < 2010) outletName = "Blender Magazine";
      else if (year < 2020) outletName = "The Fader";
      else outletName = "Variety";

      const newEmail = {
          id: emailId,
          sender: outletName,
          subject: \`\${outletName} Cover Story\`,
          body: \`We received your request. We'd love to feature you for a cover story regarding your new album.\\n\\nLet us know if you accept.\`,
          date: state.date,
          isRead: false,
          senderIcon: "news",
          offer: {
            type: "interviewOffer",
            releaseId: submission.release.id,
            interviewType: "magazine",
            outletName: outletName,
            emailId: emailId,
          }
      };`;

code = code.replace(magBlock, magBlockNew);

fs.writeFileSync('context/GameContext.tsx', code);
