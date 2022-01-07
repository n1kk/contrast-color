import counterColor from "./index";

describe(counterColor.name, () => {
    const cc = counterColor;

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
