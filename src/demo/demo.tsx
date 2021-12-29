import React, {
    ChangeEvent,
    ChangeEventHandler,
    type CSSProperties,
    EventHandler,
    type PropsWithChildren,
    useState,
} from "react";
import ReactDOM from "react-dom";
import "./demo.css";
import { lightOrDark } from "../light-or-dark";
import { generateLightGrid, namedColors, rangeColors } from "./color-codes";

type Wrapper<T = any> = (props: PropsWithChildren<T>) => any;

const Section: Wrapper = props => <div className="section">{props.children}</div>;

const ColorTag: Wrapper<{ hex: string; name?: String; threshold?: number; bullet?: boolean }> = props => {
    const lod = lightOrDark.bind(null, { threshold: props.threshold });
    const style: CSSProperties = {
        backgroundColor: props.hex,
        color: lod(props.hex),
    };
    return (
        <div className={`color ${props.bullet ? "bullet" : ""}`} style={style}>
            {props.name || props.hex}
        </div>
    );
};

const Slider: Wrapper<{
    name: string;
    label: string;
    default: any;
    min: number;
    max: number;
    step?: number;
    onChange?: (value: number) => void;
}> = props => {
    const style: CSSProperties = {};
    const [value, setValue] = useState(props.default);
    return (
        <div className="slider" style={style}>
            <label htmlFor={props.name}>{props.label}</label>
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
                style={{ width: "300px" }}
            />
            <span className="value">{value}</span>
        </div>
    );
};

const ColorGrid: Wrapper<{ range: string[]; threshold?: number; steps?: number }> = props => {
    const grid = generateLightGrid(props.range, props.steps || 4);
    const gridStyle: CSSProperties = {
        gridTemplateColumns: rangeColors.map(_ => "1fr").join(" "),
    };
    return (
        <div className="centered">
            <div className="grid" style={gridStyle}>
                {grid.map(row => (
                    <div>
                        {row.map(color => (
                            <div>
                                <ColorTag hex={color} threshold={props.threshold} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

function App() {
    const [brightness, setBrightness] = useState(82);
    const [weight, setWeight] = useState(400);
    return (
        <div className="centered" style={{ fontWeight: weight }}>
            <Section>
                <Slider
                    name="brightness"
                    label="Brightness threshold (0-100):"
                    min={0}
                    max={100}
                    step={0.1}
                    default={brightness}
                    onChange={setBrightness}
                />
                <Slider
                    name="weight"
                    label="Font weight (100-900):"
                    min={100}
                    max={900}
                    step={100}
                    default={weight}
                    onChange={setWeight}
                />
            </Section>
            <Section>
                {Object.entries(namedColors).map(([name, hex]) => (
                    <ColorTag hex={hex} name={name} key={name} threshold={brightness} bullet />
                ))}
            </Section>
            <Section>
                <ColorGrid threshold={brightness} range={rangeColors} steps={8} />
            </Section>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("app"));
