from collections import defaultdict

input = open("inputs.txt", "r").read().split('\n')

coords = [ (int(x.split(',')[0]), int(x.split(',')[1])) for x in input ]

minCoords = (min(coords, key = lambda x: x[0])[0], min(coords, key = lambda x: x[1])[1])
maxCoords = (max(coords, key = lambda x: x[0])[0], max(coords, key = lambda x: x[1])[1])

areas = defaultdict(int)
largerAreas = defaultdict(int)
safeArea = 0

def manhattan_distance(coord1, coord2):
    return abs(coord1[0] - coord2[0]) + abs(coord1[1] - coord2[1])

for x in range(minCoords[0] - 1, maxCoords[0] + 2):
    for y in range(minCoords[1] - 1, maxCoords[1] + 2):
        closestCoord = min(coords, key = lambda c: manhattan_distance(c, (x, y)))

        distances = sum([ manhattan_distance(c, (x, y)) for c in coords ])
        if (distances < 10000):
            safeArea += 1

        largerAreas[closestCoord] += 1
        
        if (x >= minCoords[0] and x <= maxCoords[0] and y >= minCoords[1] and y <= maxCoords[1]):
            areas[closestCoord] += 1

unchangedAreas = { k: v for k, v in areas.items() if v == largerAreas[k] }

print(f"[Part 1] Largest non-infinite area: { max(unchangedAreas.values()) }")
print(f"[Part 2] Safe area: { safeArea }")