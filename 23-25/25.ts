import {exampleData, starData} from "./25-data";

const parse = (data: string) => {
    const keys: number[][] = [];
    const locks: number[][] = [];
    data.split("\n\n").forEach(lockKeyData => {
        const isLock = lockKeyData[0] == "#";
        const rows = lockKeyData.split("\n");
        const scheme: number[] = Array.from(rows[0]).map(_ => null);
        const breakChar = isLock ? "." : "#";
        for (let j = 0; j < scheme.length; j++) {
            if (scheme[j] == null) {
                let i=0;
                while (i<rows.length && scheme[j]==null){
                    if (rows[i+1][j] == breakChar){
                        scheme[j]=isLock?i:5-i;
                    }
                    i++;
                }
            }
        }
        (isLock?locks:keys).push(scheme);
    })
    return {keys,locks};
}

const match = (key:number[],lock:number[],matchPin:(key:number,lock:number)=>boolean)=>{
    return lock.every((pin,i)=>matchPin(pin,key[i]));
}
const solve = (data: string) => {
    const  {keys,locks}=parse(data);
    let count = 0;
    for (const key of keys) {
        for (const lock of locks) {
            if (match(key,lock,(a,b)=>a+b<=5)){
                count++;
            }
        }
    }
    console.log("matching",count);
}
console.log("Advent of Code - 2024 - 25")
console.log("https://adventofcode.com/2024/day/25")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
