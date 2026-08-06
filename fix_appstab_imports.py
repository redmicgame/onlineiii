import re

with open('components/AppsTab.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { useState } from 'react';\n\nconst AppsTab: React.FC = () => {", "const AppsTab: React.FC = () => {")

if "import React from 'react';" in content:
    content = content.replace("import React from 'react';", "import React, { useState } from 'react';")
else:
    content = "import React, { useState } from 'react';\n" + content

with open('components/AppsTab.tsx', 'w') as f:
    f.write(content)
