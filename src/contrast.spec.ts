import { colorsContrast, colorsContrastRatio, colorsHaveSufficientContrast, pickMostContrast } from "./contrast";

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
