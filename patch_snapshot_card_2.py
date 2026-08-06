import re

with open('components/SpotifySnapshotCard.tsx', 'r') as f:
    content = f.read()

old_code = """              <div className="flex items-stretch mb-2">
                <div className="bg-[#bda58d] text-white text-2xl font-sans font-black flex-1 p-2 text-center">
                  {data.streams.toLocaleString()}
                </div>
                <div className="bg-[#cc5555] text-white text-lg font-sans font-bold p-2 flex items-center">
                  {(Math.random() * -5).toFixed(2)}%
                </div>
              </div>"""

new_code = """              <div className="flex items-stretch mb-2">
                <div className="bg-[#bda58d] text-white text-2xl font-sans font-black flex-1 p-2 text-center">
                  {data.streams.toLocaleString()}
                </div>
                <div className={`${(data.tracks?.reduce((acc, t) => acc + (t.changeVal || 0), 0) || 0) >= 0 ? "bg-[#55aa55]" : "bg-[#cc5555]"} text-white text-lg font-sans font-bold p-2 flex items-center`}>
                  {(() => {
                      const overallChangeVal = data.tracks?.reduce((acc: number, t: any) => acc + (t.changeVal || 0), 0) || 0;
                      const overallPrev = data.tracks?.reduce((acc: number, t: any) => acc + (t.weekly - (t.changeVal || 0)), 0) || 0;
                      const overallPct = overallPrev > 0 ? (overallChangeVal / overallPrev) * 100 : 0;
                      return (overallPct >= 0 ? "+" : "") + overallPct.toFixed(2) + "%";
                  })()}
                </div>
              </div>"""

content = content.replace(old_code, new_code)

with open('components/SpotifySnapshotCard.tsx', 'w') as f:
    f.write(content)
