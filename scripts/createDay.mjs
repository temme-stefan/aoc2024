import process from 'node:process';
import path from 'node:path';
import {copyFile, mkdir, readFile, writeFile} from 'node:fs/promises';
import {constants} from 'node:fs';
import {getExample, getText} from "./getData.mjs";

const url = "https://adventofcode.com/t_year/day/t_day";
const input = `${url}/input`;
const year = 2024;
const myArgs = process.argv.slice(2);
let day;
if (myArgs.length === 0) {
    day = new Date().getDate();
} else {
    day = parseInt(myArgs[0]);
}
const padLeft = (day) => (day < 10 ? "0" : "") + day;
const firstSunday = 1;
const folderNumber = day <= firstSunday ? 0 : Math.floor((day - firstSunday-1) / 7) + 1;
const endOfWeek = Math.min(25, folderNumber * 7 + firstSunday);
const startOfWeek = Math.max(1, folderNumber * 7 + firstSunday - 6);

const folder = path.join('.', `${padLeft(startOfWeek)}-${padLeft(endOfWeek)}`)
const filenames = [`${padLeft(day)}.ts`, `${padLeft(day)}-data.ts`].map(f => path.join(folder, f));
const sources = ['template.ts', 'template-data.ts'].map(f => path.join('.', 'scripts', 'template', f))


const replacer = /(t_(day|padday|year|url|input|example)|template)/g;
const baseReplacer = (pattern) => {
    switch (pattern) {
        case "t_day":
            return day;
        case "template":
        case "t_padday":
            return padLeft(day);
        case "t_year":
            return year;
    }
};
const urlOfDay = url.replace(replacer, baseReplacer);
const inputUrl = input.replace(replacer, baseReplacer);

const textInput = await getText(inputUrl);
const exampleInput = await getExample(urlOfDay);
const doReplace = (pattern) => {
    switch (pattern) {
        case "t_url":
            return urlOfDay;
        case "t_input":
            return textInput.trim();
        case "t_example":
            return exampleInput.trim();
        default:
            return baseReplacer(pattern)
    }
}


try {
    await mkdir(folder, {recursive: true});
    await Promise.all(filenames.map((p, i) => copyFile(sources[i], p, constants.COPYFILE_EXCL)));
    console.log(`${filenames.length} files copied`);
    await Promise.all(filenames.map(async (f) => {

        const content = await readFile(f, 'utf8');
        writeFile(f, content.replace(replacer, doReplace), 'utf8');
    }));
    console.log(`${filenames.length} files modified`)
} catch (e) {
    console.error(e);
}

