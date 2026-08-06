import re
with open('components/XView.tsx', 'r') as f:
    content = f.read()

content = content.replace('const isSnapshotPost = post.image && post.image.startsWith("snapshot:");', 'const isSnapshotPost = post.image && post.image.startsWith("snapshot:");\n  const isLeaderboardPost = post.image && post.image.startsWith("leaderboard:");')

with open('components/XView.tsx', 'w') as f:
    f.write(content)
