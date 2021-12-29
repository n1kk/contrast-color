import { lightOrDark } from "./light-or-dark";

describe("light-or-dark", () => {
    describe("black and white", () => {
        const lod = lightOrDark.bind(null, { light: "#FFF", dark: "#000" });

        it("should give light for black", () => {
            expect(lod("#000")).toBe("#FFF");
        });

        it("should give dark for white", () => {
            expect(lod("#FFF")).toBe("#000");
        });

        it("should throw on non valid hex", () => {
            expect(() => lod("#FF")).toThrow();
            expect(() => lod("#FFFF")).toThrow();
            expect(() => lod("#FFFFFFF")).toThrow();
        });
    });

    describe("for colors", () => {
        const lod = lightOrDark.bind(null, { light: "#FFF", dark: "#000" });

        const tests: [string, string, string][] = [
            ["#F00", "red", "#FFF"],
            ["#F80", "orange", "#FFF"],
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
        const lod = lightOrDark.bind(null, { light: "#FFF", dark: "#000", onBadColor: "#111" });

        it("should give preset value instead of throwing", () => {
            expect(lod("#000")).toBe("#FFF");
        });

        it("should give dark for white", () => {
            expect(lod("#FFF")).toBe("#000");
        });
    });
});
