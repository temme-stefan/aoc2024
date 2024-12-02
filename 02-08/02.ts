import {exampleData, starData} from "./02-data";
const parse = (data:string)=>{
    return data.split("\n").map(report=>report.split(" ").map(x=>parseInt(x)))
}
const isReportSafe = (report:number[])=>{
    if (report.length<1){
        return true
    }
    let delta = report[0]-report[1];
    let deltaAbs = Math.abs(delta);
    let safe =  1<=deltaAbs && deltaAbs<=3;
    let allCheck= Math.sign(delta);
    for (let i=2; i< report.length && safe;i++){
        delta = report[i-1]-report[i];
        deltaAbs = Math.abs(delta);
        safe = Math.sign(delta)==allCheck && 1<=deltaAbs && deltaAbs<=3
    }
    return safe;
}

const isDampenedSafe = (report:number[])=>{
    if (isReportSafe(report)){
        return true;
    }
    return report.map((_,i)=>report.toSpliced(i,1)).some(isReportSafe);

}

const solve = (data: string) => {
    const parsed = parse(data);
    const safe = parsed.filter(isReportSafe);
    console.log("Save reports",safe.length);
    const dampenedSafe = parsed.filter(isDampenedSafe);
    console.log("Dampened save reports",dampenedSafe.length);

}
console.log("Advent of Code - 2024 - 2")
console.log("https://adventofcode.com/2024/day/2")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
