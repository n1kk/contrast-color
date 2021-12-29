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

    const colorLuminosity = (r: number, g: number, b: number): number => {
        const [lr, lg, lb] = opt("lumFactors", [0.2126, 0.7152, 0.0722]);
        return (lr * r + lg * g + lb * b) / 255;
    };
    const luminance = colorLuminosity(...rgb); // 0 - 1

    // console.log("lightOrDark", { color, luminance, this: this, options });

    const threshold = opt("threshold", 0.57);
    const light = opt("light", "#eee");
    const dark = opt("dark", "#222");

    return luminance > threshold || threshold == 0 ? dark : light;
}

function hexToRGB(hex: string, noThrow?: boolean): [r: number, b: number, g: number] | undefined {
    if (hex.startsWith("#")) hex = hex.substring(1);
    const chunks = chunkString(hex, hex.length == 3 ? 1 : 2);
    const toDev = (hex: string) => parseInt(hex, 16);
    return chunks.length >= 3 ? (chunks.map(toDev) as [number, number, number]) : undefined;
}

function chunkString(str: string, n: number): string[] {
    if (n > 1) {
        return str.match(new RegExp(".{1," + n + "}", "g")) as string[];
    } else {
        return [...str].map(_ => _ + _);
    }
}
