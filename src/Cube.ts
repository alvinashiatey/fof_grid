function generateComplement(color: string): string {
  let hex: string;
  if (color.startsWith("#")) {
    hex = color.slice(1);
  } else {
    const temp = document.createElement("div");
    temp.style.color = color;
    hex = window.getComputedStyle(temp).color;
    hex = hex
      .slice(4, -1)
      .split(",")
      .map(function (a) {
        a = Number(a).toString(16);
        return a.length === 1 ? "0" + a : a;
      })
      .join("");
  }
  let complement = (parseInt(hex, 16) ^ 0xffffff).toString(16);
  complement = "#" + "0".repeat(6 - complement.length) + complement;
  return complement;
}

function styles(): string {
  return `
  div {
    width:100%; 
    height:100%; 
    display: grid; 
    place-content: center;
  }`;
}

class RoundedSquare {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  private readonly radius: number;
  readonly fillColor: string;

  public corners: Connect[] = [];
  public fontSize: string;
  public fontColor: string;
  public text: string;
  public href: string;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillColor: string
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.fillColor = fillColor;
    this.fontSize = "0.15rem";
    this.fontColor = generateComplement(fillColor);
    this.text = "hello";
    this.href = "";
  }

  public toSvgPath(): string {
    return this.groupSvg();
  }

  private anchorSvg(): string {
    return `<a href="${
      this.href
    }">${this.rectSvg()}${this.foreignObjectSvg()}${this.connectSvg()}</a>`;
  }

  private rectSvg(): string {
    return `<rect x="${this.x}" y="${this.y}" width="${this.width}" height="${this.height}" rx="${this.radius}" ry="${this.radius}" fill="${this.fillColor}"/>`;
  }

  private foreignObjectSvg(): string {
    return `<foreignObject x="${this.x}" y="${this.y}" width="${this.width}" height="${this.height}">
        <div data-content="${this.text}" style="width:100%; height:100%; display: grid; place-content: center;">
        <p xmlns="http://www.w3.org/1999/xhtml" style="width:100%; height:100%; margin: 0; color: ${this.fontColor}; text-align: center; align-items: center; font-style:italic; font-size:${this.fontSize}; font-family:sans-serif;">${this.text}</p>
        </div>
        </foreignObject>`;
  }

  private connectSvg(): string {
    let path = "";
    for (const conn of this.corners) {
      path += conn.path;
    }
    return path;
  }

  private groupSvg(): string {
    if (this.href !== "") {
      return `<g>${this.anchorSvg()}</g>`;
    }
    return `<g>${this.rectSvg()}${this.foreignObjectSvg()}${this.connectSvg()}</g>`;
  }
}

class Connect {
  private readonly x1: number;
  private readonly y1: number;
  private readonly x2: number;
  private readonly y2: number;
  private readonly radius: number;
  private readonly bx: number;
  private readonly by: number;
  public fillColor = "#181818";
  public path = "";

  constructor(
    square1: RoundedSquare,
    square2: RoundedSquare,
    radius: number,
    fillColor: string
  ) {
    this.bx = square1.x + square1.width;
    this.by = square1.y + square1.height - radius;
    this.x1 = square1.x;
    this.y1 = square1.y - radius;
    this.x2 = square2.x;
    this.y2 = square2.y + square2.height - radius;
    this.radius = radius;
    this.fillColor = fillColor;
  }
  public toSvgPathRight(): string {
    this.path = `M${this.x2} ${this.y2} l${this.radius} ${this.radius} l ${-this
      .radius} ${this.radius} l ${-this.radius} ${-this.radius} z`;
    return `<path d="${this.path}" fill="${this.fillColor}" stroke="none"/>\n`;
  }
  public toSvgPathLeft(): string {
    this.path = `M${this.x1} ${this.y1} l${this.radius} ${this.radius} l ${-this
      .radius} ${this.radius} l ${-this.radius} ${-this.radius} z`;
    return `<path d="${this.path}" fill="${this.fillColor}" stroke=nonew"/>\n`;
  }

  public toSvgPathBottomLeft(): string {
    this.path = `M${this.x1} ${this.by} l${this.radius} ${this.radius} l ${-this
      .radius} ${this.radius} l ${-this.radius} ${-this.radius} z`;
    return `<path d="${this.path}" fill="${this.fillColor}" stroke="none"/>\n`;
  }

  public toSvgPathBottomRight(): string {
    this.path = `M${this.bx} ${this.by} l${this.radius} ${this.radius} l ${-this
      .radius} ${this.radius} l ${-this.radius} ${-this.radius} z`;
    return `<path d="${this.path}" fill="${this.fillColor}" stroke="none"/>\n`;
  }
}

interface RoundedSquareGridOptions {
  x?: number;
  y?: number;
  width: number;
  height: number;
  radius?: number;
  primaryClr?: string;
  secondaryClr?: string;
  cols?: number;
  rows?: number;
  container: string;
  svgWidth?: string;
  svgHeight?: string;
}

export class RoundedSquareGrid {
  private readonly grid: RoundedSquare[][];
  private readonly x: number;
  private readonly y: number;
  private readonly squareWidth: number;
  private readonly squareHeight: number;
  private readonly radius: number;
  private readonly color1: string;
  private readonly color2: string;
  private columns: number;
  private rows: number;
  private readonly containerSelector: string;
  private containerContent: { href: string; text: string }[] = [];

  private isSingleContainer = true;
  private container: HTMLElement | NodeListOf<HTMLElement> | null;
  svgHeight: string;
  svgWidth: string;
  style: any;

  constructor({
    x,
    y,
    width,
    height,
    radius,
    primaryClr,
    secondaryClr,
    cols,
    rows,
    container,
    svgHeight,
    svgWidth,
  }: RoundedSquareGridOptions) {
    this.x = x || 0;
    this.y = y || 0;
    this.squareWidth = width;
    this.squareHeight = height;
    this.radius = radius || 0.5;
    this.color1 = primaryClr || "#ffffff";
    this.color2 = secondaryClr || "#000";
    this.columns = this.makeOdd(cols) || 3;
    this.rows = rows || 1;
    this.grid = [];
    this.containerSelector = container || "body";
    this.container = null;
    this.svgHeight = svgHeight || "100%";
    this.svgWidth = svgWidth || "100%";
    this.style = styles();
    this.init();
  }

  private init(): void {
    if (this.containerSelector === "body") {
      this.isSingleContainer = true;
      this.container = document.body;
      return;
    }

    this.isSingleContainer = this.containerSelector[0] === "#";
    const selector = this.isSingleContainer
      ? this.containerSelector.slice(1)
      : this.containerSelector;

    const el = this.isSingleContainer
      ? document.getElementById(selector)
      : (document.querySelectorAll(selector) as NodeListOf<HTMLElement>);

    if (!el) {
      return;
    }

    this.isSingleContainer = (el as NodeListOf<HTMLElement>).length === 1;
    if (el instanceof NodeList) {
      this.isSingleContainer = el.length === 1;
      this.container = this.isSingleContainer ? el[0] : el;
    } else {
      this.isSingleContainer = true;
      this.container = el as HTMLElement;
    }
  }
  private makeOdd(num: number | undefined): number | undefined {
    if (!num) return undefined;
    return num % 2 === 0 ? num + 1 : num;
  }
  private setupRowsAndColumns(container: HTMLElement) {
    const children = container.children;
    const numChildren = children.length;
    this.rows = Math.ceil((numChildren * 2) / this.columns) || 1;
    if (this.columns % 2 !== 0) {
      this.columns = this.makeOdd(this.columns) || 3;
    }
    this.setupContainerContent(container);
  }
  private setupContainerContent(container: HTMLElement) {
    this.containerContent = [];
    for (let i = 0; i < container.children.length; i++) {
      const child = container.children[i];
      const href = child.getAttribute("href") || "";
      // get all attributes
      const text = child.textContent || "";
      this.containerContent.push({ href, text });
    }
    container.innerHTML = "";
  }
  private getContainerContent(index: number): { href: string; text: string } {
    if (index % 2 !== 0) {
      return this.containerContent.shift() || { href: "", text: "" };
    }
    return { href: "", text: "" };
  }
  private toSvgPath(container: HTMLElement): string {
    let currentX = this.x;
    let currentY = this.y;
    let currentColor = this.color1;
    let index = 0;
    this.setupRowsAndColumns(container);
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.columns; j++) {
        this.grid[i][j] = this.generateSquarePath(
          currentX,
          currentY,
          currentColor
        );
        const { href, text } = this.getContainerContent(index);
        this.grid[i][j].text = text;
        this.grid[i][j].href = href;
        currentX += this.squareWidth;
        currentColor = this.alternateColor(currentColor);
        index++;
        if (this.containerContent.length === 0 && index % 2 !== 0) {
          break;
        }
      }
      currentX = this.x;
      currentY += this.squareHeight;
    }
    return this.generateGroup();
  }
  private generateSquarePath(
    currentX: number,
    currentY: number,
    currentColor: string
  ): RoundedSquare {
    return new RoundedSquare(
      currentX,
      currentY,
      this.squareWidth,
      this.squareHeight,
      this.radius,
      currentColor
    );
  }
  private hasNeighbor(
    i: number,
    j: number
  ): {
    bottomLeft: boolean;
    bottomRight: boolean;
    topLeft: boolean;
    topRight: boolean;
  } {
    let bottomLeft = false;
    let bottomRight = false;
    let topLeft = false;
    let topRight = false;
    if (i < this.rows - 1 && j > 0) {
      bottomLeft = true;
    }
    if (i < this.rows - 1 && j < this.columns - 1) {
      bottomRight = true;
    }
    if (i > 0 && j > 0) {
      topLeft = true;
    }
    if (i > 0 && j < this.columns - 1) {
      topRight = true;
    }
    return { bottomLeft, bottomRight, topLeft, topRight };
  }
  public generateConnectors(): { connectors: string; color: string } {
    let connectors = "";
    let index = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        index++;
        if (index % 2 !== 0) continue;
        const pos = this.hasNeighbor(i, j);
        if (pos.bottomLeft && this.grid[i + 1][j - 1]) {
          connectors += new Connect(
            this.grid[i][j],
            this.grid[i + 1][j - 1],
            this.radius,
            this.color2
          ).toSvgPathBottomLeft();
        }
        if (pos.bottomRight && this.grid[i + 1][j + 1]) {
          connectors += new Connect(
            this.grid[i][j],
            this.grid[i + 1][j + 1],
            this.radius,
            this.color2
          ).toSvgPathBottomRight();
        }
      }
    }
    return {
      connectors,
      color: this.color2,
    };
  }
  public generateGroup(): string {
    const groups: {
      [key: string]: RoundedSquare[];
    } = {};
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (!this.grid[i][j]) continue;
        const color = this.grid[i][j]?.fillColor;
        if (!groups[color]) {
          groups[color] = [];
        }
        groups[color].push(this.grid[i][j]);
      }
    }
    let group = "";
    const reversedKeys = Object.keys(groups).reverse();
    for (const key of reversedKeys) {
      group += `<g class="${key}">\n`;
      for (let i = 0; i < groups[key].length; i++) {
        group += groups[key][i]?.toSvgPath();
      }
      if (key === this.generateConnectors().color) {
        group += this.generateConnectors().connectors;
      }
      group += `</g>\n`;
    }
    return group;
  }
  private alternateColor(currentColor: string): string {
    return currentColor === this.color1 ? this.color2 : this.color1;
  }
  private appendToContainer(el: SVGElement): void {
    if (this.isSingleContainer) {
      el.innerHTML = this.toSvgPath(this.container as HTMLElement);
      el.setAttribute(
        "viewBox",
        `0 0 ${this.x + this.squareWidth * this.columns} ${
          this.y + this.squareHeight * this.rows
        }`
      );
      (this.container as HTMLElement)?.appendChild(el);
    }
  }
  public render(): void {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", this.svgWidth);
    svg.setAttribute("height", this.svgHeight);
    this.appendToContainer(svg);
  }
}
