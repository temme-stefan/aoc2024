import {exampleData, starData} from "./23-data";

type TNode = {
    name: string,
    adjacent: Set<TNode>
}
const parse = (data: string) => {
    const nodes = new Map<string, TNode>();
    data.split("\n").forEach(row => {
        const ns = row.split("-");
        const edgeNodes = ns.map(node => {
            if (!nodes.has(node)) {
                nodes.set(node, {name: node, adjacent: new Set()})
            }
            return nodes.get(node);
        });
        edgeNodes[0].adjacent.add(edgeNodes[1]);
        edgeNodes[1].adjacent.add(edgeNodes[0]);

    });
    return [...nodes.values()];
}

const toKey = (nodes: Iterable<TNode>) => [...nodes].map(n => n.name).sort().join(",");
const intersect = <T>(a: Set<T>, b: Set<T>) =>  new Set([...a].filter(t => b.has(t)))
const getAllCliques = (nodes : TNode[]) => {
    const foundCliques = [[],nodes.map(n=>new Set([n]))];
    let biggerFound = true;
    while (biggerFound) {
        const biggerCands: Set<TNode>[] = [];
        const added = new Set<string>();
        for (const current of foundCliques.at(-1)) {
            const commonNeighbours = [...current].reduce((a, c) => a == null ? c.adjacent : intersect(a, c.adjacent), null as Set<TNode>);
            for (const commonNeighbour of commonNeighbours) {
                const biggerCand = new Set(current);
                biggerCand.add(commonNeighbour);
                const key = toKey(biggerCand);
                if (!added.has(key)) {
                    added.add(key);
                    biggerCands.push(biggerCand);
                }
            }
        }
        biggerFound = biggerCands.length > 0;
        if (biggerFound) {
            foundCliques.push(biggerCands);
        }

    }
    return foundCliques;
}
const solve = (data: string) => {
    const nodes = parse(data);
    const cliques = getAllCliques(nodes);
    const size3 = cliques[3];
    console.log("Cliques of size 3, with a node starting with t", size3.filter(c => [...c].some(n => n.name.startsWith("t"))).length);
    const maxClique = cliques.at(-1);
    console.log("MaxClique Size", maxClique[0].size, "Code:", new Set(maxClique.map(c => toKey(c))));
}
console.log("Advent of Code - 2024 - 23")
console.log("https://adventofcode.com/2024/day/23")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
