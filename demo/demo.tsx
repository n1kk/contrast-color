import React, {
    type CSSProperties,
    type PropsWithChildren,
    RefObject,
    useLayoutEffect,
    useRef,
    useState
} from "react";
import ReactDOM from "react-dom";
import "./demo.css";
import { lightOrDark, LightOrDarkOptions } from "../src/light-or-dark";
import Color from "color";

type Wrapper<T = any> = (props: PropsWithChildren<T>) => any;

const ColorTag: Wrapper<{ hex: string; name?: string; options?: LightOrDarkOptions; bullet?: boolean }> = props => {
    const lod = lightOrDark.bind(props.options);
    const style: CSSProperties = {
        backgroundColor: props.hex,
        color: lod(props.hex),
    };
    return (
        <div className="color-tag centered" style={style}>
            {props.name || props.hex}
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
            <span className="value">{value}</span>
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

const ColorGrid: Wrapper<{ steps: number; options?: LightOrDarkOptions }> = props => {
    const ref = useRef<HTMLDivElement>(null);
    const { grid } = useGrid(ref, props.steps);

    const gridStyle: CSSProperties = {
        gridTemplateColumns: grid.map(_ => "1fr").join(" "),
    };
    return (
        <div className="centered" ref={ref}>
            <div className="grid" style={gridStyle}>
                {grid.map((row, i) => (
                    <div key={i}>
                        {row.map(color => (
                            <div>
                                <ColorTag key={color} hex={color} options={props.options} />
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
    const [lumR, setLumR] = useState(0.2126);
    const [lumG, setLumG] = useState(0.7152);
    const [lumB, setLumB] = useState(0.0722);
    const [weight, setWeight] = useState(400);
    return (
        <div className="centered v-box" style={{ fontWeight: weight }}>
            <div className="section v-box">
                <Slider min={0} max={1} step={0.01} default={threshold} onChange={setThreshold}>
                    Luminance threshold (0-1):
                </Slider>
                <div>Channels luminosity factors (0-1):</div>
                <Slider min={0} max={1} step={0.0001} default={lumR} width={500} onChange={setLumR}>
                    Red:
                </Slider>
                <Slider min={0} max={1} step={0.0001} default={lumG} width={500} onChange={setLumG}>
                    Green:
                </Slider>
                <Slider min={0} max={1} step={0.0001} default={lumB} width={500} onChange={setLumB}>
                    Blue:
                </Slider>
                <Slider min={100} max={900} step={100} default={weight} onChange={setWeight}>
                    Font weight (100-900):
                </Slider>
                <pre>
                    <code>
                        {`const getContrastingColor = lightOrDark.bind({threshold: ${threshold}, lumFactors: [${lumR}, ${lumG}, ${lumB}]);`}
                    </code>
                </pre>
            </div>
            <div className="section h-box">
                <ColorGrid options={{ threshold, lumFactors: [lumR, lumG, lumB] }} steps={16} />
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("app"));
