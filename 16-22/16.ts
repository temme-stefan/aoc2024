import {exampleData, exampleData2, starData} from "./16-data";

type TCell = { i: number, j: number, isWall: boolean }
const getNeighbours = (map: TCell[][], cell: TCell) => {
    return [[-1, 0], [0, 1], [1, 0], [0, -1]]
        .map(([o_i, o_j]) => [cell.i + o_i, cell.j + o_j])
        .filter(([c_i, c_j]) => c_i >= 0 && c_j >= 0 && c_i < map.length && c_j < map[c_i].length)
        .map(([i, j]) => map[i][j])
}
const parse = (data: string) => {
    let start: TCell, end: TCell;
    const map: TCell[][] = data.split("\n").map((row, i) => row.split("").map((c, j) => {
        const isWall = c == "#";
        const cell = {i, j, isWall};
        if (c == "S") {
            start = cell;
        }
        if (c == "E") {
            end = cell;
        }
        return cell;
    }));
    return {start, end, map}
}

class Path {
    pathSet = new Set<TCell>();
    pathArray: TCell[] = [];
    score = 0;
    map: TCell[][];

    constructor(score: number, path: TCell[], map: TCell[][]) {
        this.pathSet = new Set(path);
        this.pathArray = [...path];
        this.score = score;
        this.map = map;
    }

    has(cell: TCell) {
        return this.pathSet.has(cell);
    }

    append(cell: TCell) {
        this.score += getScoreToNext(cell, this.pathArray.at(-1), this.pathArray.at(-2));
        this.pathSet.add(cell);
        this.pathArray.push(cell);
    }

    getNextCells() {
        return getNeighbours(this.map, this.pathArray.at(-1)).filter(n => !n.isWall && !this.has(n));
    }

    clone() {
        return new Path(this.score, this.pathArray, this.map);
    }

}

const getBestPath = ({start, end, map}: ReturnType<typeof parse>) => {
    const pathesInProgress = [new Path(0, [start], map)];
    let bestPathes: Path[] = [];
    const visited = new Map<TCell, Map<TCell, number>>();
    while (pathesInProgress.length > 0) {
        const bestScore = bestPathes[0]?.score ?? Number.MAX_VALUE;
        const current = pathesInProgress.shift();
        if (current.score >= bestScore) {
            continue;
        }
        current.getNextCells().forEach(c => {
            const p = current.clone();
            visited.set(current.pathArray.at(-1), visited.get(current.pathArray.at(-1)) ?? new Map());
            const v = visited.get(current.pathArray.at(-1));
            p.append(c);
            if (!v.has(c) || v.get(c) >= p.score) {
                v.set(c, p.score);
                if (p.score <= bestScore) {
                    if (c == end) {
                        // console.log("Path found", p.score, p.pathSet.size, pathesInProgress.length)
                        if (p.score < bestScore) {
                            bestPathes.length = 0;
                        }
                        bestPathes.push(p);
                    } else {
                        pathesInProgress.push(p);
                    }
                }
            }
        })
    }
    return bestPathes
}

const getScoreToNext = (next: TCell, current: TCell, previous: TCell | null) => {
    const oldDir = previous ? [current.i - previous.i, current.j - previous.j] : [0, 1] //previous empty => current == start
    const nextDir = [next.i - current.i, next.j - current.j];
    return oldDir [0] == nextDir[0] && oldDir[1] == nextDir[1] ? 1 : 1001;
}
const solve = (data: string) => {
    const parsed = parse(data);
    const bestPathes = getBestPath(parsed);
    console.log("Minimum Score", bestPathes[0].score);
    const bestPathesTiles = bestPathes.reduce((set, path) => new Set([...set, ...path.pathSet]), new Set());
    console.log(parsed.map.map(row => row.map(c => c.isWall ? "#" : bestPathesTiles.has(c) ? "O" : ".").join("")).join("\n"))
    console.log("bestPathesTiles", bestPathesTiles.size)
}
console.log("Advent of Code - 2024 - 16")
console.log("https://adventofcode.com/2024/day/16")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Example2");
console.log("Example2")
solve(exampleData2);
console.timeEnd("Example2")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
