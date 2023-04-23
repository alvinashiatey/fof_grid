# FOF GRID

## Introduction

This is a script to create a grid for the design system of FOF design by Mainwei Wang.

## Usage

```html
<div class="app">
  <a href="/a" data-shape>Text Goes Here</a>
  <a href="/b" data-shape>Text Goes Here</a>
  <a href="/c" data-shape>Text Goes Here</a>
  <a href="/d" data-shape>Text Goes Here</a>
</div>
```

```js
import { RoundedSquareGrid } from "https://cdn.jsdelivr.net/gh/alvinashiatey/fof_grid@v0.1.2/dist/fof_grid.iife.min.js";
// Instantiate the grid
let options = {
  width: 14,
  height: 20,
  cols: 3,
  rows: 4,
  primaryClr: "tomato",
  secondaryClr: "wheat",
  // The container accepts a CSS selector
  container: ".app",
  // width and height of SVG optional
  svgWidth: "100%",
  svgHeight: "100%",
};
let grid = new RoundedSquareGrid(options);
grid.render();
```
