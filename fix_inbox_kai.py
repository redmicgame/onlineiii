import re
with open('components/InboxView.tsx', 'r') as f:
    content = f.read()

pattern1 = r'''            case 'oscarSubmission':
                dispatch\(\{ type: 'GO_TO_OSCAR_SUBMISSIONS', payload: \{ emailId: email\.id \} \}\);
                break;'''
replacement1 = '''            case 'oscarSubmission':
                dispatch({ type: 'GO_TO_OSCAR_SUBMISSIONS', payload: { emailId: email.id } });
                break;
            case 'kaiStreamSetup':
                dispatch({ type: 'GO_TO_KAI_STREAM_SETUP', payload: { emailId: email.id } });
                break;'''
content = content.replace(pattern1, replacement1)

pattern2 = r'''            case 'oscarSubmission':
                buttonText = "Submit For Oscars";
                buttonClass = "bg-amber-400 hover:bg-amber-500 text-black shadow-amber-400/20";
                acceptedText = "Submissions Sent";
                isAccepted = email\.offer\.isSubmitted;
                break;'''
replacement2 = '''            case 'oscarSubmission':
                buttonText = "Submit For Oscars";
                buttonClass = "bg-amber-400 hover:bg-amber-500 text-black shadow-amber-400/20";
                acceptedText = "Submissions Sent";
                isAccepted = email.offer.isSubmitted;
                break;
            case 'kaiStreamSetup':
                buttonText = "Setup Twitch Stream";
                buttonClass = "bg-[#9146FF] hover:bg-[#7d5bbe] text-white shadow-[#9146FF]/20";
                acceptedText = "Stream Setup Completed";
                isAccepted = email.offer.isSubmitted;
                break;'''
content = content.replace(pattern2, replacement2)

with open('components/InboxView.tsx', 'w') as f:
    f.write(content)
