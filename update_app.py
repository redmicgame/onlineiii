import re
with open('App.tsx', 'r') as f:
    content = f.read()

import_pattern = r"import SubmitForGoldenGlobesView from '\./components/SubmitForGoldenGlobesView';"
import_replacement = "import SubmitForGoldenGlobesView from './components/SubmitForGoldenGlobesView';\nimport KaiStreamSetupView from './components/KaiStreamSetupView';"
content = content.replace(import_pattern, import_replacement)

render_pattern = r'''            case 'submit_for_golden_globes':
                return <SubmitForGoldenGlobesView />;'''
render_replacement = '''            case 'submit_for_golden_globes':
                return <SubmitForGoldenGlobesView />;
            case 'kaiStreamSetup':
                return <KaiStreamSetupView />;'''
content = content.replace(render_pattern, render_replacement)

with open('App.tsx', 'w') as f:
    f.write(content)
