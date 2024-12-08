import {exampleData, starData} from "./08-data";

const parse = (data: string) => {
    const cells = data.split("\n").map(
        (r, i) => r.split("").map(
            (val, j) => ({val, i, j})
        )
    );
    const antennas = Map.groupBy(cells.flat().filter(c => c.val != ".")
        , c => c.val);
    const map = cells.map(r => r.map(_ => [] as string[]));
    return {cells, map, antennas};
}

const mapAntinodes = ({antennas, map}: ReturnType<typeof parse>, singleStep = true) => {
    antennas.forEach((currentAntennas, antennasKey) => {
        const pairs = currentAntennas.map((a, i) => currentAntennas.filter((b, j) => i < j)
            .map(b => [a, b] as [typeof currentAntennas[0], typeof currentAntennas[0]])
        ).flat();
        const inBounds = ({i, j}: { i: number, j: number }) => 0 <= i && 0 <= j && i < map.length && j < map[i].length;
        for (const [a, b] of pairs) {
            const delta = {i: a.i - b.i, j: a.j - b.j};
            const coords = []
            let step = singleStep?1:0;
            let someValid = true;
            while (singleStep && step == 1 || !singleStep && someValid) {
                const cands = [
                    {i: a.i + step * delta.i, j: a.j + step * delta.j},
                    {i: b.i - step * delta.i, j: b.j - step * delta.j}
                ].filter(inBounds);
                someValid = cands.length>0;
                coords.push(...cands)
                step++;
            }
            coords.forEach(({i, j}) => map[i][j].push(antennasKey))
        }
    });
}
const solve = (data: string) => {
    const parsed = parse(data);
    mapAntinodes(parsed);
    const locationWithAntinode = parsed.map.flat().filter(x => x.length > 0).length;
    console.log("location with antinode", locationWithAntinode)
    mapAntinodes(parsed,false);
    const locationWithAntinodeHarmonic = parsed.map.flat().filter(x => x.length > 0).length;
    console.log("location with antinode harmonic", locationWithAntinodeHarmonic)

}
console.log("Advent of Code - 2024 - 8")
console.log("https://adventofcode.com/2024/day/8")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
