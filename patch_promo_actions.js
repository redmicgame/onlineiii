import fs from 'fs';
let code = fs.readFileSync('context/GameContext.tsx', 'utf8');

const replacement = `
    case "REQUEST_MAGAZINE_PROMO": {
      if (!state.activeArtistId) return state;
      const { submissionId, songId, cost } = action.payload;
      const activeData = state.artistsData[state.activeArtistId];

      const submission = activeData.labelSubmissions.find(s => s.id === submissionId);
      if (!submission) return state;

      const emailId = crypto.randomUUID();
      const newEmail = {
          id: emailId,
          sender: "Magazine Publisher",
          subject: \`Magazine Interview Request: \${submission.release.title}\`,
          body: \`We received your label's request. We would love to interview you for an upcoming issue to discuss "\${submission.release.title}".\n\nLet us know if you accept.\`,
          date: state.date,
          isRead: false,
          senderIcon: "magazine",
          offer: {
            type: "interviewOffer",
            releaseId: submission.release.id,
            interviewType: "magazine",
            outletName: "Rolling Stone",
            emailId: emailId,
          }
      };

      const updatedSubmissions = activeData.labelSubmissions.map((sub) => {
        if (sub.id === submissionId) {
          return { ...sub, magazineInterviewRequestedForSongId: songId, promoBudgetSpent: (sub.promoBudgetSpent || 0) + cost };
        }
        return sub;
      });

      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: { ...activeData, labelSubmissions: updatedSubmissions, inbox: [newEmail, ...activeData.inbox] },
        },
      };
    }
    case "REQUEST_TV_INTERVIEW_PROMO": {
      if (!state.activeArtistId) return state;
      const { submissionId, songId, cost } = action.payload;
      const activeData = state.artistsData[state.activeArtistId];

      const submission = activeData.labelSubmissions.find(s => s.id === submissionId);
      if (!submission) return state;

      const emailId = crypto.randomUUID();
      const newEmail = {
          id: emailId,
          sender: "60 Minutes",
          subject: \`60 Minutes Interview Request\`,
          body: \`We received your request. We would like to sit down for a prime-time interview regarding your new music.\n\nLet us know if you accept.\`,
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
      };

      const updatedSubmissions = activeData.labelSubmissions.map((sub) => {
        if (sub.id === submissionId) {
          return { ...sub, tvInterviewRequestedForSongId: songId, promoBudgetSpent: (sub.promoBudgetSpent || 0) + cost };
        }
        return sub;
      });

      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: { ...activeData, labelSubmissions: updatedSubmissions, inbox: [newEmail, ...activeData.inbox] },
        },
      };
    }
    case "ACCEPT_INTERVIEW_OFFER": {
      if (!state.activeArtistId) return state;
      const { releaseId, interviewType, outletName, emailId } = action.payload;
      const activeData = state.artistsData[state.activeArtistId];
      const updatedInbox = activeData.inbox.map((email) => {
        if (email.id === emailId && email.offer?.type === "interviewOffer") {
          return { ...email, offer: { ...email.offer, isAccepted: true } };
        }
        return email;
      });
      let view = "createMagazineInterview";
      if (interviewType === "tv") view = "createTvInterview";
      
      return {
        ...state,
        artistsData: { ...state.artistsData, [state.activeArtistId]: { ...activeData, inbox: updatedInbox } },
        activeInterviewOffer: { releaseId, interviewType, outletName, emailId },
        currentView: view as any,
      };
    }
    case "CANCEL_INTERVIEW_OFFER": {
      return {
        ...state,
        activeInterviewOffer: null,
        currentView: "inbox",
      };
    }
    case "SUBMIT_INTERVIEW": {
        if (!state.activeArtistId || !state.activeInterviewOffer) return state;
        const { answers } = action.payload; // array of answers, could be poor/good
        
        let publicImageChange = 0;
        let hypeChange = 0;
        let backlash = false;
        
        // Simulating the effect of answers
        if (answers.includes('poor')) {
            publicImageChange -= 20;
            hypeChange += 5; // backlash creates buzz but lowers image
            backlash = true;
        } else {
            publicImageChange += 10;
            hypeChange += 15;
        }

        const activeData = state.artistsData[state.activeArtistId];
        const updatedData = { ...activeData };
        updatedData.publicImage = Math.max(0, Math.min(100, updatedData.publicImage + publicImageChange));
        updatedData.hype = Math.max(0, Math.min(100, updatedData.hype + hypeChange));
        
        if (backlash) {
            const article = {
                id: crypto.randomUUID(),
                type: 'text' as const,
                content: \`NEWSPAPER REPORT: \${state.soloArtist?.name || 'The artist'} faces immense backlash after a controversial \${state.activeInterviewOffer.outletName} interview. Fans are expressing disappointment.\`,
                likes: Math.floor(Math.random() * 5000) + 1000,
                retweets: Math.floor(Math.random() * 1000) + 500,
                replies: Math.floor(Math.random() * 500) + 200,
                date: state.date,
                isPlayer: false,
                author: state.activeInterviewOffer.interviewType === 'magazine' ? 'Rolling Stone' : 'Daily News'
            };
            updatedData.xPosts = [article, ...updatedData.xPosts];
        }

        return {
            ...state,
            artistsData: {
                ...state.artistsData,
                [state.activeArtistId]: updatedData
            },
            activeInterviewOffer: null,
            currentView: 'game'
        };
    }
`;

code = code.replace(
  'case "REQUEST_FALLON_PROMO": {',
  replacement + '\n    case "REQUEST_FALLON_PROMO": {'
);

fs.writeFileSync('context/GameContext.tsx', code);
