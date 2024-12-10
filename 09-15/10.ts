import {exampleData, starData} from "./10-data";

type TCell = {
    i: number,
    j: number,
    val: number
}
const parse = (data: string): TCell[][] => {
    return data.split("\n").map((r, i) => r.split("").map((x, j) => ({i, j, val: parseInt(x)})));
}

const getNeighbours = (map: TCell[][], cell: TCell) => {
    return [[-1, 0], [0, 1], [1, 0], [0, -1]]
        .map(([o_i, o_j]) => [cell.i + o_i, cell.j + o_j])
        .filter(([c_i, c_j]) => c_i >= 0 && c_j >= 0 && c_i < map.length && c_j < map[c_i].length)
        .map(([i, j]) => map[i][j])
}

const getTrailsScore = (map: TCell[][]) => {
    const ends = map.flat().filter(c => c.val == 9);
    const endCounts = Array.from(map).map(row => Array.from(row).map(_ => new Set<TCell>()));
    const hikeCounts = Array.from(map).map(row => Array.from(row).map(_ => 0));
    ends.forEach(c => {
        endCounts[c.i][c.j] = new Set([c])
        hikeCounts[c.i][c.j] = 1;
    });
    const queue = [...ends];
    while (queue.length > 0) {
        const current = queue.shift()!;
        getNeighbours(map, current).filter(n => n.val == current.val - 1)
            .forEach(n => {
                const firsttime = endCounts[n.i][n.j].size == 0;
                endCounts[n.i][n.j] = new Set([...endCounts[n.i][n.j], ...endCounts[current.i][current.j]]);//endCounts[n.i][n.j].union(endCounts[current.i][current.j])
                hikeCounts[n.i][n.j] += hikeCounts[current.i][current.j];
                if (n.val != 0 && firsttime) {
                    queue.push(n);
                }
            })
    }
    const starts = map.flat().filter(c => c.val == 0);
    const endCount = starts.reduce((sum, s) => endCounts[s.i][s.j].size + sum, 0);
    const hikeCount = starts.reduce((sum, s) => hikeCounts[s.i][s.j] + sum, 0)
    return {endCount, hikeCount}
}
const solve = (data: string) => {
    const parsed = parse(data);
    const score = getTrailsScore(parsed);
    console.log("Score", score.endCount);
    console.log("ScoreII", score.hikeCount);
}
console.log("Advent of Code - 2024 - 10")
console.log("https://adventofcode.com/2024/day/10")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
