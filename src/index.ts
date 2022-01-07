import { ColorValue } from "./types";
import { toRGB } from "./rgb";
import { colorLuminance } from "./luminance";

export * from "./luminance";
export * from "./contrast";
export * from "./rgb";

type Options = {
    threshold?: number;
    dark?: string;
    light?: string;
};

export function counterColor(targetColor: ColorValue, options?: Options): string;
export function counterColor(
    targetColor: ColorValue,
    { threshold = 0.35, dark = "#000", light = "#fff" }: Options = {},
): string {
    let rgb = toRGB(targetColor);
    const brightness = colorLuminance(rgb);
    return brightness > threshold || threshold == 0 ? dark : light;
}

export default counterColor;
