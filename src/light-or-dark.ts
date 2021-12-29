type LightOrDarkOptions = {
    dark: string;
    light: string;
    threshold: number;
    onBadColor: string;
};

const defaultThreshold = 82;

export function lightOrDark(color: string): string;
export function lightOrDark(options: Partial<LightOrDarkOptions>, color: string): string;
export function lightOrDark(...args: any[]): string {
    let options: Partial<LightOrDarkOptions> | undefined, color: string;
    if (args.length > 1) {
        [options, color] = args;
    } else {
        [color] = args;
    }

    const rgb = hexToRGB(color);

    if (!rgb) {
        if (options?.onBadColor) {
            return options?.onBadColor;
        }
        throw new Error(`Should be a valid hex, #RGB or #RRGGBB: '${color}'`);
    }

    const luminance = colorLuminosity(...rgb); // 0 - 1
    const brightness = perceivedBrightness(luminance); // 0 - 100

    // console.log("blackOrWhite", args, luminance, brightness);

    const threshold = options?.threshold ?? defaultThreshold;
    const light = options?.light || "#eee";
    const dark = options?.dark || "#222";

    return brightness > threshold || threshold == 0 ? dark : light;
}

function hexToRGB(hex: string, noThrow?: boolean): [r: number, b: number, g: number] | undefined {
    if (hex.startsWith("#")) {
        hex = hex.substring(1);
    }

    if (hex.length === 3) {
        return [
            parseInt(hex[0] + hex[0], 16), //
            parseInt(hex[1] + hex[1], 16),
            parseInt(hex[2] + hex[2], 16),
        ];
    } else if (hex.length === 6) {
        return [
            parseInt(hex.substring(0, 2), 16), //
            parseInt(hex.substring(2, 4), 16),
            parseInt(hex.substring(4, 6), 16),
        ];
    }
}

function colorLuminosity(r: number, g: number, b: number): number {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function perceivedBrightness(luminance: number): number {
    if (luminance <= 216 / 24389) {
        return luminance * (24389 / 27);
    } else {
        return Math.pow(luminance, 1 / 3) * 116 - 16;
    }
}
