import {exampleData, starData} from "./11-data";
import {bag} from "../reusable/bag";

const parse = (data: string) => data.split(" ").map(x => parseInt(x));

function doSingleStoneBlink(n: number) {
    const asString = `${n}`
    switch (true) {
        case n == 0:
            return [1];
        case asString.length % 2 == 0:
            return [asString.substring(0, asString.length / 2), asString.substring(asString.length / 2)].map(x => parseInt(x));
        default:
            return [n * 2024];
    }
}


const blink = (arrangement: number[], times: number) => {
    const count = bag<number>();
    count.incAll(arrangement);
    for (let i = 0; i < times; i++) {
        count.forEach((stone, stoneCount) => {
            const result = doSingleStoneBlink(stone);
            count.dec(stone, stoneCount);
            count.incAll(result, stoneCount);
        });
    }
    return count.values().reduce((a, b) => a + b, 0);

}


const solve = (data: string) => {
    const parsed = parse(data);
    const blink25 = blink(parsed, 25);
    console.log("after 25 times", blink25)
    const blink75 = blink(parsed, 75);
    console.log("after 75 times", blink75)
}
console.log("Advent of Code - 2024 - 11")
console.log("https://adventofcode.com/2024/day/11")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
