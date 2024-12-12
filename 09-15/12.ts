import {exampleData, exampleData2, exampleData3, starData} from "./12-data";

type TCell = {
    i: number,
    j: number,
    val: string,
    neighbours: TCell[]
}
const parse = (data: string): TCell[][] => {
    const map: TCell[][] = data.split("\n").map((r, i) => r.split("").map((x, j) => ({i, j, val: x, neighbours: []})));
    map.flat().forEach(c => c.neighbours.push(...getNeighbours(map, c)));
    return map;
}

const getNeighbours = (map: TCell[][], cell: TCell) => {
    return [[-1, 0], [0, 1], [1, 0], [0, -1]]
        .map(([o_i, o_j]) => [cell.i + o_i, cell.j + o_j])
        .filter(([c_i, c_j]) => c_i >= 0 && c_j >= 0 && c_i < map.length && c_j < map[c_i].length)
        .map(([i, j]) => map[i][j])
}

const getRegions = (map: TCell[][]) => {
    const unassignedNodes = new Set(map.flat());
    const regions: Set<TCell>[] = [];
    while (unassignedNodes.size > 0) {
        const nextCells = new Set<TCell>([unassignedNodes.values().next().value]);
        const region = new Set<TCell>();
        while (nextCells.size > 0) {
            const current: TCell = nextCells.values().next().value;
            region.add(current);
            unassignedNodes.delete(current);
            nextCells.delete(current);
            current.neighbours.filter(n => n.val == current.val && unassignedNodes.has(n) && !region.has(n)).forEach(n => nextCells.add(n))
        }
        regions.push(region);
    }
    return regions;
}

const getPerimeter = (region: Set<TCell>) => {
    return [...region].reduce((sum, cell) => sum + 4 - cell.neighbours.filter(n => cell.val == n.val).length, 0)
}
const getSides = (region: Set<TCell>, map: TCell[][]) => {
    const region_filterable = [...region];
    const leftBordered = region_filterable.filter(r => r.j == 0 || r.val != map[r.i][r.j - 1].val);
    const rightBordered = region_filterable.filter(r => r.j == map[0].length - 1 || r.val != map[r.i][r.j + 1].val);
    const topBordered = region_filterable.filter(r => r.i == 0 || r.val != map[r.i - 1][r.j].val);
    const bottomBordered = region_filterable.filter(r => r.i == map.length - 1 || r.val != map[r.i + 1][r.j].val);
    const getVerticalCount = (verticalBordered: TCell[]) => {
        let sideCount = 0;
        [...Map.groupBy(verticalBordered, c => c.j).values()].forEach(group => {
            group.sort((a, b) => Math.sign(a.i - b.i));
            let side = [group[0]]
            sideCount++;
            for (let i = 1; i < group.length; i++) {
                const current = group[i];
                if (side.at(-1).i != current.i - 1) {
                    //not adjacent => new Side
                    side.length = 0;
                    sideCount++
                }
                side.push(current)
            }
        })
        return sideCount;
    }
    const getHorizontalCount = (horizontalBordered: TCell[]) => {
        let sideCount = 0;
        [...Map.groupBy(horizontalBordered, c => c.i).values()].forEach(group => {
            group.sort((a, b) => Math.sign(a.j - b.j));
            let side = [group[0]]
            sideCount++;
            for (let i = 1; i < group.length; i++) {
                const current = group[i];
                if (side.at(-1).j != current.j - 1) {
                    //not adjacent => new Side
                    side.length = 0;
                    sideCount++
                }
                side.push(current)
            }
        })
        return sideCount;
    }
    return getHorizontalCount(topBordered) + getHorizontalCount(bottomBordered) + getVerticalCount(leftBordered) + getVerticalCount(rightBordered);
}
const solve = (data: string) => {
    const map = parse(data);
    const regions = getRegions(map);
    const totalPriceByPerimeter = regions.reduce((sum, r) => sum + getPerimeter(r) * r.size, 0)
    console.log("TotalPriceByPerimeter", totalPriceByPerimeter);
    const totalPriceBySides = regions.reduce((sum, r) => sum + getSides(r,map) * r.size, 0)
    console.log("TotalPriceBySides", totalPriceBySides);
}
console.log("Advent of Code - 2024 - 12")
console.log("https://adventofcode.com/2024/day/12")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Example2");
console.log("Example2")
solve(exampleData2);
console.timeEnd("Example2")
console.time("Example3");
console.log("Example3")
solve(exampleData3);
console.timeEnd("Example3")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
