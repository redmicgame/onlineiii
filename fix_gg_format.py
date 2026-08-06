import re
with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

pattern = r'''                let nomineesText = '';
                category\.nominees\.forEach\(n => \{
                    nomineesText \+= `• \$\{n\.artistName\.toUpperCase\(\)\} \| \$\{n\.name\.toUpperCase\(\)\}`;
                \}\);
                const content = `Congratulations to the 85th #GoldenGlobes nominees for \$\{category\.name\}:\$\{nomineesText\}`;'''

replacement = '''                let nomineesText = '';
                category.nominees.forEach(n => {
                    nomineesText += `\\n• ${n.artistName.toUpperCase()} | ${n.name.toUpperCase()}`;
                });
                const content = `Congratulations to the 85th #GoldenGlobes nominees for ${category.name}:${nomineesText}`;'''

content = content.replace(pattern, replacement)
with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
