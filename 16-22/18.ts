import {exampleData, starData} from "./18-data";

const parse = (data: string) => data.split("\n").map(r => r.split(",").map(x => parseInt(x)))

type TCell = { i: number, j: number, isCorrupted: boolean }
const getNeighbours = (map: TCell[][], cell:TCell) => {
    return [[-1, 0], [0, 1], [1, 0], [0, -1]]
        .map(([o_i, o_j]) => [cell.i + o_i, cell.j + o_j])
        .filter(([c_i, c_j]) => c_i >= 0 && c_j >= 0 && c_i < map.length && c_j < map[c_i].length)
        .map(([i, j]) => map[i][j])
}

const print = (map: TCell[][]) => {
    console.log(map.map(r => r.map(c => c.isCorrupted ? "#" : ".").join("")).join("\n"));
}

const sssp = (start:TCell,end:TCell,map:TCell[][])=>{
    const visited:number[][] = Array.from(map).map(r=>Array.from(r).map(_=>null));
    const nodes = [end];
    visited[end.i][end.j]=0;
    while (nodes.length>0 && visited[start.i][start.j]==null){
        const current = nodes.shift();
        getNeighbours(map,current).filter(c=>!c.isCorrupted && visited[c.i][c.j]==null).forEach(c=>{
            nodes.push(c);
            visited[c.i][c.j] = visited[current.i][current.j]+1
        })
    }
    return visited[start.i][start.j];
}
const createMap = (space: number) => {
    return Array.from({length: space}).map(
        (_, i) => Array.from({length: space}).map(
            (_, j) => ({i, j, isCorrupted: false})
        )
    );
}

const corruptCell = (map: TCell[][], b: number[]) => {
    map[b[1]][b[0]].isCorrupted = true;
}
const corruptCells = (steps:number, bytes: number[][], map: TCell[][]) => {
    for (let i = 0; i < steps; i++) {
        const b = bytes[i];
        corruptCell(map, b);
    }
}
const solve = (data: string, space: number, steps:number) => {
    const bytes = parse(data);
    const map = createMap(space);
    corruptCells(steps, bytes, map);
    let shortestPathLength = sssp(map[0][0],map[space-1][space-1],map);
    console.log("shortestPathLength",shortestPathLength);
    let i=steps;
    while (shortestPathLength!=null && i<bytes.length){
        corruptCell(map,bytes[i]);
        shortestPathLength = sssp(map[0][0],map[space-1][space-1],map);
        i++;
    }
    console.log("Path blocked after",bytes[i-1], i-1);
}
console.log("Advent of Code - 2024 - 18")
console.log("https://adventofcode.com/2024/day/18")
console.time("Example");
console.log("Example")
solve(exampleData, 7,12);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData, 71,1024);
console.timeEnd("Stardata");
