# Light or Dark ?

A library to determine what text color goes well with a given background, light or dark. Small, configurable, typescript, esm, no dependencies.

Demo page: https://n1kk.github.io/light-or-dark/

![demo](demo/demo.gif)

## Usage

Install:

```bash
# npm
npm i light-or-dark
# yarn
yarn add light-or-dark
# pnpm
pnpm i light-or-dark
```

Import:

```tsx
import { lightOrDark } from "light-or-dark";
```

Direct use:

```tsx
const backgroundColor = "#4600BF";
const foregroundColor = lightOrDark(backgroundColor);
```

Customized use:

```tsx
const backgroundColor = "#4600BF";
const foregroundColor = lightOrDark(backgroundColor, { threshold: 0.45 });
```

Preconfigured closure:

```tsx
const getTextColor = lightOrDark.bind({ threshold: 0.45 });

const backgroundColor = "#4600BF";
const foregroundColor = getTextColor(backgroundColor);
```

## API

### `lightOrDark(string, options?) => string`

Accepts a hex color and returns a corresponding light or dark color that has most contrast with the input. Can be configured by passing an options object as a second argument or as `this` context to the function via `bind|call|apply`.

```ts
declare function lightOrDark(this: LightOrDarkOptions | void, color: string, options?: LightOrDarkOptions): string;
```

- `color`: hex color in web or full format (`#RGB` | `#RRGGBB` | `#RRGGBBAA`)
- `options`: options object that allows you to configure how the computation is performed, it can be also passed as `this` argument to the function allowing for a handy way of creating your own configurable closure via `.bind()`
- _**returns**_: `string` of a color which has most contrast with the given background (return values can be configured in `option`)

### `LightOrDarkOptions`

```ts
type LightOrDarkOptions = {
  light?: string;
  dark?: string;
  threshold?: number;
  onBadColor?: string;
  lumFactors?: [r: number, g: number, b: number];
};
```

- `dark`: a hex value of the dark color that will be returned
  - default `#222`
- `light`: a hex value of the light color that will be returned
  - default `#EEE`
- `threshold`: a luminance threshold below which color is considered dark
  - default: `0.35`
- onBadColor: if specified, disabled error throw, instead this value will be returned when a bad/malformed value is passed as input
  - default: `undefined`, the method will throw and error
- `lumFactors`: factors that are used for RGB channel to calculate the luminance
  - default: [standard w3c channel factors for calculating luminance](https://www.w3.org/TR/WCAG20/#relativeluminancedef) `[0.2126, 0.7152, 0.0722]`
