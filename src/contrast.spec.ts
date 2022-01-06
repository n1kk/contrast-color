import {
    colorsContrast,
    colorsContrastRatio,
    colorsHaveSufficientContrast,
    contrastingTextColor,
    pickMostContrast,
} from "./contrast";

describe(colorsContrast.name, function () {
    it("contrast of black and white should be 1", function () {
        expect(colorsContrast("#fff", "#000")).toBe(1);
    });

    it("contrast of same color should be 0", function () {
        expect(colorsContrast("#fff", "#fff")).toBe(0);
        expect(colorsContrast("#000", "#000")).toBe(0);
        expect(colorsContrast("#888", "#888")).toBe(0);
    });
});

describe(colorsContrastRatio.name, function () {
    it("ratio of black and white should be 21:1 (1/21)", function () {
        expect(colorsContrastRatio("#fff", "#000")).toBe(1 / 21);
    });

    it("ratio of white and black should be 21:1 (1/21)", function () {
        expect(colorsContrastRatio("#000", "#fff")).toBe(1 / 21);
    });

    it("ratio of same color should be 1", function () {
        expect(colorsContrastRatio("#000", "#000")).toBe(1);
        expect(colorsContrastRatio("#fff", "#fff")).toBe(1);
    });
});

describe(colorsHaveSufficientContrast.name, function () {
    it("should return boolean whether colors have sufficient contrast", function () {
        expect(colorsHaveSufficientContrast("#fff", "#000")).toBe(true);
        expect(colorsHaveSufficientContrast("#fff", "#fff")).toBe(false);
        expect(colorsHaveSufficientContrast("#000", "#001")).toBe(false);
    });
});

describe(pickMostContrast.name, function () {
    it("should return color from the list with most contrast to target", function () {
        expect(pickMostContrast(["#fff", "#f00", "#0f0", "#00f", "#000"], "#000")).toBe("#fff");
    });
});

describe(contrastingTextColor.name, () => {
    const cc = contrastingTextColor;

    it("should return contrasting color for a given color", () => {
        expect(cc("#000")).toBe("#fff");
        expect(cc("#fff")).toBe("#000");
    });

    it("should accept optional configuration as second param", () => {
        expect(cc("#000")).toBe("#fff");
        expect(cc("#fff")).toBe("#000");
    });

    it("should give black with 0 threshold", () => {
        expect(cc("#000", { threshold: 0 })).toBe("#000");
        expect(cc("#fff")).toBe("#000");
    });

    describe("for colors main colors", () => {
        const config = { light: "#fff", dark: "#000" };

        const tests: [string, string, string][] = [
            ["#000", "black", config.light],
            ["#F00", "red", config.light],
            ["#F80", "orange", config.dark],
            ["#FF0", "yellow", config.dark],
            ["#8F0", "light green", config.dark],
            ["#0F0", "green", config.dark],
            ["#0F8", "malachite", config.dark],
            ["#0FF", "cyan", config.dark],
            ["#08F", "azure", config.light],
            ["#00F", "blue", config.light],
            ["#80F", "violet", config.light],
            ["#F0F", "magenta", config.light],
            ["#F08", "rose", config.light],
            ["#FFF", "white", config.dark],
        ];

        tests.forEach(([color, name, result]) => {
            it(`should give '${result}' for '${name}'`, () => {
                expect(cc(color, config)).toBe(result);
            });
        });
    });
});
