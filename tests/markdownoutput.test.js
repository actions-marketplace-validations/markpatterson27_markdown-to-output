const { test, expect, beforeEach } = require('@jest/globals');
const { readTextFile, parseTemplate, parseMatter } = require('../src/markdownoutput');

const testContent = {
    noFM: "This is some text without front matter content.",
    basicFM: `---
title: Front Matter Test
type: basic attributes and body match
---
This is some text that includes front matter content.`,
    specialChars: `---
t!tle: Front Matter Test
type: special characters match 'n stuff
🌎 ground control: lift-off 🚀
---
This is some text that includes '$pecial characters'.

And multiple lines.`,
    project: `---
title: 'Launch :rocket:'
columns: 'To do, In progress, Done'
---

Tasks to complete before initial release.
`
}

// test readFile
describe("readFile function", () => {
    beforeEach(() => {
        process.env.GITHUB_WORKSPACE = __dirname;
    });

    // test throws error if input not string
    test('throws not string', () => {
        const input = 5;
        // expect(parseMatter(5)).toThrow('content not a string');
        expect(() => {readTextFile(input);}).toThrow(TypeError);
        expect(() => {readTextFile(input);}).toThrow("File path not a string");
    });

    // test throws file not found error
    test('throws file not found', () => {
        const input = 'unknown.md';
        jest.spyOn(console, 'error').mockImplementation(() => {});
        // expect(readTextFile(input)).rejects.toThrow('ENOENT');
        expect(() => {readTextFile(input);}).toThrow('ENOENT');
        expect(console.error).toHaveBeenCalled();
    });

    // test throws error if not text file
    // #TODO

    // test reads file correctly
    test('reads file contents', () => {
        const filePath = '../examples/project.md';
        const expected = testContent.project;
        expect(readTextFile(filePath)).toEqual(expected);

    });
});

// test parseTemplate
describe("parseTemplate function", () => {
    // test throws error if input not string
    // test empty string
    // test populated string
});

// test parseMatter
describe("parseMatter function", () => {
    // test throws error if input not string
    test('throws not string', () => {
        const input = 5;
        // expect(parseMatter(5)).toThrow('content not a string');
        expect(() => {parseMatter(input);}).toThrow(TypeError);
        expect(() => {parseMatter(input);}).toThrow("Content not a string");
    });

    // test no input
    // #TODO
    
    // test empty string
    test("returns empty parsed attributes and body", () => {
        const input = "";

        const expected = {
            attributes: {},
            body: ''
        };

        expect(parseMatter(input)).toEqual(expected);
    });

    // test no front matter in string
    test("returns body with empty parsed attributes", () => {
        const input = testContent.noFM;

        const expected = {
            attributes: {},
            body: 'This is some text without front matter content.'
        };

        expect(parseMatter(input)).toEqual(expected);
    });

    // test populated string
    test("returns parsed attributes and body", () => {
        const input = testContent.basicFM;

        const expected = {
            attributes: {
                title: 'Front Matter Test',
                type: 'basic attributes and body match'
            },
            body: 'This is some text that includes front matter content.'
        };

        expect(parseMatter(input)).toEqual(expected);
    });

    // test special characters string
    test("returns special characters in attributes and body", () => {
        const input = testContent.specialChars;

        // unslugged
        // const expected = {
        //     attributes: {
        //         't!tle': 'Front Matter Test',
        //         type: 'special characters match \'n stuff',
        //         '🌎 ground control': 'lift-off 🚀'
        //     },
        //     body: 'This is some text that includes \'$pecial characters\'.\n\nAnd multiple lines.'
        // };

        // slugged
        const expected = {
            attributes: {
                'ttle': 'Front Matter Test',
                type: 'special characters match \'n stuff',
                'ground-control': 'lift-off 🚀'
            },
            body: 'This is some text that includes \'$pecial characters\'.\n\nAnd multiple lines.'
        };

        expect(parseMatter(input)).toEqual(expected);
    });
});
