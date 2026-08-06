import re

with open('App.tsx', 'r') as f:
    content = f.read()

target_import = "import { getEraConfiguration } from './utils/eraUtils';"
replacement_import = "import { getEraConfiguration } from './utils/eraUtils';\nimport UKChartView from './components/UKChartView';"
content = content.replace(target_import, replacement_import)

target_switch = """            case 'spotifyChart':
                return <SpotifyChartView />;"""
replacement_switch = """            case 'spotifyChart':
                return <SpotifyChartView />;
            case 'ukChart':
                return <UKChartView />;"""
content = content.replace(target_switch, replacement_switch)

with open('App.tsx', 'w') as f:
    f.write(content)
