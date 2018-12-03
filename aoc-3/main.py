f = open("inputs.txt", "r")
inputs = f.read().split('\n')

claimed = {}

for s in inputs:
    split = s.split(' ')
    
    claimId = split[0]
    
    coords = split[2].split(',')
    x = int(coords[0])
    y = int(coords[1][:-1])

    size = split[3].split('x')
    xSize = int(size[0])
    ySize = int(size[1])

    for i in range(x + 1, x + xSize + 1):
        for j in range(y + 1, y + ySize + 1):
            if (i, j) in claimed:
                claimed[(i, j)].append(claimId)
            else:
                claimed[(i, j)] = [claimId]

overlap = 0

pureClaims = set()
impureClaims = set()

for key, value in claimed.items():
    if len(value) > 1:
        overlap += 1
        for v in value:
            pureClaims.discard(v)
            impureClaims.add(v)
                
    elif value[0] not in impureClaims:
        pureClaims.add(value[0])
    

print(f"[Part 1] Overlapping squares: {overlap}")

if len(pureClaims) == 1:
    print(f"[Part 2] Non-overlapping claim: {pureClaims.pop()}")
