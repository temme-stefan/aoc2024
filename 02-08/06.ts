import {exampleData, starData} from "./06-data";


const facing = {
    up: Symbol(),
    right: Symbol(),
    down: Symbol(),
    left: Symbol()
}
type TDirection = typeof facing[keyof typeof facing];
const order: TDirection[] = [facing.up, facing.right, facing.down, facing.left];
const parseOrder = ["^", ">", "v", "<"]
const offsets = new Map([[-1, 0], [0, 1], [1, 0], [0, -1]].map((x, i) => [order[i], x]));

type TCell = { isObstacle: boolean, isFree: boolean, x: number, y: number }
type TGuard = { x: number, y: number, direction: TDirection }
const parse = (data: string) => {
    let guard: TGuard;
    const cells: TCell[][] = data.split("\n").map((row, i) => row.split("").map((cell, j) => {
        const isGuard = parseOrder.indexOf(cell);
        if (isGuard >= 0) {
            guard = {
                x: i,
                y: j,
                direction: order[isGuard]
            }
        }
        const isObstacle = cell == "#";
        return {
            isObstacle,
            isFree: !isObstacle,
            x: i,
            y: j
        }
    }));
    return {
        guard, cells
    }
}


const getVorne = (guard: TGuard, cells: TCell[][]) => {
    const offset = offsets.get(guard.direction);
    return cells[guard.x + offset[0]]?.[guard.y + offset[1]];
}
const move = (guard: TGuard, to: TCell) => {
    guard.x = to.x;
    guard.y = to.y;
}

const getTurnedDirection = (old: TDirection) => {
    return order[(order.indexOf(old) + 1) % 4];
}

const turn = (guard: TGuard) => {
    guard.direction = getTurnedDirection(guard.direction);
}

const proceed = (guard: TGuard, cells: TCell[][], placeObstacle: boolean) => {
    const guardCell = cells[guard.x][guard.y];
    const guardClone = {...guard};
    const dirVisited = new Map(order.map(o => [o, new Set<TCell>()]));
    let current = guardCell;
    let circle = false;
    let obstacles = new Set<TCell>();
    let obstaclesChecked = new Set<TCell>();
    do {
        let next = getVorne(guardClone, cells);
        if (dirVisited.get(guardClone.direction).has(current)) {
            circle = true;
            break;
        }
        dirVisited.get(guardClone.direction).add(current);
        while (next?.isObstacle) {
            turn(guardClone);
            dirVisited.get(guardClone.direction).add(current);
            next = getVorne(guardClone, cells);
        }
        if (next != null) {
            if (placeObstacle && next != guardCell && !obstaclesChecked.has(next)) {
                obstaclesChecked.add(next);
                next.isObstacle = !next.isObstacle
                next.isFree = !next.isFree
                const currentToGuard = {x: current.x, y: current.y, direction: guardClone.direction}
                const result = proceed(guard, cells, false);
                if (result.circle) {
                    obstacles.add(next);
                }
                next.isObstacle = !next.isObstacle
                next.isFree = !next.isFree
            }
            move(guardClone, next);

        }
        current = next;
    } while (current != null)
    return {circle, count: new Set([...dirVisited.values()].map(set => [...set]).flat()).size, obstacles};
}
const solve = (data: string) => {
    const {guard, cells} = parse(data);
    const {count, obstacles} = proceed(guard, cells, true);
    console.log("Visted Cells", count);
    console.log("MaybeObstacle", obstacles.size);
}
console.log("Advent of Code - 2024 - 6")
console.log("https://adventofcode.com/2024/day/6")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
