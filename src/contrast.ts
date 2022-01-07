import { toRGB } from "./rgb";
import { colorLuminance } from "./luminance";
import { ColorValue } from "./types";

export function colorsContrast(color1: ColorValue, color2: ColorValue): number {
    const lum1 = colorLuminance(toRGB(color1));
    const lum2 = colorLuminance(toRGB(color2));
    return Math.abs(lum1 - lum2);
}

export function colorsContrastRatio(color1: ColorValue, color2: ColorValue): number {
    const lum1 = colorLuminance(toRGB(color1));
    const lum2 = colorLuminance(toRGB(color2));
    const lighter = Math.min(lum1, lum2);
    const darker = Math.max(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
}

export function colorsHaveSufficientContrast(color1: ColorValue, color2: ColorValue): boolean {
    return colorsContrastRatio(color1, color2) <= 1 / 7;
}

export function pickMostContrast<T extends ColorValue>(colors: T[], target: ColorValue): T {
    const contrasts = colors.map(color => colorsContrast(color, target));
    const max = Math.max(...contrasts);
    const index = contrasts.indexOf(max);
    return colors[index];
}
