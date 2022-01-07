import { decToHex, decToRGB, hexToDec, hexToRGB, rbgToDec, rgbToHex, toRGB } from "./rgb";

describe(`color conversions`, function () {
    const colorTests: [number, string, string, number[]][] = [
        [0, "#000000", "black", [0, 0, 0]],
        [16711680, "#ff0000", "red", [255, 0, 0]],
        [16746496, "#ff8800", "orange", [255, 136, 0]],
        [16776960, "#ffff00", "yellow", [255, 255, 0]],
        [8978176, "#88ff00", "light green", [136, 255, 0]],
        [65280, "#00ff00", "green", [0, 255, 0]],
        [65416, "#00ff88", "malachite", [0, 255, 136]],
        [65535, "#00ffff", "cyan", [0, 255, 255]],
        [35071, "#0088ff", "azure", [0, 136, 255]],
        [255, "#0000ff", "blue", [0, 0, 255]],
        [8913151, "#8800ff", "violet", [136, 0, 255]],
        [16711935, "#ff00ff", "magenta", [255, 0, 255]],
        [16711816, "#ff0088", "rose", [255, 0, 136]],
        [16777215, "#ffffff", "white", [255, 255, 255]],
    ];

    for (const [dec, hex, name, rgb] of colorTests) {
        it(`hexToRGB should convert  ${hex} (${name}) to  [${rgb}]`, function () {
            expect(hexToRGB(hex)).toEqual(rgb);
        });

        it(`hexToDec should convert  ${hex} (${name}) to  ${dec}`, function () {
            expect(hexToDec(hex)).toEqual(dec);
        });

        it(`rgbToHex should convert  [${rgb}] (${name}) to  ${hex}`, function () {
            expect(rgbToHex(rgb)).toEqual(hex);
        });

        it(`rbgToDec should convert  [${rgb}] (${name}) to  ${dec}`, function () {
            expect(rbgToDec(rgb)).toEqual(dec);
        });

        it(`decToRGB should convert  ${dec} (${name}) to [${rgb}]`, function () {
            expect(decToRGB(dec)).toEqual(rgb);
        });

        it(`decToRGB should convert  ${dec} (${name}) to ${hex}`, function () {
            expect(decToHex(dec)).toEqual(hex);
        });

        it(`toRGB should convert  ${dec} | ${hex} (${name}) to [${rgb}]`, function () {
            expect(toRGB(dec)).toEqual(rgb);
            expect(toRGB(hex)).toEqual(rgb);
        });
    }
});

describe(hexToRGB.name, function () {
    it(`hash should be optional`, function () {
        expect(hexToRGB("000")).toEqual([0, 0, 0]);
    });

    it(`should work with 3 or 6 hex len values`, function () {
        expect(hexToRGB("000")).toEqual([0, 0, 0]);
        expect(hexToRGB("000000")).toEqual([0, 0, 0]);
    });
});
