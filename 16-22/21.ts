import {exampleData, starData} from "./21-data";

const keypads ={
    numeric:`789
456
123
.0A`,
    directional:`.^A
<v>`
};



const solve = (data: string) => {

}
console.log("Advent of Code - 2024 - 21")
console.log("https://adventofcode.com/2024/day/21")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
