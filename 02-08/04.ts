import {exampleData, starData} from "./04-data";

const parse = (data: string) => data.split("\n");
const up = Symbol();
const down = Symbol();
const back = Symbol();
const forward = Symbol();
const noMove = Symbol();


const getDirmap = (size: number, i: number, j: number, map: string[]) =>
    new Map([[up, i >= size],
        [down, i + size < map.length],
        [back, j >= size],
        [forward, j + size < map[i].length],
        [noMove, true]
    ]);

const checkXMAS = (i: number, j: number, map: string[]) => {
    if (map[i][j] != "X") {
        return 0;
    }
    const dirs = getDirmap(3, i, j, map);
    const walkMap = new Map<Symbol, -1 | 0 | 1>([
        [up, -1],
        [down, 1],
        [back, -1],
        [forward, 1],
        [noMove, 0]
    ])
    const isXMAS = ([dirI, dirJ]: (-1 | 0 | 1)[]) => "XMAS" === Array.from({length: 4}).map((_, n) => map[i + dirI * n][j + dirJ * n]).join("");

    return [[up, back], [up, noMove], [up, forward], [noMove, back], [noMove, forward], [down, back], [down, noMove], [down, forward]]
        .filter(a => a.every(key => dirs.get(key))
            && isXMAS(a.map(key => walkMap.get(key)))
        ).length;
}

const checkX_MAS = (i: number, j: number, map: string[]) => {
    if (map[i][j] != "A") {
        return 0;
    }
    const dirs = getDirmap(1, i, j, map);
    const isMAS = (startI: -1 | 1, startJ: -1 | 1) => "MAS" === Array.from({length: 3})
        .map((_, n) => map[i + startI - Math.sign(startI) * n][j + startJ - Math.sign(startJ) * n])
        .join("")

    const isCross = [...dirs.values()].every(Boolean)
        && (isMAS(-1, -1) || isMAS(1, 1))
        && (isMAS(-1, 1) || isMAS(1, -1));
    return isCross ? 1 : 0;
}
const solve = (data: string) => {
    const parsed = parse(data);
    let countXMAS = 0;
    let countX_MAS = 0;
    for (let i = 0; i < parsed.length; i++) {
        for (let j = 0; j < parsed[i].length; j++) {
            countXMAS += checkXMAS(i, j, parsed);
            countX_MAS += checkX_MAS(i, j, parsed);
        }
    }
    console.log("count XMAS", countXMAS);
    console.log("count X-MAS", countX_MAS);
}
console.log("Advent of Code - 2024 - 4")
console.log("https://adventofcode.com/2024/day/4")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
