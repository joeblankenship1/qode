import { Line } from './line.model';

export class Page {
  private id: number;
  private lines: Line[];

  constructor(id: number, lines?: Line[]) {
    this.id = id;
    this.lines = lines ? lines : [];
  }

  getId() {
    return this.id;
  }

  public setLine( line: Line) {
    this.lines.push(line);
  }

  setLines(lines: Line[]) {
    this.lines = lines;
  }

  getLines() {
    return this.lines;
  }
}
