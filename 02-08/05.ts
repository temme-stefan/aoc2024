import {exampleData, starData} from "./05-data";

const parse = (data: string) => {
    const [relationData, updateData] = data.split("\n\n");
    const updates = updateData.split("\n").map(r => r.split(",").map(x => parseInt(x)));
    const pairs = relationData.split("\n").map(r => r.split("|").map(x => parseInt(x)));
    const relation = new Map<number, Map<number, -1 | 1>>();
    const add = (a: number, b: number, order: -1 | 1) => {
        relation.set(a, relation.get(a) ?? new Map<number, -1 | 1>());
        relation.get(a).set(b, order);
    }
    pairs.forEach(([a, b]) => {
        add(a, b, -1);
        add(b, a, 1);
    })
    return {
        updates,
        relation
    }

}

const isOrdered = (row: number[], relation: Map<number, Map<number, -1 | 1>>) => {
    let ordered = true;
    for (let i = 1; i < row.length && ordered; i++) {
        const order = relation.get(row[i - 1])?.get(row[i]) ?? 0;
        ordered = order == -1;
    }
    return ordered;
}

const getMiddlePageNumberSum = (rows: number[][]) => {
    return rows.reduce((sum, row) => sum + row[Math.floor(row.length / 2)], 0);
}

const solve = (data: string) => {
    const {updates, relation} = parse(data);
    const {validUpdates,invalidUpdates} = Object.groupBy(updates,(row)=>isOrdered(row, relation)?"validUpdates":"invalidUpdates");
    const middlePageNumberSum = getMiddlePageNumberSum(validUpdates);
    console.log("Valid Middle Page Number Sums", middlePageNumberSum);
    invalidUpdates.forEach(row => row.sort((a, b) => relation.get(a).get(b)));
    const invalidMiddlePageNumberSum = getMiddlePageNumberSum(invalidUpdates);
    console.log("Fixed Invalid Middle Page Number Sums", invalidMiddlePageNumberSum);
}
console.log("Advent of Code - 2024 - 5")
console.log("https://adventofcode.com/2024/day/5")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
