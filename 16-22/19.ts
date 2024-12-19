import {exampleData, starData} from "./19-data";

const parse = (data: string) => {
    const [terminals, words] = data.split("\n\n").map((data, i) => data.split(i == 0 ? ", " : "\n"));
    return {terminals, words}
}
const checkAndCount = (word: string, terminals: string[],cache:Map<string,number>) => {
    const recusionTest = (w: string) => {
        if (!cache.has(w)) {
            let sum = 0;
            for (const terminal of terminals.filter(t => w.startsWith(t))) {
                const newW = w.substring(terminal.length);
                sum += newW.length == 0 ?1: recusionTest(newW);
            }
            cache.set(w,sum);
        }
        return cache.get(w);
    }
    return recusionTest(word);
}
const solve = (data: string) => {
    const parsed = parse(data);
    const cache = new Map<string, number>();
    const valid = parsed.words.map(w => checkAndCount(w, parsed.terminals,cache)).filter(c=>c>0);
    console.log("Valid word Count", valid.length);
    console.log("Possibilities:", valid.reduce((a,b)=>a+b))
}
console.log("Advent of Code - 2024 - 19")
console.log("https://adventofcode.com/2024/day/19")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");


