import {exampleData, exampleData2, starData} from "./17-data";

const parse = (data: string) => {
    const [registerData, programData] = data.split("\n\n");
    const register = new Map(registerData.split("\n").map(r => {
        const match = /Register (.): (\d+)/.exec(r);
        return [match[1], parseInt(match[2])]
    }));
    const program = programData.split(" ")[1].split(",").map(x => parseInt(x));
    return {register, program}
}

const toState = (program: number[], register: Map<string, number>) => {
    return {
        register: new Map(register),
        program: [...program],
        counter: 0,
        output: []
    }
}

const walkProgram = ({
                         register,
                         program,
                         counter,
                         output
                     }: ReturnType<typeof toState>, breakOnProgramLength = false) => {
    while (counter < program.length && (!breakOnProgramLength || output.length < program.length)) {
        const instruction = program[counter];
        const operand = program[counter + 1];
        const getComboValue = () => {
            switch (operand) {
                case 0:
                case 1:
                case 2:
                case 3:
                    return operand;
                case 4:
                    return register.get("A")
                case 5:
                    return register.get("B")
                case 6:
                    return register.get("A")
                case 7:
                    throw "should not happen"
            }
        }
        switch (instruction) {
            case 0:
                register.set("A", Math.floor(register.get("A") / Math.pow(2, getComboValue())));
                break;
            case 1:
                register.set("B", register.get("B") ^ operand);
                break;
            case 2:
                register.set("B", getComboValue() % 8);
                break;
            case 3:
                if (register.get("A") != 0) {
                    counter = operand;
                    continue;
                }
                break;
            case 4:
                register.set("B", register.get("B") ^ register.get("C"));
                break;
            case 5:
                output.push(getComboValue() % 8);
                break;
            case 6:
                register.set("B", Math.floor(register.get("A") / Math.pow(2, getComboValue())));
                break;
            case 7:
                register.set("C", Math.floor(register.get("A") / Math.pow(2, getComboValue())));
                break;
        }
        counter += 2;

    }
}
const solve = (data: string) => {
    const parsed = parse(data);
    const state = toState(parsed.program, parsed.register)
    walkProgram(state);
    console.log("Output", state.output.join(","));
    // let i = Math.pow(2,3*parsed.program.length)-2;
    // let j = 0;
    // let equals = false;
    // do {
    //     i++;
    //     const s = toState(parsed.program, parsed.register);
    //     s.register.set("A", i);
    //     walkProgram(s, true);
    //     equals = s.program.length == s.output.length && s.program.every((p, i) => p == s.output[i]);
    //     const newJ = s.output.length;
    //
    // } while (!equals && j<=parsed.program.length);
    // console.log("Equals after", equals?i:"not found");
}
console.log("Advent of Code - 2024 - 17")
console.log("https://adventofcode.com/2024/day/17")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Example2");
console.log("Example2")
solve(exampleData2);
console.timeEnd("Example2")

console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
