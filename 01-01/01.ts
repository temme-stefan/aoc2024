import {exampleData, starData} from "./01-data";
import {bag} from "../reusable/bag";


const parseData = (data: string) => {
    const [left, right] = data.split("\n").reduce(([left, right]: number[][], row) => {
        const [l, r] = row.split("   ").map(s => parseInt(s));
        left.push(l);
        right.push(r);
        return [left, right]
    }, [[], []])
    left.sort((a, b) => Math.sign(a - b))
    right.sort((a, b) => Math.sign(a - b))
    return {left, right};
}


const solve = (data: string) => {
    const {left, right} = parseData(data);
    const distance = left.reduce((sum, l, i) => sum + Math.abs(l - right[i]), 0)
    console.log("total distance", distance);
    const rightBag = bag(right);
    const score = left.reduce((sum, l) => sum + l * (rightBag.get(l) ?? 0), 0)

    console.log("similarity score", score)

}
console.log("Advent of Code - 2024 - 1")
console.log("https://adventofcode.com/2024/day/1")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
