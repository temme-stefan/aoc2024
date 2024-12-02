import {JSDOM} from "jsdom";
import 'dotenv/config';
import process from "node:process";

export async function getText(url) {
    const respInput = await fetch(url, {
        headers: {
            Cookie: `session=${process.env.SESSION_TOKEN}`
        }
    })
    const textInput = await respInput.text();
    return textInput;
}

export async function getExample(url) {
    const html = await getText(url);
    const {document} = (new JSDOM(html)).window;
    return [...document.querySelectorAll("pre>code")].filter(x=>(x.parentElement?.previousElementSibling?.textContent ?? "").endsWith("example:"))[0]?.textContent;
}