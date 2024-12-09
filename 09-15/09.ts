import {exampleData, starData} from "./09-data";

const parse = (data: string) => {
    return data.split("").map(x => parseInt(x));
}
const toFS = (representation: number[]) => {
    const fs: (string | number)[] = [];
    const add = (length: number, value: string | number) => {
        fs.push(...Array.from({length}).map(_ => value));
    }
    for (let i = 0; i < representation.length; i += 2) {
        const file = representation[i];
        const space = representation[i + 1] ?? 0;
        add(file, i / 2);
        add(space, ".");
    }
    return fs;
}
const toFS2 = (representation: number[]) => {
    const fs: ({ width: number, type: "file", id: number } | { width: number, type: "space" })[] = [];

    for (let i = 0; i < representation.length; i += 2) {
        const file = representation[i];
        const space = representation[i + 1] ?? 0;
        fs.push({width: file, type: "file", id: i / 2})
        fs.push({width: space, type: "space"});
    }
    trimFS2(fs);
    return fs;
}
const denseFS = (fs: (string | number)[]) => {
    let left = 0, right = fs.length - 1;
    while (left < right) {
        while (fs[left] != ".") {
            left++;
        }
        while (fs[right] == ".") {
            right--;
        }
        if (left < right) {
            [fs[left], fs[right]] = [fs[right], fs[left]];
        }
    }
}

const denseFS2 = (fs: ReturnType<typeof toFS2>) => {
    const files = fs.filter(block => block.type == "file").reverse();
    for (const file of files) {
        const removeFrom = fs.indexOf(file);
        const insertAt = fs.findIndex((s, i) => i < removeFrom && s.type == "space" && s.width >= file.width);
        if (insertAt >= 0) {
            const space = fs[insertAt];
            if (insertAt < removeFrom) {
                fs.splice(removeFrom, 1, {type: "space", width: file.width});
                fs.splice(insertAt, 0, file);
                space.width -= file.width;
            }
        }
        trimFS2(fs);
    }
}

const trimFS2 = (fs: ReturnType<typeof toFS2>) => {
    for (let i = 0; i < fs.length; i++) {
        if (fs[i].type == "space") {
            let redundantspaces = 0;
            let redundantWidth = 0;
            for (let j = 1; i + j < fs.length && fs[i + j].type == "space"; j++) {
                redundantspaces++;
                redundantWidth += fs[i + j].width;
            }
            fs[i].width += redundantWidth;
            fs.splice(i + 1, redundantspaces);
            if (fs[i].width == 0) {
                fs.splice(i, 1)
            }
        }
    }
}

const getCheckSum2 = (fs: ReturnType<typeof toFS2>) => {
    let sum = 0, innerIndex = 0;
    for (let i = 0; i < fs.length; i++) {
        const current = fs[i];
        for (let j = 0; j < current.width; j++) {
            if (current.type == "file") {
                sum += current.id * innerIndex;
            }
            innerIndex++;
        }
    }

    return sum;
}

const solve = (data: string) => {
    const parsed = parse(data);
    const fs = toFS(parsed);
    denseFS(fs);
    const fsChecksum = fs.filter(x => Number.isFinite(x)).reduce((sum: number, x: number, i) => sum + x * i, 0)
    console.log("fsCheckSum", fsChecksum);
    const fs2 = toFS2(parsed);
    denseFS2(fs2);
    const fsCheckSum2 = getCheckSum2(fs2);
    console.log("fsCheckSum2", fsCheckSum2);

}
console.log("Advent of Code - 2024 - 9")
console.log("https://adventofcode.com/2024/day/9")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
