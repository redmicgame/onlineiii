import re

with open('components/SpotifyForArtistsView.tsx', 'r') as f:
    content = f.read()

# 1. Remove the import
content = content.replace('import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";\n', '')

# 2. Replace the PieChart
target_chart = """            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={streamSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {streamSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [formatNumber(value), name]}
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: 'white' }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>"""

replacement_chart = """            <div className="flex justify-center items-center py-4">
              <div 
                className="w-32 h-32 rounded-full relative flex items-center justify-center"
                style={{
                  background: `conic-gradient(${
                    streamSources.reduce((acc, source, i) => {
                      const start = acc.angle;
                      const end = start + (source.percent / 100) * 360;
                      acc.gradients.push(`${source.color} ${start}deg ${end}deg`);
                      acc.angle = end;
                      return acc;
                    }, { angle: 0, gradients: [] as string[] }).gradients.join(', ')
                  })`
                }}
              >
                <div className="w-24 h-24 bg-zinc-900 rounded-full absolute inset-auto"></div>
              </div>
            </div>"""

if target_chart in content:
    content = content.replace(target_chart, replacement_chart)
    print("Replaced chart UI")
else:
    print("Could not find chart UI. Trying Regex...")
    # Just in case whitespace is off
    import re
    # we can try to match between `<div className="h-64` and `</ResponsiveContainer>\n            </div>`
    regex = r'<div className="h-64 w-full text-xs">.*?</ResponsiveContainer>\s*</div>'
    if re.search(regex, content, re.DOTALL):
        content = re.sub(regex, replacement_chart, content, flags=re.DOTALL)
        print("Replaced chart UI via regex")
    else:
        print("Still couldn't find chart UI")

with open('components/SpotifyForArtistsView.tsx', 'w') as f:
    f.write(content)

