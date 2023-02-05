function generateComplement(color: string): string {
  let hex: string;
  if (color.startsWith("#")) {
    hex = color.slice(1);
  } else {
    let temp = document.createElement("div");
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

class RoundedSquare {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  private readonly radius: number;
  readonly fillColor: string;

  public corners: Connect[] = [];
  public fontSize: number;
  public fontColor: string;
  public text: string;

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
    this.fontSize = 0.15;
    this.fontColor = generateComplement(fillColor);
    this.text = "hello";
  }

  public toSvgPath(): string {
    return this.groupSvg();
  }

  private rectSvg(): string {
    return `<rect x="${this.x}" y="${this.y}" width="${this.width}" height="${this.height}" rx="${this.radius}" ry="${this.radius}" fill="${this.fillColor}"/>`;
  }

  private textSvg(): string {
    return `<text x="${this.x + this.width / 2}" y="${
      this.y + this.height / 2
    }" fill="${
      this.fontColor
    }" text-anchor="middle" alignment-baseline="middle" style="font:italic ${
      this.fontSize
    }rem sans-serif; ">${this.text}</text>`;
  }

  private connectSvg(): string {
    let path = "";
    for (let conn of this.corners) {
      path += conn.path;
    }
    return path;
  }

  private groupSvg(): string {
    return `<g>${this.rectSvg()}${this.textSvg()}${this.connectSvg()}</g>`;
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
  public fillColor: string = "#181818";
  public path: string = "";

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

export class RoundedSquareGrid {
  private readonly grid: RoundedSquare[][];
  private readonly x: number;
  private readonly y: number;
  private readonly squareWidth: number;
  private readonly squareHeight: number;
  private readonly radius: number;
  private readonly color1: string;
  private readonly color2: string;
  private readonly columns: number;
  private readonly rows: number;

  constructor(
    x: number,
    y: number,
    squareWidth: number,
    squareHeight: number,
    radius: number,
    color1: string,
    color2: string,
    columns: number,
    rows: number
  ) {
    this.x = x;
    this.y = y;
    this.squareWidth = squareWidth;
    this.squareHeight = squareHeight;
    this.radius = radius;
    this.color1 = color1;
    this.color2 = color2;
    this.columns = columns;
    this.rows = rows;
    this.grid = [];
  }

  private toSvgPath(): string {
    let currentX = this.x;
    let currentY = this.y;
    let currentColor = this.color1;
    let index = 0;
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.columns; j++) {
        index++;
        this.grid[i][j] = this.generateSquarePath(
          currentX,
          currentY,
          currentColor
        );
        this.grid[i][j].text = index.toString();
        currentX += this.squareWidth;
        currentColor = this.alternateColor(currentColor);
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
        let pos = this.hasNeighbor(i, j);
        if (pos.bottomLeft) {
          connectors += new Connect(
            this.grid[i][j],
            this.grid[i + 1][j - 1],
            this.radius,
            this.color2
          ).toSvgPathBottomLeft();
        }
        if (pos.bottomRight) {
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
    let groups: {
      [key: string]: RoundedSquare[];
    } = {};
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        let color = this.grid[i][j].fillColor;
        if (!groups[color]) {
          groups[color] = [];
        }
        groups[color].push(this.grid[i][j]);
      }
    }
    let group = "";
    const reversedKeys = Object.keys(groups).reverse();
    for (let key of reversedKeys) {
      group += `<g class="${key}">\n`;
      for (let i = 0; i < groups[key].length; i++) {
        group += groups[key][i].toSvgPath();
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

  public render(container: HTMLElement | null = document.body): void {
    if (!container) return;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute(
      "viewBox",
      `0 0 ${this.x + this.squareWidth * this.columns} ${
        this.y + this.squareHeight * this.rows
      }`
    );
    svg.innerHTML = this.toSvgPath();
    container.appendChild(svg);
  }
}
