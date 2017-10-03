import { Code } from './code.model';
export class Quote {
  public _id: string;
  public text: string;
  public position: {start: number, end: number};
  public lineRange: number;
  public codes: Code[];

  constructor(text: string, start: number, end: number, range: number, id?: string) {
    this._id = id ? id : undefined;
    this.text = text;
    this.position = {start: start, end: end};
    this.lineRange = range;
    this.codes = [];
  }

  public setId(id: string) {
    this._id = id;
  }

  public getId() {
    return this._id;
  }

  public getLineRange() {
    return this.lineRange;
  }

  public isEqual(quote: Quote): boolean {
    return this._id === quote.getId();
  }
}
