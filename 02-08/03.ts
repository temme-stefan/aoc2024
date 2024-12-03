import {exampleData, starData} from "./03-data";

const getValidPatterns = (data: string) => {
    const pattern = /(do\(\)|don't\(\)|mul\((\d+),(\d+)\))/g;
    return [...data.matchAll(pattern)].map(x => ({
        match: x[0],
        x: x[2] != null ? parseInt(x[2]) : null,
        y: x[3] != null ? parseInt(x[3]) : null,
        do: x[0].startsWith("mul") ? null : x[0] == "do()",
        isMul: x[0].startsWith("mul"),
        index: x.index
    }));
}

const solve = (data: string) => {
    const patterns = getValidPatterns(data);
    const sumMul = patterns.filter(x => x.isMul)
        .reduce((sum, {x, y}) => sum + x * y, 0);
    console.log("Sum of valid Muls", sumMul);
    let active = true;
    let sum = 0;
    for (let i = 0; i < patterns.length; i++) {
        const current = patterns[i];
        if (current.isMul && active) {
            sum += current.x * current.y;
        }
        if (!current.isMul) {
            active = current.do;
        }
    }
    console.log("Sum of valid Muls, resketing doDont", sum);

}
console.log("Advent of Code - 2024 - 3")
console.log("https://adventofcode.com/2024/day/3")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
