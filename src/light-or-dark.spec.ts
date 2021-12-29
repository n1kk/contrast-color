import { lightOrDark } from "./light-or-dark";

describe("light-or-dark", () => {
    it("should accept one argument", () => {
        expect(lightOrDark("#000")).toBe("#eee");
        expect(lightOrDark("#FFF")).toBe("#222");
    });

    it("should accept optional configuration as second param", () => {
        const config = { light: "#FFF", dark: "#000", threshold: 0.4 };
        expect(lightOrDark("#000", config)).toBe("#FFF");
        expect(lightOrDark("#FFF", config)).toBe("#000");
    });

    it("should accept optional configuration as 'this' context", () => {
        const config = { light: "#FFF", dark: "#000", threshold: 0.4 };
        expect(lightOrDark.call(config, "#000")).toBe("#FFF");
        expect(lightOrDark.call(config, "#FFF")).toBe("#000");
    });

    describe("black and white", () => {
        const lod = lightOrDark.bind({ light: "#FFF", dark: "#000" });

        it("should give light for black", () => {
            expect(lod("#000")).toBe("#FFF");
        });

        it("should give dark for white", () => {
            expect(lod("#FFF")).toBe("#000");
        });

        it("should throw on non valid hex", () => {
            expect(() => lod("#FF")).toThrow();
            expect(() => lod("#FFFF")).toThrow();
        });
    });

    describe("for colors", () => {
        const lod = lightOrDark.bind({ light: "#FFF", dark: "#000" });

        const tests: [string, string, string][] = [
            ["#F00", "red", "#FFF"],
            ["#F80", "orange", "#000"],
            ["#FF0", "yellow", "#000"],
            ["#8F0", "light green", "#000"],
            ["#0F0", "green", "#000"],
            ["#0F8", "malachite", "#000"],
            ["#0FF", "cyan", "#000"],
            ["#08F", "azure", "#FFF"],
            ["#00F", "blue", "#FFF"],
            ["#80F", "violet", "#FFF"],
            ["#F0F", "magenta", "#FFF"],
            ["#F08", "rose", "#FFF"],
        ];

        tests.forEach(([color, name, result]) => {
            it(`should give '${result}' for '${name}'`, () => {
                expect(lod(color)).toBe(result);
            });
        });
    });

    describe("non throwing", () => {
        const lod = lightOrDark.bind({ light: "#FFF", dark: "#000", onBadColor: "#111" });

        it("should give preset value instead of throwing", () => {
            expect(lod("#000")).toBe("#FFF");
        });

        it("should give dark for white", () => {
            expect(lod("#FFF")).toBe("#000");
        });
    });
});
