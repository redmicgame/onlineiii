import re

with open('components/UKChartView.tsx', 'r') as f:
    content = f.read()

target = """                <div className="flex items-center gap-2 mb-6 text-sm font-semibold border-b border-zinc-300 pb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    view as cards
                </div>
                <div className="space-y-4">"""

replace = """                <div className="flex items-center gap-2 mb-6 text-lg border-b border-zinc-300 pb-2 text-black">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    view as cards
                </div>
                <div className="space-y-6">"""

content = content.replace(target, replace)
with open('components/UKChartView.tsx', 'w') as f:
    f.write(content)
