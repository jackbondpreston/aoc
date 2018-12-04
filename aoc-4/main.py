from collections import defaultdict

inputs = sorted(open("inputs.txt", "r").read().split("\n"))

guard_id = 0
guard_sleep_times = defaultdict(lambda: defaultdict(int))

fell_asleep = 0

for item in inputs:
    split = item.split()

    if split[2] == "Guard":
        guard_id = int(item.split()[3][1:])
    elif split[2] == "falls":
        fell_asleep = int(split[1][3:-1])
    elif split[2] == "wakes":
        woke_up = int(split[1][3:-1])

        for i in range(fell_asleep, woke_up):
            guard_sleep_times[guard_id][i] += 1

# id, mins slept, most common min
max_sleep = (0, 0, 0)

# id, repeats, min
max_repeats = (0, 0, 0)
for guard_id, minute_freqs in guard_sleep_times.items():
    max_freq_minute = max(minute_freqs, key = minute_freqs.get)
    max_freq = minute_freqs[max_freq_minute]
    if max_freq > max_repeats[1]:
        max_repeats = (guard_id, max_freq, max_freq_minute)

    time_slept = sum(minute_freqs.values())
    if time_slept > max_sleep[1]:
        max_sleep = (guard_id, time_slept, max_freq_minute)
    

print(f"[Part 1] Result: { max_sleep[0] * max_sleep[2] }")

print(f"[Part 2] Result: { max_repeats[0] * max_repeats[2] }")