import { sRGB, toRGB } from "./rgb";
import { ColorValue } from "./types";

export function colorLuminance(color: ColorValue): number {
    const [r, g, b] = sRGB(toRGB(color));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
