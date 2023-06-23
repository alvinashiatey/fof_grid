function g(n) {
  let t;
  if (n.startsWith("#"))
    t = n.slice(1);
  else {
    const s = document.createElement("div");
    s.style.color = n, t = window.getComputedStyle(s).color, t = t.slice(4, -1).split(",").map(function(e) {
      return e = Number(e).toString(16), e.length === 1 ? "0" + e : e;
    }).join("");
  }
  let i = (parseInt(t, 16) ^ 16777215).toString(16);
  return i = "#" + "0".repeat(6 - i.length) + i, i;
}
function p() {
  return `
  div {
    width:100%; 
    height:100%; 
    display: grid; 
    place-content: center;
  }`;
}
class m {
  x;
  y;
  width;
  height;
  radius;
  fillColor;
  corners = [];
  fontSize;
  fontColor;
  text;
  href;
  constructor(t, i, s, e, r, h) {
    this.x = t, this.y = i, this.width = s, this.height = e, this.radius = r, this.fillColor = h, this.fontSize = "0.15rem", this.fontColor = g(h), this.text = "hello", this.href = "";
  }
  toSvgPath() {
    return this.groupSvg();
  }
  anchorSvg() {
    return `<a href="${this.href}">${this.rectSvg()}${this.foreignObjectSvg()}${this.connectSvg()}</a>`;
  }
  rectSvg() {
    return `<rect x="${this.x}" y="${this.y}" width="${this.width}" height="${this.height}" rx="${this.radius}" ry="${this.radius}" fill="${this.fillColor}"/>`;
  }
  foreignObjectSvg() {
    return `<foreignObject x="${this.x}" y="${this.y}" width="${this.width}" height="${this.height}">
        <div data-content="${this.text}" style="width:100%; height:100%; display: grid; place-content: center;">
        <p xmlns="http://www.w3.org/1999/xhtml" style="width:100%; height:100%; margin: 0; color: ${this.fontColor}; text-align: center; align-items: center; font-style:italic; font-size:${this.fontSize}; font-family:sans-serif;">${this.text}</p>
        </div>
        </foreignObject>`;
  }
  connectSvg() {
    let t = "";
    for (const i of this.corners)
      t += i.path;
    return t;
  }
  groupSvg() {
    return this.href !== "" ? `<g>${this.anchorSvg()}</g>` : `<g>${this.rectSvg()}${this.foreignObjectSvg()}${this.connectSvg()}</g>`;
  }
  swapColors() {
    const t = this.fillColor;
    this.fillColor = this.fontColor, this.fontColor = t;
  }
  setFillColor(t) {
    this.fillColor = t, this.fontColor = g(t);
  }
}
class u {
  x1;
  y1;
  x2;
  y2;
  radius;
  bx;
  by;
  fillColor = "#181818";
  path = "";
  constructor(t, i, s, e) {
    this.bx = t.x + t.width, this.by = t.y + t.height - s, this.x1 = t.x, this.y1 = t.y - s, this.x2 = i.x, this.y2 = i.y + i.height - s, this.radius = s, this.fillColor = e;
  }
  toSvgPathRight() {
    return this.path = `M${this.x2} ${this.y2} l${this.radius} ${this.radius} l ${-this.radius} ${this.radius} l ${-this.radius} ${-this.radius} z`, `<path d="${this.path}" fill="${this.fillColor}" stroke="none"/>
`;
  }
  toSvgPathLeft() {
    return this.path = `M${this.x1} ${this.y1} l${this.radius} ${this.radius} l ${-this.radius} ${this.radius} l ${-this.radius} ${-this.radius} z`, `<path d="${this.path}" fill="${this.fillColor}" stroke=none"/>
`;
  }
  toSvgPathBottomLeft() {
    return this.path = `M${this.x1} ${this.by} l${this.radius} ${this.radius} l ${-this.radius} ${this.radius} l ${-this.radius} ${-this.radius} z`, `<path d="${this.path}" fill="${this.fillColor}" stroke="none"/>
`;
  }
  toSvgPathBottomRight() {
    return this.path = `M${this.bx} ${this.by} l${this.radius} ${this.radius} l ${-this.radius} ${this.radius} l ${-this.radius} ${-this.radius} z`, `<path d="${this.path}" fill="${this.fillColor}" stroke="none"/>
`;
  }
}
class S {
  grid;
  x;
  y;
  squareWidth;
  squareHeight;
  radius;
  color1;
  color2;
  columns;
  rows;
  containerSelector;
  containerContent = [];
  isSingleContainer = !0;
  container;
  svgHeight;
  svgWidth;
  style;
  minColumns;
  maxColumns;
  constructor({
    x: t,
    y: i,
    width: s,
    height: e,
    radius: r,
    primaryClr: h,
    secondaryClr: o,
    cols: l,
    rows: c,
    minCols: a,
    maxCols: d,
    container: f,
    svgHeight: $,
    svgWidth: C
  }) {
    this.x = t ?? 0, this.y = i ?? 0, this.radius = r ?? 0.5, this.color1 = h ?? "#ffffff", this.color2 = o ?? "#000", this.columns = l ?? 3, this.rows = c ?? 1, this.minColumns = a ?? 2, this.maxColumns = d ?? 2, this.squareWidth = s ?? 100, this.squareHeight = e ?? 100, this.grid = [], this.containerSelector = f ?? "body", this.container = null, this.svgHeight = $ ?? "100%", this.svgWidth = C ?? "100%", this.style = p(), this.init();
  }
  init() {
    if (this.containerSelector === "body") {
      this.isSingleContainer = !0, this.container = document.body;
      return;
    }
    this.isSingleContainer = this.containerSelector.startsWith("#");
    const t = this.isSingleContainer ? this.containerSelector.slice(1) : this.containerSelector, i = this.isSingleContainer ? document.getElementById(t) : document.querySelectorAll(t);
    !i || (this.isSingleContainer = i.length === 1, i instanceof NodeList ? (this.isSingleContainer = i.length === 1, this.container = this.isSingleContainer ? i[0] : i) : (this.isSingleContainer = !0, this.container = i), console.log(`CustomScript by Alvin Ashiatey.
Version 0.1.7`));
  }
  makeOdd(t) {
    if (!!t)
      return t % 2 === 0 ? t + 1 : t;
  }
  setupRowsAndColumns(t) {
    const s = t.children.length;
    this.rows = Math.ceil(s * 2 / this.columns) || 1, this.columns % 2 !== 0 && (this.columns = this.makeOdd(this.columns) || 3), this.setupContainerContent(t);
  }
  setupContainerContent(t) {
    this.containerContent = [];
    for (let i = 0; i < t.children.length; i++) {
      const s = t.children[i], e = s.getAttribute("href") || "", r = s.textContent || "";
      this.containerContent.push({ href: e, text: r });
    }
    t.innerHTML = "";
  }
  getContainerContent(t) {
    return t % 2 !== 0 ? this.containerContent.shift() || { href: "", text: "" } : { href: "", text: "" };
  }
  toSvgPath(t) {
    let i = this.x, s = this.y, e = this.color1, r = 0;
    this.setupRowsAndColumns(t);
    for (let h = 0; h < this.rows; h++) {
      this.grid[h] = [];
      for (let o = 0; o < this.columns && !(this.containerContent.length === 0 && r % 2 !== 0); o++) {
        if (h % 2 === 0 && o === 0 && (e = this.alternateColor(e)), this.grid[h][o] = this.generateSquarePath(i, s), this.columns % 2 === 0 && h % 2 !== 0) {
          const { href: l, text: c } = this.getContainerContent(r);
          this.grid[h][o].text = c, this.grid[h][o].href = l;
        } else {
          const l = () => r % 2 === 0 ? this.containerContent.shift() || {
            href: "",
            text: ""
          } : { href: "", text: "" }, { href: c, text: a } = l();
          this.grid[h][o].text = a, this.grid[h][o].href = c;
        }
        i += this.squareWidth, e = this.grid[h][o].text !== "" ? this.color2 : this.color1, this.grid[h][o].setFillColor(e), r++;
      }
      i = this.x, s += this.squareHeight;
    }
    return this.generateGroup();
  }
  generateSquarePath(t, i, s = this.color2) {
    return new m(
      t,
      i,
      this.squareWidth,
      this.squareHeight,
      this.radius,
      s
    );
  }
  hasNeighbor(t, i) {
    let s = !1, e = !1, r = !1, h = !1;
    return t < this.rows - 1 && i > 0 && (s = !0), t < this.rows - 1 && i < this.columns - 1 && (e = !0), t > 0 && i > 0 && (r = !0), t > 0 && i < this.columns - 1 && (h = !0), { bottomLeft: s, bottomRight: e, topLeft: r, topRight: h };
  }
  generateConnectors() {
    let t = "", i = 0;
    for (let s = 0; s < this.rows; s++)
      for (let e = 0; e < this.columns; e++) {
        if (i++, i % 2 === 0)
          continue;
        const r = this.hasNeighbor(s, e);
        r.bottomLeft && this.grid[s + 1][e - 1] && (t += new u(
          this.grid[s][e],
          this.grid[s + 1][e - 1],
          this.radius,
          this.color2
        ).toSvgPathBottomLeft()), r.bottomRight && this.grid[s + 1][e + 1] && (t += new u(
          this.grid[s][e],
          this.grid[s + 1][e + 1],
          this.radius,
          this.color2
        ).toSvgPathBottomRight());
      }
    return {
      connectors: t,
      color: this.color2
    };
  }
  generateGroup() {
    const t = {};
    for (let r = 0; r < this.rows; r++)
      for (let h = 0; h < this.columns; h++) {
        if (!this.grid[r][h])
          continue;
        const o = this.grid[r][h]?.fillColor;
        t[o] || (t[o] = []), t[o].push(this.grid[r][h]);
      }
    let i = "";
    const s = this.generateConnectors(), e = Object.keys(t);
    for (const r of e) {
      i += `<g class="${r}">
`;
      for (let h = 0; h < t[r].length; h++)
        i += t[r][h]?.toSvgPath();
      r === s.color && (i += s.connectors), i += `</g>
`;
    }
    return i;
  }
  alternateColor(t) {
    return t === this.color1 ? this.color2 : this.color1;
  }
  appendToContainer(t) {
    this.isSingleContainer && (t.innerHTML = this.toSvgPath(this.container), t.setAttribute(
      "viewBox",
      `0 0 ${this.x + this.squareWidth * this.columns} ${this.y + this.squareHeight * this.rows}`
    ), this.container?.appendChild(t));
  }
  render() {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    t.setAttribute("xmlns", "http://www.w3.org/2000/svg"), t.setAttribute("width", this.svgWidth), t.setAttribute("height", this.svgHeight), this.appendToContainer(t);
  }
}
export {
  S as RoundedSquareGrid
};
