import re

with open('types.ts', 'r') as f:
    content = f.read()

# Add to Song interface
song_target = """  isOnRadio?: boolean;
  radioPlays?: number;
  radioImpressions?: number;
  lastWeekRadioPlays?: number;
  weeksOnRadio?: number;
  radioFormat?: string;
  pendingRadioPromoSpins?: number;
  hasRadioPromo?: boolean;"""

song_replacement = """  isOnRadio?: boolean;
  radioPlays?: number;
  radioImpressions?: number;
  lastWeekRadioPlays?: number;
  weeksOnRadio?: number;
  radioFormat?: string;
  pendingRadioPromoSpins?: number;
  hasRadioPromo?: boolean;
  
  isOnUkRadio?: boolean;
  ukRadioPlays?: number;
  lastWeekUkRadioPlays?: number;
  ukWeeksOnRadio?: number;
  ukRadioFormat?: string;
  pendingUkRadioPromoSpins?: number;
  hasUkRadioPromo?: boolean;"""

if song_target in content:
    content = content.replace(song_target, song_replacement)

# Add to GameState
state_target = """  radioOverallChart?: ChartEntry[];
  radioUrbanChart?: ChartEntry[];
  radioPopChart?: ChartEntry[];
  radioRhythmicChart?: ChartEntry[];
  radioCountryChart?: ChartEntry[];
  radioChristmasChart?: ChartEntry[];"""

state_replacement = """  radioOverallChart?: ChartEntry[];
  radioUrbanChart?: ChartEntry[];
  radioPopChart?: ChartEntry[];
  radioRhythmicChart?: ChartEntry[];
  radioCountryChart?: ChartEntry[];
  radioChristmasChart?: ChartEntry[];
  ukSinglesChart?: ChartEntry[];
  ukSinglesChartHistory?: ChartHistory;"""

if state_target in content:
    content = content.replace(state_target, state_replacement)

# Add to GameView
view_target = '  | "kalshi";'
view_replacement = '  | "kalshi"\n  | "ukChart";'

if view_target in content:
    content = content.replace(view_target, view_replacement)

with open('types.ts', 'w') as f:
    f.write(content)
