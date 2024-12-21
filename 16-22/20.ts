import {exampleData} from "./20-data";

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

const sssp = (start: TCell, end: TCell, map: TCell[][]) => {
    const visited: number[][] = Array.from(map).map(r => Array.from(r).map(_ => null));
    const nodes = [end];
    visited[end.i][end.j] = 0;
    while (nodes.length > 0 && visited[start.i][start.j] == null) {
        const current = nodes.shift();
        getNeighbours(map, current).filter(c => !c.isWall && visited[c.i][c.j] == null).forEach(c => {
            nodes.push(c);
            visited[c.i][c.j] = visited[current.i][current.j] + 1
        })
    }
    return visited;
}
const solve = (data: string) => {
    const {start, end, map} = parse(data);
    const countMap = sssp(start, end, map);
    const maxLength = countMap[start.i][start.j];
    console.log("Maxlength", maxLength);
    //Obervation: there is no early stop, all cells are either walls or have a distance to the end.
    const walls = map.flat().filter(c => c.isWall);
    const cheats = new Map<number, number>()
    for (const wall of walls) {
        const {
            secondwalls,
            startcells
        } = Object.groupBy(getNeighbours(map, wall), (c => c.isWall ? "secondwalls" : "startcells"));
        for (const secondwall of secondwalls ?? []) {
            const endcells = getNeighbours(map, secondwall).filter(c => !c.isWall && !(startcells??[]).includes(c));
            if (startcells?.length > 0 && endcells.length > 0) {
                const startcounts = (startcells ?? []).map(s => countMap[s.i][s.j]);
                const endCounts = endcells.map(s => countMap[s.i][s.j]);
                const maxStart = startcounts.reduce((a, b) => Math.max(a, b), 0)
                const minEnd = endCounts.reduce((a, b) => Math.min(a, b), Number.MAX_VALUE)
                const delta = maxStart - minEnd;
                cheats.set(delta, (cheats.get(delta) ?? 0) + 1);
            }
        }
    }
    console.log([...cheats.entries()].toSorted((a, b) => Math.sign(a[0] - b[0])))
}
console.log("Advent of Code - 2024 - 20")
console.log("https://adventofcode.com/2024/day/20")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
// console.time("Stardata");
// console.log("Stardata")
// solve(starData);
// console.timeEnd("Stardata");
