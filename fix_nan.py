import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target = 'totalRegStreams["US"] += remixReg["US"] || 0; totalRegStreams["Canada"] += remixReg["Canada"] || 0; totalRegStreams["UK"] += remixReg["UK"] || 0; totalRegStreams["Latin America"] += remixReg["Latin America"] || 0; totalRegStreams["Asia"] += remixReg["Asia"] || 0; totalRegStreams["Africa"] += remixReg["Africa"] || 0;'

replacement = 'totalRegStreams["US"] = (totalRegStreams["US"] || 0) + (remixReg["US"] || 0); totalRegStreams["Canada"] = (totalRegStreams["Canada"] || 0) + (remixReg["Canada"] || 0); totalRegStreams["UK"] = (totalRegStreams["UK"] || 0) + (remixReg["UK"] || 0); totalRegStreams["Latin America"] = (totalRegStreams["Latin America"] || 0) + (remixReg["Latin America"] || 0); totalRegStreams["Asia"] = (totalRegStreams["Asia"] || 0) + (remixReg["Asia"] || 0); totalRegStreams["Africa"] = (totalRegStreams["Africa"] || 0) + (remixReg["Africa"] || 0);'

if target in content:
    content = content.replace(target, replacement)
    with open('context/GameContext.tsx', 'w') as f:
        f.write(content)
    print("Fixed NaN bug")
else:
    print("Could not find target")

