import {exampleData, starData} from "./07-data";

const parse = (data: string) => {
    return data.split("\n").map(row => {
        const [result, ...numbers] = row.split(/:? /).map(x => parseInt(x));
        return {result, numbers}
    });
}

const operations:((a:number,b:number)=>number)[] =[(a,b)=>a+b,(a,b)=>a*b,(a,b)=>Math.pow(10,Math.ceil(Math.log10(b+0.5)))*a+b]
const getValidCountForLine = ({result,numbers}:ReturnType<typeof parse>[0],operationcount=2)=>{
    const usedOperations = operations.filter((_,i)=>i<operationcount);
    const rows=[[...numbers]];
    let invalid = true;
    while (rows.length>0 && invalid){
        const current = rows.pop();
        if (current.length == 1){
            if (current[0]==result){
                invalid=false;
            }
        }
        else {
            const first = current.shift();
            usedOperations.map(op=>{
                const nextRow = [...current];
                nextRow[0] = op(first,nextRow[0]);
                if (nextRow[0]<=result) {
                    rows.push(nextRow);
                }
            })
        }
    }
    return !invalid;
}
const solve = (data: string) => {
    const parsed = parse(data);
    const calibrationResult = parsed.filter(r=>getValidCountForLine(r))
        .reduce((sum, {result})=>sum+result,0);
    console.log("Total calibration result",calibrationResult);
    const calibrationResult2 = parsed.filter(r=>getValidCountForLine(r,3))
        .reduce((sum, {result})=>sum+result,0);
    console.log("Total calibration result 2",calibrationResult2);
}
console.log("Advent of Code - 2024 - 7")
console.log("https://adventofcode.com/2024/day/7")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");

