with open('components/StartScreen.tsx', 'r') as f:
    content = f.read()

# Remove the bad injection at the end of the form
content = content.replace('                        </>\n                        )}\n                    </form>', '                    </form>')

# Inject it at the right place
target = '                        <div>\n                             <label htmlFor="start-year"'
replacement = '                            </>\n                        )}\n' + target
content = content.replace(target, replacement)

# We also have an extra `</div>` at the end because of my fix_end3.py which added `</div></div></div>` basically.
# Let's clean up the end: we know there should be exactly three `</div>` before `);`
import re
content = re.sub(r'(<\/div>\s*)+(\s*\);\s*\};\s*export default StartScreen;)', r'                </div>\n            </div>\n        </div>\n\g<2>', content)

with open('components/StartScreen.tsx', 'w') as f:
    f.write(content)
