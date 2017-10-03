import { Line } from './line.model';

export class Page {
  id: number;
  lines: Line[];

  constructor(id: number, lines?: Line[]) {
    this.id = id;
    this.lines = lines ? lines : [];
  }

  getId() {
    return this.id;
  }

  setLines(lines: Line[]) {
    this.lines = lines;
  }

  getLines() {
    return this.lines;
  }
}
