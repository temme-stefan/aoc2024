import {exampleData, starData} from "./13-data";

const parse = (data: string) => {
    return data.split("\n\n").map(machineData => {
        const [a, b, prize] = machineData.split("\n")
            .map((row): { x: number, y: number } => {
                const match = /X.(\d+), Y.(\d+)/.exec(row);
                return {x: parseInt(match[1]), y: parseInt(match[2])};
            })
        return {a, b, prize}
    })
}

const findMinimum = (machine: ReturnType<typeof parse>[0], offset = 0) => {
    const {prize, a, b} = machine;
    const p = {x: prize.x + offset, y: prize.y + offset}
    //wolfram alpha
    //solve l (a_x,a_y)+ m (b_x,b_y)=(p_x,p_y) for l,m
    //l = -(b_y p_x - b_x p_y)/(a_y b_x - a_x b_y), m = -(a_x p_y - a_y p_x)/(a_y b_x - a_x b_y)
    const nA = -(b.y * p.x - b.x * p.y)
    const dA = a.y * b.x - a.x * b.y;

    const nB = -(a.x * p.y - a.y * p.x);
    const dB = a.y * b.x - a.x * b.y;

    if (nA % dA == 0 && nB % dB == 0) {
        //only integervalues are valid;
        const a = nA / dA;
        const b = nB / dB;
        const tokens = 3 * a + b;
        return {
            found: true,
            tokens
        }
    }
    return {
        found: false,
        tokens: 0
    }
}
const solve = (data: string) => {
    const machines = parse(data);
    const minima = machines.map(m => findMinimum(m));
    const fewestToGetAllPossible = minima.filter(r => r.found).reduce((sum, a) => sum + a.tokens, 0);
    console.log("Fewest Tokens", fewestToGetAllPossible, "count", minima.filter(r => r.found).length)
    const minima2 = machines.map(m => findMinimum(m, 10000000000000));
    const fewestToGetAllPossible2 = minima2.filter(r => r.found).reduce((sum, a) => sum + a.tokens, 0);
    console.log("Fewest Tokens2", fewestToGetAllPossible2, "count", minima2.filter(r => r.found).length)
}
console.log("Advent of Code - 2024 - 13")
console.log("https://adventofcode.com/2024/day/13")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
