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
    const boxes = new Map<TCell, TCell[]>();
    const map: TCell[][] = mapData.split("\n").map((row, i) => row.split("").map((v, j) => {
        const isBox = v == box;
        const isWall = v == wall;
        if (v == robotText) {
            robot = {i, j, isBox, isWall}
        }
        const cell = {i, j, isBox, isWall};
        if (isBox) {
            boxes.set(cell, [cell]);
        }
        return cell;
    }))

    const operations = operationData.split("\n").map(r => r.split("") as (keyof typeof dirs)[]).flat();
    return {robot, map, operations, boxes}
}
const parse2 = (data: string) => {
    const [mapData, operationData] = data.split("\n\n");

    let robot: TCell;
    const boxes = new Map<TCell, TCell[]>();
    const map: TCell[][] = mapData.split("\n").map((row, i) => row.split("").map((v, j) => {
            const isBox = v == box;
            const isWall = v == wall;
            if (v == robotText) {
                robot = {i, j: 2 * j, isBox, isWall}
            }
            const cells = [
                {i, j: 2 * j, isBox, isWall},
                {i, j: 2 * j + 1, isBox, isWall}
            ];
            if (isBox) {
                cells.forEach(c => {
                    boxes.set(c, cells);
                });
            }
            return cells;
        }).flat()
    )

    const operations = operationData.split("\n").map(r => r.split("") as (keyof typeof dirs)[]).flat();
    return {robot, map, operations, boxes}
};
const print = (map: TCell[][], robot: TCell, doubled = false) => {
    let i = 0
    const b = () => doubled ? ["[", "]"][i++ % 2] : box;
    const letters = map.map(r => r.map(c => c.isWall ? wall : c.isBox ? b() : c.i == robot.i && c.j == robot.j ? robotText : ".").join("")).join("\n")
    console.log(letters);
}

const step2 = (map: TCell[][], robot: TCell, operation: keyof typeof dirs, boxes: Map<TCell, TCell[]>) => {
    const dir = dirs[operation];
    let movedBoxes = new Set<TCell[]>();
    const checkAhead = (ahead: TCell[]) => {
        let boxesAhead = ahead.filter(s => s.isBox);
        let wallsAhead = ahead.filter(s => s.isWall);
        return {boxesAhead, wallsAhead}
    }
    const getNext = (cell: TCell) => map[cell.i + dir[0]][cell.j + dir[1]];
    let {boxesAhead, wallsAhead} = checkAhead([getNext(robot)]);
    while (boxesAhead.length > 0 && wallsAhead.length == 0) {
        const boxcellsToBoxes = boxesAhead.map(b => boxes.get(b));
        boxcellsToBoxes.forEach(b => movedBoxes.add(b));
        const allBoxcells = new Set(boxcellsToBoxes.flat());
        const ahead = [...allBoxcells].map(getNext).filter(c => !allBoxcells.has(c));
        const check = checkAhead(ahead);
        boxesAhead = check.boxesAhead;
        wallsAhead = check.wallsAhead;
    }
    if (wallsAhead.length == 0) {
        //free
        for (const b of [...movedBoxes].reverse()) {
            const f = b.map(getNext);
            b.forEach(b1 => {
                b1.isBox = false;
                boxes.delete(b1);
            });
            f.forEach(f1 => {
                f1.isBox = true;
                boxes.set(f1, f);
            });
        }
        robot.i += dir[0];
        robot.j += dir[1];
    }
}

const solve = (data: string, secondPass = false) => {
    const {map, robot, operations, boxes} = parse(data);
    const score = computeScore(operations, map, robot, boxes);
    console.log("GPS Score I", score);
    if (secondPass) {
        const {map, robot, operations, boxes} = parse2(data);
        const score = computeScore(operations, map, robot, boxes);
        console.log("GPS Score II", score);
    }
}

const computeScore = (operations: (keyof typeof dirs)[], map: TCell[][], robot: TCell, boxes: Map<TCell, TCell[]>) => {
    // print(map, robot, true);
    for (const operation of operations) {
        // console.log(operation)
        step2(map, robot, operation, boxes);
        // print(map,robot,true)
    }
    const score = [...new Set(boxes.values())].map(c => c.reduce((a, b) => Math.min(a, b.i), Number.MAX_VALUE) * 100 + c[0].j).reduce((a, b) => a + b, 0);
    return score;
}

console.log("Advent of Code - 2024 - 15")
console.log("https://adventofcode.com/2024/day/15")
console.time("Example small");
console.log("Example small (2028)")
solve(exampleData_small);
console.timeEnd("Example small")

console.time("Example");
console.log("Example (10092)")
solve(exampleData, true);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData, true);
console.timeEnd("Stardata");
