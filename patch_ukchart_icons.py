import re

with open('components/UKChartView.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { ChevronLeftIcon, InformationCircleIcon, PlayIcon } from '@heroicons/react/24/solid';",
    "import ChevronLeftIcon from './icons/ChevronLeftIcon';\nimport InformationCircleIcon from './icons/InformationCircleIcon';\nimport PlayIcon from './icons/PlayIcon';"
)

with open('components/UKChartView.tsx', 'w') as f:
    f.write(content)
