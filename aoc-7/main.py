from collections import defaultdict

inputs = open("inputs.txt", "r").read().split('\n')

dependencies = defaultdict(set)

for line in inputs:
    dep = line.split()[1]
    step = line.split()[7]

    dependencies[step].add(dep)
    if dep not in dependencies:
        dependencies[dep] = set()


steps = []
while len(steps) < len(dependencies):
    possibleNextSteps = list()

    for key in sorted([ k for k in dependencies.keys() if k not in steps ]):
        if dependencies[key].issubset(set(steps)):
            possibleNextSteps.append(key)

    nextStep = possibleNextSteps[0]
    steps.append(nextStep)

print(f"[Part 1] Steps: { ''.join(steps) }")

alpha = list("_ABCDEFGHIJKLMNOPQRSTUVWXYZ")
completedSteps = set()
inProgress = dict()

time = 0
while len(completedSteps) < len(dependencies):
    for step in [ step for step in steps if step not in completedSteps and step not in inProgress.keys() ]:
        if dependencies[step].issubset(completedSteps) and len(inProgress) < 5:
            inProgress[step] = alpha.index(step) + 60

    for step in set(inProgress.keys()) - { k for k, v in inProgress.items() if v > 1 }:
        completedSteps.add(step)

    inProgress = { k : v - 1 for k, v in inProgress.items() if v > 1 }

    time += 1

print(f"[Part 2] Time taken: { time }")