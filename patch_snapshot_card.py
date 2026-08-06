import re

with open('components/SpotifySnapshotCard.tsx', 'r') as f:
    content = f.read()

old_code = """                      <div className="text-right text-red-400">
                        -{Math.floor(Math.random() * 5000).toLocaleString()}
                      </div>
                      <div className="text-right text-red-400">
                        {(Math.random() * -3 - 0.5).toFixed(2)}%
                      </div>"""

new_code = """                      <div className={`text-right ${t.changeVal >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {t.changeVal !== undefined ? (t.changeVal > 0 ? "+" : "") + t.changeVal.toLocaleString() : "-"}
                      </div>
                      <div className={`text-right ${t.changePct >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {t.changePct !== undefined ? (t.changePct > 0 ? "+" : "") + t.changePct.toFixed(2) + "%" : "-"}
                      </div>"""

content = content.replace(old_code, new_code)

old_code_2 = """                <div className="grid grid-cols-[1rem_1fr_4rem_4rem_3rem_4.5rem] gap-2 p-2 text-xs font-bold items-center bg-[#bda58d]/20 text-[#bda58d]">
                  <div></div>
                  <div>Total</div>
                  <div className="text-right">
                    {data.streams.toLocaleString()}
                  </div>
                  <div className="text-right">
                    -{Math.floor(Math.random() * 40000).toLocaleString()}
                  </div>
                  <div className="text-right">-1.90%</div>
                  <div className="text-right">
                    {data.totalStreams.toLocaleString()}
                  </div>
                </div>"""

new_code_2 = """                <div className="grid grid-cols-[1rem_1fr_4rem_4rem_3rem_4.5rem] gap-2 p-2 text-xs font-bold items-center bg-[#bda58d]/20 text-[#bda58d]">
                  <div></div>
                  <div>Total</div>
                  <div className="text-right">
                    {data.streams.toLocaleString()}
                  </div>
                  <div className="text-right">
                    {data.tracks.reduce((acc: number, t: any) => acc + (t.changeVal || 0), 0) > 0 ? "+" : ""}{data.tracks.reduce((acc: number, t: any) => acc + (t.changeVal || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-right">
                    {data.tracks.reduce((acc: number, t: any) => acc + (t.changeVal || 0), 0) > 0 ? "+" : ""}{data.tracks.reduce((acc: number, t: any) => acc + (t.weekly - (t.changeVal || 0)), 0) > 0 ? (data.tracks.reduce((acc: number, t: any) => acc + (t.changeVal || 0), 0) / data.tracks.reduce((acc: number, t: any) => acc + (t.weekly - (t.changeVal || 0)), 0) * 100).toFixed(2) + "%" : "0.00%"}
                  </div>
                  <div className="text-right">
                    {data.totalStreams.toLocaleString()}
                  </div>
                </div>"""

content = content.replace(old_code_2, new_code_2)

with open('components/SpotifySnapshotCard.tsx', 'w') as f:
    f.write(content)
