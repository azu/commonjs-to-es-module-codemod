import { defineTest } from "jscodeshift/dist/testUtils";
import fs from "fs";
import path from "path"

export function defineTests(dirName, transformName) {
    const inputFileSuffixRegex = /\.input\.js$/i;
    const tests = fs.readdirSync(path.resolve(dirName, "../__testfixtures__", transformName))
        .filter(fileName => inputFileSuffixRegex.test(fileName))
        .map(fileName => fileName.replace(inputFileSuffixRegex, ''));

    tests.forEach((test) => {
            defineTest(dirName, transformName, {
                silent: true
            }, `${transformName}/${test}`);
        });
}
