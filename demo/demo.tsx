import React, { type CSSProperties, type PropsWithChildren, RefObject, useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./demo.scss";
import Color from "color";
import { colorsContrast, counterColor, hexToRGB } from "../src";

type Wrapper<T = any> = (props: PropsWithChildren<T>) => any;

const ColorTag: Wrapper<{
    hex: string;
    name?: string;
    colorConfig: any;
    bullet?: boolean;
    showContrast?: boolean;
}> = props => {
    const pct = (n: number) => ((100 * n) >> 0) + "%";
    const textColor = counterColor(props.hex, props.colorConfig);
    const contrastValue = colorsContrast(props.hex, textColor);
    const sliderColor = counterColor(props.hex, {
        threshold: props.colorConfig.threshold,
        dark: "#000",
        light: "#fff",
    });
    const rgba1 = `rgba(${hexToRGB(sliderColor).join(",")}, 0.3)`;

    const style: CSSProperties = {
        backgroundColor: props.hex,
        color: textColor,
        "--bg": props.hex,
        "--pct": pct(contrastValue),
        "--grad": props.showContrast
            ? `linear-gradient(to right, ${rgba1} ${pct(contrastValue)}, transparent ${pct(contrastValue)})`
            : undefined,
    } as CSSProperties;

    return (
        <div className="color-tag centered" style={style}>
            <div style={{ zIndex: 1 }}>{props.name || props.hex}</div>
        </div>
    );
};

const Slider: Wrapper<{
    default: any;
    min: number;
    max: number;
    step?: number;
    onChange?: (value: number) => void;
    width?: number;
}> = props => {
    const style: CSSProperties = {};
    const [value, setValue] = useState(props.default);
    return (
        <div className="slider" style={style}>
            <label>{props.children}</label>
            <input
                type="range" //
                min={props.min}
                max={props.max}
                defaultValue={props.default}
                onChange={e => {
                    setValue(Number(e.target.value));
                    props.onChange?.(Number(e.target.value));
                }}
                step={props.step ?? 1}
                style={{ width: `${props.width || 300}px` }}
            />
            <code className="value">{value}</code>
        </div>
    );
};

const useGrid = (myRef: RefObject<HTMLDivElement>, y: number) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [grid, setGrid] = useState(generateLightGrid(1, y));

    useLayoutEffect(() => {
        const handleResize = () => {
            if (myRef.current) {
                const { offsetWidth, offsetHeight } = myRef.current;
                setWidth(offsetWidth);
                setHeight(offsetWidth);
                setGrid(generateLightGrid(((offsetWidth / 90) >> 0) - 1, y));
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [myRef]);

    return { width, height, grid };
};

const ColorGrid: Wrapper<{ steps: number; colorConfig: any; showContrast?: boolean }> = props => {
    const ref = useRef<HTMLDivElement>(null);
    const { grid } = useGrid(ref, props.steps);

    const gridStyle: CSSProperties = {
        gridTemplateColumns: grid.map(_ => "1fr").join(" "),
    };

    const rowsMinContrast = (row: string[]) => {
        const contrastDiffs = row.map(color => colorsContrast(color, counterColor(color, props.colorConfig)));
        const min = Math.min(...contrastDiffs);
        return min;
    };

    const minContrast = Math.min(...grid.map(rowsMinContrast));

    return (
        <div className="centered v-box" ref={ref}>
            {props.showContrast && (
                <div>
                    {" "}
                    Minimum BG/FG Luminance difference: <code>{minContrast.toFixed(6)}</code>
                </div>
            )}
            <div className="grid" style={gridStyle}>
                {props.showContrast && grid.map((row, i) => <code key={i}>{rowsMinContrast(row).toFixed(4)}</code>)}
                {grid.map((row, i) => (
                    <div key={i}>
                        {row.map(color => (
                            <div key={color} className="v-box">
                                <ColorTag
                                    key={color}
                                    hex={color}
                                    colorConfig={props.colorConfig}
                                    showContrast={props.showContrast}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export function generateLightGrid(x: number, y: number): string[][] {
    const red = Color("#FF0000");
    const range = Array.from({ length: x + 1 }, (_, i) => red.rotate(i * (360 / x)));
    range.push(Color("#808080"));
    const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
    return range.map(color => {
        const baseLightness = color.hsl().lightness();
        const lighten = Array.from({ length: y }, (_, i) => {
            const p = (i + 1) / y;
            return color.lightness(lerp(baseLightness, 100, p));
        });
        const darken = Array.from({ length: y }, (_, i) => {
            const p = (y - (i + 1)) / y;
            return color.lightness(lerp(0, baseLightness, p));
        });
        return [...lighten.reverse(), color, ...darken].map(_ => _.hex());
    });
}

function App() {
    const [threshold, setThreshold] = useState(0.35);
    const [dark, setDark] = useState("#000000");
    const [light, setLight] = useState("#ffffff");
    const [weight, setWeight] = useState(400);
    const [showContrast, setShowContrast] = useState(false);
    const [darkBG, setDarkBg] = useState(true);

    if (darkBG) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }

    const colorConfig = { threshold, dark, light };
    const code = () => {
        const th = threshold !== 0.35 ? `threshold: ${threshold}` : "";
        const dk = dark !== "#000000" ? `dark: ${dark}` : "";
        const lt = light !== "#ffffff" ? `light: ${light}` : "";
        const cgf = [th, dk, lt].filter(_ => _).join(", ");
        const config = cgf ? `, {${cgf}` : "";

        return `const foreground = contrastColor(backgroundHex${config});`;
    };

    return (
        <div className={`centered v-box ${darkBG ? "dark" : ""}`} style={{ fontWeight: weight }}>
            <div className="section v-box">
                <label>
                    Dark background:
                    <input type="checkbox" checked={darkBG} onChange={e => setDarkBg(e.target.checked)} />
                </label>
                <label>
                    Luminance threshold (0-1):
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        defaultValue={threshold}
                        onChange={e => setThreshold(Number(e.target.value))}
                        style={{ width: `300px` }}
                    />
                    <code className="value">{threshold}</code>
                </label>
                <label>
                    Show contrast values:
                    <input type="checkbox" checked={showContrast} onChange={e => setShowContrast(e.target.checked)} />
                </label>
                <div className="h-box">
                    <label>
                        Dark color:
                        <input type="color" defaultValue={dark} onChange={e => setDark(e.target.value)} />
                        <code className="value">{dark}</code>
                    </label>
                    <label>
                        Light color:
                        <input type="color" defaultValue={light} onChange={e => setLight(e.target.value)} />
                        <code className="value">{light}</code>
                    </label>
                </div>
                <label>
                    Font weight (100-900):
                    <input
                        type="range"
                        min={100}
                        max={900}
                        step={100}
                        defaultValue={weight}
                        onChange={e => setWeight(Number(e.target.value))}
                        style={{ width: `300px` }}
                    />
                    <code className="value">{weight}</code>
                </label>
                <pre>
                    <code>{code()}</code>
                </pre>
            </div>
            <div className="section h-box">
                <ColorGrid colorConfig={colorConfig} steps={12} showContrast={showContrast} />
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("app"));
