import React, { type CSSProperties, type PropsWithChildren, RefObject, useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./demo.scss";
import Color from "color";
import { colorsContrast, counterColor, hexToRGB } from "../src";

type Wrapper<T = any> = (props: PropsWithChildren<T>) => any;

const ColorTag: Wrapper<{
    hex: string;
    name?: string;
    threshold: number;
    bullet?: boolean;
    showContrast?: boolean;
}> = props => {
    const pct = (n: number) => ((100 * n) >> 0) + "%";
    const color = counterColor(props.hex, { threshold: props.threshold });
    const contrast = colorsContrast(props.hex, color);
    const rgba1 = `rgba(${hexToRGB(color).join(",")}, 0.3)`;

    const style: CSSProperties = {
        backgroundColor: props.hex,
        color: color,
        "--bg": props.hex,
        "--pct": pct(contrast),
        "--grad": props.showContrast
            ? `linear-gradient(to right, ${rgba1} ${pct(contrast)}, transparent ${pct(contrast)})`
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

const ColorGrid: Wrapper<{ steps: number; threshold: number; showContrast?: boolean }> = props => {
    const ref = useRef<HTMLDivElement>(null);
    const { grid } = useGrid(ref, props.steps);

    const gridStyle: CSSProperties = {
        gridTemplateColumns: grid.map(_ => "1fr").join(" "),
    };

    const rowsMinContrast = (row: string[]) => {
        const contrastDiffs = row.map(color =>
            colorsContrast(color, counterColor(color, { threshold: props.threshold })),
        );
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
                                    threshold={props.threshold}
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
    const [weight, setWeight] = useState(400);
    const [showContrast, setShowContrast] = useState(false);
    const [darkBG, setDarkBg] = useState(false);

    if (darkBG) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }

    return (
        <div className={`centered v-box ${darkBG ? "dark" : ""}`} style={{ fontWeight: weight }}>
            <div className="section v-box">
                <label>
                    Dark background:
                    <input type="checkbox" checked={darkBG} onChange={e => setDarkBg(e.target.checked)} />
                </label>
                <Slider min={0} max={1} step={0.01} default={threshold} onChange={setThreshold}>
                    Luminance threshold (0-1):
                </Slider>
                <label>
                    Show contrast values:
                    <input type="checkbox" checked={showContrast} onChange={e => setShowContrast(e.target.checked)} />
                </label>
                <Slider min={100} max={900} step={100} default={weight} onChange={setWeight}>
                    Font weight (100-900):
                </Slider>
                <pre>
                    <code>{`const foreground = contrastColor(backgroundHex, {threshold: ${threshold}});`}</code>
                </pre>
            </div>
            <div className="section h-box">
                <ColorGrid threshold={threshold} steps={14} showContrast={showContrast} />
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("app"));
