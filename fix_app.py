import re
with open('App.tsx', 'r') as f:
    content = f.read()

pattern = r'''            case 'submitForOscars':
                return <SubmitForOscarsView />;'''

replacement = '''            case 'submitForOscars':
                return <SubmitForOscarsView />;
            case 'submit_for_golden_globes':
                return <SubmitForGoldenGlobesView />;'''

content = content.replace(pattern, replacement)

with open('App.tsx', 'w') as f:
    f.write(content)
