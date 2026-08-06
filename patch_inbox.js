import fs from 'fs';
let code = fs.readFileSync('components/InboxView.tsx', 'utf8');

code = code.replace(
  "case 'fallonOffer':\\n                dispatch({ type: 'ACCEPT_FALLON_OFFER'",
  "case 'interviewOffer':\\n                dispatch({ type: 'ACCEPT_INTERVIEW_OFFER', payload: { releaseId: email.offer.releaseId, interviewType: email.offer.interviewType, outletName: email.offer.outletName, emailId: email.id } });\\n                break;\\n            case 'fallonOffer':\\n                dispatch({ type: 'ACCEPT_FALLON_OFFER'"
);

code = code.replace(
  "case 'fallonOffer':\\n                buttonText = \\`Accept \\${email.offer.offerType}",
  "case 'interviewOffer':\\n                buttonText = \\`Accept \\${email.offer.outletName} Interview\\`;\\n                buttonClass = \\\"bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20\\\";\\n                acceptedText = \\\"Interview Accepted\\\";\\n                isAccepted = email.offer.isAccepted;\\n                break;\\n            case 'fallonOffer':\\n                buttonText = \\`Accept \\${email.offer.offerType}"
);

fs.writeFileSync('components/InboxView.tsx', code);
