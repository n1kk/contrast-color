export type LightOrDarkOptions = {
    dark?: string;
    light?: string;
    threshold?: number;
    onBadColor?: string;
    lumFactors?: [r: number, g: number, b: number];
};

type OptGetter<T extends object> = {
    <K extends keyof T>(key: K): Partial<T>[K] | undefined;
    <K extends keyof T>(key: K, _default: Required<T>[K]): Required<T>[K];
};

export function lightOrDark(this: LightOrDarkOptions | void, color: string, options?: LightOrDarkOptions): string {
    const rgb = hexToRGB(color);
    const opt: OptGetter<LightOrDarkOptions> = (key, _default?) => {
        return options?.[key] ?? this?.[key] ?? _default;
    };

    if (!rgb) {
        const onBadColor = opt("onBadColor");
        if (onBadColor) return onBadColor;
        throw new Error(`Should be a valid hex, #RGB or #RRGGBB: '${color}'`);
    }

    const sRGB = (channel: number) => {
        channel /= 255;
        return channel <= 0.039_28 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    };

    const colorLuminosity = (r: number, g: number, b: number): number => {
        const [lr, lg, lb] = opt("lumFactors", [0.2126, 0.7152, 0.0722]);
        return lr * sRGB(r) + lg * sRGB(g) + lb * sRGB(b);
    };
    const luminance /* 0-1 */ = colorLuminosity(...rgb);

    const threshold = opt("threshold", 0.35);
    const light = opt("light", "#eee");
    const dark = opt("dark", "#222");

    return luminance > threshold || threshold == 0 ? dark : light;
}

function hexToRGB(hex: string, noThrow?: boolean): [r: number, b: number, g: number] | undefined {
    if (hex.startsWith("#")) hex = hex.substring(1);
    if (hex.length < 3 || hex.length == 4 || hex.length == 5) return undefined;
    const toDec = (hex: string) => parseInt(hex, 16);
    return hex.length == 3
        ? [toDec(hex[0] + hex[0]), toDec(hex[1] + hex[1]), toDec(hex[2] + hex[2])]
        : [toDec(hex[0] + hex[1]), toDec(hex[2] + hex[3]), toDec(hex[4] + hex[5])];
}
