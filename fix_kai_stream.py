import re
with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

pattern = r'''          newEmail = \{
              id: newEmailId,
              date: state\.date,
              sender: "Kai Cenat",
              subject: "Let's run a stream!",
              body: "Yo! Your manager reached out\. Let's do a stream together\. Fill out the details and I'll cover the flight costs\.",
              isRead: false,
              offer: \{
                  type: "kaiStreamSetup",
                  emailId: newEmailId
              \}
          \};'''

replacement = '''          newEmail = {
              id: newEmailId,
              date: state.date,
              sender: "Kai Cenat",
              senderIcon: "twitch",
              subject: "Let's run a stream!",
              body: "Yo! Your manager reached out. Let's do a stream together. Fill out the details and I'll cover the flight costs.",
              isRead: false,
              offer: {
                  type: "kaiStreamSetup",
                  emailId: newEmailId
              }
          };'''

content = re.sub(pattern, replacement, content)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
