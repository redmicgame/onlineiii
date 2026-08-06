import re

with open('components/ChartHistoryView.tsx', 'r') as f:
    content = f.read()

target_switch1 = """            case 'countryChart':
                history = gameState.countryChartHistory;
                items = [...songs];
                break;"""
replacement_switch1 = """            case 'countryChart':
                history = gameState.countryChartHistory;
                items = [...songs];
                break;
            case 'ukSinglesChart':
                history = gameState.ukSinglesChartHistory;
                items = [...songs];
                title = 'UK Official Singles Chart';
                break;"""
content = content.replace(target_switch1, replacement_switch1)

target_switch2 = """                case 'countryChart': title = 'Country Chart'; break;"""
replacement_switch2 = """                case 'countryChart': title = 'Country Chart'; break;
                case 'ukSinglesChart': title = 'UK Official Singles Chart'; break;"""
content = content.replace(target_switch2, replacement_switch2)

target_options = """                    <option value="electronicChart">Electronic Chart</option>
                    <option value="countryChart">Country Chart</option>
                </select>"""
replacement_options = """                    <option value="electronicChart">Electronic Chart</option>
                    <option value="countryChart">Country Chart</option>
                    {gameState.date.year >= 2016 && <option value="ukSinglesChart">UK Official Singles Chart</option>}
                </select>"""
content = content.replace(target_options, replacement_options)

with open('components/ChartHistoryView.tsx', 'w') as f:
    f.write(content)
