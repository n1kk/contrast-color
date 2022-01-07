import { ColorValue } from "./types";

export type RGB = [r: number, g: number, b: number];

export const sRGB = (rgb: RGB): RGB => {
    const normalized = rgb.map(channel => channel / 255);
    const srgb = normalized.map(channel =>
        channel <= 0.039_28 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );
    return srgb as RGB;
};

export function hexToRGB(hex: string): RGB {
    if (hex.startsWith("#")) hex = hex.substring(1);
    const toDec = (hex: string) => parseInt(hex, 16);
    return hex.length == 3
        ? [toDec(hex[0] + hex[0]), toDec(hex[1] + hex[1]), toDec(hex[2] + hex[2])]
        : [toDec(hex[0] + hex[1]), toDec(hex[2] + hex[3]), toDec(hex[4] + hex[5])];
}

export function decToRGB(dec: number): RGB {
    return [(dec >> 16) & 0xff, (dec >> 8) & 0xff, dec & 0xff];
}

export function toRGB(color: ColorValue): RGB {
    if (typeof color === "string") return hexToRGB(color);
    else if (typeof color === "number") return decToRGB(color);
    else if (Array.isArray(color)) return color as RGB;

    throw new Error(`Bad color value: ${typeof color} = ${color}`);
}

export function rgbToHex(rgb: RGB | number[]): string {
    return `#` + rgb.map(_ => _.toString(16).padStart(2, "0")).join("");
}

export function decToHex(dec: number): string {
    return rgbToHex(decToRGB(dec));
}

export function hexToDec(hex: string): number {
    if (hex.startsWith("#")) hex = hex.substring(1);
    return parseInt(hex, 16);
}

export function rbgToDec(rgb: RGB | number[]): number {
    return hexToDec(rgbToHex(rgb));
}
