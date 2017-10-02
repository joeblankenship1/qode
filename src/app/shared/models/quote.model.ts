export class Quote {
  public text: string;
  public position: {start: number, end: number};
  public lineRange: number;

  constructor(text: string, start: number, end: number, range: number) {
    this.text = text;
    this.position = {start: start, end: end};
    this.lineRange = range;
  }

  getLineRange() {
    return this.lineRange;
  }
}
