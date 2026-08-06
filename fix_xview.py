import re
with open('components/XView.tsx', 'r') as f:
    content = f.read()

# Add import
import_pattern = r'import \{ SpotifySnapshotCard \} from "\./SpotifySnapshotCard";'
import_replacement = 'import { SpotifySnapshotCard } from "./SpotifySnapshotCard";\nimport { LeaderboardGridCard } from "./LeaderboardGridCard";'
content = content.replace(import_pattern, import_replacement)

# Add isLeaderboardPost
is_leaderboard_pattern = r'  const isSnapshotPost = post\.image && post\.image\.startsWith\("snapshot:"\);'
is_leaderboard_replacement = '  const isSnapshotPost = post.image && post.image.startsWith("snapshot:");\n  const isLeaderboardPost = post.image && post.image.startsWith("leaderboard:");'
content = content.replace(is_leaderboard_pattern, is_leaderboard_replacement)

# Render logic
render_pattern = r'''        \{isChartPost \? \(
          <YearEndChart dataString=\{post\.image!\} />
        \) : isSnapshotPost \? \(
          <SpotifySnapshotCard dataString=\{post\.image!\} />
        \) : isTmzPost \? \('''

render_replacement = '''        {isChartPost ? (
          <YearEndChart dataString={post.image!} />
        ) : isSnapshotPost ? (
          <SpotifySnapshotCard dataString={post.image!} />
        ) : isLeaderboardPost ? (
          <LeaderboardGridCard dataString={post.image!} />
        ) : isTmzPost ? ('''
content = re.sub(render_pattern, render_replacement, content)

with open('components/XView.tsx', 'w') as f:
    f.write(content)
