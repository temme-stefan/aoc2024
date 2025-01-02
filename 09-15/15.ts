import {exampleData, exampleData_small, starData} from "./15-data";

const wall = "#";
const box = "O"
const robotText = "@"
const dirs = {
    "<": [0, -1],
    ">": [0, 1],
    "^": [-1, 0],
    "v": [1, 0]
}

type TCell = { i: number, j: number, isBox: boolean, isWall: boolean }
const parse = (data: string) => {
    const [mapData, operationData] = data.split("\n\n");

    let robot: TCell;
    const map: TCell[][] = mapData.split("\n").map((row, i) => row.split("").map((v, j) => {
        const isBox = v == box;
        const isWall = v == wall;
        if (v == robotText) {
            robot = {i, j, isBox, isWall}
        }
        return {i, j, isBox, isWall}
    }))

    const operations = operationData.split("\n").map(r => r.split("") as (keyof typeof dirs)[]).flat();
    return {robot, map, operations}
}

const print = (map: TCell[][], robot: TCell) => {
    const letters = map.map(r => r.map(c => c.isWall ? wall : c.isBox ? box : c.i == robot.i && c.j == robot.j ? robotText : ".").join("")).join("\n")
    console.log(letters);
}
const step = (map: TCell[][], robot: TCell, operation: keyof typeof dirs) => {
    const dir = dirs[operation];
    let ahead = map[robot.i + dir[0]][robot.j + dir[1]];
    while (ahead.isBox) {
        ahead = map[ahead.i + dir[0]][ahead.j + dir[1]];
    }
    if (!ahead.isWall) {
        //free
        while (ahead.i != robot.i || ahead.j != robot.j) {
            const back = map[ahead.i - dir[0]][ahead.j - dir[1]];
            ahead.isBox = back.isBox;
            ahead = back;
        }
        robot.i += dir[0];
        robot.j += dir[1];
    }
}

const solve = (data: string) => {
    const {map, robot, operations} = parse(data);
    // print(map,robot);
    for (const operation of operations) {
        // console.log(operation)
        step(map, robot, operation);
        // print(map,robot)
    }
    const score = map.flat().filter(c => c.isBox).map(c => c.i * 100 + c.j).reduce((a, b) => a + b, 0);
    console.log("GPS Score", score);
}

const parse2 = (data: string) => {
    const [mapData, operationData] = data.split("\n\n");

    let robot: TCell;
    const boxes = new Map<TCell,TCell[]>();
    const map: TCell[][] = mapData.split("\n").map((row, i) => row.split("").map((v, j) => {
            const isBox = v == box;
            const isWall = v == wall;
            if (v == robotText) {
                robot = {i: 2 * i, j, isBox, isWall}
            }
            const cells = [
                {i: 2 * i, j, isBox, isWall},
                {i: 2 * i + 1, j, isBox, isWall}
            ];
            if (isBox){
                boxes
            }
            return cells;
        }).flat()
    )

    const operations = operationData.split("\n").map(r => r.split("") as (keyof typeof dirs)[]).flat();
    return {robot, map, operations}
};
const solve2 = (data: string) => {
    const parsed = parse2(data);
}
console.log("Advent of Code - 2024 - 15")
console.log("https://adventofcode.com/2024/day/15")
console.time("Example small");
console.log("Example small (2028)")
solve(exampleData_small);
console.timeEnd("Example small")

console.time("Example");
console.log("Example (10092)")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
