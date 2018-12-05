let fs = require("fs");

let input = fs.readFileSync("inputs.txt", "utf8").split('');

function swapCase(c) {
    return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
}

function collapsePolymer(polymer) {
    let i = 0;
    while(i < polymer.length - 1) {
        if (polymer[i] === swapCase(polymer[i + 1])) {
            polymer.splice(i, 2);
            i = Math.max(-1, i - 2);
        }

        i++;
    }

    return polymer.length;
}


let shortest = Math.min(... 
    'abcdefghijklmnopqrstuvwxyz'
    .split('')
    .map(
        x => collapsePolymer(
            input.filter(
                y => y.toUpperCase() !== x.toUpperCase()
            )
        )
    )
);

console.log(`[Part 1] Polymer length: ${ collapsePolymer(input) }`);
console.log(`[Part 2] Shortest polymer length: ${ shortest }`);
