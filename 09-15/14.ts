import {exampleData, starData} from "./14-data";

type TRobot = {
    position: [number, number],
    direction: [number, number]
}

const parse = (data: string): TRobot[] => {
    return data.split("\n").map(row => {
        const [_, ...numbers] = /p=(\d+),(\d+) v=(-?\d+),(-?\d+)/.exec(row);
        const parsed = numbers.map(x => parseInt(x))
        return {position: [parsed[0], parsed[1]], direction: [parsed[2], parsed[3]]}
    })
}

const moveRobot = (robot: TRobot, seconds: number, width: number, height: number): TRobot => {
    const newX = (robot.position[0] + seconds * (width + robot.direction[0])) % width;
    const newY = (robot.position[1] + seconds * (height + robot.direction[1])) % height;
    return {
        position: [newX, newY],
        direction: [...robot.direction]
    }
}

const countMap = (robots: TRobot[], width: number, height: number) => {
    const map = Array.from({length: height}).map(() => Array.from({length: width}).map(() => 0));
    robots.forEach(r => {
        map[r.position[1]][r.position[0]]++;
    })
    return map;
}

const printMap = (map: number[][]) => {
    return map.map(r => r.map(x => x == 0 ? " " : "#").join("")).join(" \n")
}

function getQuadrantCount(moved: TRobot[], colSplit: number, rowSplit: number) {
    const quads = [0, 0, 0, 0];
    for (const tRobot of moved) {
        switch (true) {
            case tRobot.position[0] < colSplit && tRobot.position[1] < rowSplit:
                quads[0]++
                break;
            case tRobot.position[0] > colSplit && tRobot.position[1] < rowSplit:
                quads[1]++
                break;
            case tRobot.position[0] > colSplit && tRobot.position[1] > rowSplit:
                quads[2]++
                break;
            case tRobot.position[0] < colSplit && tRobot.position[1] > rowSplit:
                quads[3]++
                break;
            default:
                break;
        }
    }
    return quads;
}

function getMoved(robots: TRobot[], steps: number, width: number, height: number) {
    return robots.map(r => moveRobot(r, steps, width, height));
}

const solve = (data: string, width: number, height: number) => {
    const robots = parse(data);
    const steps = 100;
    const moved = getMoved(robots, steps, width, height);
    const colSplit = Math.floor(width / 2);
    const rowSplit = Math.floor(height / 2);
    const quads = getQuadrantCount(moved, colSplit, rowSplit);
    console.log("SafetyFactor", quads.reduce((a, b) => a * b));
    //after width*height every robot is back to its position (look at moveRobot)
    const candidates = []
    for (let i = 0; i < width * height && candidates.length==0; i++) {
        const map = countMap(getMoved(robots, i, width, height), width, height);
        const someLongPattern = map.some(r => {
            let length = 0;
            for (let j = 0; j < r.length && length < 7; j++) {
                if (r[j]>0){
                    length++
                }
                else{
                    length=0;
                }
            }
            return length == 7;
        })
        if (someLongPattern) {
            candidates.push([printMap(map), i]);
        }
    }
    for (const [image, step] of candidates) {
        console.log(`--------------- ${step} ------------------`)
        console.log(image);
    }

}
console.log("Advent of Code - 2024 - 14")
console.log("https://adventofcode.com/2024/day/14")
console.time("Example");
console.log("Example")
solve(exampleData, 11, 7);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData, 101, 103);
console.timeEnd("Stardata");
