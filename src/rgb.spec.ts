import { decToRGB, hexToRGB, toRGB } from "./rgb";

describe(hexToRGB.name, function () {
    const tests: [string, string, number[]][] = [
        ["#000", "black", [0, 0, 0]],
        ["#F00", "red", [255, 0, 0]],
        ["#F80", "orange", [255, 136, 0]],
        ["#FF0", "yellow", [255, 255, 0]],
        ["#8F0", "light green", [136, 255, 0]],
        ["#0F0", "green", [0, 255, 0]],
        ["#0F8", "malachite", [0, 255, 136]],
        ["#0FF", "cyan", [0, 255, 255]],
        ["#08F", "azure", [0, 136, 255]],
        ["#00F", "blue", [0, 0, 255]],
        ["#80F", "violet", [136, 0, 255]],
        ["#F0F", "magenta", [255, 0, 255]],
        ["#F08", "rose", [255, 0, 136]],
        ["#FFF", "white", [255, 255, 255]],
    ];

    for (const [input, name, expected] of tests) {
        it(`should convert hex ${input} (${name}) to rgb array [${expected}]`, function () {
            expect(hexToRGB(input)).toEqual(expected);
        });
    }

    it(`hash should be optional`, function () {
        expect(hexToRGB("000")).toEqual([0, 0, 0]);
    });

    it(`should work with 3 or 6 hex len values`, function () {
        expect(hexToRGB("000")).toEqual([0, 0, 0]);
        expect(hexToRGB("000000")).toEqual([0, 0, 0]);
    });
});

describe(decToRGB.name, () => {
    const tests: [number, string, number[]][] = [
        [0, "black", [0, 0, 0]],
        [16711680, "red", [255, 0, 0]],
        [65280, "green", [0, 255, 0]],
        [255, "blue", [0, 0, 255]],
        [16777215, "white", [255, 255, 255]],
    ];

    for (const [input, name, expected] of tests) {
        it(`should convert dec ${input} (${name}) to rgb array [${expected}]`, function () {
            expect(decToRGB(input)).toEqual(expected);
        });
    }
});

describe(toRGB.name, () => {
    const tests: [number | string | [number, number, number], string, number[]][] = [
        ["#000", "black", [0, 0, 0]],
        [16711680, "red", [255, 0, 0]],
        [65280, "green", [0, 255, 0]],
        [255, "blue", [0, 0, 255]],
        [16777215, "white", [255, 255, 255]],
    ];

    for (const [input, name, expected] of tests) {
        it(`should convert input ${input} (${name}) to rgb array [${expected}]`, function () {
            expect(toRGB(input)).toEqual(expected);
        });
    }

    it(`should throw on unsupported import`, function () {
        expect(() => toRGB(true as any)).toThrow();
        expect(() => toRGB({} as any)).toThrow();
        expect(() => toRGB(arguments as any)).toThrow();
    });
});
