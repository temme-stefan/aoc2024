import {exampleData, exampleData2, starData} from "./24-data";

const parse = (data: string) => {
    const [terminalData, actionData] = data.split("\n\n").map(r => r.split("\n"));
    const system = new Map<string, () => boolean>();
    const evaluated = new Map<string, boolean>;
    terminalData.forEach((r => {
        const match = /(.{3}): (0|1)/.exec(r);
        evaluated.set(match[1], match[2] == "1");
        system.set(match[1], () => evaluated.get(match[1]));
    }))
    actionData.forEach((r => {
        const match = /(.{3}) (AND|XOR|OR) (.{3}) -> (.{3})/.exec(r);
        let action = () => false;
        switch (match[2]) {
            case "AND":
                action = () =>  system.get(match[1])() && system.get(match[3])()
                break;
            case "XOR":
                action = () =>  system.get(match[1])() != system.get(match[3])()
                break;
            case "OR":
                action = () =>  system.get(match[1])() || system.get(match[3])()
                break;
        }
        system.set(match[4], action);
    }));
    return system;
}


const getNumber = (präfix: string, system: Map<string, () => boolean>) => {
    const output = [...system.keys()].filter(k => k.startsWith(präfix)).toSorted().reverse();
    const binär = output.map(k => system.get(k)() ? "1" : "0").join("");
    const number = parseInt(binär, 2);
    return {number, binär};
}
const solve = (data: string) => {
    const system = parse(data);
    const number = getNumber("z", system).number;
    console.log("Output", number);
}

const solve2 = (data: string) => {
    const system = parse(data);
    console.log(getNumber("x", system));
    console.log(getNumber("y", system));
    console.log(getNumber("z", system));
    console.log([...system.keys()].filter(k => !k.startsWith("x") && !k.startsWith("y")).length);
}
console.log("Advent of Code - 2024 - 24")
console.log("https://adventofcode.com/2024/day/24")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Example2");
console.log("Example2")
solve(exampleData2);
solve2(exampleData2);
console.timeEnd("Example2")
console.time("Stardata");
console.log("Stardata")
solve(starData);
solve2(starData);
console.timeEnd("Stardata");
