import {exampleData, exampleData2, starData} from "./22-data";

const mix = (number: bigint, secret: bigint) => {
    return number ^ secret;
};

const prune = (number: bigint) => {
    return number % 16777216n;
};


const next = (n: bigint) => {
    n = prune(mix(n * 64n, n));
    n = prune(mix(n / 32n, n));
    n = prune(mix(n * 2048n, n));
    return n;
}

const parse = (data: string) => {
    return data.split("\n").map(n => BigInt(n));
}
const getSequencePrice = (numbers: bigint[]) => {
    const prices = numbers.map((p) => Number(p % 10n));
    const delta: number[] = [];
    for (let i = 1; i < prices.length; i++) {
        delta.push(prices[i] - prices[i - 1]);
    }
    const sequence = new Map<string, number>();
    for (let i = 4; i < prices.length; i++) {
        const s = [delta[i - 4], delta[i - 3], delta[i - 2], delta[i - 1]].join(",");
        if (!sequence.has(s)) {
            sequence.set(s, prices[i]);
        }
    }
    return sequence;
}
const iterateTimes = (n: bigint, times: number) => {
    const numbers = [n];
    for (let i = 0; i < times; i++) {
        numbers.push(next(numbers.at(-1)));
    }
    return numbers;
}
const union = <T>(a: Set<T>, b: Set<T>) =>  new Set([...a,...b])
const solve = (data: string) => {
    const initialSecretNumbers = parse(data);
    const numberSequences = initialSecretNumbers.map(n => iterateTimes(n, 2000));
    const sum = numberSequences.reduce((a, c) => a + c.at(-1), 0n)
    console.log("numbers after2k sum", sum);
}
const solve2 = (data:string)=>{
    const initialSecretNumbers = parse(data);
    console.time("solve2")
    const numberSequences = initialSecretNumbers.map(n => iterateTimes(n, 2000));
    console.timeLog("solve2","create Map")
    const sequenceData = numberSequences.map(getSequencePrice);
    console.timeLog("solve2","find all Sequences")
    const allSequences = sequenceData.map(s=>new Set(s.keys())).reduce((a,b)=>union(a,b));
    console.timeLog("solve2","found sequences",allSequences.size)
    let max = 0;
    let sequence = "";
    for (const s of allSequences) {
        const bananas = sequenceData.reduce((a,map)=>a+(map.get(s)??0),0)
        if (bananas>max){
            max=bananas;
            sequence=s;
        }
    }
    console.log("bananas",max,"sequence",sequence);
    console.timeEnd("solve2")
}

// const s = iterateTimes(123n,10)
// const pS = getSequencePrice(s);
// console.log(s);
// console.log(pS);

console.log("Advent of Code - 2024 - 22")
console.log("https://adventofcode.com/2024/day/22")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
console.time("Example2");
console.log("Example2")
solve2(exampleData2);
console.timeEnd("Example2")
console.time("Stardata2");
console.log("Stardata2")
solve2(starData);
console.timeEnd("Stardata2");
