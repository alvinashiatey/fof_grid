function d(o) {
  let t;
  if (o.startsWith("#"))
    t = o.slice(1);
  else {
    let h = document.createElement("div");
    h.style.color = o, t = window.getComputedStyle(h).color, t = t.slice(4, -1).split(",").map(function(s) {
      return s = Number(s).toString(16), s.length === 1 ? "0" + s : s;
    }).join("");
  }
  let i = (parseInt(t, 16) ^ 16777215).toString(16);
  return i = "#" + "0".repeat(6 - i.length) + i, i;
}
class g {
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
  constructor(t, i, h, s, e, r) {
    this.x = t, this.y = i, this.width = h, this.height = s, this.radius = e, this.fillColor = r, this.fontSize = 0.15, this.fontColor = d(r), this.text = "hello";
  }
  toSvgPath() {
    return this.groupSvg();
  }
  rectSvg() {
    return `<rect x="${this.x}" y="${this.y}" width="${this.width}" height="${this.height}" rx="${this.radius}" ry="${this.radius}" fill="${this.fillColor}"/>`;
  }
  textSvg() {
    return `<text x="${this.x + this.width / 2}" y="${this.y + this.height / 2}" fill="${this.fontColor}" text-anchor="middle" alignment-baseline="middle" style="font:italic ${this.fontSize}rem sans-serif; ">${this.text}</text>`;
  }
  connectSvg() {
    let t = "";
    for (let i of this.corners)
      t += i.path;
    return t;
  }
  groupSvg() {
    return `<g>${this.rectSvg()}${this.textSvg()}${this.connectSvg()}</g>`;
  }
}
class l {
  x1;
  y1;
  x2;
  y2;
  radius;
  bx;
  by;
  fillColor = "#181818";
  path = "";
  constructor(t, i, h, s) {
    this.bx = t.x + t.width, this.by = t.y + t.height - h, this.x1 = t.x, this.y1 = t.y - h, this.x2 = i.x, this.y2 = i.y + i.height - h, this.radius = h, this.fillColor = s;
  }
  toSvgPathRight() {
    return this.path = `M${this.x2} ${this.y2} l${this.radius} ${this.radius} l ${-this.radius} ${this.radius} l ${-this.radius} ${-this.radius} z`, `<path d="${this.path}" fill="${this.fillColor}" stroke="none"/>
`;
  }
  toSvgPathLeft() {
    return this.path = `M${this.x1} ${this.y1} l${this.radius} ${this.radius} l ${-this.radius} ${this.radius} l ${-this.radius} ${-this.radius} z`, `<path d="${this.path}" fill="${this.fillColor}" stroke=nonew"/>
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
class c {
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
  constructor(t, i, h, s, e, r, n, u, a) {
    this.x = t, this.y = i, this.squareWidth = h, this.squareHeight = s, this.radius = e, this.color1 = r, this.color2 = n, this.columns = u, this.rows = a, this.grid = [];
  }
  toSvgPath() {
    let t = this.x, i = this.y, h = this.color1, s = 0;
    for (let e = 0; e < this.rows; e++) {
      this.grid[e] = [];
      for (let r = 0; r < this.columns; r++)
        s++, this.grid[e][r] = this.generateSquarePath(t, i, h), this.grid[e][r].text = s.toString(), t += this.squareWidth, h = this.alternateColor(h);
      t = this.x, i += this.squareHeight;
    }
    return this.generateGroup();
  }
  generateSquarePath(t, i, h) {
    return new g(t, i, this.squareWidth, this.squareHeight, this.radius, h);
  }
  hasNeighbor(t, i) {
    let h = !1, s = !1, e = !1, r = !1;
    return t < this.rows - 1 && i > 0 && (h = !0), t < this.rows - 1 && i < this.columns - 1 && (s = !0), t > 0 && i > 0 && (e = !0), t > 0 && i < this.columns - 1 && (r = !0), { bottomLeft: h, bottomRight: s, topLeft: e, topRight: r };
  }
  generateConnectors() {
    let t = "", i = 0;
    for (let h = 0; h < this.rows; h++)
      for (let s = 0; s < this.columns; s++) {
        if (i++, i % 2 !== 0)
          continue;
        let e = this.hasNeighbor(h, s);
        e.bottomLeft && (t += new l(this.grid[h][s], this.grid[h + 1][s - 1], this.radius, this.color2).toSvgPathBottomLeft()), e.bottomRight && (t += new l(this.grid[h][s], this.grid[h + 1][s + 1], this.radius, this.color2).toSvgPathBottomRight());
      }
    return {
      connectors: t,
      color: this.color2
    };
  }
  generateGroup() {
    let t = {};
    for (let s = 0; s < this.rows; s++)
      for (let e = 0; e < this.columns; e++) {
        let r = this.grid[s][e].fillColor;
        t[r] || (t[r] = []), t[r].push(this.grid[s][e]);
      }
    let i = "";
    const h = Object.keys(t).reverse();
    for (let s of h) {
      i += `<g class="${s}">
`;
      for (let e = 0; e < t[s].length; e++)
        i += t[s][e].toSvgPath();
      s === this.generateConnectors().color && (i += this.generateConnectors().connectors), i += `</g>
`;
    }
    return i;
  }
  alternateColor(t) {
    return t === this.color1 ? this.color2 : this.color1;
  }
  render(t = document.body) {
    if (!t)
      return;
    const i = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    i.setAttribute("xmlns", "http://www.w3.org/2000/svg"), i.setAttribute("width", "100%"), i.setAttribute("height", "100%"), i.setAttribute("viewBox", `0 0 ${this.x + this.squareWidth * this.columns} ${this.y + this.squareHeight * this.rows}`), i.innerHTML = this.toSvgPath(), t.appendChild(i);
  }
}
export {
  c as RoundedSquareGrid
};
