# Noa Iran Map React

<div style="flex: 1">
<img src="https://freecyberhawk.github.io/noa_iran_map_react/assets/demo_image.png" alt="Kara Persian Datepicker Screenshot" width="auto" height="400">
</div>
A highly customizable, interactive map of Iran designed for React and Next.js applications. With support for TypeScript,
you can dynamically highlight provinces based on their codes, values, and colors, making it ideal for data visualization
or interactive dashboards.

## Features

- **Dynamic Province Coloring**: Change the color intensity of provinces using their codes and provided values.
- **TypeScript Support**: Enjoy type safety and seamless integration in TypeScript projects.
- **Next.js Ready**: Fully compatible with React and Next.js environments.
- **Interactive**: Easy-to-use props for dynamic updates and event handling.


## Installation

```bash
   npm install noa-iran-map-react
```


## Usage

```typescript
"use cleint"
import React from 'react';
import {IranMap} from 'noa-iran-map-react';

export default function Home() {
    const data = {
        "IR-32": 100, // استان البرز
        "IR-15": 200, // استان کرمان
        "IR-04": 250, // استان کرمان
        // سایر استان‌ها...
    };

    return (
        <div style={{height:"200px"}}>
            <IranMap data={data}  />
        </div>
    );
}
```

## Props

| Prop Name         | Type                       | Default     | Description                                                     |
|-------------------|----------------------------|-------------|-----------------------------------------------------------------|
| `color`           | `string`                   | `'#FF5733'` | The fill color for provinces that have data.                    |
| `backgroundColor` | `string`                   | `'#E0E0E0'` | The default color for provinces without specific data.          |
| `tooltipLabel`    | `(code: string) => string` | `undefined` | Function to define the tooltip label when hovering provinces.   |
| `data`            | `Record<string, number>`   | `{}`        | An object containing province codes as keys and values as data. |



## Province Codes

| Province Name | Code  |
|---------------|-------|
| Alborz        | IR-32 |
| Kerman        | IR-15 |
| Fars          | IR-04 |

All province codes's JSON
file: [Download](https://freecyberhawk.github.io/noa_iran_map_react/assets/iran_provinces.json)


## Authors

- [FreeCyberHawk](https://github.com/freecyberhawk)
- [YousefZare](https://github.com/YousefZare2000)
