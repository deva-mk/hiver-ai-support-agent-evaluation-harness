import json
import re

with open('src/data/goldenEvaluationSet.ts') as f:
    content = f.read()

# Parse the JSON-like array from goldenEvaluationSet.ts
# Or write a small node script with tsx to run it in TypeScript directly!
