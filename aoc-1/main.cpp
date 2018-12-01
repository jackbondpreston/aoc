#include <iostream>
#include <fstream>
#include <string>
#include <unordered_set>

int main() {
	std::ifstream in{"inputs.txt"};
	
	/* Part 1 */
	std::string line;
	long total = 0;

	while (std::getline(in, line)) {
		long value = std::stol(line);

		total += value;
	}

	std::cout << "[Part 1] Total: " << total << std::endl;


	/* Part 2 */
	total = 0;

	std::unordered_set<long> seen_values;

	bool reoccurence_found = false;
	long first_reocurrence = 0;

	while (!reoccurence_found) {
		// seek back to start of file, reset EOF flag
		in.clear();
		in.seekg(0, std::ios::beg);

		while (std::getline(in, line) && !reoccurence_found) {
			auto result = seen_values.insert(total); // add it to set
			if (!result.second) { // if it could not be inserted
				first_reocurrence = total;
				reoccurence_found = true;
			}

			long value = std::stol(line);

			total += value;
		}
	}

	std::cout << "[Part 2] First reoccurence: " << first_reocurrence << std::endl;
}